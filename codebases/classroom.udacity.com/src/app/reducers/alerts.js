import {
    NUM_DAYS_IN_TWO_WEEKS,
    STATIC_ACCESS_END_APPROACHING,
} from 'constants/static-access';

import Actions from 'actions';
import {
    CA_OVER_LIMIT
} from 'constants/payment-status';
import DateHelper from 'helpers/date-helper';
import NanodegreeHelper from 'helpers/nanodegree-helper.js';
import PaymentsHelper from 'helpers/payments-helper';
import {
    __
} from 'services/localization-service';
import cookies from 'js-cookie';

const DISMISSED_ALERTS = 'dismissed_alerts';

function generateId() {
    return Math.random().toString(36).slice(-10);
}

function _addAlert(state, {
    type,
    message,
    dismissable,
    name
}) {
    var id = generateId();
    const dismissedAlerts = cookies.getJSON(DISMISSED_ALERTS);
    return dismissable === 'manual' && _.includes(dismissedAlerts, name) ?
        [...state] :
        [{
                id,
                type,
                message,
                dismissable,
                name,
            },
            ...state,
        ];
}

// updating "persisted" state to "dismissable" with three options: auto, manual, none
// auto: auto-dismissed after timeout (https://github.com/udacity/classroom-web/blob/master/src/app/components/notifications/alerts.jsx#L5)
// manual: dismissable only by student. Will not show on subsequent page loads.
// none: not dismissable by student or timer. Will show upon every load until warning action has been completed (i.e. payment made)

function addNotification(state, message, dismissable = 'auto', name) {
    return _addAlert(state, {
        type: 'information',
        message,
        dismissable,
        name
    });
}

function addSuccess(state, message, dismissable = 'auto', name) {
    return _addAlert(state, {
        type: 'success',
        message,
        dismissable,
        name
    });
}

function addWarning(state, message, dismissable = 'auto', name) {
    return _addAlert(state, {
        type: 'warning',
        message,
        dismissable,
        name
    });
}

function addWarningWithMessageAndNDCookie({
    state,
    messageText,
    degree,
    expiryDate,
    alertCookieBaseName,
}) {
    const nanodegreeTitle = _.get(degree, 'title');
    const alertCookieName = alertCookieBaseName + nanodegreeTitle; // Add ND title to cookie base name so dismissing the alert only affects the one ND.

    return addWarning(
        state,
        __(
            messageText, {
                nanodegreeTitle,
                period_end_date: DateHelper.formatShortMonth(expiryDate),
            }, {
                renderHTML: true,
            }
        ),
        'manual',
        alertCookieName
    );
}

function addError(state, message, dismissable = 'auto', name) {
    return _addAlert(state, {
        type: 'error',
        message,
        dismissable,
        name
    });
}

function removeAlert(state, {
    id,
    name,
    dismissable
}) {
    const dismissedAlerts = cookies.getJSON(DISMISSED_ALERTS);
    dismissable === 'manual' &&
        cookies.set(DISMISSED_ALERTS, _.concat(dismissedAlerts, name));
    return _.reject(state, (alert) => alert.id === id);
}

