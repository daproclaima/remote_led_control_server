import {objectAcceptableMessages} from "./objectAcceptableMessages.js";
import {objectRepliesForMessages} from "./objectRepliesForMessages.js";
import {WSS_REPLY_UNEXPECTED_MESSAGE} from "./REPLIES.js";

export default class Informant {
    #objectAcceptedMessages = objectAcceptableMessages

    #objectRepliesForMessages = objectRepliesForMessages

    isMessageAcceptable = false

    reply = null

    static defaultReply = WSS_REPLY_UNEXPECTED_MESSAGE

    logger = null

    get isMessageAcceptable() {
        return this.isMessageAcceptable
    }

    constructor({logger}) {
        this.logger = logger
    }

    checkIsMessageAcceptable = (message) => {
        return this.isMessageAcceptable = !!this.#objectAcceptedMessages[message]
    }

    getReplyAccordingToMessage = (message) => {
        this.reply = this.defaultReply

        if (this.#objectRepliesForMessages[message]) {
            this.reply = this.#objectRepliesForMessages[message]
        }

        return this.reply
    }

}
