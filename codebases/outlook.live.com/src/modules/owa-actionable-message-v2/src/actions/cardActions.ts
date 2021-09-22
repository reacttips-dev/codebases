import { action } from 'satcheljs';

export const addCard = action('addCard', (cardId: string) => ({
    cardId: cardId,
}));

export const removeCard = action('removeCard', (cardId: string) => ({
    cardId: cardId,
}));

export const setAutoInvokeActionAlreadyRan = action(
    'setAutoInvokeActionAlreadyRan',
    (cardId: string, autoInvokeActionAlreadyRan: boolean) => ({
        cardId: cardId,
        autoInvokeActionAlreadyRan: autoInvokeActionAlreadyRan,
    })
);
