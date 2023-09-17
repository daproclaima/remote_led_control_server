export default class LedController {
    logger = null

    handleMessage = (data) => {
        // https://github.com/winstonjs/winston#logging-levels
        this.logger.log({level: 'info', message: 'LedController.handleMessage data : ' + data})
    }

    constructor({logger}) {
        this.logger = logger
    }
}
