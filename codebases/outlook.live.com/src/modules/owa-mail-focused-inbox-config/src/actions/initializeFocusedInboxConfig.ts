import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { setIsFocusedInboxCapableService } from '../services/setIsFocusedCapableService';
import { updateUserConfigurationAndService } from 'owa-session-store/lib/utils/updateUserConfigurationAndService';
import { logUsage } from 'owa-analytics';

// Initialize focused inbox config
export default function initializeFocusedInboxConfig(): void {
    const userOptions = getUserConfiguration().UserOptions;
    if (userOptions) {
        const userTimeStamp =
            userOptions.IsFocusedInboxOnLastUpdateTime != null
                ? new Date(userOptions.IsFocusedInboxOnLastUpdateTime).getTime()
                : null;
        const adminTimeStamp =
            userOptions.IsFocusedInboxOnAdminLastUpdateTime != null
                ? new Date(userOptions.IsFocusedInboxOnAdminLastUpdateTime).getTime()
                : null;

        // Initialize IsFocusedInboxEnabled on first logon (when IsFocusedInboxEnabled is null) or if admin overrides the Focused Inbox On setting
        const isFocusedInboxEnabledDefined = userOptions.IsFocusedInboxEnabled != null;
        const isAdminTimeStampGreater =
            userTimeStamp && adminTimeStamp && adminTimeStamp > userTimeStamp;
        if (!isFocusedInboxEnabledDefined || isAdminTimeStampGreater) {
            logUsage('FocusedInboxInitialize', [
                userOptions?.IsFocusedInboxEnabled,
                isAdminTimeStampGreater,
            ]);

            updateUserConfigurationAndService(
                config => {
                    config.UserOptions!.IsFocusedInboxEnabled =
                        userOptions.FocusedInboxServerOverride;
                    config.UserOptions!.IsFocusedInboxOnLastUpdateTime =
                        userOptions.IsFocusedInboxOnAdminLastUpdateTime;
                },
                [
                    {
                        key: 'IsFocusedInboxEnabled',
                        valuetype: 'Boolean',
                        value: [String(userOptions.FocusedInboxServerOverride)],
                    },
                    {
                        key: 'IsFocusedInboxOnLastUpdateTime',
                        valuetype: 'String',
                        value: [userOptions.IsFocusedInboxOnAdminLastUpdateTime!],
                    },
                ]
            );

            // Make a request to set IsFocusedInboxCapable if IsFocusedInboxEnabled is set to true
            if (userOptions.IsFocusedInboxEnabled) {
                setIsFocusedInboxCapableService();
            }
        }
    }
}
