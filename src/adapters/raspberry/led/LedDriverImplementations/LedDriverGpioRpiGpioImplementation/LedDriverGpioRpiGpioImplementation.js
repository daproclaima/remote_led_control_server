//  https://www.npmjs.com/package/onoff

import gpio from 'rpi-gpio'

export default class LedDriverGpioRpiGpioImplementation {
    driver = null
    logger = null
    #isLedToLit = false
    isGpioToTearUp = false
    PIN_12 = 12
    #isLoggedInfoLedOn = false
    #isLoggedInfoLedOff = false
    #gpio = gpio
    #isExceptionOccured = false

    constructor({logger}) {
        this.logger = logger
        this.driver = gpio
    }

    listen() {
        const logger = this.logger
        try {
            this.#setup()
        } catch (error) {
            logger.log({
                level: 'error',
                message: `LedDriverGpioRpiGpioImplementation error : `, error
            })
        }
    }

    switchOnLed() {
        this.#isLedToLit = true
        this.listen()
    }

    switchOffLed() {
        this.#isLedToLit = false
        this.listen()
    }

    tearUpGpios() {
        this.isGpioToTearUp = true
        this.listen()
    }

    #setup = () => {
        this.#gpio.setup(this.PIN_12, gpio.DIR_OUT, () => {
            this.logger.log({
                level: 'info',
                message: `LedDriverGpioRpiGpioImplementation.construct set up pin ${this.PIN_12}`
            })

            if (!this.isGpioToTearUp) {
                if (this.#isLedToLit === false) {
                    this.#setLedOff(this.#gpio)

                    this.#isLoggedInfoLedOn = true

                    if (!this.#isLoggedInfoLedOn) {
                        this.logger.log({
                            level: 'info',
                            message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written true to pin ${this.PIN_12}`
                        })

                        this.#isLoggedInfoLedOff = false
                    }

                    this.#listenOnUncaughtException()
                    this.#listenOnExit(this.#gpio)
                }

                if (this.#isLedToLit === true) {
                    this.#setLedOn(this.#gpio)

                    this.#isLoggedInfoLedOff = true
                    if (!this.#isLoggedInfoLedOff) {
                        this.logger.log({
                            level: 'info',
                            message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written false to pin 12`
                        })
                        this.#isLoggedInfoLedOn = false
                    }

                    this.#listenOnUncaughtException()
                    this.#listenOnExit(this.#gpio)
                }
            }

            if (this.isGpioToTearUp) this.#destroy(this.#gpio)
        });
    }

    #destroy = (gpio) => {
        gpio.destroy((error) => {
            if (error) throw error
            this.logger.log({
                level: 'info',
                message: `LedDriverGpioRpiGpioImplementation.tearUpGpios executed`
            })
        });
    }

    #setLedOn = (gpio) => {
        gpio.write(this.PIN_12, true, function (err) {
            if (err) throw err
        })
    }

    #setLedOff = (gpio) => {
        gpio.write(this.PIN_12, true, function (err) {
            if (err) throw err;
        });
    }

    #listenOnUncaughtException() {
        process.on('uncaughtException', err => {
            console.log('Caught exception: ' + err);

            this.logger.log({
                level: 'error',
                message: 'LedController.handleMessage Caught exception : ' + err
            });

            this.#isExceptionOccured = true;

            process.exit();
        });
    }

    #listenOnExit = (gpio) => {
        // code can be a param for the callback
        process.on('exit', () => {
            if (this.#isExceptionOccured) {
                this.logger.log({
                    level: 'info',
                    message: 'LedController.handleMessage Exception occured'
                });
            }
            else this.logger.log({level: 'info', message: 'LedController.handleMessage Kill signal received'});

            this.#destroy(gpio)
        });
    }
}
