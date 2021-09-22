import getSubstrateSearchScenarioBySearchScenarioId from './getSubstrateSearchScenarioBySearchScenarioId';
import CategorySearchSuggestion from '../components/suggestions/categorySearchSuggestion/CategorySearchSuggestion';
import EventSearchSuggestion from '../components/suggestions/eventSearchSuggestion/EventSearchSuggestion';
import FileSearchSuggestion from '../components/suggestions/fileSearchSuggestions/FileSearchSuggestion';
import MessageSearchSuggestion from '../components/suggestions/messageSearchSuggestion/MessageSearchSuggestion';
import { PeopleSearchSuggestion } from '../components/suggestions/peopleSearchSuggestion/PeopleSearchSuggestion';
import TextSearchSuggestion from '../components/suggestions/textSearchSuggestion/TextSearchSuggestion';
import TrySearchSuggestion from '../components/suggestions/TrySearchSuggestion';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import loc from 'owa-localize';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import { lazyLogLocalContentLayout } from 'owa-search-service/lib/lazyFunctions';
import * as React from 'react';
import type {
    LocalContentLayout,
    LocalContentLayoutGroup,
} from 'owa-search-service/lib/actions/substrateSearchLogLocalContentEvents';
import SuggestionSet, {
    Suggestion,
    SuggestionKind,
    FileSuggestion,
} from 'owa-search-service/lib/data/schema/SuggestionSet';
import {
    lazyLogSearchSuggestionsClientLayoutEvent,
    ResultsView,
    ItemType,
    GroupName,
} from 'owa-search-instrumentation';
import {
    suggestionsHeader,
    potentialMatchesHeader,
    trySuggestionsHeader,
    recentFilesSuggestionsHeader,
    bestMatchSuggestionsHeader,
} from '../components/suggestions/searchSuggestion/SearchSuggestion.locstring.json';
import isModernFilesEnabled from './isModernFilesEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from '../components/suggestions/searchSuggestion/SearchSuggestion.scss';

/**
 * Build out the suggestions content.
 * Importantly: the order here needs to match the order that we set in the store in orderSuggestions!
 */
