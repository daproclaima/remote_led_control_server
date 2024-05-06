import Informant from "./Informant/Informant.js";
import LedDriver from "../LED/LedDriver.js";
import Errors from "../Errors/Errors.js";
import PubSubMessage from "./PubSubMessage.js";
import {WSS_REPLY_FAILED_SWITCH_OFF_LED, WSS_REPLY_FAILED_SWITCH_ON_LED} from "./Informant/REPLIES.js";

export default class PubSubServerService {
    #loggerService = null
    #pubSubServerImplementation = null
    #lastMessage = null
    #lastReply = null
    #nextReply = null

    constructor({pubSubServerImplementation, loggerService}) {
        if(!pubSubServerImplementation.listen) {
            throw new Error('pubSubServerImplementation provided in PubSubServerService constructor has no listen method')
        }

        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#pubSubServerImplementation = pubSubServerImplementation
        this.#loggerService = loggerService
    }

    get getConnection() {
        return this.#pubSubServerImplementation.getConnection()
    }

    get lastMessage() {
        return this.#pubSubServerImplementation.getLastMessage()
    }

    get lastRequest() {
        return this.#pubSubServerImplementation.getLastRequest()
    }

    get lastClient() {
        return this.#pubSubServerImplementation.getLastClient()
    }

    get lastError() {
        return this.#pubSubServerImplementation.getLastError()
    }

    set nextReply(reply) {
        this.#nextReply = reply
    }

    get nextReply() {
        return this.#nextReply
    }

    get lastReply() {
        return this.#lastReply
    }

    listen = () => {
        this.#lastMessage = this.#pubSubServerImplementation.listen()
        this.#loggerService.log({
            level: 'info',
            message: `PubSubServerService parseLastMessage : ${this.lastMessage}`,
        })

        return this.#lastMessage
    }

    reply = (response) => {
        this.#pubSubServerImplementation.reply(response)
        this.#lastReply = response
    }

    closeConnection = () => {
        this.#pubSubServerImplementation.closeConnection()
        return this
    }
}
