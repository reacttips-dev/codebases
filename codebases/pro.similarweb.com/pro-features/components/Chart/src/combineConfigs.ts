import * as _ from "lodash";

export default (graphParams, configsList) =>
    configsList.reduce((prevConfig, configOrConfigFactory) => {
        const currentConfig = _.isFunction(configOrConfigFactory)
            ? configOrConfigFactory(graphParams)
            : configOrConfigFactory;
        // we pass customizer function to concat arrays (series, plotLines etc.)
        return _.mergeWith({}, prevConfig, currentConfig, (objVal, srcVal) => {
            if (_.isArray(objVal)) {
                return objVal.concat(srcVal);
            }
        });
    }, {});
