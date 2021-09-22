import { isFeatureEnabled } from 'owa-feature-flags';

export function appendUserUpsellFlights() {
    let upsellFlights = 'ofc_flights=';

    if (isFeatureEnabled('iris-commercial-bizbar')) {
        upsellFlights = upsellFlights.concat('iris-commercial-bizbar;');
    }
    if (isFeatureEnabled('edge-iris-upsell-experiment')) {
        upsellFlights = upsellFlights.concat('edge-iris-upsell-experiment;');
    }

    return upsellFlights;
}
