import store from '../store/Store';
import { trace } from 'owa-trace';
import { mutator } from 'satcheljs';
import { addCard, removeCard, setAutoInvokeActionAlreadyRan } from '../actions/cardActions';

export const addCardMutator = mutator(addCard, actionMessage => {
    store.cards.set(actionMessage.cardId, {
        autoInvokeActionAlreadyRan: false,
    });
});

export const removeCardMutator = mutator(removeCard, actionMessage => {
    store.cards.delete(actionMessage.cardId);
});

export const setAutoInvokeActionAlreadyRanMutator = mutator(
    setAutoInvokeActionAlreadyRan,
    actionMessage => {
        const card = store.cards.get(actionMessage.cardId);
        if (card) {
            card.autoInvokeActionAlreadyRan = actionMessage.autoInvokeActionAlreadyRan;
        } else {
            trace.warn(
                `[ActionableMessageDebug] setAutoInvokeActionAlreadyRanMutator: card is undefined for cardId ${actionMessage.cardId}`
            );
        }
    }
);
