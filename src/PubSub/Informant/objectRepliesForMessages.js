import PubSubMessage from "../PubSubMessage.js";
import PubSubReply from "../PubSubReply.js";

export const objectRepliesForMessages = {
    [PubSubMessage.switchOnLed]: PubSubReply.switchedOnLed,
    [PubSubMessage.switchOffLed]: PubSubReply.switchedOffLed,
    [PubSubMessage.terminateGpioLed]: PubSubReply.terminatedGpioLed
}
