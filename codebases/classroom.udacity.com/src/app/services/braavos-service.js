import ApiError from 'errors/api-error';
import ApiService from './api-service';
import AuthenticationService from 'services/authentication-service';
import _ from 'lodash';
import {
    __
} from 'services/localization-service';

const UPGRADE_PRICE_SHEET = 'paid_trial_upgrade';

export default {
    /**
     * Update the default payment method to a Stripe credit card.
     * @param card_token the Stripe card token
     */
    async updateDefaultPaymentMethod(card_token) {
        const userId = AuthenticationService.getCurrentUserId();
        const url = `${CONFIG.braavosUrl}/users/${userId}/payment_methods`;
        const body = {
            provider: 'stripe',
            card_token: card_token,
        };
        try {
            const response = await ApiService.post(url, body);
            return _.get(response, 'payment_method.saved_credit_card');
        } catch (error) {
            const message = _.get(error.responseJSON, 'errors[0]', error.statusText);
            throw new ApiError({
                message: message,
                status: error.status,
            });
        }
    },

    async deletePaymentMethod(urn) {
        const url = `${CONFIG.braavosUrl}/payment_methods/${urn}`;
        try {
            await ApiService.delete(url);
        } catch (error) {
            const message = _.get(error.responseJSON, 'errors[0]', error.statusText);
            throw new ApiError({
                message: message,
                status: error.status,
            });
        }
    },

    cancelPurchase(purchaseUrn) {
        return ApiService.post(
                `${CONFIG.braavosUrl}/purchases/${purchaseUrn}/cancel`
            )
            .then((response) => {
                return {
                    urn: purchaseUrn,
                    status: _.get(response, 'purchase.status'),
                };
            })
            .catch((error) => {
                throw new ApiError({
                    message: error.statusText,
                    status: error.status,
                });
            });
    },

    fetchAccountCreditTotal(currency) {
        const userId = AuthenticationService.getCurrentUserId();
        const url = `${CONFIG.braavosUrl}/users/${userId}/referral_balances`;
        return ApiService.get(url, {
                currency: currency,
            })
            .then((response) => {
                return {
                    amount: _.get(response, 'amount'),
                };
            })
            .catch((error) => {
                throw new ApiError({
                    message: error.statusText,
                    status: error.status,
                });
            });
    },

    fetchPaidTrialUpgradeLink(nodeKey, currency) {
        const url = `${CONFIG.braavosUrl}/prices`;
        return ApiService.get(url, {
            item: `urn:x-udacity:item:node:${nodeKey}`,
            currency,
            price_sheet: UPGRADE_PRICE_SHEET,
            with_open_cohort: true,
        }).then((response) => {
            const firstResult = _.get(response, 'results[0]', {});
            const link = _.get(firstResult, ['links', '0', 'href']);
            const purchasableCohortId = _.get(firstResult, [
                'current_purchasable_cohort',
                'cohort_id',
            ]);
            const joinChar = _.includes(link, '?') ? '&' : '?';
            return `${link}${joinChar}cohort_id=${purchasableCohortId}`;
        });
    },

    async updateStripeBillingAddress(urn, billing_address) {
        const url = `${CONFIG.braavosUrl}/payment_methods/${urn}`;
        try {
            await ApiService.patch(url, {
                billing_address
            });
        } catch (error) {
            const message = _.get(error.responseJSON, 'errors[0]', error.statusText);
            throw new ApiError({
                message: message,
                status: error.status,
            });
        }
    },

    async fetchOrderHistory() {
        const userId = AuthenticationService.getCurrentUserId();
        const url = `${CONFIG.braavosUrl}/users/${userId}/order_history`;
        try {
            const res = await ApiService.get(url);
            return res;
        } catch (error) {
            const message = _.get(error.responseJSON, 'errors[0]', error.statusText);
            throw new ApiError({
                message,
                status: error.status,
            });
        }
    },

    async cancelOrder(
        urn,
        refund_expected,
        intercom_cancel,
        cancel_reason,
        follow_up
    ) {
        const url = `${CONFIG.braavosUrl}/subscriptions/${urn}/cancel`;
        const attributes = {
            refund_expected,
            cancel_reason,
            intercom_cancel,
            ...follow_up,
        };
        try {
            return await ApiService.post(url, _.omit(attributes, _.isUndefined));
        } catch (error) {
            const message = _.get(error.responseJSON, 'errors[0]', error.statusText);
            throw new ApiError({
                message,
                status: error.status,
            });
        }
    },

    async uncancelOrder(urn) {
        const url = `${CONFIG.braavosUrl}/subscriptions/${urn}/uncancel`;
        try {
            return await ApiService.post(url);
        } catch (error) {
            const message = _.get(error.responseJSON, 'errors[0]', error.statusText);
            throw new ApiError({
                message,
                status: error.status,
            });
        }
    },

    async updateAutoRenew(urn, setAutoRenewTo) {
        const url = `${CONFIG.braavosUrl}/subscriptions/${urn}/update_auto_renew`;
        try {
            await ApiService.put(url, {
                auto_renew: setAutoRenewTo
            });
        } catch (error) {
            const message =
                _.get(error, 'rich_errors[0].detail') ||
                _.get(error, 'errors[0]') ||
                __('An error occurred saving your choice. Please try again.');

            throw new ApiError({
                message,
                status: error.status,
            });
        }
    },

    // proxy request through classroom-content in order to authenticate as staff user
    async isDiscountEligible(urn, declinedOffer) {
        return ApiService.gql(
                `
      query ClassroomWeb_isDiscountEligible{
        isDiscountEligible(subscription_urn:"${urn}", declinedOffer: ${declinedOffer}){
          is_eligible
          discount_amount_display
          subtotal_amount_display
          refunded_amount_display
        }
      }`
            )
            .then((response) => {
                return {
                    is_eligible: _.get(
                        response.data,
                        'isDiscountEligible.is_eligible',
                        false
                    ),
                    discount_amount_display: _.get(
                        response.data,
                        'isDiscountEligible.discount_amount_display',
                        ''
                    ),
                    subtotal_amount_display: _.get(
                        response.data,
                        'isDiscountEligible.subtotal_amount_display',
                        ''
                    ),
                    refunded_amount_display: _.get(
                        response.data,
                        'isDiscountEligible.refunded_amount_display',
                        ''
                    ),
                };
            })
            .catch((error) => {
                throw new ApiError({
                    message: _.get(error, 'errors[0].message'),
                    status: _.get(error, 'errors[0].status'),
                });
            });
    },

    // proxy request through classroom-content in order to authenticate as staff user
    async applySubscriptionDiscount(urn, declinedOffer) {
        return ApiService.gql(
                `
      mutation ClassroomWeb_applySubscriptionDiscount{
        applySubscriptionDiscount(subscription_urn:"${urn}", declinedOffer:${declinedOffer}){
          success
        }
      }`
            )
            .then((response) => {
                return {
                    success: _.get(
                        response.data,
                        'applySubscriptionDiscount.success',
                        false
                    ),
                };
            })
            .catch((error) => {
                throw new ApiError({
                    message: _.get(error, 'errors[0].message'),
                    status: _.get(error, 'errors[0].status'),
                });
            });
    },

    async switchNanodegrees(subscriptionUrn, ndKey) {
        const url = `${CONFIG.braavosUrl}/subscriptions/${subscriptionUrn}/switch_nanodegree?nanodegree_key=${ndKey}`;
        try {
            await ApiService.post(url);
            return {
                success: true,
                message: null
            };
        } catch (e) {
            return {
                success: false,
                message: _.get(
                    e.responseJSON,
                    'errors[0]',
                    __(
                        'An error occurred while attempting to switch nanodegrees. Please try again.'
                    )
                ),
            };
        }
    },

    async checkSwitchEligibility(subscriptionUrn, ndKey) {
        try {
            const data = await ApiService.get(
                `${CONFIG.braavosUrl}/subscriptions/${subscriptionUrn}/switch_nanodegree?nanodegree_key=${ndKey}`
            );
            return {
                data,
                success: true
            };
        } catch (e) {
            return {
                success: false,
                message: _.get(
                    e.responseJSON,
                    'errors[0]',
                    __('An error occurred while checking eligibility. Please try again.')
                ),
            };
        }
    },
};