import LedService from "../../../../application/Leds/LedService.js";
import WebSocketMessage from "../../../webSocket/WebSocketMessage/WebSocketMessage.js";

export default class LedController {
    logger = null

    bitLedLit = null

    get bitLedLit() {
        return this.bitLedLit
    }

    handleMessage = (data) => {
        // https://github.com/winstonjs/winston#logging-levels
        this.logger.log({level: 'info', message: 'LedController.handleMessage data : ' + data})

        this.ledService = new LedService({logger: this.logger})

        switch (data) {
            case WebSocketMessage.switchOnLed:
                this.bitLedLit = this.ledService.switchOnLed()
                break
            case WebSocketMessage.switchOffLed:
                this.bitLedLit = this.ledService.switchOffLed()
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
