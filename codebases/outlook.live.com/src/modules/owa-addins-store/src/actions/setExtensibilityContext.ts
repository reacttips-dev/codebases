import extensibilityState from '../store/store';
import { isFeatureEnabled } from 'owa-feature-flags';
import type DetectedEntity from 'owa-service/lib/contract/DetectedEntity';
import type ExtensibilityContext from 'owa-service/lib/contract/ExtensibilityContext';
import { action } from 'satcheljs/lib/legacy';
import { getUserConfiguration } from 'owa-session-store';

const PAYPAL_ID = '599e5de2-d41c-442a-bdb4-92eafa18a0dc';
const SUGGESTED_MEETING_ID = 'bc13b9d0-5ba2-446a-956b-c583bdc94d5e';

export default action('setExtensibilityContext')(function setExtensibilityContext(
    context: ExtensibilityContext
) {
    if (context?.Extensions) {
        // Retrieve suggested replies user selected option -
        // load suggested meeting addin if toggle is off,
        // otherwise suppress addin and show smart time pill
        const userConfig = getUserConfiguration();
        const isSuggestedRepliesEnabled: boolean =
            userConfig?.UserOptions?.WebSuggestedRepliesEnabledForUser;
        let removeItemIndex = -1;
        for (let i = 0; i < context.Extensions.length; i++) {
            let contextExtensions = context.Extensions[i];

            if (
                contextExtensions.Id === PAYPAL_ID &&
                contextExtensions.ExtensionPointCollection.DetectedEntity == null
            ) {
                contextExtensions.ExtensionPointCollection.DetectedEntity = <DetectedEntity>(
                    contextExtensions.ExtensionPointCollection.CustomPane
                );
                contextExtensions.ExtensionPointCollection.DetectedEntity.Label =
                    contextExtensions.DisplayName;
            }

            if (isSuggestedRepliesEnabled) {
                // Do not show suggested meeting agave if smart-* is enabled
                if (
                    contextExtensions.Id === SUGGESTED_MEETING_ID &&
                    isFeatureEnabled('mc-smartReplyWithCustomMeeting')
                ) {
                    removeItemIndex = i;
                }
            }
        }

        if (removeItemIndex >= 0) {
            context.Extensions.splice(removeItemIndex, 1);
        }
    }
    extensibilityState.Context = context;
});
