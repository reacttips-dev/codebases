import _ from "lodash";

export enum SearchTypes {
    WEBSITE,
    MOBILE,
    PLAYKEYWORD,
    UNIVERSAL,
    KEYWORD,
    INDUSTRY,
}

const SEARCH_TYPE_TO_NAME = {
    [SearchTypes.WEBSITE]: "Website",
    [SearchTypes.MOBILE]: "Mobile Apps",
    [SearchTypes.PLAYKEYWORD]: "Play Keywords",
    [SearchTypes.UNIVERSAL]: "Universal",
    [SearchTypes.KEYWORD]: "Keyword",
    [SearchTypes.INDUSTRY]: "Industry",
};

export type SearchTypesHelperService = {
    standardSearchType(searchType: string): number;
    searchTypeName(searchType: string): string | null;
};

export function createSearchTypesHelperService(): SearchTypesHelperService {
    const searchTypeMatch = _.curry((searchType: string, type: string) => {
        return searchType.toLowerCase().indexOf(type.toLowerCase()) > -1;
    });

    // Returns the number in the searchTypes obj
    function standardSearchType(searchType: string): number {
        const matchesWith = searchTypeMatch(searchType);
        let type: number;

        if (matchesWith("website")) {
            type = SearchTypes.WEBSITE;
        }

        if (matchesWith("mobile")) {
            type = SearchTypes.MOBILE;
        }

        if (matchesWith("playKeyword")) {
            type = SearchTypes.PLAYKEYWORD;
        }

        if (matchesWith("keyword")) {
            type = SearchTypes.KEYWORD;
        }

        if (matchesWith("industry")) {
            type = SearchTypes.INDUSTRY;
        }

        if (matchesWith("universal")) {
            type = SearchTypes.UNIVERSAL;
        }

        return type;
    }

    function searchTypeName(searchType: string | number): string | null {
        if (typeof searchType === "number") {
            return SEARCH_TYPE_TO_NAME[searchType];
        }

        if (typeof searchType === "string") {
            return SEARCH_TYPE_TO_NAME[standardSearchType(searchType)];
        }

        return null;
    }

    return {
        searchTypeName,
        standardSearchType,
    };
}

export default createSearchTypesHelperService();
