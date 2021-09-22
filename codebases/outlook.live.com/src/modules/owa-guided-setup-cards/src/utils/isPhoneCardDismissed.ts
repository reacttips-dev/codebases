import { phoneAppCardStore } from '../store/store';

export default function isPhoneCardDismissed(): boolean {
    return phoneAppCardStore().isCardDismissed;
}
