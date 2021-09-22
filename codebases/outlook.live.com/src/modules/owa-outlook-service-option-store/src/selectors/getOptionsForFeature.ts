import getStore from '../store/store';
import type OwsOptionsBase from '../store/schema/OwsOptionsBase';
import type { OwsOptionsFeatureType } from '../store/schema/OwsOptionsFeatureType';

export default function getOptionsForFeature<T extends OwsOptionsBase>(
    feature: OwsOptionsFeatureType
): T {
    return getStore().options[feature] as T;
}
