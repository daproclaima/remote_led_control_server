import {WSS_MESSAGE_SWITCH_OFF_LED, WSS_MESSAGE_SWITCH_ON_LED} from "../constants/WSS_MESSAGES.js";

export default class WebSocketMessage {
    static switchOnLed = WSS_MESSAGE_SWITCH_ON_LED
    static switchOffLed = WSS_MESSAGE_SWITCH_OFF_LED
}
