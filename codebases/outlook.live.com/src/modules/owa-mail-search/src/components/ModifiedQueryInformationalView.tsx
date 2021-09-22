import getSearchQueryString from '../selectors/getSearchQueryString';
import getSearchScopeDisplayName from '../utils/getSearchScopeDisplayName';
import getSelectedSearchScope from '../utils/getSelectedSearchScope';
import { Link } from '@fluentui/react/lib/Link';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc, { formatToArray } from 'owa-localize';
import { searchNaturalLanguageFirstLine } from 'owa-locstrings/lib/strings/searchnaturallanguagefirstline.locstring.json';
import { searchNaturalLanguageOriginalQuery } from 'owa-locstrings/lib/strings/searchnaturallanguageoriginalquery.locstring.json';
import { searchNaturalLanguageSecondLine } from 'owa-locstrings/lib/strings/searchnaturallanguagesecondline.locstring.json';
import { onSearchTextChanged, startSearch } from 'owa-search-actions';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { lazyLogSearchEntityActions } from 'owa-search-instrumentation';
import { SubstrateSearchScenario } from 'owa-search-service';
import * as React from 'react';
import {
    didYouMeanLabel,
    spellerNoResults,
    modification,
    noResultsInFolder_1,
} from './ModifiedQueryInformationalView.locstring.json';
import isInteractiveFiltersEnabled from '../utils/isInteractiveFiltersEnabled';

import classNames from 'classnames';
import styles from './ModifiedQueryInformationalView.scss';

export interface ModifiedQueryInformationalViewProps {
    className: string;
}

export default observer(function ModifiedQueryInformationalView(
    props: ModifiedQueryInformationalViewProps
) {
    const { queryAlterationType } = getScenarioStore(SearchScenarioId.Mail);
    if (!queryAlterationType) {
        return null;
    }

    // Log that spelling suggestion was shown to the user.
    logUsage('Search_SearchSpellerRendered', [SearchScenarioId.Mail]);

    return (
        <div
            style={{ display: isInteractiveFiltersEnabled() ? 'flex' : 'block' }}
            className={classNames(
                styles.spellerLabel,
                isFeatureEnabled('sea-smallRecourse') && styles.smallRecourse,
                props.className
            )}>
            {getDRL()}
        </div>
    );
});

function changeSearchTerm() {
    onClick('Search_SearchSpellerClicked', getScenarioStore(SearchScenarioId.Mail).alteredQuery);
}

function onModificationRecourseLinkClicked() {
    onClick(
        'Search_OnModificationRecourseLinkClicked',
        getScenarioStore(SearchScenarioId.Mail).recourseQuery
    );
}

function onNaturalLanguageRecourseLinkClicked() {
    onClick(
        'Search_NaturalLanguageRecourseLinkClicked',
        getScenarioStore(SearchScenarioId.Mail).recourseQuery
    );
}

function onNoResultsInFolderRecourseLinkClicked() {
    onClick(
        'Search_NoResultsInFolderRecourseLinkClicked',
        getScenarioStore(SearchScenarioId.Mail).recourseQuery
    );
}

/**
 * Gets altered query string for UI (i.e. bolding corrected words in
 * query string).
 */
function getAlteredQueryString() {
    const { recourseQuery, flaggedTokens, alterationDisplayText } = getScenarioStore(
        SearchScenarioId.Mail
    );
    let modifiedRecourseQuery = recourseQuery;
    const pieces = [];

    if (alterationDisplayText) {
        pieces.push(<strong key={0}>{alterationDisplayText}</strong>);
        return pieces;
    }

    // Grab first part of string (if it doesn't start with a misspelled word).
    if (flaggedTokens && flaggedTokens[0].Offset > 0) {
        pieces.push(recourseQuery.substring(0, flaggedTokens[0].Offset));
    }

    // Iterate over flagged tokens returned by the service.
    for (let i = 0; i < flaggedTokens.length; i++) {
        const currentFlaggedToken = flaggedTokens[i];
        const { Suggestion: suggestion, Offset: offset, Length: length } = currentFlaggedToken;

        // Bold the correctly spelled version of the flagged token.
        pieces.push(<strong key={i}>{suggestion}</strong>);

        // Get the misspelled word from original query so we can remove it.
        const misspelledWord = modifiedRecourseQuery.substr(offset, length);

        // Split the query string so we only replace in the bad part.
        const properlySpelledPart = modifiedRecourseQuery.substring(0, offset);
        const partWithMisspelledWord = modifiedRecourseQuery.substring(offset);
        /**
         * Replace first instance of misspelled word in questionable part of
         * query with suggestion, and then merge the parts back together.
         */

        const regExp = new RegExp(misspelledWord);
        modifiedRecourseQuery =
            properlySpelledPart + partWithMisspelledWord.replace(regExp, suggestion);

        /**
         * Check if current flagged token is the last one. If it's not the
         * last one, add the correctly spelled bit between the 2 flagged
         * tokens. If it is the last one, just add the rest of the string.
         */
        const nextIndex = offset + suggestion.length;
        if (i < flaggedTokens.length - 1) {
            const nextFlaggedToken = flaggedTokens[i + 1];
            pieces.push(modifiedRecourseQuery.substring(nextIndex, nextFlaggedToken.Offset));
        } else {
            pieces.push(modifiedRecourseQuery.substring(nextIndex));
        }
    }

    return pieces;
}

