import type ObservableOwaUserConfiguration from '../types/ObservableOwaUserConfiguration';
import isDefaultMailbox from './isDefaultMailbox';
import getConnectedAccountUserConfiguration from '../actions/getConnectedAccountUserConfiguration';
import getUserConfiguration from '../actions/getUserConfiguration';

export default function getUserConfigurationForUser(
    userIdentity: string | undefined
): ObservableOwaUserConfiguration | undefined {
    if (!userIdentity || isDefaultMailbox(userIdentity)) {
        return getUserConfiguration();
    } else {
        return getConnectedAccountUserConfiguration(userIdentity);
    }
}
