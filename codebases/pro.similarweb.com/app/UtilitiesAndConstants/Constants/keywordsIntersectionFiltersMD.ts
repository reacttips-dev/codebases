export enum EFiltersTypes {
    ALL_KEYWORDS,
    CORE_KEYWORDS,
    KEYWORD_WINS,
    KEYWORDS_OPPORTUNITIES,
    KEYWORD_LOSSES,
    COMPETITIVE_KEYWORDS,
}

export const keywordsIntersectionFiltersMD = {
    [EFiltersTypes.KEYWORD_WINS]: {
        apiValue: "0.8-1",
    },
    [EFiltersTypes.KEYWORDS_OPPORTUNITIES]: {
        apiValue: "0-0.01",
    },
    [EFiltersTypes.KEYWORD_LOSSES]: {
        apiValue: "0.01-0.2",
    },
    [EFiltersTypes.COMPETITIVE_KEYWORDS]: {
        apiValue: "0.2-0.6;0.2-0.6",
    },
};
