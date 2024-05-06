import {WebSocketServer} from "ws";

const CONNECTION = 'connection'
const OPEN = 'open'
const MESSAGE = 'message'
const CLOSE = 'close'
const ERROR = 'error'

export default class WsWebSocketImplementation {
    #loggerService = null
    #server = null
    #message = null
    #request = null
    #client = null
    #error = null
    #connection

    constructor({wssConfig, loggerService}) {
        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#server = new WebSocketServer(wssConfig);
        this.#loggerService = loggerService
    }

    get getConnection() {
        return this.#connection
    }

    get getLastMessage() {
        return this.#message
    }

    get getLastRequest() {
        return this.#request
    }

    get getLastClient() {
        return this.#client
    }

    get getLastError() {
        return this.#error
    }

    listen = () => {
        this.#server.on(CONNECTION, (webSocketConnection, request, client) => {
            this.#loggerService.log({
                level: 'info',
                message: 'WsWebSocketImplementation is listening'
            })

            webSocketConnection.isAlive = true;
            this.#request = request
            this.#client = client

            this.#connection = webSocketConnection

            this.#connection.on(OPEN, () => {
                this.#connection.send("CONNECTION OPENED")
            });
            this.#connection.on(MESSAGE, (data) => {
                this.#message = JSON.parse(data);
            })
            this.#connection.on(CLOSE, (webSocketConnection) => {
                webSocketConnection.isAlive = false
                this.closeConnection()

                this.#connection = webSocketConnection;
            });
            this.#connection.on(ERROR, (errorObject) => {
                this.#error = JSON.parse(errorObject)
                this.#loggerService.log({level: 'error', message: this.#error})
            });
        });

        return this
    }

    reply = (response) => {
        if(!this.#connection.isAlive) {
            throw new Error("WsWebSocketImplementation connection is not alive.")
        }

        const jsonMessage = JSON.stringify(response)

        this.#connection.send(jsonMessage)
        this.#loggerService.log({level: 'info', message: `WsWebSocketImplementation.reply sent: ${jsonMessage}`})

        return this
    }

    closeConnection = () => {
        this.#connection.terminate()
        this.#loggerService.log({level: 'info', message: 'WsWebSocketImplementation server terminated'})

        return this
    }
}
