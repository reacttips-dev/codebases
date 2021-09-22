import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

// Gets if Focused Inbox feature is enabled for the user
export function isFocusedInboxEnabled(): boolean {
    return !!getUserConfiguration().UserOptions?.IsFocusedInboxEnabled;
}
