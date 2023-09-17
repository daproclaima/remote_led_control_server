import {
    WSS_MESSAGE_SWITCH_OFF_LED,
    WSS_MESSAGE_SWITCH_ON_LED,
    WSS_MESSAGE_TEST
} from "../../../constants/Informant/MESSAGES.js";


export default class WebSocketMessage {
    static switchOnLed = WSS_MESSAGE_SWITCH_ON_LED
    static switchOffLed = WSS_MESSAGE_SWITCH_OFF_LED
    static test = WSS_MESSAGE_TEST
}
