import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export function isPolicyTipsEnabled(): boolean {
    // Policy Tips are enabled if the session data reports it to be enabled.
    // We can rely on this check to differentiate between premium consumers, as they'll have this property set.
    return getUserConfiguration().PolicyTipsEnabled;
}
