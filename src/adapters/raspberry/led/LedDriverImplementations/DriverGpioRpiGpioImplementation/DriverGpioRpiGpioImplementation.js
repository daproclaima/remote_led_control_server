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
        if (!this.isGpioToTearUp && this.#isLedLit === false) {
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

    switchOffLed() {
        if (!this.isGpioToTearUp && this.#isLedLit === true) {
            const callback = gpioSession => {
                this.#writeInGpioPin({gpioSession, pinId: this.PIN_12, pinValue: true})

                this.#setIsLedLit(gpioSession)
                this.#listenOnUncaughtException()
                this.#listenOnExit(gpioSession)
            }

            this.#gpioExecute(callback)
        }
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
        this.#isLedLit = this.#readFromGpioPin({gpioSession, pinId: this.PIN_12})
    }

    #writeInGpioPin = ({gpioSession, pinId, pinValue}) => {
        gpioSession.write(pinId, pinValue, function (err) {
            if (err) throw err;
        });
    }

    #readFromGpioPin = ({gpioSession, pinId}) => {
        let pinValue = null
        gpioSession.read(pinId, (err, value) => {
            if (err) throw err

            pinValue = value
            this.logger.log({level: 'info', message: `the value of pin ${pinId} is : ${value}`})
        })

        return pinValue
    }


}
