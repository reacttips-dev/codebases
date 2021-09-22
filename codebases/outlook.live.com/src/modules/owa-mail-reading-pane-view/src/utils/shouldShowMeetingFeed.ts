import { ExtendedCardType } from 'owa-mail-reading-pane-store/lib/store/schema/ExtendedCardViewState';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import { hasExtendedCard } from 'owa-mail-reading-pane-store/lib/utils/extendedCardUtils';
import type { ClientMessage } from 'owa-mail-store';
import { isMeetingMessage } from 'owa-meeting-message';

const shouldShowMeetingFeed = (message: ClientMessage) => {
    const viewState = getConversationReadingPaneViewState(message.ConversationId?.Id);
    if (!hasExtendedCard(viewState, ExtendedCardType.CalendarCard)) {
        return false;
    }

    return isMeetingMessage(message);
};

export default shouldShowMeetingFeed;
