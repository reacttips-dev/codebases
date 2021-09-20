import CurrencySymbols from 'constants/currency';
import {
    __
} from 'services/localization-service';
import getSymbolFromCurrency from 'currency-symbol-map';

const MINI_NANODEGREES = ['nd801-1', 'nd801-2', 'nd801-3', 'nd801-4'];

const SubscriptionHelper = {
    WECHATPAY: 'wxpay',
    ALIPAY: 'alipay',
    ALIPAY_HB: 'hb',
    FQLPAY: 'fql',
    status: {
        CANCELED: 'CANCELED',
        SUSPENDED: 'SUSPENDED',
        TRIALING: 'TRIALING',
        ACTIVE: 'ACTIVE',
        CANCELING: 'CANCELING',
    },

    isSuspended(subscription) {
        return subscription && subscription.status === 'past_due';
    },

    isTrialing(subscription) {
        return subscription && subscription.status === 'trialing';
    },

    isCanceled(subscription) {
        return subscription && !!subscription.canceled_at;
    },

    isCanceling(subscription) {
        return subscription && subscription.status === 'canceling';
    },

    isRefundable(subscription) {
        return subscription && subscription.refundability !== 'non-refundable';
    },

    subscriptionStatus(subscription) {
        if (SubscriptionHelper.isCanceled(subscription)) {
            return SubscriptionHelper.status.CANCELED;
        } else if (SubscriptionHelper.isSuspended(subscription)) {
            return SubscriptionHelper.status.SUSPENDED;
        } else if (SubscriptionHelper.isTrialing(subscription)) {
            return SubscriptionHelper.status.TRIALING;
        } else if (SubscriptionHelper.isCanceling(subscription)) {
            return SubscriptionHelper.status.CANCELING;
        } else {
            return SubscriptionHelper.status.ACTIVE;
        }
    },

    calcBalance(coupon, amount) {
        const percentOff = (coupon || {}).percent_off || 0;
        return amount * (1 - percentOff / 100);
    },

    formatPrice(currency, amount) {
        return __('<%= symbol %><%= amount %>', {
            symbol: getSymbolFromCurrency(currency.toUpperCase()),
            amount: (amount / 100).toFixed(2),
        });
    },

    isChinaPayment(subscription) {
        return subscription.provider === 'china';
    },

    isStripePayment(subscription) {
        return subscription.provider === 'stripe';
    },

    isManagedPayment(subscription) {
        return subscription.provider === 'managed';
    },

    isAppleIapPayment(subscription) {
        return subscription.provider === 'apple_iap';
    },

    isConnectProduct(subscription) {
        return subscription.name === 'Udacity Connect';
    },

    isIndiaPayment(subscription) {
        return SubscriptionHelper.isManagedPayment(subscription) ?
            subscription.currency.toUpperCase() === CurrencySymbols.INDIANRUPEE :
            false;
    },

    //TODO: Is this still accurate?
    getSubscriptionIdOrURN(subscription) {
        return SubscriptionHelper.isManagedPayment(subscription) ?
            subscription.urn :
            subscription.id;
    },

    getSubscriptionURN(subscription) {
        return _.get(subscription, 'urn');
    },

    userHasActiveStripeSubscription(subscriptions) {
        return _.some(subscriptions, (subscription) => {
            return SubscriptionHelper.isStripePayment(subscription);
        });
    },

    getConnectSubscription(subscriptions) {
        return _.find(subscriptions, {
            name: 'Udacity Connect'
        });
    },

    hasNanodegreeSubscription(subscriptions) {
        return !_.isEmpty(
            SubscriptionHelper.getEarliestNanodegreeSubscription(subscriptions)
        );
    },

    getEarliestNanodegreeSubscription(subscriptions) {
        return _.chain(subscriptions)
            .filter(SubscriptionHelper.isNanodegreeSubscription)
            .sortBy((subscription) => new Date(subscription.started_at).getTime())
            .first()
            .value();
    },

    isNanodegreeSubscription(subscription) {
        return _.startsWith(subscription.product_key || '', 'nd');
    },

    isPreorder(subscription) {
        return _.get(subscription, 'status') === 'pre_order';
    },

    buildInvoicePaymentUrl(invoice) {
        return CONFIG.paymentsUrl + '/checkout/billing-info?invoice=' + invoice;
    },

    // China team is experimenting mini-nanodegree which splits the content
    // of one nanodegree into different pieces; and charge student before enrollment.
    // So we will hide the subscription card in /settings/subscriptions.
    isMiniND(subscription) {
        return MINI_NANODEGREES.indexOf(subscription.product_key) > -1;
    },

    getNanodegreeKey(subscription) {
        return _.get(subscription, 'purchased_products[0].nanodegree_key');
    },

    isEnterprise(subscription) {
        return _.includes(
            SubscriptionHelper.getNanodegreeKey(subscription),
            '-ent'
        );
    },

    isChinaManaged(subscription) {
        return _.includes(SubscriptionHelper.getNanodegreeKey(subscription), '-cn');
    },

    getNanodegreeTitle(subscription) {
        return _.get(subscription, 'purchased_product_description', '');
    },

    getPaymentMethod(subscription) {
        return _.get(subscription, 'payment_method.processor');
    },

    hasPaid(subscription) {
        const paymentHistory = _.get(subscription, 'payment_history', []);
        return !!paymentHistory.find((payment) => {
            const amountPaid = _.get(payment, 'total_amount.minor', 0);
            return (
                (payment.status === 'paid' ||
                    payment.status === 'partially_refunded') &&
                amountPaid > 0
            );
        });
    },

    isAutoRenewEligible(subscription) {
        //TODO: clarify what this means and if it should default to false
        return _.get(subscription, 'next_payment.can_auto_renew', false);
    },

    isEligibleForRefund(subscription) {
        //TODO: clarify why this means in concert with isAutoRenewEligible
        //TODO: clarify what the default value should be, currently undefined
        return _.get(subscription, 'can_refund');
    },

    firstPaymentLength(subscription) {
        // It’s the number of month the first payment covers. 1 in the case of monthly subscriptions. > 1 in the case of bundle subscriptions.
        //typical values: [1,4,null]
        return _.get(subscription, 'payment_plan.upfront_interval_count');
    },

    getCountryCode(subscription) {
        return _.get(subscription, 'country_code', '');
    },

    getRegion(subscription) {
        return _.get(subscription, 'region', '');
    },

    isFreeMonthPromotion(subscription) {
        const promotion = _.get(subscription, 'campaign_name', undefined);
        //for now we're hardcoding the promo. this will need to change when we implement more promos
        return promotion === 'free_month_2020';
    },
};

export default SubscriptionHelper;