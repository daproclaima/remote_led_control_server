import PubSubMessage from "../../PubSub/PubSubMessage/PubSubMessage.js";

export const objectAcceptableMessages = {
    [PubSubMessage.switchOnLed]: PubSubMessage.switchOnLed,
    [PubSubMessage.switchOffLed]: PubSubMessage.switchOffLed,
    [PubSubMessage.terminateGpioLed]: PubSubMessage.terminateGpioLed
}
