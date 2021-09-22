import { isFeatureEnabled } from 'owa-feature-flags';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getUserConfiguration } from 'owa-session-store';
import { lazyIsReadingPaneConversationEnabled } from 'owa-mail-unstacked';

export default function shouldShowUnstackedReadingPane(): boolean {
    // Show unstacked reading pane if:
    // - Feature flag is enabled
    // - React list view type is conversation
    // - Reading pane conversation is disabled
    if (isFeatureEnabled('mon-rp-unstackedConversation')) {
        const globalListViewTypeReact = getUserConfiguration()?.UserOptions
            ?.GlobalListViewTypeReact;
        return (
            globalListViewTypeReact == ReactListViewType.Conversation &&
            !getIsRPConversationEnabled()
        );
    } else {
        return false;
    }
}

function getIsRPConversationEnabled(): boolean {
    let isConversationEnabled: boolean | null = null;

    // Try to import the actual util function (see note below)
    // If it is not imported yet, try to grab the option from the boot prime settings
    // If the boot prime settings is not available, it means it is not set, return the default

    // NOTE: This lazy import is temporary until we remove the direct dependency between owa-outlook-service-options-store and owa-outlook-service-option
    // VSO: 105165 https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/105165
    const isReadingPaneConversationEnabledFunction = lazyIsReadingPaneConversationEnabled.tryImportForRender();
    if (isReadingPaneConversationEnabledFunction) {
        isConversationEnabled = isReadingPaneConversationEnabledFunction();
    } else {
        const isNative = isHostAppFeatureEnabled('useNativeConversationOptions');
        let primeSettings = getUserConfiguration()?.PrimeSettings;

        if (primeSettings?.Items) {
            for (let primeSetting of primeSettings.Items) {
                if (primeSetting.Id === 'ReadingPaneConversationOptions' && primeSetting.Value) {
                    const conversationOptions: any = primeSetting.Value.options?.[0];
                    isConversationEnabled = isNative
                        ? (conversationOptions?.conversationEnabledNativeHost as boolean)
                        : (conversationOptions?.conversationEnabled as boolean);
                    break;
                }
            }
        }

        if (isConversationEnabled == null) {
            isConversationEnabled = !isNative;
        }
    }

    return isConversationEnabled;
}
