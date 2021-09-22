import getUserConfiguration from '../actions/getUserConfiguration';
import * as trace from 'owa-trace';

// This is implemented as a function so that unit tests can spy on it.
export default function getDefaultUserEmailAddress(): string | undefined {
    const userConfiguration = getUserConfiguration();

    // This shouldn't happen in production, but if it does we'll have a hint.
    if (!userConfiguration || !userConfiguration.SessionSettings) {
        trace.errorThatWillCauseAlert('SessionSettings not available');
        return 'no-smtp-address';
    }

    return userConfiguration.SessionSettings.UserEmailAddress;
}
