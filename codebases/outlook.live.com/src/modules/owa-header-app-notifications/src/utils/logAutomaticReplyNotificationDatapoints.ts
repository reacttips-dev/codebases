import { logUsage } from 'owa-analytics';

/**
 * Log the datapoint if user clicks on turn off button
 */
export function logAutomaticReplyNotificationTurnOffButtonClicked() {
    logUsage('AutomaticReplyNotificationTurnOffButtonClicked');
}

/**
 * Log the datapoint if user clicks on dismiss button
 */
export function logAutomaticReplyNotificationDismissButtonClicked() {
    logUsage('AutomaticReplyNotificationDismissButtonClicked');
}

/**
 * Log the datapoint when the notification is visible
 */
export function logAutomaticReplyNotificationShown() {
    logUsage('AutomaticReplyNotificationShown');
}
