import type Message from 'owa-service/lib/contract/Message';
import type VotingCardViewState from 'owa-mail-voting/lib/store/schema/VotingCardViewState';
import setExtendedCardViewState from '../actions/setExtendedCardViewState';
import { lazyLoadActiveVotingProviders } from 'owa-mail-voting';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { ExtendedCardType } from '../store/schema/ExtendedCardViewState';

export default function initializeVotingCard(
    conversationViewState: ConversationReadingPaneViewState,
    item: Message
) {
    setExtendedCardViewState(conversationViewState, {
        cardViewState: {
            itemId: item.ItemId.Id,
            votingInformation: item.VotingInformation,
        } as VotingCardViewState,
        cardType: ExtendedCardType.Voting,
        inScrollRegion: true,
    });

    lazyLoadActiveVotingProviders
        .import()
        .then(loadActiveVotingProviders => loadActiveVotingProviders(item.ItemId.Id, item));
}
