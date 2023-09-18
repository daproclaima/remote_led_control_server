//  https://www.npmjs.com/package/onoff

import gpio from 'rpi-gpio'

export default class LedDriverGpioRpiGpioImplementation {
    #driver = null
    logger = null
    #isLedLit = false
    isGpioToTearUp = false
    PIN_12 = 12
    #isExceptionOccured = false

    constructor({logger}) {
        this.logger = logger
        this.#driver = gpio
    }

    switchOnLed() {
        if (!this.#isLedLit && !this.isGpioToTearUp) {
            const callback = (gpioSession) => {
                gpioSession.write(this.PIN_12, true, function (err) {
                    if (err) throw err
                })

                this.logger.log({
                    level: 'info',
                    message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written false to pin 12`
                })

                this.#setIsLedLit(gpioSession)
                this.#listenOnUncaughtException()
                this.#listenOnExit(gpioSession)
            }

            this.#gpioExecute(callback)
        }
    }

    switchOffLed(gpioSession) {
        // if (this.#isLedLit && !this.isGpioToTearUp) {
            const callback = () => {
                gpioSession.write(this.PIN_12, true, function (err) {
                    if (err) throw err;
                });

                this.logger.log({
                    level: 'info',
                    message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written true to pin ${this.PIN_12}`
                })

                this.#setIsLedLit(gpioSession)
                this.#listenOnUncaughtException()
                this.#listenOnExit(gpioSession)
            }

            this.#gpioExecute(callback)
        // }
    }

    tearUpGpios(gpioSessionFromGpioExecuteMethod) {
        this.isGpioToTearUp = true

        const callback = gpioSession => {
            gpioSession = gpioSessionFromGpioExecuteMethod ?? gpioSession
            gpioSession.destroy((error) => {
                if (error) throw error
                this.logger.log({
                    level: 'info',
                    message: `LedDriverGpioRpiGpioImplementation.tearUpGpios executed`
                })
            });
        }

        this.#gpioExecute(callback)
    }

    #gpioExecute = callback => {
        const logger = this.logger
        try {
            const gpioSession = this.#driver

            gpioSession.setup(this.PIN_12, gpioSession.DIR_OUT, () => {
                this.logger.log({
                    level: 'info',
                    message: `LedDriverGpioRpiGpioImplementation.construct set up pin ${this.PIN_12}`
                })

                callback(gpioSession)

                if (this.isGpioToTearUp) this.tearUpGpios(gpioSession)
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: `LedDriverGpioRpiGpioImplementation error : `, error
            })
        }
    }

    #listenOnUncaughtException = () => {
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

    #listenOnExit = (gpioSession) => {
        // code can be a param for the callback
        process.on('exit', () => {
            if (this.#isExceptionOccured) {
                this.logger.log({
                    level: 'info',
                    message: 'LedController.handleMessage Exception occured'
                });
            } else this.logger.log({level: 'info', message: 'LedController.handleMessage Kill signal received'});

            this.tearUpGpios()
        });
    }

    #setIsLedLit = (gpioSession) => {
        gpioSession.read(this.PIN_12, (err, value) => {
            if (err) throw err

            this.logger.log({level: 'info', message: `the value of pin ${this.PIN_12} is : ${value}`})
            this.#isLedLit = value
        })
    }
}
