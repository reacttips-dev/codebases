import * as trace from 'owa-trace';
import { getConfiguration } from '../cache';

export default function getDefaultLogonEmailAddress(): string | undefined {
    const userConfiguration = getConfiguration();

    // This shouldn't happen in production, but if it does we'll have a hint.
    if (!userConfiguration || !userConfiguration.SessionSettings) {
        trace.errorThatWillCauseAlert('SessionSettings not available');
        return 'no-smtp-address';
    }

    return userConfiguration.SessionSettings.LogonEmailAddress ?? undefined;
}
