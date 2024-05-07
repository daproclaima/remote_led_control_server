import Informant from "../../Informant/Informant.js";
import LedDriver from "../../../LED/LedDriver.js";
import Errors from "../../../Errors/Errors.js";
import PubSubMessage from "../../PubSubMessage.js";
import {WSS_REPLY_FAILED_SWITCH_OFF_LED, WSS_REPLY_FAILED_SWITCH_ON_LED} from "../../Informant/REPLIES.js";

export default class WebSocketServerFacade {
    #loggerService = null
    #webSocketImplementation = null
    #server

    listen = () => {
        this.#webSocketImplementation.listen()
        return this
    }

    // reply = (webSocketConnection) => {
    //     let currentReply = Informant.defaultReply

    //     if (!currentReply) {
    //         throw new Error(Errors.WebSocketServer.EMPTY_INFORMANT_REPLY.code)
    //     }

    //     if (this.#nextReply) {
    //         currentReply = this.#nextReply
    //         this.#nextReply = null
    //     }

    //     this.#webSocketImplementation.reply(webSocketConnection, currentReply)
    //     this.#lastReply = currentReply

    //     return this
    // }

    closeConnection = () => {
        this.#webSocketImplementation.closeConnection()

        return this
    }

    constructor({webSocketImplementation, loggerService}) {
        if(!webSocketImplementation.listen) {
            throw new Error('pubSubServerImplementation provided in PubSubServerService constructor has no listen method')
        }

        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#webSocketImplementation = webSocketImplementation
        this.#loggerService = loggerService

        this.#loggerService.log({
            level: 'info',
            message: 'WebSocketServerFacade instance built'
        })
    }
}
