import { allTrackers } from "services/track/track";

export const createSignalsTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    const SIGNALS_SUB_FILTER_DROPDOWN_PREFIX = "Header/Metric change type filter";

    function trackSignalsSubFilterDropdownAction(action: string, value: number | string) {
        track("Drop down", action, `${SIGNALS_SUB_FILTER_DROPDOWN_PREFIX}/${value}`);
    }

    return {
        trackSubFiltersDropdownSelection(subFilterId: string) {
            trackSignalsSubFilterDropdownAction("Click", subFilterId);
        },
        trackSubFiltersDropdownOpen(signalId: string) {
            trackSignalsSubFilterDropdownAction("Open", signalId);
        },
        trackSubFiltersDropdownClose(signalId: string) {
            trackSignalsSubFilterDropdownAction("Close", signalId);
        },
    };
};

export default createSignalsTrackingService(allTrackers.trackEvent.bind(allTrackers));
