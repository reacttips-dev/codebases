import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import { featureStores, APF_PREFIX, dynamicFeatureIndexMap, getL2Features } from '3s-featurisers';
import getKeyForSuggestion from '../actions/getKeyForSuggestion';
import convertSuggestionToPersonaType from 'owa-recipient-suggestions/lib/util/convertSuggestionToPersonaType';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import { logUsage } from 'owa-analytics';

export function compareFeatureData(
    clientSideResults: FindRecipientPersonaType[],
    suggestionResponse: SubstrateSearchSuggestionsResponse
): string {
    let featureDifferences = new Map<string, Array<FeatureValueLog>>();

    if (!suggestionResponse) {
        logFeatureValueDifferences(
            featureDifferences,
            true /* serverResponseEmpty */,
            false /* serverResponseGroupsEmpty */
        );
        return '';
    }

    if (!suggestionResponse.Groups) {
        logFeatureValueDifferences(
            featureDifferences,
            false /* serverResponseEmpty */,
            true /* serverResponseGroupsEmpty */
        );
        return '';
    }

    try {
        // Create a map for server retrieved results to be able to retrieve them easily in the next for loop
        let clientSuggestions = clientSideResults.map(x => getKeyForSuggestion(x));
        let serverResultMap = new Map<string, FindRecipientPersonaType>();
        var serverResultArray: FindRecipientPersonaType[] = new Array();
        let missingSuggestionsFromClientSource = new Map<string, number>();
        let missingSuggestionsFromServerSource = new Map<string, number>();
        let l2Features = getL2Features();

        for (const group of suggestionResponse.Groups) {
            if (group.Type === 'People') {
                group.Suggestions.forEach(suggestion => {
                    const personaType = convertSuggestionToPersonaType(
                        suggestion,
                        suggestionResponse.Instrumentation?.TraceId,
                        true /*returnMaskedRecipients */
                    );
                    let suggestionKey = getKeyForSuggestion(personaType);
                    serverResultMap.set(suggestionKey, personaType);
                    serverResultArray.push(personaType);

                    let inClientSuggestions = clientSuggestions.includes(suggestionKey);
                    if (!inClientSuggestions) {
                        // Server Suggestion is missing from client results
                        let missingSource = personaType.FeatureData['PeopleSource'];
                        missingSuggestionsFromClientSource[
                            missingSource
                        ] = missingSuggestionsFromClientSource[missingSource]
                            ? missingSuggestionsFromClientSource[missingSource] + 1
                            : 1;
                    }

                    featureDifferences.set(
                        suggestionKey,
                        extractFeatureDifferencesAndUpdateClientSideFeatures(
                            suggestionKey,
                            <Map<string, number>>(<any>personaType.FeatureData),
                            inClientSuggestions,
                            l2Features
                        )
                    );
                });
                break;
            }
        }

        for (let clientSuggestion of clientSideResults) {
            let suggestionKey = getKeyForSuggestion(clientSuggestion);
            let serverSuggestion = serverResultMap.get(suggestionKey);
            let featureStore = featureStores.get(suggestionKey);

            if (!serverSuggestion) {
                // Client Suggestion is missing from server results
                let missingSource =
                    featureStore[dynamicFeatureIndexMap.getFeatureIndex('PeopleSource')];
                missingSuggestionsFromServerSource[
                    missingSource
                ] = missingSuggestionsFromServerSource[missingSource]
                    ? missingSuggestionsFromServerSource[missingSource] + 1
                    : 1;
            }
        }

        logFeatureValueDifferences(
            featureDifferences,
            false /* serverResponseEmpty */,
            false /* serverResponseGroupsEmpty */
        );

        logSuggestionsTrieRankerQuality(clientSideResults, serverResultArray);

        logUsage('SuggestionsTrie_missingSuggestions', [
            JSON.stringify(missingSuggestionsFromClientSource),
            JSON.stringify(missingSuggestionsFromServerSource),
        ]);

        return extractFeatureDifferenceStringFromDiffData(featureDifferences);
    } catch (e) {
        let failureString = ' { compareFeatureData failed: ' + e.toString() + ' } ';

        logUsage('SuggestionsTrie_compareFeatureData', [
            0 /* countOfContactsWithFVDiff */,
            0 /* countOfDifferentFeatures */,
            0 /* clientSideMissingFeatures */,
            0 /* serverSideMissingFeatures */,
            false /* serverResponseEmpty */,
            false /* serverResponseGroupsEmpty */,
            failureString /* overallFeatureDifferenceInfo */,
        ]);
        return failureString;
    }
}

function logSuggestionsTrieRankerQuality(
    clientSideResults: FindRecipientPersonaType[],
    serverResultArray: FindRecipientPersonaType[]
): void {
    var matchedPositions: number[] = [0, 0, 0, 0, 0];
    var numberOfOrderMismatches: number = 0;
    for (var i = 0; i < matchedPositions.length; i++) {
        if (!clientSideResults[i] || !serverResultArray[i]) {
            break;
        }

        let clientSuggestionKey = getKeyForSuggestion(clientSideResults[i]);
        let serverSuggestionKey = getKeyForSuggestion(serverResultArray[i]);

        if (clientSuggestionKey == serverSuggestionKey) {
            matchedPositions[i] = 1;
        } else {
            numberOfOrderMismatches += 1;
        }
    }

    logUsage('SuggestionsTrie_RankingQuality_CorrectMatches', matchedPositions);
    logUsage('SuggestionsTrie_RankingQuality_NumberOfOrderMismatches', [numberOfOrderMismatches]);
}

