export const getModal = (moduleName: string) => {
    switch (moduleName) {
        case "websites":
        case "websites-root":
            return "WebsiteAnalysis";
        case "industryAnalysis":
            return "WebCategoryAnalysis";
        case "keywordAnalysis":
            return "SearchKeywordAnalysis";
        case "apps":
            return "AppAnalysis";
        case "appcategory":
            return "AppCategoryAnalysis";
        case "keywords":
            return "GooglePlayKeywords";
        case "dashboard":
            return "CustomDashboards";
        case "eventFeed":
            return "NewsFeed";
        case "leadGenerator":
            return "LeadGenerator";
        case "cig":
            return "CIG";
        case "conversion":
            return "ConversionModule";
    }

    return moduleName;
};
