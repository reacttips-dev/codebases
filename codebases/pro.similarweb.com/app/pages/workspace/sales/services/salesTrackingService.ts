import { allTrackers } from "services/track/track";

/**
 * @deprecated
 * Don't use this service. It will be removed soon.
 */
const createSalesTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    return {
        /** @deprecated */
        trackRightBarOpenChange(status: boolean, row: string) {
            const event = status ? "change" : "open";
            track("Table Row", "click", `sidebar/${event}/${row}`);
        },
    };
};

export default createSalesTrackingService(allTrackers.trackEvent.bind(allTrackers));
