import {
    setOptionValue,
    setExtendedOptionValue,
    verifyAndSetOptionValues,
    assignOptionValue,
} from '../actions/publicActions';
import getStore from '../store/store';
import { extendObservable } from 'mobx';
import { mutator } from 'satcheljs';
import type { OwsOptionsFeatureType } from '../store/schema/OwsOptionsFeatureType';
import { isOwsOptionsBase } from '../utils/typeGuards';
import type OwsOptionsBase from '../store/schema/OwsOptionsBase';

import assign from 'object-assign';

mutator(assignOptionValue, msg => {
    const { feature, value } = msg;
    assign(getStore().options[feature], value);
});

mutator(setOptionValue, msg => {
    const { feature, value } = msg;
    setValue(feature, value);
});

mutator(setExtendedOptionValue, msg => {
    const { feature, value } = msg;
    extendObservable(getStore().options[feature], value);
});

mutator(verifyAndSetOptionValues, message => {
    const { potentialOptionValues } = message;
    for (let option of potentialOptionValues) {
        if (option && isOwsOptionsBase(option)) {
            setValue(option.feature, option);
        }
    }
});

function setValue(feature: OwsOptionsFeatureType, value: OwsOptionsBase) {
    getStore().options[feature] = value;
}
