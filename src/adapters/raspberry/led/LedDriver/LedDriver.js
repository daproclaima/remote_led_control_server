export default class LedDriver {
    constructor({ledDriverImplementation, logger}) {
        this.ledDriver = ledDriverImplementation
        this.logger = logger
    }
}
