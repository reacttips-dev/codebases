import type OwsOptionsBase from '../store/schema/OwsOptionsBase';
import { OwsOptionsFeatureType } from '../store/schema/OwsOptionsFeatureType';

export function isOwsOptionsBase(option: any): option is OwsOptionsBase {
    return option?.feature in OwsOptionsFeatureType;
}