export default function getSuggestionCalloutContent(
    suggestionSet: SuggestionSet,
    scenarioId: SearchScenarioId,
    focusSearchInput: () => void
): JSX.Element[] {
    if (!suggestionSet) {
        return [];
    }

    const items: JSX.Element[] = [];
    const localContentLayoutGroups: { [groupType: string]: LocalContentLayout[] } = {};

    /**
     * We break up the suggestions into "Best Match" and non-"Best Match" because
     * "Best Match" suggestions are a subset of the other kinds of suggestions.
     * Since we don't want a suggestion that's marked as "Best Match" to appear
     * in another section, we'll pull them out.
     */
    const suggestions = suggestionSet.Suggestions;
    const bestMatchSuggestions = getBestMatchSuggestionGroup(suggestions);
    const nonBestMatchSuggestions = getNonBestMatchSuggestions(suggestions);

    const shouldShowHeaders = !isFeatureEnabled('sea-removeHeaders-qf');
    const trySuggestionGroup = getTrySuggestionGroup(nonBestMatchSuggestions);
    const searchExecutingSuggestions = getSearchExecutingSuggestionGroup(nonBestMatchSuggestions);
    const potentialMatchSuggestions = getPotentialMatchesSuggestionGroup(nonBestMatchSuggestions);
    const mruFileSuggestions = getMRUSuggestionGroup(nonBestMatchSuggestions);

    const scenarioStore = getScenarioStore(scenarioId);
    const traceId = suggestionSet.TraceId;

    // Used for sending 3S an object that details what was rendered
    const resultsView = [];
    let resultsViewGroupIndex = 1;

    // Try out suggestions in zero query suggestion callout
    if (trySuggestionGroup.length > 0) {
        shouldShowHeaders &&
            items.push(<div className={styles.header}>{loc(trySuggestionsHeader)}</div>);

        trySuggestionGroup.map((suggestion: Suggestion, index: number) => {
            addSuggestionComponent(
                items,
                suggestion,
                index,
                scenarioId,
                traceId,
                localContentLayoutGroups,
                focusSearchInput
            );
        });

        resultsView.push(getResultsView('Try', resultsViewGroupIndex, trySuggestionGroup, traceId));
        resultsViewGroupIndex++;
    }

    // Suggestions to elevate to the top of the list that go under the "Best Match" header
    if (bestMatchSuggestions.length > 0) {
        shouldShowHeaders &&
            items.push(<div className={styles.header}>{loc(bestMatchSuggestionsHeader)}</div>);

        bestMatchSuggestions.map((suggestion: Suggestion, index: number) => {
            // Need to account for first group of try suggestions.
            const adjustedIndex = trySuggestionGroup.length + index;
            addSuggestionComponent(
                items,
                suggestion,
                adjustedIndex,
                scenarioId,
                traceId,
                localContentLayoutGroups,
                focusSearchInput
            );
        });

        resultsView.push(
            getResultsView('TopHits', resultsViewGroupIndex, bestMatchSuggestions, traceId)
        );
        resultsViewGroupIndex++;
    }

    // Suggestions that go under the "Suggested Searches" header (i.e. suggestions that execute a search)
    if (searchExecutingSuggestions.length > 0) {
        shouldShowHeaders && addHorizontalDivider(items);
        shouldShowHeaders &&
            items.push(<div className={styles.header}>{loc(suggestionsHeader)}</div>);

        searchExecutingSuggestions.map((suggestion: Suggestion, index: number) => {
            // Need to account for first group of try suggestions.
            const adjustedIndex = trySuggestionGroup.length + bestMatchSuggestions.length + index;
            addSuggestionComponent(
                items,
                suggestion,
                adjustedIndex,
                scenarioId,
                traceId,
                localContentLayoutGroups,
                focusSearchInput
            );
        });

        // Build out the result view with the specific grouping that 3S requires
        // This means splitting out this grouping into sub-groups by the type of Suggestion
        const groups = searchExecutingSuggestions.reduce((suggestionsByKind, suggestion) => {
            const suggestionKind = suggestion.kind;

            if (!suggestionsByKind[suggestionKind]) {
                suggestionsByKind[suggestionKind] = [];
            }

            suggestionsByKind[suggestionKind].push(suggestion);
            return suggestionsByKind;
        }, {});

        for (let [suggestionKindForGroup, groupSuggestions] of Object.entries(groups)) {
            const groupName = getInstrumentationGroupName(suggestionKindForGroup as SuggestionKind);
            resultsView.push(
                getResultsView(groupName, resultsViewGroupIndex, groupSuggestions, traceId)
            );
            resultsViewGroupIndex++;
        }
    }

    // Suggestions that go under the "Potential matches" header (i.e. suggestions that are actually search results)
    if (potentialMatchSuggestions.length > 0) {
        shouldShowHeaders && addHorizontalDivider(items);
        shouldShowHeaders &&
            items.push(<div className={styles.header}>{loc(potentialMatchesHeader)}</div>);

        potentialMatchSuggestions.map((suggestion: Suggestion, index: number) => {
            // Need to account for first group of suggestions.
            const adjustedIndex =
                trySuggestionGroup.length +
                searchExecutingSuggestions.length +
                bestMatchSuggestions.length +
                index;

            addSuggestionComponent(
                items,
                suggestion,
                adjustedIndex,
                scenarioId,
                traceId,
                localContentLayoutGroups,
                focusSearchInput
            );
        });

        // Build out the result view with the specific grouping that 3S requires
        // This means splitting out this grouping into sub-groups by the type of Suggestion
        const groups = potentialMatchSuggestions.reduce((suggestionsByKind, suggestion) => {
            const suggestionKind = suggestion.kind;

            if (!suggestionsByKind[suggestionKind]) {
                suggestionsByKind[suggestionKind] = [];
            }

            suggestionsByKind[suggestionKind].push(suggestion);
            return suggestionsByKind;
        }, {});

        for (let [suggestionKindForGroup, groupSuggestions] of Object.entries(groups)) {
            const groupName = getInstrumentationGroupName(suggestionKindForGroup as SuggestionKind);
            resultsView.push(
                getResultsView(groupName, resultsViewGroupIndex, groupSuggestions, traceId)
            );
            resultsViewGroupIndex++;
        }
    }

    if (mruFileSuggestions.length > 0) {
        shouldShowHeaders && addHorizontalDivider(items);
        shouldShowHeaders &&
            items.push(<div className={styles.header}>{loc(recentFilesSuggestionsHeader)}</div>);

        mruFileSuggestions.map((suggestion: Suggestion, index: number) => {
            // Need to account for other groups of suggestions.
            const adjustedIndex =
                trySuggestionGroup.length +
                searchExecutingSuggestions.length +
                potentialMatchSuggestions.length +
                bestMatchSuggestions.length +
                index;

            addSuggestionComponent(
                items,
                suggestion,
                adjustedIndex,
                scenarioId,
                traceId,
                localContentLayoutGroups,
                focusSearchInput
            );
        });

        resultsView.push(
            getResultsView('File', resultsViewGroupIndex, mruFileSuggestions, traceId)
        );
        resultsViewGroupIndex++;
    }

    const substrateSearchScenarioId = getSubstrateSearchScenarioBySearchScenarioId(scenarioId);

    if (suggestionSet.IsComplete) {
        const logicalId = scenarioStore.traceIdToLogicalIdMap.get(traceId);

        lazyLogSearchSuggestionsClientLayoutEvent.importAndExecute(
            substrateSearchScenarioId,
            null /* Puid */,
            null /* TenantId */,
            logicalId,
            traceId,
            'Vertical',
            resultsView
        );
    }

    if (substrateSearchScenarioId !== SubstrateSearchScenario.Mail) {
        if (suggestionSet.IsComplete && Object.keys(localContentLayoutGroups).length > 0) {
            lazyLogLocalContentLayout.importAndExecute(
                traceId,
                localContentLayoutGroups,
                substrateSearchScenarioId
            );
        }
    }

    return items;
}

