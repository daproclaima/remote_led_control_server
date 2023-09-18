import LedService from "../../../../application/Leds/LedService.js";
import WebSocketMessage from "../../../webSocket/WebSocketMessage/WebSocketMessage.js";

export default class LedController {
    logger = null

    handleMessage = (data) => {
        const ledController = this
        let isExceptionOccured = false;

        // https://github.com/winstonjs/winston#logging-levels
        this.logger.log({level: 'info', message: 'LedController.handleMessage data : ' + data})

        this.ledService = new LedService({logger: this.logger})

        switch (data) {
            case [WebSocketMessage.switchOnLed]:
                this.ledService.switchOnLed()
                break
            case [WebSocketMessage.switchOffLed]:
                this.ledService.switchOffLed()
                break
            case [WebSocketMessage.terminateGpioLed]:
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
