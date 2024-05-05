import PubSubMessage from "../../PubSub/PubSubMessage/PubSubMessage.js";
import PubSubReply from "../../PubSub/PubSubReply/PubSubReply.js";

export const objectRepliesForMessages = {
    [PubSubMessage.switchOnLed]: PubSubReply.switchedOnLed,
    [PubSubMessage.switchOffLed]: PubSubReply.switchedOffLed,
    [PubSubMessage.terminateGpioLed]: PubSubReply.terminatedGpioLed
}
