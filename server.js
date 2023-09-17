import {wssConfig} from "./src/configuration/wsServer/wssConfig.js";
import WebSocketServer from "./src/webSocket/WebSocketServer.js";
import WinstonLoggerImplementation from "./src/logger/loggerImplementations/WinstonLoggerImplementation.js";
import {winstonConfiguration} from "./src/configuration/logger/winstonConfiguration.js";
import WsWebSocketImplementation from "./src/webSocket/webSocketImplementations/WsWebSocketImplementation.js";
import Logger from "./src/logger/Logger.js";

const loggerImplementation = new WinstonLoggerImplementation({winstonConfiguration})
const logger = new Logger({loggerImplementation})

const webSocketImplementation = new WsWebSocketImplementation({wssConfig, logger})
const webSocketServer = new WebSocketServer({webSocketImplementation, logger})

webSocketServer.listen()
    .prepareNextReply()
    .reply()
