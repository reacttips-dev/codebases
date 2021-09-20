import * as CANCEL from './_cancel-flow-constants';
import BraavosService from 'services/braavos-service';
import PredictionHelper from 'helpers/prediction-helper';
import SubscriptionHelper from 'helpers/subscription-helper';
import cookies from 'js-cookie';
import {
    reportError
} from 'initializers/sentry';
import {
    sendSegmentProxyEvent
} from 'services/segment-service';

const CHAT_SUPPORT = 'chat';
const SELF_SERVE_DISCOUNT_SUPPORT = 'discount';

export const SUPPORT_BY = {
    SELF_SERVE_DISCOUNT: {
        name: 'self-serve-discount',
        value: CANCEL.EVENT_VALUE.SELF_SERVE_DISCOUNT,
        requires: [SELF_SERVE_DISCOUNT_SUPPORT],
    },
    CHAT: {
        name: 'chat',
        value: CANCEL.EVENT_VALUE.CHAT,
        requires: [CHAT_SUPPORT],
    },
    SELF_SERVE: {
        name: 'self-serve',
        value: CANCEL.EVENT_VALUE.SELF_SERVE,
        requires: [],
    },
    LAST_RESORT: {
        name: 'self-serve-discount',
        value: CANCEL.EVENT_VALUE.SELF_SERVE_DISCOUNT,
        requires: [],
    },
};

const PRIORITIZED_SUPPORT = [
    SUPPORT_BY.CHAT,
    SUPPORT_BY.SELF_SERVE_DISCOUNT,
    SUPPORT_BY.LAST_RESORT,
];

export const SupportOptionHelpers = {
    isIntercomLoaded: () => {
        return typeof Intercom === 'function';
    },
};

const _filterOut = (option, condition, supportType) =>
    condition ? true : option.requires.indexOf(supportType) === -1;

// enabledFeatures is the output of checkCancelFlowFeatures
// ie: {chat: true}
export function bestSupportOption(countryCode, enabledFeatures) {
    const hasIntercom = SupportOptionHelpers.isIntercomLoaded();
    const supportOptions = [...PRIORITIZED_SUPPORT]
        //filter out what optimizely turns off
        .filter((option) => _filterOut(option, enabledFeatures.chat, CHAT_SUPPORT))
        .filter((option) =>
            _filterOut(
                option,
                enabledFeatures.self_serve_with_discount ||
                enabledFeatures.self_serve_with_discount_low_grc,
                SELF_SERVE_DISCOUNT_SUPPORT
            )
        )
        //filter out chat if intercom is disabled
        .filter((option) => _filterOut(option, hasIntercom, CHAT_SUPPORT));

    if (supportOptions.length === 0) {
        throw Error('Unexpected no support options remaining');
    }
    return supportOptions[0].name;
}

export function _supportTypeValue(supportType) {
    const supportOption = Object.values(SUPPORT_BY).find(
        (option) => option.name === supportType
    );

    if (supportOption === undefined) {
        reportError(Error(`Unrecognized support type: ${supportType}`), {
            tags: {
                cancelEvent: true
            },
        });
        return supportType;
    } else {
        return supportOption.value;
    }
}

export function commonCancellationEventProps(
    countryCode,
    region,
    subscription,
    grcModel,
    enabledFeatures
) {
    const has_intercom = SupportOptionHelpers.isIntercomLoaded();
    const {
        score,
        type,
        day,
        fullModel
    } = grcModel || {
        score: null,
        type: null,
        day: null,
        fullModel: null,
    };
    const {
        chat,
        self_serve_with_discount,
        self_serve_with_discount_low_grc
    } =
    enabledFeatures || {};

    return {
        auto_renew_eligible: SubscriptionHelper.isAutoRenewEligible(subscription),
        campaign_name: _.get(subscription, 'campaign_name'),
        cancel_flow_version: 8,
        country: countryCode,
        region: region,
        has_intercom,
        eligible_for_refund: SubscriptionHelper.isEligibleForRefund(subscription),
        enrolled_at: _.get(subscription, 'created_at', ''),
        first_payment_length: SubscriptionHelper.firstPaymentLength(subscription),
        has_paid: SubscriptionHelper.hasPaid(subscription),
        nd_key: SubscriptionHelper.getNanodegreeKey(subscription),
        nd_title: SubscriptionHelper.getNanodegreeTitle(subscription),
        payment_method: SubscriptionHelper.getPaymentMethod(subscription),
        payment_plan_type: _.get(subscription, 'payment_plan.type', ''),
        purchase_urn: SubscriptionHelper.getSubscriptionURN(subscription),
        optimizely_chat_enabled: chat,
        optimizely_self_serve_discount_enabled: self_serve_with_discount,
        optimizely_self_serve_discount_low_grc_enabled: self_serve_with_discount_low_grc,
        grc_model: fullModel,
        grc_score: score,
        grc_score_type: type,
        grc_model_day: day,
    };
}

