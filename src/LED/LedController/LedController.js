import LedService from "../LedService.js";
import PubSubMessage from "../../PubSub/PubSubMessage/PubSubMessage.js";

export default class LedController {
    logger = null

    isLedLit = null

    get isLedLit() {
        return this.isLedLit
    }

    handleMessage = (data) => {
        // https://github.com/winstonjs/winston#logging-levels
        this.logger.log({level: 'info', message: 'LedController.handleMessage data : ' + data})

        this.ledService = new LedService({logger: this.logger})

        switch (data) {
            case PubSubMessage.switchOnLed:
                this.isLedLit = this.ledService.switchOnLed()
                break
            case PubSubMessage.switchOffLed:
                this.isLedLit = this.ledService.switchOffLed()
                break
            case PubSubMessage.terminateGpioLed:
                this.ledService.tearUpGpios()
                break;
            default:
                return
        }
    }

    constructor({logger}) {
        this.logger = logger
    }
}
