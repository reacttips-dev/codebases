import {ClientConfig, ServerConfig, FeatureToggleConfig} from "../../../config";
import {configActionTypes} from "../../actions";
import {RemoteConfig} from "../../models";

export type ConfigState = ClientConfig & ServerConfig & FeatureToggleConfig;

export const initialConfigState: ClientConfig & ServerConfig & FeatureToggleConfig = {};

export const initialRemoteConfig: RemoteConfig = {
    isAddToCartEnabled: true,
    isPlpAvailabilityEnabled: true,
    isQueueItEnabled: false,
    isRpuEnabled: true,
    isServerSideRenderEnabled: true,
    isTargetEnabled: true,
    isCheckoutQueueEnabled: false,
    isLightweightBasket: false,
};

export const config = (state = initialConfigState, action) => {
    switch (action.type) {
        case configActionTypes.configLoadSuccess:
            return {
                ...state,
                remoteConfig: state.remoteConfig,
                ...action.config,
            };
        case configActionTypes.configLoadRemoteSuccess:
            return {
                ...state,
                remoteConfig: action.config,
            };
        case configActionTypes.configLoadRemoteFailure:
            return {
                ...state,
                remoteConfig: {...initialRemoteConfig},
            };
        case configActionTypes.setFeatureToggleConfig:
            const featureToggleConfig = state.features || {};
            return {
                ...state,
                features: {
                    ...featureToggleConfig,
                    ...action.config,
                },
            };
        case configActionTypes.updateFeatureTogglesConfig:
            return {
                ...state,
                features: {
                    ...state.features,
                    ...action.payload.features,
                },
            };
        case configActionTypes.updateNpsOptIn:
            return {
                ...state,
                npsSurvey: {
                    ...state.npsSurvey,
                    isOptIn: true,
                },
            };
        case configActionTypes.setEffectiveDate:
            return {
                ...state,
                futureDatePricingValue: action.payload,
            };
        default:
            return state;
    }
};

export default config;
