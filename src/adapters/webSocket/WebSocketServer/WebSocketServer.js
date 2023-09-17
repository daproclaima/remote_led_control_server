import Informant from "../../../application/Informant/Informant.js";
import LedController from "../../raspberry/led/LedController/LedController.js";

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
        this.webSocketImplementation.listen(this)
        return this
    }

    parseLastMessage = () => {
        // 2 - security : is message clean

        // 1 - Logic : is such message expected and then reply
        this.logger.log({
            level: 'info',
            message: 'WebSocketServer parseLastMessage this.lastMessage: ' + this.lastMessage,
        })


        const informant = new Informant({logger: this.logger})
        informant.checkIsMessageAcceptable(this.lastMessage)

        this.logger.log({
            level: 'info',
            message: 'WebSocketServer.parseLastMessage informant.isMessageAcceptable : ' + informant.isMessageAcceptable
        })

        if (informant.isMessageAcceptable) {
            this.nextReply = informant.getReplyAccordingToMessage(this.lastMessage)

            const ledController = new LedController({logger: this.logger})

            ledController.handleMessage(this.lastMessage)
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