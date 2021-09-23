import optimizely from '@optimizely/optimizely-sdk';
import {
    OPTIMIZELY_KEY,
    OPTIMIZELY_LOG_LEVEL
} from '../env';
import {
    isLocalStorageAvailable
} from '../util';

// TODO: Make this better
/**
 * List of experiments that we are currently running
 * That should send the experiement related pings to
 * our tracking
 */
const experiments = ['editor_show_preview'];

/**
 * Manages feature rollouts using the Optimizely SDK as well as localStorage.
 */
export default function Rollouts(I, self) {
    let optimizelyInstance = null;
    if (OPTIMIZELY_KEY) {
        optimizelyInstance = optimizely.createInstance({
            sdkKey: OPTIMIZELY_KEY,
            logger: optimizely.logging.createLogger({
                logLevel: OPTIMIZELY_LOG_LEVEL || optimizely.enums.LOG_LEVEL.INFO,
            }),
        });
    }

    return self.extend({
        /**
         * Check if an Optimizely feature rollout is enabled for the current user.
         *
         * This only supports userId-based audiences for now, and does not yet support audiences relying on features such as whether
         * the user is in the testing team.
         */
        isFeatureEnabled(featureName) {
            const override = self.getFeatureOverride(featureName);
            let enabled;

            if (override === undefined || override === null) {
                enabled =
                    optimizelyInstance ? .isFeatureEnabled(featureName, String(self.currentUser() ? .id()), {
                        userId: String(self.currentUser() ? .id())
                    }) || false;
            } else {
                enabled = override;
            }
            if (experiments.includes(featureName)) {
                self.analytics.track('Experiment Viewed', {
                    experiment_name: featureName,
                    variation_name: enabled ? 'variant' : 'baseline', // the other one is "control"
                });
            }
            return enabled;
        },

        /**
         * Get the override value for a feature stored in localStorage. Override
         * values are set either by application.setFeatureOverride, or by the /secrets
         * page on the DotCom site.
         */
        getFeatureOverride(featureName) {
            if (!isLocalStorageAvailable()) {
                return false;
            }

            const communityPrefs = JSON.parse(window.localStorage.getItem('community-userPrefs'));
            return communityPrefs ? .optimizelyOverrides ? .[featureName];
        },

        /**
         * Store an override value in localStorage for a feature rollout. These values
         * are shared with DotCom via localStorage and can be set there from the /secrets
         * page.
         *
         * To enable or disable a feature rollout, set the override to true or false:
         *
         *   application.setFeatureOverride('my-test-feature', true)
         *
         * To reset an override so that the Optimizely rollout logic is used again,
         * set the override to undefined:
         *
         *   application.setFeatureOverride('my-test-feature', undefined)
         */
        setFeatureOverride(featureName, value) {
            if (!isLocalStorageAvailable()) {
                return;
            }

            const communityPrefs = JSON.parse(window.localStorage.getItem('community-userPrefs')) || {};
            if (!communityPrefs.optimizelyOverrides) {
                communityPrefs.optimizelyOverrides = {};
            }
            communityPrefs.optimizelyOverrides[featureName] = value;
            window.localStorage.setItem('community-userPrefs', JSON.stringify(communityPrefs));
        },
    });
}