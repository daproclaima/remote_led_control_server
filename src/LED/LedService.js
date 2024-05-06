import LedDriver from "./LedDriver.js";
import PubSubMessage from "../PubSub/PubSubMessage.js";
import {
    WSS_REPLY_FAILED_SWITCH_OFF_LED,
    WSS_REPLY_FAILED_SWITCH_ON_LED, WSS_REPLY_FAILED_TERMINATE_GPIO_LED, WSS_REPLY_SWITCHED_OFF_LED,
    WSS_REPLY_SWITCHED_ON_LED, WSS_REPLY_TERMINATED_GPIO_LED
} from "../PubSub/Informant/REPLIES.js";

export default class LedService {
    #loggerService = null
    #ledDriver = null
    #response = null

    constructor({loggerService, gpioService}) {
        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#loggerService = loggerService
        this.#ledDriver = new LedDriver({loggerService, gpioService})
        this.#ledDriver.start()
    }

    handleMessage = (message) => {
        // https://github.com/winstonjs/winston#logging-levels
        this.#loggerService.log({level: 'info', message: `ledDriver.handleMessage data : ' + ${message}`})

        switch (message) {
            case PubSubMessage.switchOnLed:
                this.#ledDriver.switchOnLed()

                this.#response = WSS_REPLY_SWITCHED_ON_LED

                if(!this.#ledDriver.getIsLedLit()) {
                    this.#response = WSS_REPLY_FAILED_SWITCH_ON_LED
                }
                break

            case PubSubMessage.switchOffLed:
                this.#ledDriver.switchOffLed()

                this.#response = WSS_REPLY_SWITCHED_OFF_LED

                if(this.#ledDriver.getIsLedLit()) {
                    this.#response = WSS_REPLY_FAILED_SWITCH_OFF_LED
                }
                break

            case PubSubMessage.terminateGpioLed:
                this.#ledDriver.tearDownGpios()

                this.#response = WSS_REPLY_TERMINATED_GPIO_LED

                if(this.#ledDriver.getIsGpioOn()) {
                    this.#response = WSS_REPLY_FAILED_TERMINATE_GPIO_LED
                }
                break;

            default: {
                const errorMessage = `LedService.handleMessage data : ' + ${message}`
                this.#loggerService.log({level: 'info', message: errorMessage})
                throw new Error(errorMessage)
            }

        }

        return this.#response
    }
}
