import { action } from 'satcheljs';

export const notificationAutoDismissTimerCompleted = action(
    'notificationAutoDismissTimerCompleted'
);

export const notificationMouseEnter = action('notificationMouseEnter');

export const notificationMouseLeave = action(
    'notificationMouseLeave',
    (notificationId: string) => ({
        notificationId,
    })
);

export const resetNotificationViewState = action('resetNotificationViewState');

export const setNotificationIsHovered = action(
    'setNotificationIsHovered',
    (isHovered: boolean) => ({
        isHovered,
    })
);

export const setIsNotificationBarFocused = action('setFocusOnNotificationBar');
