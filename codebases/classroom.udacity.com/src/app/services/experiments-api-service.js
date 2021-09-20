import ApiService from './api-service';

export function _getOptionsIfStaging(config) {
    const customProjId = config.udacityStagingOptimizelyProjectId;
    const options = customProjId ?
        {
            headers: {
                'X-Optimizely-Project-ID': customProjId
            }
        } :
        undefined;
    return options;
}

export default {
    async getFeature(userId, key, attributes) {
        const path = `${CONFIG.experimentsUrl}/users/${userId}/enabled-features/${key}`;
        const queryParams = {
            attributes: JSON.stringify(attributes)
        };
        try {
            const response = await ApiService.get(
                path,
                queryParams,
                _getOptionsIfStaging(CONFIG)
            );
            return {
                isEnabled: response.enabled
            };
        } catch (error) {
            return {
                isEnabled: false
            };
        }
    },

    async getFeatures(userId, keys, attributes) {
        const path = `${CONFIG.experimentsUrl}/users/${userId}/enabled-features`;
        const queryParams = {
            attributes: JSON.stringify(attributes),
            ...(keys && {
                featureKeys: keys.join(',')
            }),
        };
        try {
            const response = await ApiService.get(
                path,
                queryParams,
                _getOptionsIfStaging(CONFIG)
            );
            return _.fromPairs(
                _.map(response.features, ({
                    key,
                    enabled
                }) => [key, enabled])
            );
        } catch (error) {
            return _.fromPairs(_.map(keys, (key) => [key, false]));
        }
    },

    async getFeatureVariable(userId, key, variableName, attributes) {
        const path = `${CONFIG.experimentsUrl}/users/${userId}/features/${key}/variables/${variableName}`;
        const queryParams = {
            attributes: JSON.stringify(attributes)
        };
        try {
            const response = await ApiService.get(
                path,
                queryParams,
                _getOptionsIfStaging(CONFIG)
            );
            return {
                variableValue: response.variableValue
            };
        } catch (error) {
            return {
                variableValue: null
            };
        }
    },

    async track(userId, evt, attributes) {
        try {
            await ApiService.post(
                `${CONFIG.experimentsUrl}/users/${userId}/events/${evt}/tracking`, {
                    attributes
                },
                _getOptionsIfStaging(CONFIG)
            );
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false
            };
        }
    },
};