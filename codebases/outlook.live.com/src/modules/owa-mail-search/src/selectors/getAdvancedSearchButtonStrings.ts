import { searchRefinersMoreInfoAriaLabel } from '../components/advancedSearch/AdvancedSearch.locstring.json';
import { searchRefinersButtonTitle } from 'owa-locstrings/lib/strings/searchrefinersbuttontitle.locstring.json';
import loc, { format } from 'owa-localize';
import isAttachmentsRefinerApplied from './isAttachmentsRefinerApplied';
import isDateRefinerApplied from './isDateRefinerApplied';
import { getStore } from '../store/store';
import getSearchScopeDisplayName from '../utils/getSearchScopeDisplayName';

export interface AdvancedSearchButtonStrings {
    ariaLabel: string;
    buttonTitle: string;
}

export default function getAdvancedSearchButtonStrings(): AdvancedSearchButtonStrings {
    const staticSearchScope = getStore().staticSearchScope;

    // If staticSearchScope hasn't been initialized yet, return empty strings.
    if (!staticSearchScope) {
        return {
            ariaLabel: '',
            buttonTitle: '',
        };
    }

    // Get the folder name
    const searchScopeNameToShow = getSearchScopeDisplayName(staticSearchScope);

    let appliedRefinersCount = 0;
    isAttachmentsRefinerApplied() ? appliedRefinersCount++ : null;
    isDateRefinerApplied() ? appliedRefinersCount++ : null;

    return {
        ariaLabel: format(
            loc(searchRefinersMoreInfoAriaLabel),
            searchScopeNameToShow,
            appliedRefinersCount
        ),
        buttonTitle: loc(searchRefinersButtonTitle),
    };
}
