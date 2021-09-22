import { DEFAULT_ACTION_SOURCE } from '../utils/constants';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyReplyToMessage } from 'owa-mail-compose-actions';
import type { ClientItem } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type * as React from 'react';
import {
    shouldSuppressServerMarkReadOnReplyOrForward,
    getSelectedTableView,
} from 'owa-mail-list-store';

export default function onReplyReplyAllInternal(
    isReplyAll: boolean,
    isConversationItemPart: boolean,
    item: ClientItem,
    instrumentationContext: InstrumentationContext,
    targetWindow: Window,
    event?: React.MouseEvent<HTMLElement>
) {
    event?.stopPropagation();

    const conversationId = item.ConversationId ? item.ConversationId.Id : null;
    const isItemTranslated =
        isFeatureEnabled('cmp-inlineTranslation') &&
        item.TranslationData &&
        (item.TranslationData.isShowingTranslation ||
            item.TranslationData.isShowingForwardContentTranslation);

    lazyReplyToMessage.importAndExecute({
        referenceItemOrId: item,
        mailboxInfo: item.MailboxInfo,
        isReplyAll: isReplyAll,
        // We use the inline compose only when conversationId is defined (e.g.: we are in Conversation View)
        // or when the item is translated.
        useFullCompose: !isItemTranslated && !isConversationItemPart,
        actionSource: DEFAULT_ACTION_SOURCE,
        instrumentationContexts: [instrumentationContext],
        conversationId: conversationId,
        suppressServerMarkReadOnReplyOrForward: shouldSuppressServerMarkReadOnReplyOrForward(
            getSelectedTableView()
        ),
        targetWindow: targetWindow,
    });
}
