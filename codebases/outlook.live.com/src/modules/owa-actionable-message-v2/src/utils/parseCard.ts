import type CardDetails from '../store/schema/CardDetails';
import { getGuid } from 'owa-guid';

type CardType = {
    type: string;
};

export default function parseCard(
    commonProps: any,
    card: object,
    cardSignature: string,
    isAdaptive?: boolean,
    cardId?: string
): CardDetails {
    return {
        ...commonProps,
        isAdaptiveCard:
            isAdaptive === undefined ? (card as CardType).type === 'AdaptiveCard' : isAdaptive,
        cardSignature: cardSignature,
        card: card,
        cardHash: undefined,
        cardId: cardId || getGuid(),
    };
}
