import {wssConfig} from "./src/PubSub/WebSocket/WsWebSocketImplementation/wssConfig.js";
import WebSocketServer from "./src/PubSub/WebSocket/WebSocketServer/WebSocketServer.js";
import WinstonLoggerImplementation from "./src/Logger/WinstonImplementation/WinstonLoggerImplementation.js";
import {winstonConfiguration} from "./src/Logger/WinstonImplementation/winstonConfiguration.js";
import WsWebSocketImplementation
    from "./src/PubSub/WebSocket/WsWebSocketImplementation/WsWebSocketImplementation.js";
import LoggerFacade from "./src/Logger/LoggerFacade.js";
import {Application} from "./src/application/Application.js";

try {
// https://github.com/winstonjs/winston#logging-levels
    const loggerImplementation = new WinstonLoggerImplementation({winstonConfiguration})
    const webSocketImplementation = new WsWebSocketImplementation({wssConfig, logger})

    const application = new Application({loggerImplementation, pubSubImplementation: webSocketImplementation})
    application.start();
} catch (error) {
    console.error('index.js: ', error)
}
