import getLogger from "../../../common/logging/getLogger";
import getClientConfig from "../../../config/getClientConfig";
import getServerConfig from "../../../config/getServerConfig";
import {RemoteConfig} from "../../models";
import {createRemoteConfigProvider} from "../../providers";
import {initialRemoteConfig} from "../../reducers";
import {State} from "../../store";
import {getFeatureToggleConfig} from "config/featureToggles";
import {ActionCreatorsMapObject} from "redux";
import {FeatureToggle} from "config";
import {ActionCreator} from "react-redux";

export const configActionTypes = {
    configLoadRemoteFailure: "CONFIG_LOAD_REMOTE_FAILURE",
    configLoadRemoteSuccess: "CONFIG_LOAD_REMOTE_SUCCESS",
    configLoadSuccess: "CONFIG_LOAD_SUCCESS",
    setFeatureToggleConfig: "SET_FEATURE_TOGGLE_CONFIG",
    updateFeatureTogglesConfig: "UPDATE_FEATURE_TOGGLES_CONFIG",
    updateNpsOptIn: "UPDATE_NPS_OPT_IN",
    setEffectiveDate: "config/SET_EFFECTIVE_DATE",
};

export interface ConfigActionCreators extends ActionCreatorsMapObject {
    loadClientConfig: () => any;
    loadServerConfig: () => any;
    loadRemoteConfig: () => any;
    setFeatureToggleConfig: (env: string) => any;
    updateFeatureTogglesConfig: (payload: FeatureToggle) => {type: string; payload: {features: FeatureToggle}};
    fetchFeatureToggles: () => any;
    optInNPS: () => any;
    setEffectiveDate: (date: string | undefined) => {payload: string | undefined; type: string};
}

export const optInNPS: ActionCreator<any> = () => ({
    type: configActionTypes.updateNpsOptIn,
});

export const configActionCreators: ConfigActionCreators = (() => {
    const loadClientConfig = () => {
        return async (dispatch) => {
            const config = await getClientConfig();
            dispatch({config, type: configActionTypes.configLoadSuccess});
        };
    };

    const loadServerConfig = () => {
        return async (dispatch) => {
            const config = await getServerConfig();
            dispatch({config, type: configActionTypes.configLoadSuccess});
        };
    };

    const setFeatureToggleConfig = (env) => {
        return (dispatch) => {
            const config = getFeatureToggleConfig(env);
            dispatch({config, type: configActionTypes.setFeatureToggleConfig});
        };
    };

    const loadRemoteConfig = () => {
        return async (dispatch, getState) => {
            const state: State = getState();

            try {
                const provider = createRemoteConfigProvider(state.config.dataSources.remoteConfigUrl);
                const remoteConfig: RemoteConfig = await provider.getConfigs();
                const initialConfig = initialRemoteConfig;

                const config: RemoteConfig = {
                    isAddToCartEnabled:
                        remoteConfig.isAddToCartEnabled === undefined
                            ? initialConfig.isAddToCartEnabled
                            : remoteConfig.isAddToCartEnabled,

                    isPlpAvailabilityEnabled:
                        remoteConfig.isPlpAvailabilityEnabled === undefined
                            ? initialConfig.isPlpAvailabilityEnabled
                            : remoteConfig.isPlpAvailabilityEnabled,

                    isQueueItEnabled:
                        remoteConfig.isQueueItEnabled === undefined
                            ? initialConfig.isQueueItEnabled
                            : remoteConfig.isQueueItEnabled,

                    isRpuEnabled:
                        remoteConfig.isRpuEnabled === undefined
                            ? initialConfig.isRpuEnabled
                            : remoteConfig.isRpuEnabled,

                    isServerSideRenderEnabled:
                        remoteConfig.isServerSideRenderEnabled === undefined
                            ? initialConfig.isServerSideRenderEnabled
                            : remoteConfig.isServerSideRenderEnabled,

                    isTargetEnabled:
                        remoteConfig.isTargetEnabled === undefined
                            ? initialConfig.isTargetEnabled
                            : remoteConfig.isTargetEnabled,

                    isCheckoutQueueEnabled:
                        remoteConfig.isCheckoutQueueEnabled === undefined
                            ? initialConfig.isCheckoutQueueEnabled
                            : remoteConfig.isCheckoutQueueEnabled,

                    isLightweightBasket:
                        remoteConfig.isLightweightBasket === undefined
                            ? initialConfig.isLightweightBasket
                            : remoteConfig.isLightweightBasket,

                    masterpassConfig: remoteConfig.masterpassConfig,
                };

                dispatch({config, type: configActionTypes.configLoadRemoteSuccess});
            } catch (error) {
                getLogger().error(error);
                dispatch({type: configActionTypes.configLoadRemoteFailure});
            }
        };
    };

    const updateFeatureTogglesConfig = (features: FeatureToggle) => ({
        type: configActionTypes.updateFeatureTogglesConfig,
        payload: {
            features,
        },
    });

    const fetchFeatureToggles = () => async (dispatch, getState, {abTestProvider}) => {
        const abTests = await abTestProvider.fetchFeatureToggles();
        dispatch(configActionCreators.updateFeatureTogglesConfig(abTests));
    };

    const setEffectiveDate = (date: string) => {
        return {
            payload: date,
            type: configActionTypes.setEffectiveDate,
        };
    };

    return {
        loadClientConfig,
        loadRemoteConfig,
        loadServerConfig,
        setFeatureToggleConfig,
        updateFeatureTogglesConfig,
        fetchFeatureToggles,
        setEffectiveDate,
    };
})();