const getInstrumentationItemType = (suggestionKind: SuggestionKind): ItemType => {
    switch (suggestionKind) {
        case SuggestionKind.Category:
            return 'Category';
        case SuggestionKind.TrySuggestion:
            return 'Try';
        case SuggestionKind.Keywords:
            return 'TextualSuggestion';
        case SuggestionKind.People:
            return 'PeopleSuggestion';
        case SuggestionKind.File:
            return 'FileSuggestion';
        case SuggestionKind.Event:
            return 'EventSuggestion';
        case SuggestionKind.Message:
            return 'MessageSuggestion';
        case SuggestionKind.Setting:
            return 'Setting';
        default:
            return 'Unknown';
    }
};

const getInstrumentationGroupName = (suggestionKind: SuggestionKind): GroupName => {
    switch (+suggestionKind) {
        case SuggestionKind.Category:
            return 'Category';
        case SuggestionKind.TrySuggestion:
            return 'Try';
        case SuggestionKind.Keywords:
            return 'Text';
        case SuggestionKind.People:
            return 'People';
        case SuggestionKind.File:
            return isModernFilesEnabled() ? 'File' : 'Attachment';
        case SuggestionKind.Event:
            return 'Event';
        case SuggestionKind.Message:
            return 'Message';
        case SuggestionKind.Setting:
            return 'Setting';
        default:
            return 'Unknown';
    }
};

const getResultsView = (
    groupName: GroupName,
    position: number,
    suggestions: Suggestion[],
    traceId: string
) => {
    const resultsView: ResultsView[] = [];

    suggestions.forEach((suggestion, index) => {
        if (suggestion) {
            const itemType = getInstrumentationItemType(suggestion.kind);

            resultsView.push({
                type: 'Entity',
                referenceId: suggestion.ReferenceId,
                providerId: traceId,
                position: index + 1, // position starts from 1
                entityType: itemType,
                placementType: 'Visible',
            });
        }
    });

    return {
        layoutType: 'Vertical',
        type: 'Group',
        name: groupName,
        position,
        resultsView: resultsView,
    };
};

const getBestMatchSuggestionGroup = (suggestions: Suggestion[]): Suggestion[] => {
    return suggestions.filter((suggestion: Suggestion) => {
        return suggestion.BestMatchPosition !== -1 && suggestion.BestMatchPosition !== undefined;
    });
};

const getNonBestMatchSuggestions = (suggestions: Suggestion[]): Suggestion[] => {
    return suggestions.filter((suggestion: Suggestion) => {
        return suggestion.BestMatchPosition === -1 || suggestion.BestMatchPosition === undefined;
    });
};

const getSearchExecutingSuggestionGroup = (suggestions: Suggestion[]): Suggestion[] => {
    return suggestions.filter((suggestion: Suggestion) => {
        const suggestionKind = suggestion.kind;

        switch (suggestionKind) {
            case SuggestionKind.Keywords:
            case SuggestionKind.People:
            case SuggestionKind.PrivateDistributionList:
            case SuggestionKind.Category:
                return true;
            default:
                return false;
        }
    });
};

