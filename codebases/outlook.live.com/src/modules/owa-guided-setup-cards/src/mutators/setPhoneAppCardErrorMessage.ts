import { mutatorAction } from 'satcheljs';
import { phoneAppCardStore } from '../store/store';

export let setPhoneAppCardErrorMessage = mutatorAction(
    'setPhoneAppCardErrorMessage',
    (errorMessage: string) => {
        let store = phoneAppCardStore();
        store.errorMessage = errorMessage;
    }
);
