import LoggerFacade from "../Logger/LoggerFacade.js";
import PubSubServer from "../PubSub/PubSubServer.js";

export class Application {
    constructor({loggerImplementation, pubSubImplementation}) {
        this.logger = new LoggerFacade({loggerImplementation})
        this.pubSubServer = new PubSubServer({pubSubImplementation, loggerImplementation: this.logger})
    }

    logger = null;
    pubSubServer = null;

    start = () => {
        try {

        this.pubSubServer.listen().parseLastMessage().reply()
        } catch(error) {
            this.pubSubServer.closeConnection()
            this.logger.log({
                level: 'error',
                message: `pubSubServer server terminated: ${error}`
            })
        }
    }
}