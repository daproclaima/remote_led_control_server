import WebSocketMessage from "../../PubSub/WebSocket/WebSocketMessage/WebSocketMessage.js";

export const objectAcceptableMessages = {
    [WebSocketMessage.switchOnLed]: WebSocketMessage.switchOnLed,
    [WebSocketMessage.switchOffLed]: WebSocketMessage.switchOffLed,
    [WebSocketMessage.terminateGpioLed]: WebSocketMessage.terminateGpioLed
}
