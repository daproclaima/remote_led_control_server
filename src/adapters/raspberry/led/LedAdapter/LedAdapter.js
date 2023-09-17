export default class LedAdapter {
    driver = null
    logger = null

    constructor({ledDriverImplementation, logger}) {
        this.driver = ledDriverImplementation
        this.logger = logger
    }

    switchOnLed() {
        this.driver.switchOnLed()
        this.logger.log({level: 'info', message: 'LedAdapter.switchOnLed executed'})
    }

    switchOffLed() {
        this.driver.switchOffLed()
        this.logger.log({level: 'info', message: 'LedAdapter.switchOffLed executed'})
    }
}
