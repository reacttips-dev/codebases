import trieStore from '../store/store';
import type PeopleSuggestionTrieStore from '../store/schema/PeopleSuggestionTrieStore';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { mutatorAction } from 'satcheljs';
import { createFeatureStore } from './createFeatureStore';
import {
    setDynamicModel,
    dynamicFeatureIndexMap,
    setFuzzyCharSwapsData,
    constructSuggestionTrie,
    featureStores,
} from '3s-featurisers';
import getPeopleModelFromServer from 'owa-substrate-people-suggestions/lib/actions/getPeopleModelFromServer';
import isEmailAddressMasked from 'owa-substrate-people-suggestions/lib/utils/isEmailAddressMasked';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import getKeyForSuggestion from './getKeyForSuggestion';

export interface InitializeSuggestionTrieState {
    store: PeopleSuggestionTrieStore;
}

export default wrapFunctionForDatapoint(
    {
        name: 'RecipientTrieInitialization',
    },
    async function initializeSuggestionTrie(
        cacheResults: PersonaType[],
        state: InitializeSuggestionTrieState = { store: trieStore }
    ): Promise<boolean> {
        if (!cacheResults || cacheResults.length == 0) {
            return false;
        }

        // Get dynamic model from server
        let modelResponse = await getPeopleModelFromServer();

        if (modelResponse == null) {
            logUsage('setDynamicModel_RankerModelVersion', ['']);
            return false;
        }

        let modelName = setDynamicModel(modelResponse);
        logUsage('setDynamicModel_RankerModelVersion', [modelName]);

        setFuzzyCharSwapsData(modelResponse.Mispellings);

        createFeatureStore(cacheResults, dynamicFeatureIndexMap);
        setRecipientTrie(state.store, cacheResults);

        let statistics = state.store.recipientTrie.getStatistics();
        logUsage('RecipientSuggestionTrie', [statistics.numberOfNodes, statistics.numberOfIndices]);
        return true;
    }
);

const setRecipientTrie = mutatorAction(
    'setRecipientTrie',
    (store: PeopleSuggestionTrieStore, cacheResults: PersonaType[]) => {
        store.recipientTrie = constructSuggestionTrie(
            orderTrieSuggestions(cacheResults),
            getKeyForSuggestion,
            isEmailAddressMasked
        );
    }
);

function orderTrieSuggestions(trieSuggestion: PersonaType[]): PersonaType[] {
    trieSuggestion.sort((a, b) => getExperimentalScore(b) - getExperimentalScore(a));
    return trieSuggestion;
}

function getExperimentalScore(person: PersonaType): number {
    let suggestionKey = getKeyForSuggestion(person);
    let featureStore = featureStores.get(suggestionKey);
    return featureStore[dynamicFeatureIndexMap.getFeatureIndex('173')];
}
