export default class Logger {
    logger = null

    get logger() {
        return this.logger
    }

    log = (logObject) => {
        this.logger.log(logObject)
    }

    constructor({loggerImplementation}) {
        this.logger = loggerImplementation
    }
}