export default function(state = [], action) {
    switch (action.type) {
        case Actions.Types.CREATE_SUCCESS_ALERT:
            state = addSuccess(state, action.payload);
            break;

        case Actions.Types.CREATE_NOTIFICATION_ALERT:
            state = addNotification(state, action.payload);
            break;

        case Actions.Types.CREATE_WARNING_ALERT:
            state = addWarning(state, action.payload);
            break;

        case Actions.Types.CREATE_ERROR_ALERT:
            state = addError(state, action.payload);
            break;

        case Actions.Types.REMOVE_ALERT:
            state = removeAlert(state, action.payload);
            break;

        case Actions.Types.UPDATE_USER_COMPLETED:
        case Actions.Types.UPDATE_HUB_USER_COMPLETED:
            const {
                showToast = true
            } = action.payload;
            if (showToast) {
                if (action.error) {
                    state = addError(
                        state,
                        __('An error occurred while trying to save your info')
                    );
                } else {
                    state = addSuccess(state, __('Info changed successfully'));
                }
            }
            break;

        case Actions.Types.UPDATE_LANGUAGE_COMPLETED:
            if (action.error) {
                state = addError(
                    state,
                    __('An error occurred while trying to save your language preference')
                );
            } else {
                state = addSuccess(
                    state,
                    __('Language preference changed successfully')
                );
            }
            break;

        case Actions.Types.UPDATE_DEFAULT_CARD_COMPLETED:
            if (action.error) {
                state = addError(
                    state,
                    __('An error occurred while trying to update your card')
                );
            } else {
                state = addSuccess(state, __('Card updated successfully'));
            }
            break;

        case Actions.Types.UPDATE_DEFAULT_SOURCE_COMPLETED:
            if (action.error) {
                state = addError(
                    state,
                    __('An error occurred while trying to update your SEPA direct-debit')
                );
            } else {
                state = addSuccess(state, __('SEPA direct-debit updated successfully'));
            }
            break;

        case Actions.Types.CANCEL_TERM_PURCHASE_COMPLETED:
            if (action.error) {
                state = addError(
                    state,
                    __('An error occurred while trying to cancel your purchase')
                );
            } else {
                state = addSuccess(
                    state,
                    __('Purchase canceled and refunded successfully')
                );
            }
            break;

        case Actions.Types.CANCEL_SUBSCRIPTION_COMPLETED:
            if (action.error) {
                state = addError(
                    state,
                    __('An error occurred while trying to cancel your subscription')
                );
            } else {
                state = addSuccess(state, __('Subscription canceled successfully'));
            }
            break;

        case Actions.Types.FETCH_ORDER_HISTORY_COMPLETED:
            const orderHistory = _.get(action, 'payload.order_history');
            const {
                hasUpcomingPayment,
                dueDate
            } = PaymentsHelper.getUpcomingPayment(
                orderHistory
            );
            const hasOverduePayment = PaymentsHelper.getOverduePayment(orderHistory);
            const hasFailedPayment = PaymentsHelper.getFailedPayment(orderHistory);
            const subscription = _.get(orderHistory, '[0]', {});
            const hasUnpaidPreorder =
                PaymentsHelper.isPreOrder(subscription) &&
                PaymentsHelper.isPaymentOverdue(
                    _.get(subscription, 'next_payment', {})
                );
            let endDate, nanodegree;
            const isCaliforniaOverLimit = PaymentsHelper.getCAOverLimit(orderHistory);
            if (isCaliforniaOverLimit) {
                endDate = _.get(isCaliforniaOverLimit, 'period_end_date');
                nanodegree = _.get(isCaliforniaOverLimit, 'purchased_products[0].name');
            }

            const bundleEnding = PaymentsHelper.getBundleEnding(orderHistory);
            let isAutoRenewableBundleEnding;
            if (bundleEnding) {
                endDate = _.get(bundleEnding, 'period_end_date');
                nanodegree = _.get(bundleEnding, 'purchased_products[0].name');
                isAutoRenewableBundleEnding = PaymentsHelper.canAutoRenew(bundleEnding);
            }

            if (hasUpcomingPayment) {
                state = addNotification(
                    state,
                    __(
                        'You have an upcoming payment due on <%= date %>. See <a href="https://classroom.udacity.com/settings/subscriptions">Subscription and Billing</a> for more information.', {
                            date: dueDate,
                            renderHTML: true
                        }
                    )
                );
            }
            if (hasOverduePayment) {
                state = addWarning(
                    state,
                    __(
                        'Your account is past due. <a href="https://classroom.udacity.com/settings/subscriptions">Pay now</a> to avoid losing access.', {
                            renderHTML: true
                        }
                    ),
                    'none'
                );
            }
            if (hasFailedPayment) {
                state = addError(
                    state,
                    __(
                        'A failed payment has posted to your account. <a href="https://classroom.udacity.com/settings/subscriptions">Pay now</a> to avoid losing access.', {
                            renderHTML: true
                        }
                    ),
                    'none'
                );
            }
            if (hasUnpaidPreorder) {
                state = addWarning(
                    state,
                    __(
                        'The classroom is now open! <a href="https://classroom.udacity.com/settings/subscriptions">Pay now</a> to start learning.', {
                            renderHTML: true
                        }
                    )
                );
            }
            if (isCaliforniaOverLimit) {
                state = addWarning(
                    state,
                    __(
                        'You have reached the mandatory price cap set by California educational regulations for your subscription to <%= nanodegree %>. Your access will end on <%= period_end_date %>. <a href="https://classroom.udacity.com/settings/subscriptions">Check your subscriptions</a> to learn more.', {
                            nanodegree,
                            period_end_date: DateHelper.formatShortMonth(endDate),
                        }, {
                            renderHTML: true,
                        }
                    ),
                    'manual',
                    CA_OVER_LIMIT
                );
            }
            if (isAutoRenewableBundleEnding) {
                state = addWarning(
                    state,
                    __(
                        'Your bundle subscription to <%= nanodegree %> will end on <%= period_end_date %>, and will be auto-renewed on a monthly basis. <a href="https://classroom.udacity.com/settings/subscriptions">Check your subscriptions</a> to learn more.', {
                            nanodegree,
                            period_end_date: DateHelper.formatShortMonth(endDate),
                        }, {
                            renderHTML: true,
                        }
                    ),
                    'none'
                );
            }
            break;

            // Warning that end of static access is approaching
        case Actions.Types.FETCH_NANODEGREE_COMPLETED:
            const degree = _.get(action, 'payload');
            const isStatic = NanodegreeHelper.isStatic(degree);
            if (isStatic && typeof degree !== 'undefined') {
                const expiryDate = NanodegreeHelper.getStaticAccessExpiryDate(degree);
                const numDaysLeft = DateHelper.getNumDaysLeftUntil(expiryDate);
                const alertCookieBaseName = STATIC_ACCESS_END_APPROACHING;
                if (
                    expiryDate &&
                    numDaysLeft >= 0 &&
                    numDaysLeft <= NUM_DAYS_IN_TWO_WEEKS
                ) {
                    state = addWarningWithMessageAndNDCookie({
                        degree,
                        state,
                        expiryDate,
                        alertCookieBaseName,
                        messageText: 'Your static access to <%= nanodegreeTitle %> has been active for nearly 1 year and will expire on <%= period_end_date %>',
                    });
                }
            }
            break;
    }
    return state;
}