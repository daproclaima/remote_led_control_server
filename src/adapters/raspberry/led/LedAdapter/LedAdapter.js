export default class LedAdapter {
    driver = null
    logger = null

    constructor({ledDriverImplementation, logger}) {
        this.driver = ledDriverImplementation
        this.logger = logger
    }

    switchOnLed() {
        const bitLedLit = this.driver.switchOnLed()
        this.logger.log({level: 'info', message: 'LedAdapter.switchOnLed executed'})

        return bitLedLit
    }

    switchOffLed() {
        const bitLedLit = this.driver.switchOffLed()
        this.logger.log({level: 'info', message: 'LedAdapter.switchOffLed executed'})
        return bitLedLit
    }

    tearUpGpios() {
        this.driver.tearUpGpios()
        this.logger.log({level: 'info', message: 'LedAdapter.tearUpGpios executed'})
    }
}
