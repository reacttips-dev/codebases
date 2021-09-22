import type UserAdConfigType from '../schema/UserAdConfigType';
import { isFeatureEnabled } from 'owa-feature-flags';
import {
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
    AdsAggregateOptions,
    getOptionsForFeature,
} from 'owa-outlook-service-options';
import getStore from '../store/getStore';

export default function updateUserAdConfig(userAdConfigUpdateValue: UserAdConfigType) {
    if (isFeatureEnabled('fwk-ads-logUserConfig')) {
        const userOptions = getOptionsForFeature<AdsAggregateOptions>(
            OwsOptionsFeatureType.AdsAggregate
        );
        const userStoreOptions = getStore();

        let nativeAdsSeenRunningSumValue = getFallbackValueIfNullUndefined(
            userStoreOptions.nativeAdsSeenRunningSum,
            userOptions ? userOptions.nativeAdsSeenRunningSum : 0
        );
        let nativeAdsClickedRunningSumValue = getFallbackValueIfNullUndefined(
            userStoreOptions.nativeAdsClickedRunningSum,
            userOptions ? userOptions.nativeAdsClickedRunningSum : 0
        );
        let nativeCPMRunningSumValue = getFallbackValueIfNullUndefined(
            userStoreOptions.nativeCPMRunningSum,
            userOptions ? userOptions.nativeCPMRunningSum : 0
        );
        let wasAdSeenInLastSessionValue = getFallbackValueIfNullUndefined(
            userStoreOptions.wasAdLastSeenInLastSession,
            userOptions ? userOptions.wasAdSeenInLastSession : false
        );

        if (userAdConfigUpdateValue.increaseNativeAdsSeenRunningSum) {
            userStoreOptions.nativeAdsSeenRunningSum = nativeAdsSeenRunningSumValue + 1;
            nativeAdsSeenRunningSumValue = userStoreOptions.nativeAdsSeenRunningSum;
        }

        if (userAdConfigUpdateValue.increaseNativeAdsClickedRunningSum) {
            userStoreOptions.nativeAdsClickedRunningSum = nativeAdsClickedRunningSumValue + 1;
            nativeAdsClickedRunningSumValue = userStoreOptions.nativeAdsClickedRunningSum;
        }

        if (userAdConfigUpdateValue.updateNativeCPMRunningSum) {
            userStoreOptions.nativeCPMRunningSum =
                nativeCPMRunningSumValue + userAdConfigUpdateValue.updateNativeCPMRunningSum;
            nativeCPMRunningSumValue = userStoreOptions.nativeCPMRunningSum;
        }

        if (userAdConfigUpdateValue.updateWasAdLastSeenInLastSession) {
            userStoreOptions.wasAdLastSeenInLastSession =
                userAdConfigUpdateValue.updateWasAdLastSeenInLastSessionValue;
            wasAdSeenInLastSessionValue = userStoreOptions.wasAdLastSeenInLastSession;
        }

        lazyCreateOrUpdateOptionsForFeature.importAndExecute(OwsOptionsFeatureType.AdsAggregate, {
            ...userOptions,
            nativeAdsSeenRunningSum: nativeAdsSeenRunningSumValue,
            nativeAdsClickedRunningSum: nativeAdsClickedRunningSumValue,
            nativeCPMRunningSum: nativeCPMRunningSumValue,
            wasAdSeenInLastSession: wasAdSeenInLastSessionValue,
        } as AdsAggregateOptions);
    }
}

function getFallbackValueIfNullUndefined<T>(value: T | null, fallback: T) {
    return value == null ? fallback : value;
}
