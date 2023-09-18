export default class LedAdapter {
    driver = null
    logger = null

    constructor({ledDriverImplementation, logger}) {
        this.driver = ledDriverImplementation
        this.logger = logger
    }

    switchOnLed() {
        const isLedLit = this.driver.switchOnLed()
        this.logger.log({level: 'info', message: 'LedAdapter.switchOnLed executed'})

        return isLedLit
    }

    switchOffLed() {
        const isLedLit = this.driver.switchOffLed()
        this.logger.log({level: 'info', message: 'LedAdapter.switchOffLed executed'})
        return isLedLit
    }

    tearUpGpios() {
        this.driver.tearUpGpios()
        this.logger.log({level: 'info', message: 'LedAdapter.tearUpGpios executed'})
    }
}
