import { action } from 'satcheljs';

export const increaseNativeAdsClickedRunningSum = action('IncreaseNativeAdsClickedRunningSum');
export const increaseNativeAdsSeenRunningSum = action('IncreaseNativeAdsSeenRunningSum');
export const updateNativeCPMRunningSum = action(
    'UpdateNativeCPMRunningSum',
    (newCPMRunningSum: number) => ({
        newCPMRunningSum: newCPMRunningSum,
    })
);
export const updateWasAdLastSeenInLastSession = action(
    'UpdateWasAdLastSeenInLastSession',
    (wasAdLastSeenInLastSession: boolean) => ({
        wasAdLastSeenInLastSession: wasAdLastSeenInLastSession,
    })
);
