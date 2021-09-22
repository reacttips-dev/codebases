import type { MailboxInfo } from 'owa-client-ids';
import { isFluidEnabledForSource, FluidOwaSource } from 'owa-fluid-validations';
import { addPopoutV2, getReadingPaneRouteForPopoutV2 } from 'owa-popout-v2';
import type ReadingPanePopoutItemFolderInfo from '../schema/ReadingPanePopoutItemFolderInfo';

/**
 * Popout reading pane based on either itemId or InternetMessageId
 */
export default function popoutReadingPane(
    itemId?: string,
    internetMessageId?: string,
    mailboxInfo?: MailboxInfo,
    folderInfo?: ReadingPanePopoutItemFolderInfo
) {
    const route = getReadingPaneRouteForPopoutV2(
        mailboxInfo,
        itemId,
        null /*conversationId*/,
        internetMessageId
    );

    // Because Fluid relies on a SDS option to load,
    // We need to pass this value to the popout, since
    // OWA will not have completed this call in time.
    // This pattern should not be repeated.
    const readingPanePopoutData = {
        ...folderInfo,
        includeFluidOnPopout: isFluidEnabledForSource(FluidOwaSource.None),
    };

    addPopoutV2('mail', route, readingPanePopoutData, {
        resizable: true,
    });
}
