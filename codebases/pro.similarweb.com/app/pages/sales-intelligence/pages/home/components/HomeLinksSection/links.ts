import { FIND_LEADS_PAGE_ROUTE, MY_LISTS_PAGE_ROUTE } from "../../../../constants/routes";
import createHomePageTrackingService from "../../../../services/tracking/homePageTrackingService";

export const getHomeLinks = <NAV extends { go(key: string): void }>(
    navigator: NAV,
    trackingService: ReturnType<typeof createHomePageTrackingService>,
) => {
    return [
        {
            onClick() {
                trackingService.trackTargetAccountsClicked();
                navigator.go(MY_LISTS_PAGE_ROUTE);
            },
            name: "addStaticList",
            iconName: "ic-publishers",
            primaryText: "si.pages.home.links.target_acc.title",
            secondaryText: "si.pages.home.links.target_acc.subtitle",
        },
        {
            onClick() {
                trackingService.trackFindCompaniesClicked();
                navigator.go(FIND_LEADS_PAGE_ROUTE);
            },
            name: "findLeads",
            iconName: "funnel-colored",
            primaryText: "si.pages.home.links.find_leads.title",
            secondaryText: "si.pages.home.links.find_leads.subtitle",
        },
    ];
};
