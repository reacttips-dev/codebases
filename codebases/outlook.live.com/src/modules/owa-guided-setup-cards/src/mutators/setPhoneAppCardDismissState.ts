import { mutatorAction } from 'satcheljs';
import { phoneAppCardStore } from '../store/store';

export let setPhoneAppCardDismissState = mutatorAction(
    'setPhoneAppCardDismissState',
    (isCardDismissed: boolean) => {
        let store = phoneAppCardStore();
        store.isCardDismissed = isCardDismissed;
    }
);
