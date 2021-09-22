import { createStore } from 'satcheljs';
import type { HeaderToastNotificationViewState } from './schema/HeaderToastNotificationViewState';

let initialState: HeaderToastNotificationViewState = {
    notificationViewStates: [],
};

export default createStore<HeaderToastNotificationViewState>(
    'headerToastNotificationViewState',
    initialState
)();
