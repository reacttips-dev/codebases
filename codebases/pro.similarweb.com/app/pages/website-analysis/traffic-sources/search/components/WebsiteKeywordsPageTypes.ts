export enum EOrganicPaidFilterValues {
    IncludeOrganic,
    IncludePaid,
}

export enum EBrandedNonBrandedValues {
    IncludeBranded,
    IncludeNoneBranded,
}

export interface IWebsiteKeywordsPageFilters {
    IncludeBranded: boolean;
    IncludeNewKeywords: boolean;
    IncludeNoneBranded: boolean;
    IncludeOrganic: boolean;
    IncludePaid: boolean;
    IncludeQuestions: boolean;
    IncludeTrendingKeywords: boolean;
    filter?: object;
    limits: string;
    family: string;
    source: string;
    webSource: string;
    duration: string;
    country: string;
    keys: string;
    selectedPhrase: string;
    volumeFromValue: string;
    volumeToValue: string;
    cpcFromValue: string;
    cpcToValue: string;
    serp: string[];
    ranking: string;
    includeSubDomains?: boolean;
}

export interface IWebsiteKeywordsPageTableData {
    Data?: any[];
    Records?: any[];
    TotalCount?: number;
    Header?: {
        total?: {
            organic: number;
            paid: number;
            total: number;
            percentage: number;
        };
        breakdown?: {
            [domain: string]: {
                percentage: number;
                value: number;
            };
        };
        flags?: {
            serpFailed: boolean;
        };
    };
    Filters?: {
        ChannelFilters: Array<{ count: number; id: string; text: string }>;
        SourcesFilter: Array<{ count: number; id: string; text: string }>;
        SerpFilter?: Array<{ count: number; id: string; text: string }>;
    };
}
