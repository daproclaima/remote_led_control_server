export class GpioService {
    #gpioDriver
    #loggerService

    constructor({gpioDriver, loggerService}) {
        if(!loggerService.log) {
            throw new Error('loggerService provided in PubSubServerService constructor has no log method')
        }

        this.#loggerService = loggerService
        this.#gpioDriver = gpioDriver
    }
    tearDownGpios = () => {
        this.#gpioDriver.tearDownGpios()
    }

    addActiveLine = ({lineNumber = null, type = null, defaultValue = null, consumerServiceName = null}) => {
        this.#gpioDriver = this.#gpioDriver.addActiveLine({lineNumber, type, defaultValue, consumerServiceName})
        return this
    }
    getLineValue = (lineNumber) => {
        return this.#gpioDriver.getLineValue(lineNumber)
    }

    setLineValue = ({lineNumber = null, value = null}) => {
        this.#gpioDriver = this.#gpioDriver.setLineValue({lineNumber, value})
        return this
    }
    releaseLine = (lineNumber = null) => {
        this.#gpioDriver = this.#gpioDriver.releaseLine(lineNumber)
        return this

    }
}