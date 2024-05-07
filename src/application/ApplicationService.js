import LedService from "../LED/LedService.js";

export class ApplicationService {
    #loggerService = null;
    #pubSubServerService = null;
    #gpioService = null;
    #informantService = null;
    #lastMessage = null;
    #lastResponse = null;
    #nextResponse = null;

    constructor({loggerService, pubSubServerService, informantService, gpioService}) {
        if(!pubSubServerService.listen) {
            throw new Error('pubSubServerImplementation provided in PubSubServerService constructor has no listen method')
        }

        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#loggerService = loggerService
        this.#pubSubServerService = pubSubServerService
        this.#informantService = informantService
        this.#gpioService = gpioService
    }


    start = () => {
        try {
            const pubSubServer = this.#pubSubServerService.getServer()
            
            pubSubServer.listen(connection => {
                const lastMessage = this.#pubSubServerService.getLastMessage()
                
                this.#loggerService.log({level: "info", message: `Application.start last message : ${JSON.stringify(lastMessage)}`})
                
                if(lastMessage) {
                    this.handleLastMessage(lastMessage)
                }

            })
        } catch(error) {
            this.#loggerService.log({
                level: 'error',
                message: `ApplicationService.start caught error: ${error}`
            })
        }
    }

    stop = () => {
        this.#gpioService.tearDownGpios()
        this.#pubSubServerService.closeConnection()
    }

    #parseLastMessage = (message) => {
        this.#lastMessage = message
        if (!this.#informantService.getIsMessageAcceptable(message)) {
            const errorMessage = `ApplicationService.parseLastMessage last message is incorrect : ${this.#lastMessage}`
            this.#loggerService.log({
                level: 'error',
                message: `ApplicationService.parseLastMessage last message is incorrect : ${errorMessage}`
            })
            throw new Error(errorMessage)
        }
    }

    handleLastMessage = (message) => {
        this.#parseLastMessage(message)
        // todo should call a LedService using a LedDriver and a GPIO Driver
        const ledService = new LedService({loggerService: this.#loggerService, gpioService: this.#gpioService})
        const ledServiceResponse = ledService.handleMessage(this.#lastMessage)
        this.#nextResponse = this.#informantService.prepareResponse(ledServiceResponse)

        this.#pubSubServerService.reply(this.#nextResponse)
        this.#lastResponse = this.#nextResponse;
    }
}