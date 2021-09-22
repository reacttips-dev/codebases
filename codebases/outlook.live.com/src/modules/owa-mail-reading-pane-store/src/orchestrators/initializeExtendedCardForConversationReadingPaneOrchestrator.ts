import initializeExtendedCardForConversationReadingPane from '../actions/initializeExtendedCardForConversationReadingPane';
import findFirstItemWithVotingInformation from '../utils/findFirstItemWithVotingInformation';
import getFirstItemInConversation from '../utils/getFirstItemInConversation';
import initializeTxpCard from '../utils/initializeTxpCard';
import initializeVotingCard from '../utils/initializeVotingCard';
import initializeYammerCard, { findItemWithYammer } from '../utils/initializeYammerCard';
import { logUsage } from 'owa-analytics';
import isYammerEnabled from 'owa-mail-store-actions/lib/utils/isYammerEnabled';
import { orchestrator } from 'satcheljs';
import {
    getMeetingMessagesForCalendarCard,
    tryInitializeCalendarCard,
} from '../utils/tryInitializeCalendarCard';
import {
    findItemIdWithMeetingPoll,
    tryInitializeMeetingPollCard,
} from '../utils/tryInitializeMeetingPollCard';

/**
 * This is where we decide which card to initialize on top of the conversation reading pane.
 * If you have a new scenario please decide on the priority of the card before adding to this if statement.
 *
 * Current priority:
 *
 * 1. TXP
 * 2. Calendar card
 * 3. Meeting poll
 * 4. Voting
 * 5. Yammer
 */

export default orchestrator(initializeExtendedCardForConversationReadingPane, actionMessage => {
    const { conversationViewState, loadedItemParts } = actionMessage;

    const firstItemInConversation = getFirstItemInConversation(
        conversationViewState.conversationId.Id
    );

    if (firstItemInConversation?.EntityNamesMap) {
        // Initialize TXP
        initializeTxpCard(conversationViewState, firstItemInConversation);
        return;
    }

    const calendarCardMessages = getMeetingMessagesForCalendarCard(conversationViewState);
    if (calendarCardMessages && calendarCardMessages.length > 0) {
        // Initialize Calendar Card
        tryInitializeCalendarCard(conversationViewState, calendarCardMessages);
        return;
    }

    const itemIdWithMeetingPoll = findItemIdWithMeetingPoll(conversationViewState);
    if (itemIdWithMeetingPoll) {
        // Initialize meeting poll card
        tryInitializeMeetingPollCard(conversationViewState, itemIdWithMeetingPoll);
        return;
    }

    const itemIdWithVotingInformation = findFirstItemWithVotingInformation(conversationViewState);
    if (itemIdWithVotingInformation) {
        // Initialize voting
        initializeVotingCard(conversationViewState, itemIdWithVotingInformation);
        return;
    }

    if (loadedItemParts) {
        const [itemWithYammer, isAnyItemNonYammer] = findItemWithYammer(loadedItemParts);
        if (itemWithYammer) {
            const yammerEnabled = isYammerEnabled();
            logUsage(
                'Yammer_ThreadLoaded',
                {
                    yammerEnabled: yammerEnabled,
                    isConversation: true,
                },
                { logEvery: 1 }
            );
            if (yammerEnabled) {
                // Initialize Yammer Card
                initializeYammerCard(conversationViewState, itemWithYammer, isAnyItemNonYammer);
                return;
            }
        }
    }
});
