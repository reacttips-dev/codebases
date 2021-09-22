import { isFeatureEnabled } from 'owa-feature-flags';

export default function isCallingEnabled(): boolean {
    return isFeatureEnabled('fwk-skypeConsumer') || isFeatureEnabled('fwk-skypeBusinessCalling');
}
