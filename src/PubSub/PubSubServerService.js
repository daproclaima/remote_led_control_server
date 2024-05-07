import { Buffer } from 'node:buffer';
export default class PubSubServerService {
    #loggerService = null
    #pubSubServerImplementation = null

    constructor({pubSubServerImplementation, loggerService}) {
        if(!pubSubServerImplementation.listen) {
            throw new Error('pubSubServerImplementation provided in PubSubServerService constructor has no listen method')
        }

        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#pubSubServerImplementation = pubSubServerImplementation
        this.#loggerService = loggerService

        this.#loggerService.log({
            level: 'info',
            message: 'PubSubServerService instance was created successfully',
        })
    }

    listen = ({callbackOnConnection = () => {}, callbackOnError = () => {}, callbackOnOpen = () => {}, callbackOnMessage = () => {}, callbackOnClose = () => {}}) => {
        this.#pubSubServerImplementation.listen({
            callbackOnConnection,
            callbackOnError,
            callbackOnOpen,
            callbackOnMessage: ({data, isBinary}) => {
                if(isBinary || Buffer.from(data)) {
                    data = data.toString()
                }

                console.log(`PubSubServerService.listen -> callbackOnMessage isBinary : ${isBinary}`)
                console.log(`PubSubServerService.listen -> callbackOnMessage data : ${data}`)

                return callbackOnMessage({data})
            },
            callbackOnClose})

        this.#loggerService.log({
            level: 'info',
            message: 'PubSubServerService.listen was executed successfully',
        })

        return this
    }

    reply = (response) => {
        this.#pubSubServerImplementation.reply(response)

        this.#loggerService.log({
            level: 'info',
            message: 'PubSubServerService.reply was executed successfully',
        })

        return this
    }

    closeConnection = () => {
        this.#pubSubServerImplementation.closeConnection()

        this.#loggerService.log({
            level: 'info',
            message: 'PubSubServerService.closeConnection was executed successfully',
        })

        return this
    }
}
