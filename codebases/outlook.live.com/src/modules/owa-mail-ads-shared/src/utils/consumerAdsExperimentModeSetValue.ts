import type ConsumerAdsExperimentMode from 'owa-service/lib/contract/ConsumerAdsExperimentMode';

export default function consumerAdsExperimentModeSetValue(
    consumerAdsExperimentModeSet: ConsumerAdsExperimentMode
) {
    switch (consumerAdsExperimentModeSet) {
        case 'DisplayOffNativeOff':
            return 0x1;
        case 'DisplayOffNativeOther':
            return 0x2;
        case 'DisplayOffNativeInbox':
            return 0x3;
        case 'DisplayOnNativeOff':
            return 0x4;
        case 'DisplayOnNativeOther':
            return 0x5;
        case 'DisplayOnNativeInbox':
            return 0x6;
        case 'NoExperiment':
        default:
            return 0x0;
    }
}
