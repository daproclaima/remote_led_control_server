import WebSocketMessage from "../../webSocket/WebSocketMessage/WebSocketMessage.js";
import WebSocketReply from "../../webSocket/WebSocketReply/WebSocketReply.js";

export const objectRepliesForMessages = {
    [WebSocketMessage.switchOnLed]: WebSocketReply.switchedOnLed,
    [WebSocketMessage.switchOffLed]: WebSocketReply.switchedOffLed,
    [WebSocketMessage.test]: WebSocketReply.test
}
