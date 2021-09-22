import { getExtensibilityState } from 'owa-addins-store';

export default function getSelectedRegExMatches(regExMatches: {
    [index: string]: string[];
}): { [index: string]: string[] } {
    let selectedRegExMatches: { [index: string]: string[] } = {};
    if (regExMatches) {
        Object.keys(regExMatches).forEach(key => {
            if (regExMatches[key]) {
                selectedRegExMatches[key] = filterContextualMatchList(
                    regExMatches[key] as string[]
                );
            }
        });
    }
    return selectedRegExMatches;
}

function filterContextualMatchList(itemsToBeFiltered: string[]): string[] {
    const terms = getExtensibilityState().contextualCalloutState.selectedTerms;
    return terms.filter(term => itemsToBeFiltered.indexOf(term) >= 0);
}
