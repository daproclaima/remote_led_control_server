import Informant from "../../Informant/Informant.js";
import LedDriver from "../../../LED/LedDriver.js";
import Errors from "../../../Errors/Errors.js";
import PubSubMessage from "../../PubSubMessage.js";
import {WSS_REPLY_FAILED_SWITCH_OFF_LED, WSS_REPLY_FAILED_SWITCH_ON_LED} from "../../Informant/REPLIES.js";

export default class WebSocketServer {
    #loggerService = null
    #webSocketImplementation = null
    #lastMessage = null
    #lastReply = null
    #lastRequest = null
    #lastClient = null
    #lastError = null
    #nextReply = null

    get lastMessage() {
        return this.#webSocketImplementation.lastMessage
    }

    set lastMessage(message) {
        this.#lastMessage = message
    }

    get lastRequest() {
        return this.#webSocketImplementation.lastRequest
    }

    set lastRequest(request) {
        this.#lastRequest = request
    }

    get lastClient() {
        return this.#webSocketImplementation.lastClient
    }

    set lastClient(client) {
        this.#lastClient = client
    }

    get lastError() {
        return this.#webSocketImplementation.lastError
    }

    set nextReply(reply) {
        this.#nextReply = reply
    }

    get nextReply() {
        return this.#nextReply
    }

    set lastError(error) {
        this.#lastError = error
    }

    get loggerService() {
        return this.#loggerService
    }

    listen = () => {
        this.#webSocketImplementation.listen()
        return this
    }

    reply = (webSocketConnection) => {
        let currentReply = Informant.defaultReply

        if (!currentReply) {
            throw new Error(Errors.WebSocketServer.EMPTY_INFORMANT_REPLY.code)
        }

        if (this.#nextReply) {
            currentReply = this.#nextReply
            this.#nextReply = null
        }

        this.#webSocketImplementation.reply(webSocketConnection, currentReply)
        this.#lastReply = currentReply

        return this
    }

    closeConnection = () => {
        this.#webSocketImplementation.closeConnection()

        return this
    }

    constructor({webSocketImplementation, loggerService}) {
        this.#webSocketImplementation = webSocketImplementation
        this.#loggerService = loggerService
    }
}
