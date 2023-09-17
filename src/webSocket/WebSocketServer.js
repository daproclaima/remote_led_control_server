import WebSocketMessage from "./WebSocketMessage.js";
import WebSocketReply from "./WebSocketReply.js";
import {WSS_REPLY_EMPTY} from "../constants/WSS_REPLIES.js";

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

    prepareNextReply = () => {
        const objectAcceptedMessages = {
            [WebSocketMessage.switchOnLed]: WebSocketMessage.switchOnLed,
            [WebSocketMessage.switchOffLed]: WebSocketMessage.switchOffLed
        }

        const objectRepliesForMessages = {
            [WebSocketMessage.switchOnLed]: WebSocketReply.switchedOnLed,
            [WebSocketMessage.switchOffLed]: WebSocketReply.switchedOffLed
        }

        console.log('this.lastMessage prepareNextReply : ', this.lastMessage)

        if (objectAcceptedMessages[this.lastMessage]) {
            this.nextReply = objectRepliesForMessages[this.lastMessage]
            console.log('this.nextReply : ', this.nextReply)
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
        let currentReply = WSS_REPLY_EMPTY

        if(this.nextReply) {
            currentReply = this.nextReply
            this.nextReply = null
        }

        console.log('this.currentReply : ', currentReply)


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
