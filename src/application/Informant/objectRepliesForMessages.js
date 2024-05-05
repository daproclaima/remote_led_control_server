import WebSocketMessage from "../../PubSub/WebSocket/WebSocketMessage/WebSocketMessage.js";
import WebSocketReply from "../../PubSub/WebSocket/WebSocketReply/WebSocketReply.js";

export const objectRepliesForMessages = {
    [WebSocketMessage.switchOnLed]: WebSocketReply.switchedOnLed,
    [WebSocketMessage.switchOffLed]: WebSocketReply.switchedOffLed,
    [WebSocketMessage.terminateGpioLed]: WebSocketReply.terminatedGpioLed
}