function extractFeatureDifferencesAndUpdateClientSideFeatures(
    suggestionKey: string,
    serverSideFeatures: Map<string, number>,
    inClientSuggestions: boolean,
    l2Features: string[]
): Array<FeatureValueLog> {
    let fvDiffList = new Array<FeatureValueLog>();
    let clientSidefeatures = featureStores.get(suggestionKey);

    if (!clientSidefeatures) {
        return fvDiffList;
    }

    const featureIndexMap = dynamicFeatureIndexMap.getFeatureIndexMap();
    for (let [key, value] of Object.entries(featureIndexMap)) {
        let clientSideFeatureValue = clientSidefeatures[value] ?? 0;
        let serverSideFeatureValue =
            retrieveServerSideFeatureValueForId(serverSideFeatures, key) ?? 0;

        if (clientSideFeatureValue != serverSideFeatureValue) {
            if (inClientSuggestions) {
                let fvLog = {
                    featureName: key,
                    clientSideFeatureId: value,
                    clientSideFeatureValue:
                        clientSideFeatureValue || clientSideFeatureValue == 0
                            ? clientSideFeatureValue.toString()
                            : '',
                    serversideFeatureValue:
                        serverSideFeatureValue || serverSideFeatureValue == 0
                            ? serverSideFeatureValue.toString()
                            : '',
                };
                fvDiffList.push(fvLog);
            }

            // If client side has a different feature value than server, override the client side values with the server one.
            // This is done to handle the case when browser is kept open for a long time and server side apf features are updated (and new values are not received by the client since browser is not refreshed)
            // We are only interested in updated L1 or context aware features
            if (l2Features.indexOf(key) == -1) {
                clientSidefeatures[value] = serverSideFeatureValue;
            }
        }
    }
    return fvDiffList;
}

function logFeatureValueDifferences(
    featureValueDifferences: Map<string, Array<FeatureValueLog>>,
    serverResponseEmpty: boolean,
    serverResponseGroupsEmpty: boolean
): void {
    let countOfContactsWithFVDiff = 0; // Count of suggestions for which server-client side features include difference(s)
    let countOfDifferentFeatures = 0; // Total count of features (among all suggestions) where server/client side values are different

    let clientSideMissingFeatures = 0; // Count of features where we have a valid value at server side but have no value at client side
    let serverSideMissingFeatures = 0; // Count of features where we have a valid value at client side but have no value at server side

    let overallFeatureDifferenceInfo = '';

    let dynamicFeatureValDiffCount = 0; // count of dynamic (non-apf) feature differences

    featureValueDifferences.forEach((value, key, _) => {
        if (value.length > 0) {
            countOfContactsWithFVDiff++;
        }
        countOfDifferentFeatures += value.length;

        let featureDifferenceInfo = '';
        for (let i = 0; i < value.length; i++) {
            if (value[i].clientSideFeatureValue == '' && value[i].serversideFeatureValue != '') {
                clientSideMissingFeatures++;
            } else if (
                value[i].serversideFeatureValue == '' &&
                value[i].clientSideFeatureValue != ''
            ) {
                serverSideMissingFeatures++;
            }

            if (value[i].clientSideFeatureValue != value[i].serversideFeatureValue) {
                featureDifferenceInfo +=
                    ' [ F: ' +
                    value[i].featureName +
                    ' C: ' +
                    value[i].clientSideFeatureValue +
                    ' S: ' +
                    value[i].serversideFeatureValue +
                    ' ] ';

                let clientSideFeatureName = value[i].featureName;
                if (clientSideFeatureName.substring(0, APF_PREFIX.length) != APF_PREFIX) {
                    // Difference is not in APF features, it is in dynamic features
                    dynamicFeatureValDiffCount++;
                }
            }
        }

        if (featureDifferenceInfo != '') {
            overallFeatureDifferenceInfo += ' { ' + featureDifferenceInfo + ' } ';
        }
    });

    if (overallFeatureDifferenceInfo == '') {
        overallFeatureDifferenceInfo = '{ No fv diff detected.}';
    }

    logUsage('SuggestionsTrie_compareFeatureData', [
        countOfContactsWithFVDiff,
        countOfDifferentFeatures,
        dynamicFeatureValDiffCount,
        clientSideMissingFeatures,
        serverSideMissingFeatures,
        serverResponseEmpty,
        serverResponseGroupsEmpty,
        overallFeatureDifferenceInfo,
    ]);
}

function retrieveServerSideFeatureValueForId(
    serverSideFeatures: Map<string, number>,
    clientSideFeatureName: string
): number {
    let serverSideId: string;

    let isAdvancedPreferFeature =
        clientSideFeatureName.substring(0, APF_PREFIX.length) === APF_PREFIX;

    if (isAdvancedPreferFeature) {
        // Extracting the APF feature ID
        serverSideId = clientSideFeatureName.substring(APF_PREFIX.length);
    }

    return serverSideFeatures[serverSideId ?? clientSideFeatureName];
}

function extractFeatureDifferenceStringFromDiffData(
    featureDiffData: Map<string, Array<FeatureValueLog>>
): string {
    let diffString: string = '';

    featureDiffData.forEach((value, key, _) => {
        let diffPerContact: string = '';
        for (let i = 0; i < value.length; i++) {
            diffPerContact +=
                ' Feature: ' +
                value[i].featureName +
                ' ClientVal: ' +
                value[i].clientSideFeatureValue +
                ' ServerVal: ' +
                value[i].serversideFeatureValue;
        }

        if (diffPerContact != '') {
            diffString += ' [ ' + key + ': ' + diffPerContact + ' ] ';
        }
    });

    if (diffString != '') {
        return ' { Detected Feature Value Differences: ' + diffString + ' }';
    }

    return '{ No feature value difference detected. }';
}

interface FeatureValueLog {
    featureName: string;
    clientSideFeatureId: number;
    clientSideFeatureValue: string;
    serversideFeatureValue: string;
}
