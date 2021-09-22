import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { FeatureStore, featureStores, FeatureIndexMap } from '3s-featurisers';
import getKeyForSuggestion from './getKeyForSuggestion';
import { logUsage } from 'owa-analytics';

export function createFeatureStore(people: PersonaType[], featureIndexMap: FeatureIndexMap): void {
    if (!people || people.length == 0) {
        return;
    }

    let numberOfSuggestionsWithFeatures = 0;
    let numberOfTotalFeatureValuesPresent = 0;
    people.forEach(person => {
        let suggestionKey = getKeyForSuggestion(person);

        // Do not refresh FeatureValues for existing candidates
        // They are not compatible with the static browse values
        if (!suggestionKey || featureStores.has(suggestionKey)) {
            return;
        }

        let featureStore: FeatureStore = {};
        if (person.FeatureData) {
            let featureData: Map<string, number> = <Map<string, number>>(<any>person.FeatureData);

            let features = Object.keys(featureData);
            features.forEach(function (x: string): void {
                if (featureIndexMap.isL1feature(x) || featureIndexMap.hasFeature(x)) {
                    featureStore[featureIndexMap.getFeatureIndex(x)] = featureData[x];
                }
            });

            numberOfTotalFeatureValuesPresent += features.length;
            ++numberOfSuggestionsWithFeatures;
        }

        featureStores.set(suggestionKey, featureStore);
    });

    logUsage('CreateFeatureStore', [
        people.length,
        numberOfSuggestionsWithFeatures,
        numberOfTotalFeatureValuesPresent,
    ]);
}
