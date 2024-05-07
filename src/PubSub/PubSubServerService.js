export default class PubSubServerService {
    #loggerService = null
    #pubSubServerFacade = null
    #lastMessage = null
    #lastReply = null
    #nextReply = null

    constructor({pubSubServerFacade, loggerService}) {
        if(!pubSubServerFacade.listen) {
            throw new Error('pubSubServerFacade provided in PubSubServerService constructor has no listen method')
        }

        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#pubSubServerFacade = pubSubServerFacade
        this.#loggerService = loggerService
    }

    getConnection() {
        return this.#pubSubServerFacade.getConnection()
    }

    getLastMessage() {
        return this.#pubSubServerFacade.getLastMessage()
    }

    getLastRequest() {
        return this.#pubSubServerFacade.getLastRequest()
    }

    getLastClient() {
        return this.#pubSubServerFacade.getLastClient()
    }

    getLastError() {
        return this.#pubSubServerFacade.getLastError()
    }

    setNextReply(reply) {
        this.#nextReply = reply
    }

    getNextReply() {
        return this.#nextReply
    }

    getLastReply() {
        return this.#lastReply
    }

    getServer() {
        return this.#pubSubServerFacade
    }

    listen = () => {
        this.#pubSubServerFacade.listen()
        
        this.#lastMessage = this.#pubSubServerFacade.getLastMessage();
        this.#loggerService.log({
            level: 'info',
            message: `PubSubServerService parseLastMessage : ${this.lastMessage}`,
        })

        return this.#lastMessage
    }

    reply = (response) => {
        this.#pubSubServerFacade.reply(response)
        this.#lastReply = response
    }

    closeConnection = () => {
        this.#pubSubServerFacade.closeConnection()
        return this
    }
}
