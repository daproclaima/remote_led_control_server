//  https://www.npmjs.com/package/onoff

import gpio from 'rpi-gpio'

export default class DriverGpioRpiGpioImplementation {
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
        if (this.#isExceptionOccured === false) {
            const callback = (gpioSession) => {
                const isLedLit = this.#readFromGpioPin({gpioSession, pinId: this.PIN_12})

                if(isLedLit === true) {
                    this.#writeInGpioPin({gpioSession, pinId: this.PIN_12, pinValue: true})
                    this.#setIsLedLit(gpioSession)
                }

                this.#listenOnUncaughtException()
                this.#listenOnExit(gpioSession)
            }

            this.#gpioExecute(callback)
        }

        return this.#isLedLit
    }

    switchOffLed() {
        if (this.#isExceptionOccured === false) {
            const callback = gpioSession => {
                const isLedLit = this.#readFromGpioPin({gpioSession, pinId: this.PIN_12})

                if(isLedLit === false) {
                    this.#writeInGpioPin({gpioSession, pinId: this.PIN_12, pinValue: false})
                    this.#setIsLedLit(gpioSession)
                }

                this.#listenOnUncaughtException()
                this.#listenOnExit(gpioSession)
            }

            this.#gpioExecute(callback)
        }

        return this.#isLedLit
    }

    tearUpGpios(gpioSessionFromGpioExecuteMethod) {
        this.isGpioToTearUp = true

        const callback = gpioSession => {
            gpioSession = gpioSessionFromGpioExecuteMethod ?? gpioSession

            gpioSession.destroy((error) => {
                if (error) {
                    this.logger.log({
                        level: 'error',
                        message: `LedDriverGpioRpiGpioImplementation.tearUpGpios error : ${error}`
                    })
                } else {
                    this.logger.log({
                        level: 'info',
                        message: `LedDriverGpioRpiGpioImplementation.tearUpGpios executed`
                    })
                }
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
                message: `LedDriverGpioRpiGpioImplementation.#gpioExecute error : ${error}`
            })
        }
    }

    #listenOnUncaughtException = () => {
        process.once('uncaughtException', err => {
            console.log('Caught exception: ' + err);

            this.logger.log({
                level: 'error',
                message: 'LedController.listenOnUncaughtException Caught exception : ' + err
            });

            this.#isExceptionOccured = true;

            process.exit();
        });
    }

    #listenOnExit = (gpioSession) => {
        // code can be a param for the callback
        process.once('exit', () => {
            if (this.#isExceptionOccured) {
                this.logger.log({
                    level: 'info',
                    message: 'LedController.#listenOnExit Exception occured'
                });
            } else this.logger.log({level: 'info', message: 'LedController.listenOnExit Kill signal received'});

            this.tearUpGpios(gpioSession)
        });
    }

    #setIsLedLit = (gpioSession) => {
        this.#isLedLit = this.#readFromGpioPin({gpioSession, pinId: this.PIN_12})
    }

    #writeInGpioPin = ({gpioSession, pinId, pinValue}) => {
        gpioSession.write(pinId, pinValue, (err) => {
            if (err) {
                this.logger.log({
                    level: 'error',
                    message: `LedController.#writeInGpioPin Exception occured: ${err}`
                });
            }

            this.logger.log({
                level: 'info',
                message: `LedDriverGpioRpiGpioImplementation.#writeInGpioPin wrote ${pinValue} to pin ${pinId}`
            })
        });
    }

    #readFromGpioPin = ({gpioSession, pinId}) => {
        let pinValue = null

        gpioSession.read(pinId, (err, value) => {
            if (err) throw err

            pinValue = value
            this.logger.log({level: 'info', message: `the value of pin ${pinId} is: ${value}`})
        })

        return pinValue
    }
}
