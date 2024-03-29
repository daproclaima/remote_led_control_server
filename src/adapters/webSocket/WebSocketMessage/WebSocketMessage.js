import {
    WSS_MESSAGE_SWITCH_OFF_LED,
    WSS_MESSAGE_SWITCH_ON_LED,
    WSS_MESSAGE_TERMINATE_GPIO_LED
} from "../../../constants/Informant/MESSAGES.js";


export default class WebSocketMessage {
    static switchOnLed = WSS_MESSAGE_SWITCH_ON_LED
    static switchOffLed = WSS_MESSAGE_SWITCH_OFF_LED
    static terminateGpioLed = WSS_MESSAGE_TERMINATE_GPIO_LED
}
