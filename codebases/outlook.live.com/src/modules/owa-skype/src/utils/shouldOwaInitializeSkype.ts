import { isFeatureEnabled } from 'owa-feature-flags';

// Function to determine if OWA code should initialize skype
export default () =>
    !isFeatureEnabled('fwk-partner-code-off') &&
    !isFeatureEnabled('fwk-skypeSuite') &&
    isFeatureEnabled('fwk-skypeConsumer');
