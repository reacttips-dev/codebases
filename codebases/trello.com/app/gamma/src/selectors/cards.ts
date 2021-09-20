import { State } from 'app/gamma/src/modules/types';
import { CardModel } from 'app/gamma/src/types/models';

// helpers

export const getCardById = (
  state: State,
  idCard: string,
): CardModel | undefined =>
  state.models.cards.find((card: CardModel) => card.id === idCard);

export const getCardsByIds = (
  state: State,
  idCards: string[] = [],
): CardModel[] =>
  idCards.reduce((result, idCard) => {
    const card = getCardById(state, idCard);
    if (card) {
      result.push(card);
    }

    return result;
  }, [] as CardModel[]);

export const getCardByShortLink = (
  state: State,
  shortLink: string,
): CardModel | undefined =>
  state.models.cards.find((card: CardModel) => card.shortLink === shortLink);
