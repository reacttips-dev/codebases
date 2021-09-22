import type { WebPushNotificationsOptions } from 'owa-outlook-service-options';

export function getUserPreferenceIdentifier(
    mbxGuid: string,
    options: WebPushNotificationsOptions
): string {
    let userPreferenceIdentifier =
        mbxGuid + '_' + (options.enabledTimeInUTCMs != null ? options.enabledTimeInUTCMs : '');
    return userPreferenceIdentifier;
}
