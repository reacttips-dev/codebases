/* eslint-disable @typescript-eslint/camelcase */
export enum ProductTours {
    Workspaces = 166236,
    WebAnalysis = 166148,
    WebAnalysisSearchOnly = 166257,
    LeadGenerator = 169855,
    StaticListPageSI1 = 233349,
    NewQueryBar = 179790,
    NewQueryBar_Compare = 179791,
    SearchInterestAnalysisQueryBar = 184509,
    AnalyzeKeywordsQueryBar = 184554,
    KeywordAnalysisQueryBar = 184563,
}

export enum ProductToursLocalStorageKeys {
    WorkspaceTour = "solutions-2.0-viewed-workspaces-tour",
    WebAnalysisFullTour = "solutions-2.0-viewed-web-analysis-tour",
    WebAnalysisSearchOnlyTour = "solutions-2.0-viewed-search-tour",
    LeadGeneratorTour = "solutions-2.0-viewed-lead-generator-tour",
    StaticListPageSI1Tour = "solutions-2.0-viewed-static-list-page-for-si1-tour",
    NewQueryBarTour = "solutions-2.0-viewed-query-bar-tour",
    NewQueryBar_CompareTour = "solutions-2.0-viewed-query-bar-compare-tour",
    SearchInterestAnalysisQueryBar = "solutions-2.0-viewed-search-interest-analysis-q-bar",
    AnalyzeKeywordsQueryBar = "solutions-2.0-viewed-analyze-keywords-q-bar",
    KeywordAnalysisQueryBar = "solutions-2.0-viewed-keyword-analysis-q-bar",
}

export const showIntercomTour = (tourType: ProductTours): void => {
    if (window.Intercom) {
        window.Intercom("startTour", tourType);
    }
};
