import { isFeatureEnabled } from 'owa-feature-flags';
import { getUnifiedGroupsSettingsStore } from '../UnifiedGroupsSettingsStore';
import { isConsumer } from 'owa-session-store';

export function IsShareableCRUDEnabled(): boolean {
    return (
        (isFeatureEnabled('grp-shareable-crud') ||
            getUnifiedGroupsSettingsStore().isSensitivityLabelsEnabled) &&
        !isConsumer()
    );
}

export function IsGroupSmtpEditEnabled(): boolean {
    return (
        isFeatureEnabled('grp-shareable-crud-smtpEdit') &&
        isFeatureEnabled('grp-cardReloadAfterEditingSmtp')
    );
}
