//  https://www.npmjs.com/package/onoff

import {Gpio} from "onoff";

import {LINE_NUMBERS} from "../LINE_NUMBERS.js"
import {LINE_TYPES} from "../LINE_TYPES.js"

export default class DriverGpioOnOffImplementation {
    #loggerService = null
    #chip = null
    #arrayGpioDecorators = []
    #isGpioOn = false
    
    constructor({loggerService, chipNumber = 1}) {
        this.#loggerService = loggerService
        this.#chip = chipNumber
        this.#isGpioOn = true;
    }

    getIsGpioOn = () => {
        return this.#isGpioOn
    }

    addActiveLine = ({lineNumber = null, type = null, defaultValue = null, consumerServiceName = null, chip = 0}) => {
        if(!LINE_TYPES[type]) {
            const errorMessage = "DriverGpioOnOffImplementation.addActiveLine error: type should be READ or WRITE"
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }
        if(!LINE_NUMBERS[lineNumber]) {
            const errorMessage = `DriverGpioOnOffImplementation.addActiveLine error: lineNumber should be one of ${JSON.stringify(LINE_NUMBERS)} while given ${lineNumber}`
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }
        if(!this.#chip) {
            const errorMessage = "DriverGpioOnOffImplementation.addActiveLine error: chip is not instanced."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        const line = {gpio: null, lineNumber, type, defaultValue, consumerServiceName}

        let {gpio} = line;

        if(type === LINE_TYPES.WRITE) {
            gpio = new Gpio(lineNumber, 'out');
            
            if(defaultValue) {
                gpio.writeSync(defaultValue)
            }
        }

        if(type === LINE_TYPES.READ) {
            gpio = new Gpio(lineNumber, 'in');
        }

        if(!gpio) {
            throw new Error(`DriverGpioOnOffImplementation.addline error: could not create gpio ${JSON.stringify(line)}`)
        }

        line.write = gpio.writeSync
        line.writeAsync = gpio.write
        line.unmount = gpio.unexport
        line.read = gpio.readSync
        line.readAsync = gpio.read
        line.release = gpio.unexport

        this.#arrayGpioDecorators.push(line)

        return this
    }

    getLineValue = (lineNumber = null) => {
        if(!lineNumber) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: no lineNumber provided."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        const line = this.#findLine(lineNumber)

        if (line.type !== LINE_TYPES.READ) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: requested line is not a READ TYPE."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        return line.readSync();
    }

    getAsyncLineValue = async (lineNumber = null) => {
        if(!lineNumber) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: no lineNumber provided."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        const line = this.#findLine(lineNumber)

        if (line.type !== LINE_TYPES.READ) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: requested line is not a READ TYPE."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        return await line.readAsync();
    }

    setLineValue = ({lineNumber = null, value = null}) => {
        if(!lineNumber) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: no lineNumber provided."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        const line = this.#findLine(lineNumber)

        if (line.type !== LINE_TYPES.WRITE) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: requested line is not a WRITE TYPE."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }


        line.write(value);

        return this
    }

    setAsyncLineValue = async ({lineNumber = null, value = null}) => {
        if(!lineNumber) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: no lineNumber provided."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        const line = this.#findLine(lineNumber)

        if (line.type !== LINE_TYPES.WRITE) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: requested line is not a WRITE TYPE."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }


        await line.writeAsync(value);

        return this
    }

    #findLine = (lineNumber) => {
        const line = this.#arrayGpioDecorators.find(candidateLine => candidateLine.lineNumber === lineNumber)

        if(!line) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: requested line is not activated."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        return line
    }

    releaseLine = (lineNumber) => {
        if(!lineNumber) {
            const errorMessage = "DriverGpioOnOffImplementation.readLine error: no lineNumber provided."
            this.#loggerService.log({ level: "info", message: errorMessage})
            throw new Error(errorMessage)
        }

        const line = this.#findLine(lineNumber)

        line.release()

        this.#arrayGpioDecorators = this.#arrayGpioDecorators.filter(candidate => candidate.lineNumber !== lineNumber)

        return this
    }

    tearDownGpios = () => {
        if(this.#isGpioOn) {
            this.#arrayGpioDecorators.map(line => {
                line.release();
                this.#arrayGpioDecorators = this.#arrayGpioDecorators.filter(candidate => candidate.lineNumber !== line.lineNumber)
            })

            this.#isGpioOn = false
        }

        return this
    }

}
