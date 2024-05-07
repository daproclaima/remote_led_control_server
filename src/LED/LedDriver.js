import {LINE_NUMBERS} from "../GPIO/LINE_NUMBERS.js"
import {LINE_TYPES} from "../GPIO/LINE_TYPES.js"

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

    #addLedToChip = ({lineNumber, type= LINE_TYPES.WRITE, defaultValue = 0, consumerServiceName = 'LedDriver'}) => {
        this.#gpioService.addActiveLine({lineNumber, type, defaultValue, consumerServiceName})
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
    
    switchOffLed() {
        this.#gpioService.setLineValue({LED_GPIO_LINE_NUMBER, value: 0})
    }
}
