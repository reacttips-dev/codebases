import {
    ACTIVE,
    CANCELED,
    CANCELING,
    CA_OVER_LIMIT,
    DUE,
    FAILED,
    PAID,
    PAST_DUE,
    PREORDER,
    TRIALING,
    UPFRONT_RECURRING,
} from 'constants/payment-status';
import DateHelper from 'helpers/date-helper';
import _ from 'lodash';
import {
    __
} from 'services/localization-service';
import moment from 'moment';

const PaymentsHelper = {
    State: {
        getBillingInfo(state) {
            return _.get(state, 'payments.billingInfo') || {};
        },

        getOrderHistory(state) {
            return _.get(state, 'payments.orderHistory') || [];
        },
    },

    getDisplayStatus(payment) {
        const status = _.get(payment, 'status');
        switch (status) {
            case ACTIVE:
                return __('Active');
            case CANCELED:
                return __('Canceled');
            case CANCELING:
                return __('Canceling');
            case DUE:
                return __('Due');
            case FAILED:
                return __('Failed');
            case PAID:
                return __('Paid');
            case PREORDER:
                return __('Preorder');
            case PAST_DUE:
                return __('Past due');
            default:
                console.error(`Unknown payment status #getDisplayStatus: ${status}`);
                return '';
        }
    },

    getDisplayPrice(payment) {
        // chop off the last 4 chars (one space and 3 char country currency code)
        if (_.isString(payment)) {
            return payment.slice(0, -4);
        }
        return _.get(payment, 'total_amount.display', '').slice(0, -4);
    },

    paymentFailed(payment) {
        return _.isEqual(_.get(payment, 'status'), FAILED);
    },

    isPaymentOverdue(payment) {
        return (
            _.isEqual(_.get(payment, 'status'), PAST_DUE) ||
            DateHelper.pastToday(_.get(payment, 'due_at'))
        );
    },

    isPreOrder(subscription) {
        return _.isEqual(_.get(subscription, 'status'), PREORDER);
    },

    isCAOverLimit(subscription) {
        return _.isEqual(_.get(subscription, 'no_uncancel_reason'), CA_OVER_LIMIT);
    },

    getUpcomingPayment(orderHistory) {
        const upcoming = _.find(
            orderHistory,
            (order) =>
            PaymentsHelper.isDue(order) && !PaymentsHelper.canAutoRenew(order)
        );
        return {
            hasUpcomingPayment: !_.isEmpty(upcoming),
            dueDate: DateHelper.formatShortMonth(
                _.get(upcoming, 'next_payment.due_at', '')
            ),
        };
    },

    getOverduePayment(orderHistory) {
        return _.find(orderHistory, (order) =>
            PaymentsHelper.isPaymentOverdue(order)
        );
    },

    getFailedPayment(orderHistory) {
        return _.find(orderHistory, (order) => PaymentsHelper.paymentFailed(order));
    },

    isDue(payment) {
        const nextPayment = _.get(payment, 'next_payment');
        const daysLeft = PaymentsHelper.getDaysLeft(_.get(nextPayment, 'due_at'));
        return nextPayment && daysLeft <= 7 && daysLeft >= 0;
    },

    canAutoRenew(subscription) {
        const canAutoRenew = _.get(
            subscription,
            'next_payment.can_auto_renew',
            false
        );
        const isNotTrialing = _.get(subscription, 'status') !== TRIALING;
        return canAutoRenew && isNotTrialing;
    },

    getCAOverLimit(orderHistory) {
        return _.find(orderHistory, (order) => PaymentsHelper.isCAOverLimit(order));
    },

    getBundleEnding(orderHistory) {
        const bundle = _.find(orderHistory, (order) =>
            PaymentsHelper.isBundle(order)
        );
        if (!bundle) {
            return false;
        }
        const daysLeft = PaymentsHelper.getDaysLeft(
            _.get(bundle, 'period_end_date')
        );
        return daysLeft <= 7 && daysLeft >= 0 ? bundle : false;
    },

    isBundle(subscription) {
        return _.isEqual(
            _.get(subscription, 'payment_plan.type'),
            UPFRONT_RECURRING
        );
    },

    getDaysLeft(date) {
        return moment(date).diff(moment(), 'days');
    },

    getMostRecentOrderForNdKey(orderHistory, ndKey) {
        const payableOrdersForNd = orderHistory.filter((order) => {
            return (!!order.next_payment &&
                !!order.purchased_products.find(
                    (product) => product.nanodegree_key === ndKey
                )
            );
        });

        if (payableOrdersForNd.length === 0) {
            return undefined;
        }

        const sortedPayableOrdersForNd = payableOrdersForNd.slice().sort((a, b) => {
            const aPaymentDate = moment(a.next_payment.due_at);

            return aPaymentDate.isAfter(b.next_payment.due_at) ?
                -1 :
                aPaymentDate.isBefore(b.next_payment.due_at) ?
                1 :
                0;
        });

        return sortedPayableOrdersForNd[0];
    },
};

export default PaymentsHelper;