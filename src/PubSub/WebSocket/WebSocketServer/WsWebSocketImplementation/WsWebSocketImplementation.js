import {WebSocketServer} from "ws";

const CONNECTION = 'connection'
const OPEN = 'open'
const MESSAGE = 'message'
const CLOSE = 'close'
const ERROR = 'error'

export default class WsWebSocketImplementation {
    #loggerService = null
    #server = null
    #connection

    constructor({wssConfig, loggerService}) {
        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#server = new WebSocketServer(wssConfig);
        this.#loggerService = loggerService
    }

    getServer = () => {
        return this.#server
    }

    listen = ({callbackOnConnection = () => {}, callbackOnError =  () => {}, callbackOnOpen =  () => {}, callbackOnMessage =  () => {}, callbackOnClose =  () => {}}) => {
        this.#server.on(CONNECTION, (connection, request, client) => {
            this.#loggerService.log({
                level: 'info',
                message: "WsWebSocketImplementation.listened connection"
            })

            connection.isAlive = true;

            const socket = {request, client, connection}

            callbackOnConnection({socket})

            connection.on(ERROR, (error) => {
                // this.#sanitizeDataReceived(data)
                this.#loggerService.log({level: 'error', message: `WsWebSocketImplementation.listen listened error : ${error}`})
                callbackOnError({socket, error})
            });

            connection.on(OPEN, () => {
                this.#loggerService.log({level: 'info', message: 'WsWebSocketImplementation.listen listened open'})
                callbackOnOpen({socket})
                this.#connection.send("CONNECTION OPEN")
            });
            connection.on(MESSAGE, (data) => {
                // this.#sanitizeDataReceived(data)
                this.#loggerService.log({level: 'error', message: `WsWebSocketImplementation.listen listened message : ${JSON.stringify(data)}`})
                callbackOnMessage({socket, data})
            })
            connection.on(CLOSE, () => {
                this.#loggerService.log({
                    level: 'info',
                    message: "WsWebSocketImplementation.listened close"
                })

                callbackOnClose({socket})
                connection.isAlive = false
            });

            this.#connection = connection
        });

        this.#loggerService.log({
            level: 'info',
            message: 'WsWebSocketImplementation.listen was executed successfully'
        })

        return this
    }

    reply = (data) => {
        if(!data) {
            throw new Error("WsWebSocketImplementation.reply : data is nullish.")
        }

        if(!this.#connection.isAlive) {
            throw new Error("WsWebSocketImplementation.reply : connection is not alive.")
        }

        const payload = JSON.stringify(data)

        this.#connection.send(payload)
        this.#loggerService.log({level: 'info', message: `WsWebSocketImplementation.reply successfully sent: ${payload}`})

        return this
    }

    closeConnection = () => {
        this.#connection.terminate()
        this.#loggerService.log({level: 'info', message: 'WsWebSocketImplementation.closeConnection executed successfully; server terminated'})

        return this
    }

    // #sanitizeDataReceived = (data) => {}
}
