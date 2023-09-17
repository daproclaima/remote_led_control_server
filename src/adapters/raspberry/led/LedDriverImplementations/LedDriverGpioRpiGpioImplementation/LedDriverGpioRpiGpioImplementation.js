//  https://www.npmjs.com/package/onoff

import gpio from 'rpi-gpio'

export default class LedDriverGpioRpiGpioImplementation {
    driver = null
    logger = null

    constructor({logger}) {
        this.logger = logger
        this.driver = gpio

        gpio.setup(12, gpio.DIR_OUT);
    }

    switchOnLed() {
        gpio.write(12, true, function (err) {
            if (err) throw err;

            this.logger.log({
                level: 'info',
                message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written true to pin 12`
            })
        });
    }

    switchOffLed() {
        gpio.write(12, true, function (err) {
            if (err) throw err;
            this.logger.log({
                level: 'info',
                message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written false to pin 12`
            })
        })
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
