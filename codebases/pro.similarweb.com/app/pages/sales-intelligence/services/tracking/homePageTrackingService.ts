const createHomePageTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    const trackSearchBarAction = (eventName: string, domain: string) => {
        track("Search Bar", "click", `${eventName}/WEBSITE/${domain}`);
    };

    const trackTargetAccountsAction = (eventName: string) => {
        track("Win target accounts", "click", eventName);
    };

    return {
        trackRecentDomainClicked(domain: string) {
            trackSearchBarAction("recent", domain);
        },
        trackStaticListClicked(numberOfDomains: number) {
            trackTargetAccountsAction(`existing list/static list/${numberOfDomains}`);
        },
        trackSavedSearchClicked(numberOfResults: number) {
            trackTargetAccountsAction(`existing list/saved search/${numberOfResults}`);
        },
        trackViewAllClicked() {
            trackTargetAccountsAction("view all lists");
        },
        trackTargetAccountsClicked() {
            trackTargetAccountsAction("Win target accounts");
        },
        trackFindCompaniesClicked() {
            track("Find companies", "click", "Find companies");
        },
    };
};

export default createHomePageTrackingService;
