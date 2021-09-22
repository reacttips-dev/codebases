import { logUsage } from 'owa-analytics';
import { getUserConfiguration, lazyUpdateUserConfigurationService } from 'owa-session-store';
import {
    setBit,
    FocusedInboxBitFlagsMasks,
} from 'owa-bit-flags/lib/utils/focusedInboxBitFlagConstants';
import { onNudgeIsEnableSaved } from 'owa-mail-shared-actions/lib/onNudgeIsEnableSaved';

export function disableNudgeOption() {
    setBit(true, FocusedInboxBitFlagsMasks.IsNudgeDisabled);

    lazyUpdateUserConfigurationService.importAndExecute(
        [
            {
                key: 'FocusedInboxBitFlags',
                valuetype: 'Integer32',
                value: [`${getUserConfiguration().ViewStateConfiguration.FocusedInboxBitFlags}`],
            },
        ],
        'OWA.ViewStateConfiguration'
    );

    logUsage('TnS_SaveNudgeOption', [false, 'InlineFeedback']);
    onNudgeIsEnableSaved();
}
