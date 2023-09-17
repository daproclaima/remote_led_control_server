export default class LedAdapter {
    driver = null
    logger = null

    constructor({ledDriverImplementation, logger}) {
        this.driver = ledDriverImplementation
        this.logger = logger
    }

    start() {
        this.driver.start()
        this.logger.log({level: 'info', message: 'LedAdapter.start executed'})
    }

    switchOnLed() {
        this.driver.switchOnLed()
        this.logger.log({level: 'info', message: 'LedAdapter.switchOnLed executed'})
    }

    switchOffLed() {
        this.driver.switchOffLed()
        this.logger.log({level: 'info', message: 'LedAdapter.switchOffLed executed'})
    }

    tearUpGpios() {
        this.driver.tearUpGpios()
        this.logger.log({level: 'info', message: 'LedAdapter.tearUpGpios executed'})
    }
}
