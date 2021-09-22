import getUserConfiguration from '../actions/getUserConfiguration';

/**
 * IMPORTANT: Do not use this selector to access outlook options values. These values
 * are stored in `owa-outlook-service-options-store`, and should always be accessed from there.
 */
export function getPrimeBootSettingsOptionsValues(): any[] {
    const settings: any[] = [];
    let primeSettingsItems = getUserConfiguration()?.PrimeSettings?.Items;

    if (primeSettingsItems) {
        for (let primeSetting of primeSettingsItems) {
            const options = primeSetting.Value?.options?.[0];
            if (options) {
                settings.push(options);
            }
        }
    }
    return settings;
}
