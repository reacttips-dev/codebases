import type { PhoneAppCardState } from './schema/PhoneAppCardState';
import type { UserOutlookClientsState } from './schema/UserOutlookClientsState';
import { createStore } from 'satcheljs';

let initialPhoneAppCardState: PhoneAppCardState = {
    errorMessage: '',
    isCardDismissed: false,
};

let initialUserOutlookClientsState: UserOutlookClientsState = {
    clients: [],
};

export let phoneAppCardStore = createStore<PhoneAppCardState>(
    'PhoneAppCardStore',
    initialPhoneAppCardState
);

export let userOutlookClientsStore = createStore<UserOutlookClientsState>(
    'OutlookClientsStore',
    initialUserOutlookClientsState
);
