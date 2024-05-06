import {LINE_NUMBERS, LINE_TYPE} from "../GPIO/DriverLibGpiodImplementation/DriverLibGpiodImplementation.js";

const LED_GPIO_LINE_NUMBER = LINE_NUMBERS.TWELVE

export default class LedDriver {
    #loggerService = null
    #gpioService = null

    constructor({loggerService, gpioService}) {
        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#loggerService = loggerService
        this.#gpioService = gpioService
    }

    start = () => {
        if(this.#gpioService.getIsGpioOn()) {
            this.#addLedToChip(LED_GPIO_LINE_NUMBER)
        }
    }

    #addLedToChip = (lineNumber) => {
        this.#gpioService.addActiveLine({lineNumber, type: LINE_TYPE.READ, defaultValue: 0, consumerServiceName: 'LedDriver'})
    }

    tearDownGpios = () => {
        return this.#gpioService.tearDownGpios()
    }

    getIsLedLit = () => {
        return this.#gpioService.getLineValue(LED_GPIO_LINE_NUMBER)
    }

    switchOnLed() {
        this.#gpioService.setLineValue({LED_GPIO_LINE_NUMBER, value: 1})
    }
    //
    switchOffLed() {
        this.#gpioService.setLineValue({LED_GPIO_LINE_NUMBER, value: 0})
    }
}
