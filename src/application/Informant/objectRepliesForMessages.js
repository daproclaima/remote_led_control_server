import WebSocketMessage from "../../adapters/webSocket/WebSocketMessage/WebSocketMessage.js";
import WebSocketReply from "../../adapters/webSocket/WebSocketReply/WebSocketReply.js";

export const objectRepliesForMessages = {
    [WebSocketMessage.switchOnLed]: WebSocketReply.switchedOnLed,
    [WebSocketMessage.switchOffLed]: WebSocketReply.switchedOffLed,
    [WebSocketMessage.terminateGpioLed]: WebSocketReply.terminatedGpioLed
}
