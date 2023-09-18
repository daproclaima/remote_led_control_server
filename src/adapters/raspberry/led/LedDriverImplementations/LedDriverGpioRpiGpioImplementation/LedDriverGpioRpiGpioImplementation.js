//  https://www.npmjs.com/package/onoff

import gpio from 'rpi-gpio'

export default class LedDriverGpioRpiGpioImplementation {
    #driver = null
    logger = null
    #isLedLit = false
    isGpioToTearUp = false
    PIN_12 = 12
    #gpioSession = null
    #isExceptionOccured = false

    constructor({logger}) {
        this.logger = logger
        this.#driver = gpio
        this.#openSession()
    }

    switchOnLed() {
        if (!this.#isLedLit && !this.isGpioToTearUp) {
            this.#gpioSession.write(this.PIN_12, true, function (err) {
                if (err) throw err
            })

            this.logger.log({
                level: 'info',
                message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written false to pin 12`
            })

            this.#setIsLedLit()

            this.#listenOnUncaughtException()
            this.#listenOnExit(this.#gpioSession)
        }
    }

    switchOffLed() {
        if (this.#isLedLit && !this.isGpioToTearUp) {

            this.#gpioSession.write(this.PIN_12, true, function (err) {
                if (err) throw err;
            });

            this.logger.log({
                level: 'info',
                message: `LedDriverGpioRpiGpioImplementation.switchOnLed Written true to pin ${this.PIN_12}`
            })

            this.#setIsLedLit()

            this.#listenOnUncaughtException()
            this.#listenOnExit(this.#gpioSession)
        }
    }

    tearUpGpios() {
        this.isGpioToTearUp = true
        this.#destroy()
    }

    #openSession = () => {
        const logger = this.logger
        try {
            const gpioSession = structuredClone(this.#driver)
            gpioSession.setup(this.PIN_12, this.#driver.DIR_OUT, () => {
                this.logger.log({
                    level: 'info',
                    message: `LedDriverGpioRpiGpioImplementation.construct set up pin ${this.PIN_12}`
                })

                this.#gpioSession = gpioSession

                if (this.isGpioToTearUp) this.#destroy(this.#gpioSession)
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: `LedDriverGpioRpiGpioImplementation error : `, error
            })
        }
    }

    #destroy = () => {
        this.#gpioSession.destroy((error) => {
            if (error) throw error
            this.logger.log({
                level: 'info',
                message: `LedDriverGpioRpiGpioImplementation.tearUpGpios executed`
            })
        });
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

    #listenOnExit = () => {
        // code can be a param for the callback
        process.on('exit', () => {
            if (this.#isExceptionOccured) {
                this.logger.log({
                    level: 'info',
                    message: 'LedController.handleMessage Exception occured'
                });
            } else this.logger.log({level: 'info', message: 'LedController.handleMessage Kill signal received'});

            this.#destroy(this.#gpioSession)
        });
    }

    #setIsLedLit = () => {
        this.#gpioSession.read(this.PIN_12, (err, value) => {
            if (err) throw err

            this.logger.log({level: 'info', message: `the value of pin ${this.PIN_12} is : ${value}`})
            this.#isLedLit = value
        })
    }
}
