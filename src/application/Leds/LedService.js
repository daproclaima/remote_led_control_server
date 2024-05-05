import FeatureToggler from "../../FeatureToggler/FeatureToggler.js";
import {FEATURE_GPIO} from "../../FeatureToggler/FEATURES.js";
import LedFacade from "../../LED/LedFacade/LedFacade.js";
import DriverGpioRpiGpioImplementation
    from "../../GPIO/DriverGpioRpiGpioImplementation/DriverGpioRpiGpioImplementation.js";

export default class LedService {
    logger = null

    ledAdapter = null

    constructor({logger}) {
        const featureToggle = new FeatureToggler()
        const isFeatureGpioEnabled = featureToggle.getIsFeatureEnabled(FEATURE_GPIO)

        if (isFeatureGpioEnabled) {
            const ledDriverGpio = new DriverGpioRpiGpioImplementation({logger})
            this.ledAdapter = new LedFacade({logger, ledDriverImplementation: ledDriverGpio})
        }

        this.logger = logger
    }

    switchOnLed() {
        return this.ledAdapter?.switchOnLed()
    }

    switchOffLed() {
        return this.ledAdapter?.switchOffLed()
    }

    tearUpGpios() {
        this.ledAdapter.tearUpGpios()
    }
}
