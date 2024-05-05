import PubSubMessage from "../PubSubMessage/PubSubMessage.js";
import PubSubReply from "../PubSubReply/PubSubReply.js";

export const objectRepliesForMessages = {
    [PubSubMessage.switchOnLed]: PubSubReply.switchedOnLed,
    [PubSubMessage.switchOffLed]: PubSubReply.switchedOffLed,
    [PubSubMessage.terminateGpioLed]: PubSubReply.terminatedGpioLed
}