/**
 * This function gets which version of the DRL (decisions representative
 * language) to display to the user.
 */

function getDRL() {
    const { queryAlterationType, recourseQuery: originalQuery } = getScenarioStore(
        SearchScenarioId.Mail
    );

    const linkLeftPaddingStyles = {
        root: {
            paddingLeft: isInteractiveFiltersEnabled() ? '4px' : 'unset',
        },
    };
    const linkLeftRightPaddingStyles = {
        root: {
            padding: isInteractiveFiltersEnabled() ? '0 4px' : 'unset',
        },
    };

    switch (queryAlterationType) {
        case 'Suggestion':
            return formatToArray(
                loc(didYouMeanLabel),
                <Link
                    key="suggestedSearchTerm"
                    onClick={changeSearchTerm}
                    styles={linkLeftPaddingStyles}>
                    {getAlteredQueryString()}
                </Link>
            );
        case 'NoResultModification':
            return formatToArray(
                loc(spellerNoResults),
                <Link
                    key="suggestedSearchTerm"
                    onClick={changeSearchTerm}
                    styles={linkLeftPaddingStyles}>
                    {getAlteredQueryString()}
                </Link>,
                <strong
                    className={classNames(
                        isInteractiveFiltersEnabled() && styles.noResultsQueryPadding
                    )}>
                    {originalQuery}
                </strong>
            );
        case 'NoRequeryModification':
            logUsage('Search_NaturalLanguageRecourseLinkRendered', [SearchScenarioId.Mail]);
            return (
                <>
                    <div
                        className={classNames(
                            isInteractiveFiltersEnabled() && styles.nlFirstLinePadding
                        )}>
                        {loc(searchNaturalLanguageFirstLine)}
                    </div>
                    {formatToArray(
                        loc(searchNaturalLanguageSecondLine),
                        <Link
                            key="naturalLanguageRecourseLink"
                            onClick={onNaturalLanguageRecourseLinkClicked}
                            styles={linkLeftRightPaddingStyles}>
                            <strong>{loc(searchNaturalLanguageOriginalQuery)}</strong>
                        </Link>
                    )}
                </>
            );
        case 'NoResultFolderRefinerModification':
            const searchScope = getSelectedSearchScope();
            const currentFolderName = getSearchScopeDisplayName(searchScope);
            logUsage('Search_NoResultsInFolderRecourseLinkRendered', [SearchScenarioId.Mail]);
            return formatToArray(
                loc(noResultsInFolder_1),
                <Link
                    key="noResultsInFolderRecourseLink"
                    onClick={onNoResultsInFolderRecourseLinkClicked}
                    styles={linkLeftPaddingStyles}>
                    <strong>{currentFolderName}</strong>
                </Link>
            );
        case 'Modification':
            logUsage('Search_ModificationRecourseLinkRendered', [SearchScenarioId.Mail]);
            return formatToArray(
                loc(modification),
                <strong
                    className={classNames(
                        isInteractiveFiltersEnabled() && styles.noResultsQueryPadding
                    )}>
                    {getAlteredQueryString()}
                </strong>,
                <Link
                    key="modificationRecourseLink"
                    onClick={onModificationRecourseLinkClicked}
                    styles={linkLeftPaddingStyles}>
                    <strong>{originalQuery}</strong>
                </Link>
            );
        default:
            return null;
    }
}

/**
 * Click handler for the link in the DRL.
 *
 * @param datapointName Datapoint to log for click on specific type
 * @param recourseQuery Text to update the search box with
 */
const onClick = (datapointName: string, recourseQuery: string) => {
    // Log that user clicked on recourse link.
    logClick(datapointName);

    const { queryAlterationType, alterationDisplayText } = getScenarioStore(SearchScenarioId.Mail);

    const currentQuery = getSearchQueryString();
    // Re-issue search with recourse query.
    if (currentQuery !== recourseQuery) {
        onSearchTextChanged(
            alterationDisplayText ? alterationDisplayText : recourseQuery,
            SearchScenarioId.Mail
        );
    }
    startSearch(
        queryAlterationType === 'Suggestion' || queryAlterationType === 'NoResultModification'
            ? 'QueryAlterationSuggestionLink'
            : 'QueryAlterationRecourseLink', // When action source is QueryAlterationRecourseLink alterations will be disabled in the subsquent query request (see createAlterationOptions.ts)
        SearchScenarioId.Mail
    );
};

/**
 * Handles instrumentation logging (both client datapoint and 3S instrumentation).
 *
 * @param datapointName The name of the client-side datapoint to log
 */
const logClick = (datapointName: string) => {
    const { suggestedSearchTermReferenceId, queryAlterationLogicalId } = getScenarioStore(
        SearchScenarioId.Mail
    );

    // Client-side datapoint
    logUsage(datapointName, [SearchScenarioId.Mail]);

    // 3S v2 instrumentation event
    lazyLogSearchEntityActions.importAndExecute(
        SubstrateSearchScenario.Mail,
        null /* userId */,
        null /* tenantId */,
        queryAlterationLogicalId,
        null /* traceId */,
        suggestedSearchTermReferenceId,
        'EntityClicked'
    );
};
