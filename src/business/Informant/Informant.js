import {objectAcceptableMessages} from "./objectAcceptableMessages.js";
import {objectRepliesForMessages} from "./objectRepliesForMessages.js";
import {WSS_REPLY_UNEXPECTED_MESSAGE} from "../../constants/Informant/REPLIES.js";

export default class Informant {
    static objectAcceptedMessages = objectAcceptableMessages

    static objectRepliesForMessages = objectRepliesForMessages

    static isMessageAcceptable = false

    static reply = null

    static defaultReply = WSS_REPLY_UNEXPECTED_MESSAGE

    static getIsMessageAcceptable = (message) => {
        return this.isMessageAcceptable = this.objectAcceptedMessages[message]
    }

    static getReplyAccordingToMessage = (message) => {
        this.reply = this.defaultReply

        if (this.objectRepliesForMessages[message]) {
            this.reply = this.objectRepliesForMessages[message]
        }

        return this.reply
    }
}
