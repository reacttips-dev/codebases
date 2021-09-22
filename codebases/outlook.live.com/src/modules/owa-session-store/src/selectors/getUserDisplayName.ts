import getUserConfiguration from '../actions/getUserConfiguration';

export default function getUserDisplayName(): string | undefined {
    const userConfiguration = getUserConfiguration();
    return userConfiguration.SessionSettings?.UserDisplayName;
}
