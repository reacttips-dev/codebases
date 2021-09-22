const createSimilarSitesTrackingService = (
    track: (category: string, action: string, name: string) => void,
    prospectDomain: string,
) => {
    const trackWithDefaultCategory = (action: string, name: string) => {
        track("similar sites panel", action, name);
    };

    const withProspectDomain = (eventName: string) => {
        return `${eventName}/${prospectDomain}`;
    };

    return {
        trackPanelOpenedViaToolbar(numberOfSimilarSites: number) {
            trackWithDefaultCategory(
                "expand panel",
                withProspectDomain(`similar sites expand/${numberOfSimilarSites}`),
            );
        },
        trackPanelOpenedViaEmptyState(benchmarkModeName: string) {
            trackWithDefaultCategory(
                "expand panel",
                withProspectDomain(`define competitors/${benchmarkModeName}`),
            );
        },
        trackAddWebsiteClicked(numberOfSimilarSites: number) {
            trackWithDefaultCategory(
                "open dropdown",
                withProspectDomain(`open websites dropdown/${numberOfSimilarSites}`),
            );
        },
        trackWebsiteAdded(domain: string) {
            trackWithDefaultCategory(
                "select website",
                withProspectDomain(`similar site add by user/${domain}`),
            );
        },
        trackWebsiteRemoved(domain: string) {
            trackWithDefaultCategory(
                "remove",
                withProspectDomain(`similar site remove by user/${domain}`),
            );
        },
        trackWebsiteLinkClicked(domain: string) {
            trackWithDefaultCategory("click", withProspectDomain(`redirect to domain/${domain}`));
        },
        trackApplyClicked() {
            trackWithDefaultCategory("apply", withProspectDomain("similar sites changed/"));
        },
        trackCancelClicked(numberOfSimilarSites: number) {
            trackWithDefaultCategory(
                "cancel",
                withProspectDomain(`similar sites changed/${numberOfSimilarSites}`),
            );
        },
    };
};

export default createSimilarSitesTrackingService;
