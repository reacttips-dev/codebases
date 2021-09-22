import store from '../store/store';
import type ObservableOwaUserConfiguration from '../types/ObservableOwaUserConfiguration';

export default function getConnectedAccountUserConfiguration(
    userIdentity: string
): ObservableOwaUserConfiguration | undefined {
    return store.connectedAccountsUserConfigurationMap.get(userIdentity);
}
