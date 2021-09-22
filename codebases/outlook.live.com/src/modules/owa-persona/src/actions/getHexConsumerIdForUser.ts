import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function getHexConsumerIdForUser(emailAddress: string): string {
    if (!isConsumer() || !emailAddress) {
        return undefined;
    }

    const userConfig = getUserConfiguration();
    if (!userConfig || !userConfig.SessionSettings) {
        return undefined;
    }

    // If the persona is yourself, return the current user hex id.
    if (isSameStringIgnoreCase(emailAddress, userConfig.SessionSettings.UserEmailAddress)) {
        return userConfig.HexCID;
    }

    return undefined;
}

function isSameStringIgnoreCase(str1: string, str2: string): boolean {
    return str1 && str2 && str1.toLowerCase() == str2.toLowerCase();
}
