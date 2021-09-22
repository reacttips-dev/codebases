import setExtendedCardViewState from '../actions/setExtendedCardViewState';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { ExtendedCardType } from '../store/schema/ExtendedCardViewState';
import { getExtendedCardViewState, hasExtendedCard } from '../utils/extendedCardUtils';
import getAllItemsShownInConversation from '../utils/getAllItemsShownInConversation';
import { isReadingPanePositionBottom } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import type { ClientItem } from 'owa-mail-store';
import { isSxSDisplayed } from 'owa-sxs-store';
import {
    getMeetingCardProps,
    getInitialViewState,
    lazyInitializeCalendarCard,
    CalendarCardViewState,
} from 'owa-mail-calendar-card';
import { isMeetingMessage, isMeetingRequest } from 'owa-meeting-message';
import {
    lazyCreatePerfDatapoint,
    reportPerfCheckmark,
    OWAFluidCheckmarksEnum,
} from 'owa-fluid-perf-datapoints';
import { isFeatureEnabled } from 'owa-feature-flags';
import { FluidOwaSource } from 'owa-fluid-validations';

export function getMeetingMessagesForCalendarCard(
    conversationViewState: ConversationReadingPaneViewState
): ClientItem[] {
    if (isReadingPanePositionBottom() || isSxSDisplayed(null /* sxsId */)) {
        // Calendar card is disabled when the reading pane is on the bottom
        // or displayed side by side with an attachment
        return [];
    }

    const items = getAllItemsShownInConversation(
        conversationViewState,
        false /* getNewestItemFirst */
    );

    if (!items || items.length <= 0) {
        return [];
    }

    return items.filter(item => !!item && isMeetingMessage(item));
}

export function tryInitializeCalendarCard(
    conversationViewState: ConversationReadingPaneViewState,
    meetingMessages: ClientItem[]
) {
    // TODO VSO:58462 - Move more of the calendar card initialization into the calendar card package
    const { latestMeetingMessage, latestRequestId, latestCancellationId } = getMeetingCardProps(
        meetingMessages
    );

    // latestMeetingMessage can be null, because getMeetingCardProps perform more filtering such as isDelegate, is past meeting, etc.
    if (!latestMeetingMessage) {
        return;
    }

    if (!hasExtendedCard(conversationViewState, ExtendedCardType.CalendarCard)) {
        setExtendedCardViewState(conversationViewState, {
            cardViewState: getInitialViewState(),
            cardType: ExtendedCardType.CalendarCard,
            inScrollRegion: false,
        });
    }

    const isSingleMeetingMessageConversation = isSingleItemPartMeetingRequest(
        conversationViewState
    );

    if (isFeatureEnabled('cal-cmp-fluidCollaborativeSpace')) {
        lazyCreatePerfDatapoint.importAndExecute(FluidOwaSource.MailCalendarCard);
        reportPerfCheckmark(OWAFluidCheckmarksEnum.ch14, FluidOwaSource.MailCalendarCard);
    }

    lazyInitializeCalendarCard.importAndExecute(
        getExtendedCardViewState(
            conversationViewState,
            ExtendedCardType.CalendarCard
        ) as CalendarCardViewState,
        latestMeetingMessage,
        () => {
            setExtendedCardViewState(conversationViewState, null);
        } /* onErrorCallback */,
        isSingleMeetingMessageConversation,
        latestRequestId,
        latestCancellationId
    );
}

export function isSingleItemPartMeetingRequest(
    conversationViewState: ConversationReadingPaneViewState
): boolean {
    const items = getAllItemsShownInConversation(
        conversationViewState,
        false /* getNewestItemFirst */
    );
    if (!items || items.length !== 1) {
        return false;
    }
    const item = items[0];
    return !!(item && isMeetingRequest(item.ItemClass));
}
