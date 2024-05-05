import {wssConfig} from "./src/adapters/configuration/wsServer/wssConfig.js";
import WebSocketServer from "./src/adapters/webSocket/WebSocketServer/WebSocketServer.js";
import WinstonLoggerImplementation from "./src/Logger/loggerImplementations/winston/WinstonLoggerImplementation.js";
import {winstonConfiguration} from "./src/Logger/loggerImplementations/winston/winstonConfiguration.js";
import WsWebSocketImplementation
    from "./src/adapters/webSocket/webSocketImplementations/WsWebSocketImplementation/WsWebSocketImplementation.js";
import LoggerFacade from "./src/Logger/LoggerFacade.js";

try {
// https://github.com/winstonjs/winston#logging-levels
    const loggerImplementation = new WinstonLoggerImplementation({winstonConfiguration})
    const logger = new LoggerFacade({loggerImplementation})

    const webSocketImplementation = new WsWebSocketImplementation({wssConfig, logger})
    const webSocketServer = new WebSocketServer({webSocketImplementation, logger})


    webSocketServer.listen()
        .parseLastMessage()
        .reply()
} catch (error) {
    console.error('index.js websocket server : ', error)
}
