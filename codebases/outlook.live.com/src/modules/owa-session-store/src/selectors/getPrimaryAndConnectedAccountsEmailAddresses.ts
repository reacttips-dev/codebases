import store from '../store/store';
import getDefaultLogonEmailAddress from '../selectors/getDefaultLogonEmailAddress';

export function getPrimaryAndConnectedAccountsEmailAddresses(): string[] {
    const connectedAccountSmtpAddresses = store.connectedAccountsUserConfigurationMap
        ? [...store.connectedAccountsUserConfigurationMap.keys()]
        : ([] as string[]);
    const defaultEmail = getDefaultLogonEmailAddress();
    return defaultEmail
        ? [defaultEmail, ...connectedAccountSmtpAddresses]
        : connectedAccountSmtpAddresses;
}
