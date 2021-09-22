const createTargetAccountsTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    const trackStaticListAction = (eventName: string, eventValue: number) => {
        track("accounts lists", "click", `${eventName}/static list/${eventValue}`);
    };

    const trackSavedSearchAction = (eventName: string, eventValue?: number) => {
        track(
            "saved searches",
            "click",
            `${eventName}/saved search${eventValue ? `/${eventValue}` : ""}`,
        );
    };

    return {
        trackStaticListClicked(numberOfDomains: number) {
            trackStaticListAction("existing list", numberOfDomains);
        },
        trackAddListClicked(numberOfTrackingDomains: number) {
            trackStaticListAction("add list", numberOfTrackingDomains);
        },
        trackSavedSearchClicked(numberOfResults: number) {
            trackSavedSearchAction("existing list", numberOfResults);
        },
        trackNewSearchClicked() {
            trackSavedSearchAction("add list");
        },
    };
};

export default createTargetAccountsTrackingService;
