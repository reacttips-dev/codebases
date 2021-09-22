import {
    loadLocalWebPushUserSetting,
    getUserPreferenceIdentifier,
    lazyLoadWebPushOptions,
} from 'owa-webpush-notifications';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export async function initializeLocalWebPushUserSetting(): Promise<void> {
    let mbxGuid = getUserConfiguration().SessionSettings?.MailboxGuid;
    let loadWebPushOptions = await lazyLoadWebPushOptions.import()!;
    if (mbxGuid) {
        let userPreferenceIdentifier = getUserPreferenceIdentifier(
            mbxGuid,
            await loadWebPushOptions()
        );
        loadLocalWebPushUserSetting(window, userPreferenceIdentifier);
    }
}
