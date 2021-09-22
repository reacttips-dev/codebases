import getUserConfiguration from '../actions/getUserConfiguration';

export default function getUserEmailAddress(): string | undefined {
    const userConfiguration = getUserConfiguration();
    return userConfiguration.SessionSettings?.UserEmailAddress;
}
