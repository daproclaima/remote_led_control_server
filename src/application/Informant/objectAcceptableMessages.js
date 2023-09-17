import WebSocketMessage from "../../adapters/webSocket/WebSocketMessage/WebSocketMessage.js";

export const objectAcceptableMessages = {
    [WebSocketMessage.switchOnLed]: WebSocketMessage.switchOnLed,
    [WebSocketMessage.switchOffLed]: WebSocketMessage.switchOffLed,
    [WebSocketMessage.test]: WebSocketMessage.test
}
