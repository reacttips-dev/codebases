import ExternalScriptLoader from 'helpers/external-script-loader';

export default {
    load() {
        return ExternalScriptLoader.promisedLoad(
            'https://js.stripe.com/v2/',
            'stripe-base'
        ).then(() => {
            window.Stripe.setPublishableKey(CONFIG.stripePublishableKey);
        });
    },

    createStripeToken(card) {
        return new Promise((resolve, reject) => {
            window.Stripe.card.createToken(card, (response, status) => {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(status.id);
                }
            });
        });
    },
};