import {
    increaseNativeAdsClickedRunningSum,
    increaseNativeAdsSeenRunningSum,
    updateNativeCPMRunningSum,
    updateWasAdLastSeenInLastSession,
} from '../actions/updateUserAdConfigActions';
import type UserAdConfigType from '../schema/UserAdConfigType';
import updateUserAdConfig from '../utils/updateUserAdConfig';
import { orchestrator } from 'satcheljs';

orchestrator(increaseNativeAdsClickedRunningSum, () => {
    const updateUserAdConfigValue: UserAdConfigType = { increaseNativeAdsClickedRunningSum: true };
    updateUserAdConfig(updateUserAdConfigValue);
});

orchestrator(increaseNativeAdsSeenRunningSum, () => {
    const updateUserAdConfigValue: UserAdConfigType = { increaseNativeAdsSeenRunningSum: true };
    updateUserAdConfig(updateUserAdConfigValue);
});

orchestrator(updateNativeCPMRunningSum, actionMessage => {
    const updateUserAdConfigValue: UserAdConfigType = {
        updateNativeCPMRunningSum: actionMessage.newCPMRunningSum,
    };
    updateUserAdConfig(updateUserAdConfigValue);
});

orchestrator(updateWasAdLastSeenInLastSession, actionMessage => {
    const updateUserAdConfigValue: UserAdConfigType = {
        updateWasAdLastSeenInLastSession: true,
        updateWasAdLastSeenInLastSessionValue: actionMessage.wasAdLastSeenInLastSession,
    };
    updateUserAdConfig(updateUserAdConfigValue);
});
