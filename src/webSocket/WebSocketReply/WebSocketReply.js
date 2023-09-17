import {
    WSS_REPLY_SWITCHED_OFF_LED,
    WSS_REPLY_SWITCHED_ON_LED,
    WSS_REPLY_TEST,
} from "../../constants/Informant/REPLIES.js";

export default class WebSocketReply {
    static switchedOnLed = WSS_REPLY_SWITCHED_ON_LED
    static switchedOffLed = WSS_REPLY_SWITCHED_OFF_LED
    static test = WSS_REPLY_TEST
}
