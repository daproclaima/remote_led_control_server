import 'dotenv/config'
import {FEATURE_GPIO} from "../../constants/Features/FEATURES.js";
import {OS_TYPE} from "../../constants/OperatingSystems/OS.js";

export default class FeatureToggler {
    features = {
        [FEATURE_GPIO]: process.env.OS_TYPE === OS_TYPE
    }

    setFeature(featureName, value) {
        if (this.features[featureName] !== undefined) this.features[featureName] = value
    }

    getIsFeatureEnabled(featureName) {
        return this.features[featureName]
    }

    constructor(props) {}

}
