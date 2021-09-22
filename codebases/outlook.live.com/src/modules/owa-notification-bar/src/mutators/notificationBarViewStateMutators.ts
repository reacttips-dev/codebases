import store from '../store/Store';
import { mutator } from 'satcheljs';
import {
    notificationAutoDismissTimerCompleted,
    notificationMouseEnter,
    resetNotificationViewState,
    setNotificationIsHovered,
    setIsNotificationBarFocused,
} from '../actions/internalActions';

mutator(notificationAutoDismissTimerCompleted, actionMessage => {
    store.notificationBarViewState.autoDismissTimerCompleted = true;
});

mutator(notificationMouseEnter, actionMessage => {
    store.notificationBarViewState.isHovered = true;
});

mutator(setNotificationIsHovered, actionMessage => {
    store.notificationBarViewState.isHovered = actionMessage.isHovered;
});

mutator(resetNotificationViewState, actionMessage => {
    store.notificationBarViewState.isHovered = false;
    store.notificationBarViewState.autoDismissTimerCompleted = false;

    if (store.notificationStack.length === 0) {
        store.notificationBarViewState.isFocused = false;
    }
});

mutator(setIsNotificationBarFocused, actionMessage => {
    store.notificationBarViewState.isFocused = true;
});
