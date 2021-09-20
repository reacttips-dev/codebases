import Analytics from '@udacity/ureact-analytics';
import AuthenticationService from 'services/authentication-service';

export default {
    trackNavLink(action, eventName, root) {
        const user_id = AuthenticationService.getCurrentUserId();
        const opts = {
            user_id,
            cohort_id: _.get(root, 'cohort_id'),
            nanodegree_key: _.get(root, 'key'),
            term_id: _.get(root, 'term_id'),
        };
        this.track(eventName, opts);
        action();
    },
    track(eventName, opts, integrations, callback) {
        Analytics.track(eventName, opts, integrations, callback);
    },
    page(eventName, properties) {
        Analytics.page('classroom', eventName, properties);
    },
    identify(user) {
        Analytics.identify({
            id: user.key || user.uid,
            email: user.email
        });
    },
};