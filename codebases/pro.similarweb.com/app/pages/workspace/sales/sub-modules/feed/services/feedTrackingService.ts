import { allTrackers } from "../../../../../../services/track/track";

export const createFeedTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    const AD_NETWORK_DROPDOWN_PREFIX = "Specific ad network filter";
    const AD_NETWORK_FEED_ITEM_PREFIX = "New ad network";

    function trackAdNetworkDropdownAction(action: string, value: number | string) {
        track("Drop down", action, `${AD_NETWORK_DROPDOWN_PREFIX}/${value}`);
    }

    function trackAdNetworkFeedAction(action: string, value: number | string) {
        track("Signals tab", action, `${AD_NETWORK_FEED_ITEM_PREFIX}/${value}`);
    }

    return {
        trackAdNetworkCollapse() {
            trackAdNetworkFeedAction("Collapse", "using chevron");
        },
        trackAdNetworkExpand(position: number, name: string) {
            trackAdNetworkFeedAction("Expand", `${position}/${name}`);
        },
        trackAdNetworkDropdownSearch(searchTerm: string) {
            trackAdNetworkDropdownAction("Search", searchTerm);
        },
        trackAdNetworkDropdownOpen(subFiltersCountsSum: number) {
            trackAdNetworkDropdownAction("Open", subFiltersCountsSum);
        },
        trackAdNetworkDropdownClose(adNetworksCount: number) {
            trackAdNetworkDropdownAction("Close", adNetworksCount);
        },
        trackAdNetworkDropdownSelection(group: string, name: string) {
            trackAdNetworkDropdownAction("Click", `${group}/${name}`);
        },
    };
};

export default createFeedTrackingService(allTrackers.trackEvent.bind(allTrackers));
