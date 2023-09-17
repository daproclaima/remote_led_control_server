import WebSocketMessage from "../WebSocketMessage/WebSocketMessage.js";
import WebSocketReply from "../WebSocketReply/WebSocketReply.js";
import Informant from "../../business/Informant/Informant.js";

export default class WebSocketServer {
    logger = null
    webSocketImplementation = null
    lastMessage = null
    lastRequest = null
    lastClient = null
    lastError = null
    nextReply = null

    get lastMessage() {
        return this.webSocketImplementation.lastMessage
    }

    set lastMessage(message) {
        this.lastMessage = message
    }

    get lastRequest() {
        return this.webSocketImplementation.lastRequest
    }

    set lastRequest(request) {
        this.lastRequest = request
    }

    get lastClient() {
        return this.webSocketImplementation.lastClient
    }

    set lastClient(client) {
        this.lastClient = client
    }

    get lastError() {
        return this.webSocketImplementation.lastError
    }

    set nextReply(reply) {
        this.nextReply = reply
    }

    get nextReply() {
        return this.nextReply
    }

    set lastError(error) {
        this.lastError = error
    }

    get logger() {
        return this.logger
    }

    listen = () => {
        this.logger.log({level: 'info', message: 'WebSocketServer is listening'})

        this.webSocketImplementation.listen(this)
        return this
    }

    parseLastMessage = () => {
        // 2 - security : is message clean

        // 1 - Logic : is such message expected and then reply
        if (Informant.getIsMessageAcceptable(this.lastMessage)) {
            this.nextReply = Informant.getReplyAccordingToMessage(this.lastMessage)
        }

        if (this.lastMessage === WebSocketMessage.switchOffLed) {
            this.nextReply = WebSocketReply.switchedOffLed

            this.logger.log({
                level: 'info',
                message: WebSocketMessage.switchOffLed
            })
        }

        return this
    }

    reply = (webSocketConnection) => {
        let currentReply = Informant.defaultReply

        if (this.nextReply) {
            currentReply = this.nextReply
            this.nextReply = null
        }

        this.webSocketImplementation.reply(webSocketConnection, currentReply)
        this.lastReply = currentReply

        return this
    }

    close = () => {
        this.webSocketImplementation.close()

        return this
    }

    constructor({webSocketImplementation, logger}) {
        this.webSocketImplementation = webSocketImplementation
        this.logger = logger
    }
}
