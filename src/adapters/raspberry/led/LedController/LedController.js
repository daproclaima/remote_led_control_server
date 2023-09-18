import {WSS_MESSAGE_SWITCH_OFF_LED, WSS_MESSAGE_SWITCH_ON_LED} from "../../../../constants/Informant/MESSAGES.js";
import LedService from "../../../../application/Leds/LedService.js";

export default class LedController {
    logger = null

    handleMessage = (data) => {
        let exceptionOccured = false;

        // https://github.com/winstonjs/winston#logging-levels
        this.logger.log({level: 'info', message: 'LedController.handleMessage data : ' + data})

        this.ledService = new LedService({logger: this.logger})

        switch (data) {
            case WSS_MESSAGE_SWITCH_ON_LED:
                this.ledService.switchOnLed()
                return
            case WSS_MESSAGE_SWITCH_OFF_LED:
                this.ledService.switchOffLed()
        }

        process.on('uncaughtException', function (err) {
            console.log('Caught exception: ' + err);

            this.logger.log({level: 'error', message: 'LedController.handleMessage Caught exception : ' + err});

            exceptionOccured = true;

            process.exit();
        });

        process.on('exit', function (code) {
            if (exceptionOccured) this.logger.log({
                level: 'info',
                message: 'LedController.handleMessage Exception occured'
            });
            else this.logger.log({level: 'info', message: 'LedController.handleMessage Kill signal received'});

            this.ledService.tearUpGpios();
        });
    }

    constructor({logger}) {
        this.logger = logger
    }
}