export function _sendCancelEvent(
    commonEventProps,
    eventName,
    supportType,
    extraProps
) {
    const value = _supportTypeValue(supportType);

    return sendSegmentProxyEvent(eventName, {
        ...commonEventProps,
        ...extraProps,
        value,
        category: value,
    }).catch((e) => {
        reportError(e, {
            tags: {
                cancelEvent: true,
                eventName
            }
        });
    });
}

export function sendModalOpenEvent(commonEventProps, supportType) {
    _sendCancelEvent(
        commonEventProps,
        CANCEL.EVENT_NAME.CANCEL_CLICKED,
        supportType
    );
}

export function sendModalCloseEvent(commonEventProps, supportType) {
    _sendCancelEvent(
        commonEventProps,
        CANCEL.EVENT_NAME.MODAL_CLOSED,
        supportType
    );
}

export function sendCancelRequestInitiated(
    commonEventProps,
    supportType,
    label,
    extraProps
) {
    _sendCancelEvent(commonEventProps, CANCEL.EVENT_NAME.REQUESTED, supportType, {
        label,
        ...extraProps,
    });
}

export function sendCancelDiscountEvent(
    commonEventProps,
    supportType,
    label,
    extraProps
) {
    _sendCancelEvent(commonEventProps, CANCEL.EVENT_NAME.DISCOUNT, supportType, {
        label,
        ...extraProps,
    });
}

export function setAllFeaturesTo(val) {
    return Object.entries(CANCEL.FEATURES).reduce((result, [key]) => {
        result[key] = val;
        return result;
    }, {});
}

// transform {chat: 'cancel_chat_flow', ...} -> {chat: false, ...}
export function checkCancelFlowFeatures(
    fetchPredictionsFn,
    checkFeaturesFn, {
        userId,
        subscription
    }
) {
    const keys = Object.values(CANCEL.FEATURES);
    let attributes = {};
    const {
        COUNTRY_CODE,
        REGION,
        RETENTION_PROBABILITY,
        TEST_USER,
    } = CANCEL.ATTRIBUTES;
    attributes[COUNTRY_CODE] = SubscriptionHelper.getCountryCode(subscription);
    attributes[REGION] = SubscriptionHelper.getRegion(subscription);
    attributes[TEST_USER] = cookies.get(CONFIG.optimizelyTestCookie);

    //TODO: promise.race for 1 second, if too slow, return error
    return fetchPredictionsFn()
        .then(
            (predictions) => predictions,
            // If the prediction service encountered an error then consider that
            // to be the empty prediction set when handling the cancel flow feature
            // flags.
            (e) => {
                console.error('Error fetching a prediction. ', e && e.message);
            }
        )
        .then((predictions) => {
            // Add the users retain probability to the list of attributes.
            const retainModel = PredictionHelper.getGrcModel(
                predictions,
                1 /* default to expect retaining if otherwise unknown */
            );
            attributes[RETENTION_PROBABILITY] = retainModel.score;
            return checkFeaturesFn(userId, keys, attributes);
        })
        .then((features) => {
            return Object.entries(CANCEL.FEATURES).reduce((result, [key, value]) => {
                // Optimizely does not distinguish between a feature name not found
                // and a feature name found but set to false for this user
                // For performance we are using the /enabled-features endpoint
                // so a missing feature[value] indicates false | name-not-found
                result[key] = !!features[value];
                return result;
            }, {});
        })
        .catch((e) => {
            reportError(e, {
                tags: {
                    cancelEvent: true
                }
            });
            return setAllFeaturesTo(null);
        });
}

export async function checkDiscountOfferEligibility(
    subscriptionUrn,
    declinedOffer
) {
    let is_eligible = false;
    let discount_amount_display = '';
    let subtotal_amount_display = '';
    let refunded_amount_display = '';

    try {
        ({
            is_eligible,
            discount_amount_display,
            subtotal_amount_display,
            refunded_amount_display,
        } = await BraavosService.isDiscountEligible(
            subscriptionUrn,
            declinedOffer
        ));
    } catch (error) {
        reportError(error, {
            tags: {
                cancelEvent: true
            }
        });
    }

    return {
        discountOfferEligible: is_eligible,
        discountDisplayPrice: discount_amount_display,
        subtotalDisplayAmount: subtotal_amount_display,
        refundDisplayAmount: refunded_amount_display,
    };
}

export async function generateDiscountCoupon(subscriptionUrn, declinedOffer) {
    let success = false;
    try {
        ({
            success
        } = await BraavosService.applySubscriptionDiscount(
            subscriptionUrn,
            declinedOffer
        ));
    } catch (error) {
        reportError(error, {
            tags: {
                cancelEvent: true
            }
        });
    }

    return success;
}