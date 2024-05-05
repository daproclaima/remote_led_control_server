export default class LedFacade {
    driver = null
    logger = null

    constructor({ledDriverImplementation, logger}) {
        this.driver = ledDriverImplementation
        this.logger = logger
    }

    switchOnLed() {
        const isLedLit = this.driver.switchOnLed()
        this.logger.log({level: 'info', message: 'LedFacade.switchOnLed executed'})

        return isLedLit
    }

    switchOffLed() {
        const isLedLit = this.driver.switchOffLed()
        this.logger.log({level: 'info', message: 'LedFacade.switchOffLed executed'})
        return isLedLit
    }

    tearUpGpios() {
        this.driver.tearUpGpios()
        this.logger.log({level: 'info', message: 'LedFacade.tearUpGpios executed'})
    }
}
