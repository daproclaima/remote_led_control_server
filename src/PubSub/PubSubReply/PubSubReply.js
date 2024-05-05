import {
    WSS_REPLY_SWITCHED_OFF_LED,
    WSS_REPLY_SWITCHED_ON_LED,
    WSS_REPLY_TERMINATED_GPIO_LED,
} from "../../constants/Informant/REPLIES.js";

export default class PubSubReply {
    static switchedOnLed = WSS_REPLY_SWITCHED_ON_LED
    static switchedOffLed = WSS_REPLY_SWITCHED_OFF_LED
    static terminatedGpioLed = WSS_REPLY_TERMINATED_GPIO_LED
}
