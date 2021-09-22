import {
    getOptionsForFeature,
    OwsOptionsFeatureType,
    ConfettiOptions,
} from 'owa-outlook-service-options';

export default function isConfettiEnabled(): boolean {
    return getOptionsForFeature<ConfettiOptions>(OwsOptionsFeatureType.Confetti).confettiEnabled;
}
