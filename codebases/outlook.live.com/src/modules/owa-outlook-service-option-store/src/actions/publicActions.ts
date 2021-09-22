import { action } from 'satcheljs';
import type { OwsOptionsFeatureType } from '../store/schema/OwsOptionsFeatureType';
import type OwsOptionsBase from '../store/schema/OwsOptionsBase';

export const setOptionValue = action(
    'setOptionValue',
    (feature: OwsOptionsFeatureType, value: OwsOptionsBase) => ({
        feature,
        value,
    })
);

export const assignOptionValue = action(
    'assignOptionValue',
    (feature: OwsOptionsFeatureType, value: OwsOptionsBase) => ({
        feature,
        value,
    })
);

export const verifyAndSetOptionValues = action(
    'verifyAndSetOptionValues',
    (potentialOptionValues: any[]) => ({
        potentialOptionValues,
    })
);

export const setExtendedOptionValue = action(
    'setOptionValue',
    (feature: OwsOptionsFeatureType, value: Partial<OwsOptionsBase>) => ({
        feature,
        value,
    })
);
