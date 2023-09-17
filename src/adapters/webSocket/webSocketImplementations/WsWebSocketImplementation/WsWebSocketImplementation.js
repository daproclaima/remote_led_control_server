import {WebSocketServer} from "ws";

const CONNECTION = 'connection'
const MESSAGE = 'message'
const CLOSE = 'close'
const ERROR = 'error'

export default class WsWebSocketImplementation {
    logger = null
    server = null
    lastMessage = null
    lastRequest = null
    lastClient = null
    lastError = null

    get lastMessage() {
        return this.lastMessage
    }

    set lastMessage(data) {
        this.lastMessage = data
    }

    get lastRequest() {
        return this.lastRequest
    }

    set lastRequest(request) {
        this.lastRequest = request
    }

    get lastClient() {
        return this.lastClient
    }

    set lastClient(client) {
        return this.client = client
    }

    get lastError() {
        return this.lastError
    }

    set lastError(error) {
        return this.lastError = error
    }

    listen = (domain) => {
        this.domain = domain

        this.server.on(CONNECTION, (webSocketConnection, request, client) => {
            this.logger.log({
                level: 'info',
                message: 'WsWebSocketImplementation is listening'
            })

            webSocketConnection.isAlive = true;
            this.domain.lastRequest = request
            this.domain.lastClient = client

            webSocketConnection.on(MESSAGE, (data) => {
                this.domain.lastMessage = JSON.parse(data);
                this.domain.parseLastMessage()
                this.domain.reply(webSocketConnection)
            })

        });

        this.server.on(CLOSE, (webSocketConnection) => {
            webSocketConnection.isAlive = false

            this.close()
            this.logger.log({level: 'info', message: 'WS server terminated'})
        });

        this.server.on(ERROR, (errorObject) => {
            this.domain.lastError = JSON.parse(errorObject)
            this.logger.log({level: 'error', message: this.lastError})
        });

        return this
    }

    reply = (webSocketConnection, data) => {
        const jsonMessage = JSON.stringify(data)

        webSocketConnection?.send(jsonMessage)
        this.logger.log({level: 'info', message: `WsWebSocketImplementation.reply sent: ${jsonMessage}`})
        return this
    }

    // close = () => {
    //     this.socketInterlocutor.terminate()
    //
    //     return this
    // }

    constructor({wssConfig, logger}) {
        this.server = new WebSocketServer(wssConfig);
        this.logger = logger
    }
}
