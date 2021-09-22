import { isFeatureEnabled } from 'owa-feature-flags';
export default function isSkypeEnabled(): boolean {
    return (
        !isFeatureEnabled('fwk-partner-code-off') &&
        (isFeatureEnabled('fwk-skypeConsumer') || isFeatureEnabled('fwk-skypeBusinessV2'))
    );
}
