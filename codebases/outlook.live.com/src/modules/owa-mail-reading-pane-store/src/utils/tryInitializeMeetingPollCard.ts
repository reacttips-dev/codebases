import getAllItemPartsShownInConversation from './getAllItemPartsShownInConversation';
import setExtendedCardViewState from '../actions/setExtendedCardViewState';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import isFeatureEnabled from 'owa-feature-flags/lib/utils/isFeatureEnabled';
import { ExtendedCardType } from '../store/schema/ExtendedCardViewState';
import { lazyInitializeMeetingPollCard } from 'owa-mail-meetingpoll-card';

export function findItemIdWithMeetingPoll(
    conversationViewState: ConversationReadingPaneViewState
): string {
    if (!isFeatureEnabled('cal-mf-meetingPollCard')) {
        return null;
    }

    const itemParts = getAllItemPartsShownInConversation(
        conversationViewState,
        false /* getNewestItemFirst */
    );
    if (!itemParts) {
        return null;
    }

    for (let index = 0; index < itemParts.length; index++) {
        if (itemParts[index]?.hasMeetingPoll) {
            return itemParts[index].itemId;
        }
    }

    return null;
}

export function tryInitializeMeetingPollCard(
    conversationViewState: ConversationReadingPaneViewState,
    itemId: string
) {
    setExtendedCardViewState(conversationViewState, {
        cardViewState: null,
        cardType: ExtendedCardType.MeetingPoll,
        inScrollRegion: false,
    });

    lazyInitializeMeetingPollCard.importAndExecute(itemId);
}
