import {
    FLEX_SUBSCRIPTION
} from 'constants/payment-status';
import PaymentsHelper from 'helpers/payments-helper';
import _ from 'lodash';

function _commonSubcriptionAndPurchaseProperties(thing, segmentTags) {
    const properties = {
        category: segmentTags.category || null,
        label: segmentTags.label || null,
        product_key: thing.product_key,
        variant: thing.product_variant,
        name: thing.name,
        price: thing.amount / 100,
        currency: thing.currency,
    };

    // add properties for flex subscriptions
    if (thing.type === FLEX_SUBSCRIPTION) {
        const purchasedProduct = _.get(thing, 'purchased_products[0]') || {};
        properties.term_id = purchasedProduct.term_id;
        properties.cohort_id = purchasedProduct.cohort_id;
        properties.product_key = purchasedProduct.nanodegree_key;
        properties.type = thing.type;
        properties.price = PaymentsHelper.getDisplayPrice(
            _.get(thing, 'original_price.display', '')
        );
        properties.name = thing.purchased_product_description;
        properties.purchase_urn = thing.urn;
    }
    return properties;
}

const AnalyticsHelper = {
    getSubscriptionData(subscription, segmentTags = {}) {
        if (subscription) {
            return {
                ..._commonSubcriptionAndPurchaseProperties(subscription, segmentTags),
                subscription_id: subscription.id,
                sku: subscription.product_key,
            };
        }
        return {};
    },

    getCourseData(course, segmentTags = {}) {
        if (course) {
            return {
                course_id: course.id,
                category: segmentTags.category || null,
                label: segmentTags.label || null,
                is_graduated: course.is_graduated,
                title: course.title,
            };
        }
        return {};
    },
};

export default AnalyticsHelper;