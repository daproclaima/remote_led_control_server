//  https://www.npmjs.com/package/onoff

import gpio from 'rpi-gpio'

export default class LedDriverGpioRpiGpioImplementation {
    driver = null
    logger = null
    isLedToLit = false
    isGpioToTearUp = false

    constructor({logger}) {
        this.logger = logger
        this.driver = gpio
    }

    start() {
        try {
            gpio.setup(12, gpio.DIR_OUT, () => {
                this.logger.log({
                    level: 'info',
                    message: `LedDriverGpioRpiGpioImplementation.construct set up pin 12`
                })

                if (this.isLedToLit === false) gpio.write(12, true, function (err) {
                    if (err) throw err;

                    this.logger.log({
                        level: 'info',
                        message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written true to pin 12`
                    })
                });

                if (this.isLedToLit === true) gpio.write(12, true, function (err) {
                    if (err) throw err;

                    this.logger.log({
                        level: 'info',
                        message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written false to pin 12`
                    })
                })

                if(this.isGpioToTearUp) gpio.destroy((error) => {
                    if (error) throw error
                    this.logger.log({
                        level: 'info',
                        message: `LedDriverGpioRpiGpioImplementation.tearUpGpios executed`
                    })
                });
            });
        } catch (error) {
            this.logger.log({
                level: 'error',
                message: `LedDriverGpioRpiGpioImplementation error : `, error
            })
        }
    }

    switchOnLed() {
        this.isLedToLit = true
    }

    switchOffLed() {
        this.isLedToLit = false
    }

    tearUpGpios() {
        try {
            gpio.destroy((error) => {
                if (error) throw error
                this.logger.log({
                    level: 'info',
                    message: `LedDriverGpioRpiGpioImplementation.tearUpGpios executed`
                })
            });
        } catch (error) {
            this.logger.log({
                level: 'error',
                message: `LedDriverGpioRpiGpioImplementation.tearUpGpios error : `, error
            })
        }
    }
}
