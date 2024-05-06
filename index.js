import {wssConfig} from "./src/PubSub/WebSocket/WebSocketServer/WsWebSocketImplementation/wssConfig.js";
import WinstonLoggerImplementation from "./src/Logger/WinstonImplementation/WinstonLoggerImplementation.js";
import {winstonConfiguration} from "./src/Logger/WinstonImplementation/winstonConfiguration.js";
import WsWebSocketImplementation
    from "./src/PubSub/WebSocket/WebSocketServer/WsWebSocketImplementation/WsWebSocketImplementation.js";
import {ApplicationService} from "./src/application/ApplicationService.js";
import LoggerService from "./src/Logger/LoggerService.js";
import PubSubServerService from "./src/PubSub/PubSubServerService.js";
import Informant from "./src/PubSub/Informant/Informant.js";
import {GpioService} from "./src/GPIO/GpioService.js";
import {DriverLibGpiodImplementation} from "./src/GPIO/DriverLibGpiodImplementation/DriverLibGpiodImplementation.js";

try {
    // https://github.com/winstonjs/winston#logging-levels
    const winstonLoggerImplementation = new WinstonLoggerImplementation({winstonConfiguration})
    const loggerService = new LoggerService({loggerImplementation: winstonLoggerImplementation})

    // wrong should not take a logger
    const wsWebSocketImplementation = new WsWebSocketImplementation({wssConfig, loggerService})
    const pubSubServerService = new PubSubServerService({pubSubServerImplementation: wsWebSocketImplementation, loggerService})

    const informantService = new Informant({loggerService})

    const gpioDriver = new DriverLibGpiodImplementation({loggerService})
    const gpioService = new GpioService({loggerService, gpioDriver})

    const applicationService = new ApplicationService({loggerService, pubSubServerService, informantService, gpioService})

    applicationService.start();
} catch (error) {
    console.error('index.js: ', error)
}
