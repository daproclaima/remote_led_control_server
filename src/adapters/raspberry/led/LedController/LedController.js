import LedService from "../../../../application/Leds/LedService.js";
import WebSocketMessage from "../../../webSocket/WebSocketMessage/WebSocketMessage.js";

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
            case WebSocketMessage.switchOnLed:
                this.isLedLit = this.ledService.switchOnLed()
                break
            case WebSocketMessage.switchOffLed:
                this.isLedLit = this.ledService.switchOffLed()
                break
            case WebSocketMessage.terminateGpioLed:
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