const getTrySuggestionGroup = (suggestions: Suggestion[]): Suggestion[] => {
    return suggestions.filter((suggestion: Suggestion) => {
        const suggestionKind = suggestion.kind;
        return suggestionKind === SuggestionKind.TrySuggestion;
    });
};

const getPotentialMatchesSuggestionGroup = (suggestions: Suggestion[]): Suggestion[] => {
    return suggestions.filter((suggestion: Suggestion) => {
        const suggestionKind = suggestion.kind;
        switch (suggestionKind) {
            case SuggestionKind.File:
                const fileSuggestionComponentType = getFileSuggestionComponentType(suggestion);
                return fileSuggestionComponentType !== 'MruFile';
            case SuggestionKind.Message:
            case SuggestionKind.Event:
                return true;
            default:
                return false;
        }
    });
};

const getMRUSuggestionGroup = (suggestions: Suggestion[]): Suggestion[] => {
    return suggestions.filter((suggestion: Suggestion) => {
        const suggestionKind = suggestion.kind;
        switch (suggestionKind) {
            case SuggestionKind.File:
                const fileSuggestionComponentType = getFileSuggestionComponentType(suggestion);
                return fileSuggestionComponentType === 'MruFile';
            default:
                return false;
        }
    });
};

const addSuggestionComponent = (
    items: JSX.Element[],
    suggestion: Suggestion,
    index: number,
    scenarioId: SearchScenarioId,
    traceId: string,
    localContentLayoutGroups: { [groupType: string]: LocalContentLayout[] },
    focusSearchInput?: () => void
) => {
    // Subset of SearchSuggestion props that all suggestions share.
    const sharedProps = {
        index: index,
        scenarioId: scenarioId,
        suggestionSetTraceId: traceId,
    };

    // Add the appropriate component based on suggestion kind.
    switch (suggestion.kind) {
        case SuggestionKind.People:
            items.push(<PeopleSearchSuggestion {...sharedProps} suggestion={suggestion} />);

            if (suggestion.Source === 'gal') {
                const galGroupType: LocalContentLayoutGroup = 'gal';
                if (!localContentLayoutGroups[galGroupType]) {
                    localContentLayoutGroups[galGroupType] = [];
                }

                // add to local content layout
                localContentLayoutGroups[galGroupType].push({
                    entityId: suggestion.ReferenceId,
                    position: index + 1,
                });
            }
            break;
        case SuggestionKind.Keywords:
            items.push(<TextSearchSuggestion {...sharedProps} suggestion={suggestion} />);
            break;
        case SuggestionKind.Message:
            items.push(<MessageSearchSuggestion {...sharedProps} suggestion={suggestion} />);
            break;
        case SuggestionKind.Category:
            items.push(<CategorySearchSuggestion {...sharedProps} suggestion={suggestion} />);

            const categoryGroupType: LocalContentLayoutGroup = 'category';
            if (!localContentLayoutGroups[categoryGroupType]) {
                localContentLayoutGroups[categoryGroupType] = [];
            }

            // add to local content layout
            localContentLayoutGroups[categoryGroupType].push({
                entityId: suggestion.ReferenceId,
                position: index + 1,
            });
            break;
        case SuggestionKind.File:
            items.push(
                <FileSearchSuggestion
                    {...sharedProps}
                    suggestion={suggestion}
                    focusSearchInput={focusSearchInput}
                />
            );
            break;
        case SuggestionKind.Event:
            items.push(<EventSearchSuggestion {...sharedProps} suggestion={suggestion} />);
            break;
        case SuggestionKind.TrySuggestion:
            items.push(<TrySearchSuggestion {...sharedProps} suggestion={suggestion} />);

            const tryGroupType: LocalContentLayoutGroup = 'try';
            if (!localContentLayoutGroups[tryGroupType]) {
                localContentLayoutGroups[tryGroupType] = [];
            }

            // add to local content layout
            localContentLayoutGroups[tryGroupType].push({
                entityId: suggestion.ReferenceId,
                position: index + 1,
            });
            break;
    }
};

const getFileSuggestionComponentType = (suggestion: Suggestion): string => {
    const fileSuggestion = suggestion as FileSuggestion;
    return fileSuggestion.LayoutHint;
};

const addHorizontalDivider = (items: JSX.Element[]) => {
    if (items.length > 0) {
        items.push(<hr className={styles.divider} />);
    }
};
