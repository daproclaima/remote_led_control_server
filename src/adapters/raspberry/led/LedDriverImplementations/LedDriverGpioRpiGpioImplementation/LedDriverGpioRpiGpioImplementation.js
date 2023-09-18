//  https://www.npmjs.com/package/onoff

import gpio from 'rpi-gpio'

export default class LedDriverGpioRpiGpioImplementation {
    driver = null
    logger = null
    isLedToLit = false
    isGpioToTearUp = false
    PIN_12 = 12

    constructor({logger}) {
        this.logger = logger
        this.driver = gpio
    }

    listen() {
        const logger = this.logger
        const ledDriver = this

        try {
            gpio.setup(ledDriver.PIN_12, gpio.DIR_OUT, () => {
                logger.log({
                    level: 'info',
                    message: `LedDriverGpioRpiGpioImplementation.construct set up pin ${ledDriver.PIN_12}`
                })

                while(true) {

                    let isLoggedInfoLedOn = false
                    while (ledDriver.isLedToLit === false) {
                        gpio.write(ledDriver.PIN_12, true, function (err) {
                            if (err) throw err;

                            isLoggedInfoLedOn = true

                            if (!isLoggedInfoLedOn) logger.log({
                                level: 'info',
                                message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written true to pin ${ledDriver.PIN_12}`
                            })
                        });
                    }

                    let isLoggedInfoLedOff = false
                    while (ledDriver.isLedToLit === true) {
                        gpio.write(ledDriver.PIN_12, true, function (err) {
                            if (err) throw err;

                            isLoggedInfoLedOff = true

                            if (!isLoggedInfoLedOff) logger.log({
                                level: 'info',
                                message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written false to pin 12`
                            })
                        })
                    }

                    if (ledDriver.isGpioToTearUp) gpio.destroy((error) => {
                        if (error) throw error
                        logger.log({
                            level: 'info',
                            message: `LedDriverGpioRpiGpioImplementation.tearUpGpios executed`
                        })
                    });
                }
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: `LedDriverGpioRpiGpioImplementation error : `, error
            })
        }
    }

    switchOnLed() {
        this.isLedToLit = true
        this.listen()
    }

    switchOffLed() {
        this.isLedToLit = false
        this.listen()
    }

    tearUpGpios() {
        this.isGpioToTearUp = true
        this.listen()
    }
}
