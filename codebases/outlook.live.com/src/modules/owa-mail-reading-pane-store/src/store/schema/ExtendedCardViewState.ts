import type TxpCardViewState from 'txp-data/lib/schema/viewSchema/TxpCardViewState';
import type VotingCardViewState from 'owa-mail-voting/lib/store/schema/VotingCardViewState';
import type { CalendarCardViewState } from 'owa-mail-calendar-card';
import type MeetingPollCardViewState from 'owa-mail-meetingpoll-card/lib/store/schema/MeetingPollCardViewState';
import type { YammerCardViewState } from 'owa-yammer-thread';

interface ExtendedCardViewState {
    cardViewState: CardViewState;
    cardType: ExtendedCardType;
    inScrollRegion: boolean;
    coverOriginalContent?: boolean;
}

export enum ExtendedCardType {
    TXP,
    CalendarCard,
    MeetingPoll,
    Voting,
    Yammer,
}

export type CardViewState =
    | TxpCardViewState
    | VotingCardViewState
    | CalendarCardViewState
    | MeetingPollCardViewState
    | YammerCardViewState;

export default ExtendedCardViewState;
