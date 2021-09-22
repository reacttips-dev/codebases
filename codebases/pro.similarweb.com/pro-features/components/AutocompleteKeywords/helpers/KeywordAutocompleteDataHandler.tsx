import { ISite } from "components/Workspace/Wizard/src/types";
import { uniqBy } from "lodash";
import { DefaultFetchService } from "services/fetchService";
import { IAutocompleteKeyword } from "components/AutocompleteKeywords/types/AutocompleteKeywordGroupTypes";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import { RecentService } from "services/recent/recentService";

export const getAutocompleteKeywordsForQuery = async (
    query: string,
    fetchService: DefaultFetchService,
) => {
    try {
        return await fetchService.get<ISite[]>(
            `/autocomplete/keywords?size=20&term=${query}&webSource=Desktop&validate=true`,
        );
    } catch (e) {
        return [];
    }
};

const KEYWORDS_RECENT_TYPE = "keyword";

const keywordsTypeAndNonKeywordsGroupFilter = ({ data }) => {
    const { type, keyword } = data;
    return type === KEYWORDS_RECENT_TYPE && !KeywordsGroupUtilities.isKeywordsGroupByName(keyword);
};

export const getAutocompleteRecentKeywordSearches = (): IAutocompleteKeyword[] => {
    const recent = RecentService.getRecents();
    const keywordsTypeAndNonKeywordsGroupRecent = recent.filter(
        keywordsTypeAndNonKeywordsGroupFilter,
    );
    const recentKeywordSearches = keywordsTypeAndNonKeywordsGroupRecent.reduce(
        (results, { data: { keyword } }) => [...results, { name: keyword }],
        [],
    );
    const autocompleteRecentKeywordSearches = uniqBy<IAutocompleteKeyword>(
        recentKeywordSearches,
        "name",
    );
    return autocompleteRecentKeywordSearches;
};
