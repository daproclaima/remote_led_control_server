import LoggerFacade from "../Logger/LoggerFacade.js";
import PubSubServerFacade from "../PubSub/PubSubServerFacade.js";

export class Application {
    constructor({loggerImplementation, pubSubImplementation}) {
        this.logger = new LoggerFacade({loggerImplementation})
        this.pubSubServer = new PubSubServerFacade({pubSubImplementation, loggerImplementation: this.logger})
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