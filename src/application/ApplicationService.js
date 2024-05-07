import LedService from "../LED/LedService.js";

export class ApplicationService {
    #loggerService = null;
    #pubSubServerService = null;
    #gpioService = null;
    #ledService = null;

    constructor({loggerService, pubSubServerService, gpioService}) {
        if(!pubSubServerService.listen) {
            throw new Error('pubSubServerImplementation provided in PubSubServerService constructor has no listen method')
        }

        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#loggerService = loggerService
        this.#pubSubServerService = pubSubServerService
        this.#gpioService = gpioService
    }


    start = () => {
        try {
            this.#ledService = new LedService({loggerService: this.#loggerService, gpioService: this.#gpioService, pubSubServerService: this.#pubSubServerService})
            this.#ledService.start()
        } catch(error) {
            this.#loggerService.log({
                level: 'error',
                message: `ApplicationService.start caught error: ${error}`
            })
        }

        return this
    }

    stop = () => {
        this.#gpioService.tearDownGpios()
        this.#pubSubServerService.closeConnection()
    }
}