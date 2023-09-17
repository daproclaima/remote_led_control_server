//  https://www.npmjs.com/package/onoff

import {Gpio} from "onoff";

export default class LedDriverGpioImplementation {
    constructor() {
        this.driver = Gpio
    }
}
