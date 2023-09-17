//  https://www.npmjs.com/package/onoff

import {Gpio} from "onoff";

export default class LedDriverGpioImplementation {
    driver = null
    logger = null

    led = new Gpio(12, 'out')

    constructor({logger}) {
        this.logger = logger
        this.driver = Gpio
    }

    switchOnLed() {
        if (this.led.readSync() === 0) this.led.writeSync(1)
    }

    switchOffLed() {
        if (this.led.readSync() === 1) this.led.writeSync(0)
    }
}
