import FeatureToggler from "../FeatureToggler/FeatureToggler.js";
import {FEATURE_GPIO} from "../../constants/Features/FEATURES.js";
import LedAdapter from "../../adapters/raspberry/led/LedAdapter/LedAdapter.js";
import LedDriverGpioRpiGpioImplementation
    from "../../adapters/raspberry/led/LedDriverImplementations/LedDriverGpioRpiGpioImplementation/LedDriverGpioRpiGpioImplementation.js";

export default class LedService {
    logger = null

    ledAdapter = null

    constructor({logger}) {
        const featureToggle = new FeatureToggler()
        const isFeatureGpioEnabled = featureToggle.getIsFeatureEnabled(FEATURE_GPIO)

        if (isFeatureGpioEnabled) {
            const ledDriverGpio = new LedDriverGpioRpiGpioImplementation({logger})
            this.ledAdapter = new LedAdapter({logger, ledDriverImplementation: ledDriverGpio})
        }

        this.logger = logger
    }

    switchOnLed() {
        this.ledAdapter?.switchOnLed()
    }

    switchOffLed() {
        this.ledAdapter?.switchOffLed()
    }

    tearUpGpios() {
        this.ledAdapter.tearUpGpios()
    }
}
