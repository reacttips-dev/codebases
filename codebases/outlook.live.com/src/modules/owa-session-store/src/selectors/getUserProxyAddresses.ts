import getUserConfiguration from '../actions/getUserConfiguration';

export default function getUserProxyAddresses(): readonly string[] | undefined {
    const userConfiguration = getUserConfiguration();
    return userConfiguration.SessionSettings?.UserProxyAddresses;
}
