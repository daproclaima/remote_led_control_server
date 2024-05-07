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

    getConnection() {
        return this.#connection
    }

    getLastMessage() {
        return this.#message
    }

    getLastRequest() {
        return this.#request
    }

    getLastClient() {
        return this.#client
    }

    getLastError() {
        return this.#error
    }

    listen = ({callbackOnError, callbackOnConnection, callbackOnOpen, callbackOnClose}) => {
        this.#server.on(CONNECTION, (webSocketConnection, request, client) => {
            this.#loggerService.log({
                level: 'info',
                message: 'WsWebSocketImplementation is listening'
            })

            webSocketConnection.isAlive = true;
            this.#request = request
            this.#client = client

            this.#connection = webSocketConnection

            const socket = {webSocketConnection, request, client, server: this.#server}
            callbackOnConnection({socket})

            this.#connection.on(ERROR, (error) => {
                this.#loggerService.log({
                    level: 'info',
                    message: `WsWebSocketImplementation.listened error : ${error}`
                })
                callbackOnError({socket, error})
                this.#error = JSON.parse(error)
            });

            this.#connection.on(OPEN, () => {
                this.#connection.send("CONNECTION OPENED")
                this.#loggerService.log({
                    level: 'info',
                    message: "WsWebSocketImplementation.listened open"
                })
                callbackOnOpen({socket})
            });

            this.#connection.on(MESSAGE, (data) => {
                console.log('received: %s', data);
                this.#message = JSON.parse(data);
                this.#loggerService.log({
                    level: 'info',
                    message: "WsWebSocketImplementation.listened message"
                })
                callbackOnClose({socket, data})
            })

            this.#connection.on(CLOSE, () => {
                this.#loggerService.log({
                    level: 'info',
                    message: "WsWebSocketImplementation.listened close"
                })
                this.#connection.isAlive = false
                socket.connection = {...this.#connection}
                callbackOnClose({socket})
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
