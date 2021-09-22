const createFindLeadsTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    const trackHomeLinkClicked = (name: string) => {
        track("find links", "click", name);
    };

    return {
        trackCompanySearchClicked() {
            trackHomeLinkClicked("company search");
        },
        trackIndustryLeadersClicked() {
            trackHomeLinkClicked("industry leaders");
        },
        trackTopicLeadersClicked() {
            trackHomeLinkClicked("topic leaders");
        },
        trackCompetitorsCustomersClicked() {
            trackHomeLinkClicked("competitors customers");
        },
    };
};

export default createFindLeadsTrackingService;
