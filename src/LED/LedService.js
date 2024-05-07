import LedDriver from "./LedDriver.js";
import PubSubMessage from "../PubSub/PubSubMessage.js";
import {
    WSS_REPLY_FAILED_SWITCH_OFF_LED,
    WSS_REPLY_FAILED_SWITCH_ON_LED,
    WSS_REPLY_FAILED_TERMINATE_GPIO_LED,
    WSS_REPLY_SWITCHED_OFF_LED,
    WSS_REPLY_SWITCHED_ON_LED,
    WSS_REPLY_TERMINATED_GPIO_LED, WSS_REPLY_UNEXPECTED_MESSAGE
} from "./REPLIES.js";
import {WSS_MESSAGE_SWITCH_OFF_LED, WSS_MESSAGE_SWITCH_ON_LED, WSS_MESSAGE_TERMINATE_GPIO_LED} from "./MESSAGES.js";

export default class LedService {
    #loggerService = null
    #ledDriver = null
    #pubSubServerService = null
    #enumValidMessages = null
    #enumValidResponse = null

    constructor({loggerService, gpioService, pubSubServerService}) {
        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#loggerService = loggerService
        this.#pubSubServerService = pubSubServerService
        this.#ledDriver = new LedDriver({loggerService, gpioService})
        this.#enumValidMessages = {
            [WSS_MESSAGE_SWITCH_ON_LED] : WSS_MESSAGE_SWITCH_ON_LED,
            [WSS_MESSAGE_SWITCH_OFF_LED] : WSS_MESSAGE_SWITCH_OFF_LED,
            [WSS_MESSAGE_TERMINATE_GPIO_LED] : WSS_MESSAGE_TERMINATE_GPIO_LED,
        }.freeze()

        this.#enumValidMessages = {
            [WSS_REPLY_SWITCHED_ON_LED] : WSS_REPLY_SWITCHED_ON_LED,
            [WSS_REPLY_SWITCHED_OFF_LED] : WSS_REPLY_SWITCHED_OFF_LED,
            [WSS_REPLY_FAILED_SWITCH_ON_LED] : WSS_REPLY_FAILED_SWITCH_ON_LED,
            [WSS_REPLY_FAILED_SWITCH_OFF_LED] : WSS_REPLY_FAILED_SWITCH_OFF_LED,
            [WSS_REPLY_UNEXPECTED_MESSAGE] : WSS_REPLY_UNEXPECTED_MESSAGE,
            [WSS_REPLY_TERMINATED_GPIO_LED] : WSS_REPLY_TERMINATED_GPIO_LED,
            [WSS_REPLY_FAILED_TERMINATE_GPIO_LED] : WSS_REPLY_FAILED_TERMINATE_GPIO_LED,
        }.freeze()
    }

    start = () => {
        if(!this.#pubSubServerService) {
            throw new Error('LedService.start: no pubSubServerService provided')
        }

        if(!this.#pubSubServerService.listen) {
            throw new Error('LedService.start: this.#pubSubServerService has no listen method')
        }

        this.#ledDriver.start()
        this.#pubSubServerService.listen({callbackOnMessage: this.#callbackOnMessage})
    }

    #callbackOnMessage = (socket, data) => {
        // https://github.com/winstonjs/winston#logging-levels
        this.#loggerService.log({level: 'info', message: `ledDriver.callbackOnMessage data : ' + ${JSON.stringify(data)}`})
        this.#loggerService.log({level: 'info', message: `ledDriver.callbackOnMessage data : ' + ${JSON.stringify(socket)}`})

        let responsePayload = WSS_REPLY_UNEXPECTED_MESSAGE


        switch (data) {
            case WSS_MESSAGE_SWITCH_ON_LED:
                this.#ledDriver.switchOnLed()

                responsePayload = WSS_REPLY_SWITCHED_ON_LED

                if(!this.#ledDriver.getIsLedLit()) {
                    responsePayload = WSS_REPLY_FAILED_SWITCH_ON_LED
                }
                break

            case WSS_MESSAGE_SWITCH_OFF_LED:
                this.#ledDriver.switchOffLed()

                responsePayload = WSS_REPLY_SWITCHED_OFF_LED

                if(this.#ledDriver.getIsLedLit()) {
                    responsePayload = WSS_REPLY_FAILED_SWITCH_OFF_LED
                }
                break

            case WSS_MESSAGE_TERMINATE_GPIO_LED:
                this.#ledDriver.tearDownGpios()

                responsePayload = WSS_REPLY_TERMINATED_GPIO_LED

                if(this.#ledDriver.getIsGpioOn()) {
                    responsePayload = WSS_REPLY_FAILED_TERMINATE_GPIO_LED
                }
                break;

            default: {
                this.#loggerService.log({level: 'info', message: `LedService.callbackOnMessage data was not recognized : ${JSON.stringify(data)}; socket data : ${JSON.stringify(socket)}`})
            }

        }

        if(!this.#getIsResponseToSendValid(responsePayload)) {
            this.#loggerService.log({level: 'info', message: `LedService.callbackOnMessage response payload is not valid : ${responsePayload}`})
        }

        this.#pubSubServerService.reply(responsePayload)

        return this
    }

    #getIsResponseToSendValid = (response) => {
        return !!this.#enumValidResponse[response]
    }
}
