import type ExpressionPickerViewState from './schema/ExpressionPickerViewState';
import type ExpressionStore from './schema/ExpressionStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';
import {
    getOptionsForFeature,
    OwsOptionsFeatureType,
    DiverseEmojisOptions,
} from 'owa-outlook-service-options';

let expressionStoreData: ExpressionStore = {
    expressionPickerViewStates: new ObservableMap<string, ExpressionPickerViewState>(),
    selectedSkinTone: getOptionsForFeature<DiverseEmojisOptions>(
        OwsOptionsFeatureType.DiverseEmojis
    ).diverseEmojisSelectedSkinTone,
    useFlexPane: null,
    isSxSDisplayed: null,
    primaryExpressionId: null,
};

export let getStore = createStore<ExpressionStore>('expression', expressionStoreData);

var expressionStore = getStore();
export default expressionStore;
