import {objectAcceptableMessages} from "./objectAcceptableMessages.js";
import {objectRepliesForMessages} from "./objectRepliesForMessages.js";
import {WSS_REPLY_UNEXPECTED_MESSAGE} from "./REPLIES.js";

export default class Informant {
    static defaultResponse = WSS_REPLY_UNEXPECTED_MESSAGE
    #objectAcceptedMessages = objectAcceptableMessages

    #objectRepliesForMessages = objectRepliesForMessages

    #isMessageAcceptable = false

    #response = null


    #loggerService = null

    constructor({loggerService}) {
        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#loggerService = loggerService
    }

    get getIsMessageAcceptable() {
        return this.#isMessageAcceptable
    }

    get getResponse() {
        return this.#response
    }

    checkIsMessageAcceptable = (message) => {
        this.#isMessageAcceptable = !!this.#objectAcceptedMessages[message]
    }

    prepareResponse = (message) => {
        let response = this.defaultResponse

        if (!this.#objectRepliesForMessages[message]) {
            const errorMessage = 'The message provided to Informant.prepareResponse is not valid'

            this.#loggerService.log({
                level: 'error',
                message: `Informant.prepareResponse prepared response: ${this.#response}`
            })

            throw new Error(errorMessage)
        }

        response = this.#objectRepliesForMessages[message]

        this.#response  = response

        this.#loggerService.log({
            level: 'info',
            message: `Informant.prepareResponse prepared response: ${this.#response}`
        })

        return this.#response
    }

}
