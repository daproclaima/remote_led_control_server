import {wssConfig} from "./src/PubSub/WebSocket/WsWebSocketImplementation/wssConfig.js";
import WinstonLoggerImplementation from "./src/Logger/WinstonImplementation/WinstonLoggerImplementation.js";
import {winstonConfiguration} from "./src/Logger/WinstonImplementation/winstonConfiguration.js";
import WsWebSocketImplementation
    from "./src/PubSub/WebSocket/WsWebSocketImplementation/WsWebSocketImplementation.js";
import {ApplicationService} from "./src/application/ApplicationService.js";
import LoggerService from "./src/Logger/LoggerService.js";
import PubSubServerService from "./src/PubSub/PubSubServerService.js";
import {GpioService} from "./src/GPIO/GpioService.js";
import DriverGpioOnOffImplementation from "./src/GPIO/DriverGpioOnOffImplementation/DriverGpioOnOffImplementation.js";

let winstonLoggerImplementation = null;
let loggerService = null;

const startApplication = () => {
    // https://github.com/winstonjs/winston#logging-levels
    winstonLoggerImplementation = new WinstonLoggerImplementation({winstonConfiguration})
    loggerService = new LoggerService({loggerImplementation: winstonLoggerImplementation})

    const pubSubServerImplementation = new WsWebSocketImplementation({wssConfig, loggerService})
    const pubSubServerService = new PubSubServerService({pubSubServerImplementation, loggerService})

    const gpioDriver = new DriverGpioOnOffImplementation({loggerService})
    const gpioService = new GpioService({loggerService, gpioDriver})

    const applicationService = new ApplicationService({loggerService, pubSubServerService, gpioService})

    applicationService.start();

    process.on('SIGTERM', () => {
        applicationService.stop()
        process.exit(0);
    });
    process.on('SIGINT', () => {
        applicationService.stop()
        process.exit(0);
    });
}

try {
    startApplication()
} catch (error) {
    loggerService?.log({level: "error", message: `index.js :${error}`}) || console.error(`index.js error : ${error}`)
    process.exit(0);
}
