import swLog from "@similarweb/sw-log";
import {BaseTracker} from "./BaseTracker";
import { ICustomDimensionData } from "./ITrack";

/**
 * A Tracker for Intercom
 */
export abstract class IntercomTracker extends BaseTracker {

    public updateAction() {
        if (typeof this.intercom() !== "function") {
            return;
        }
        try {
            this.intercom()("update");
        } catch (e) {
            swLog.warn("Error in intercom tracking", e);
        }
    }

    protected trackEventInternal(category, action, name) {
        const intercom = this.intercom();
        if (typeof intercom !== "function") {
            return;
        }
        const params = {
            event_category: category,
            event_action: action,
            event_name: name,
        };
        try {
            intercom("trackEvent", `${category}/${action}`, params);
        } catch (e) {
            swLog.warn("Error in intercom tracking", e);
        }
    }

    protected trackPageViewInternal(customDimsData: ICustomDimensionData) {
        // nothing
    }

    protected healthCheckInternal() {
        // nothing
    }

    /**
     * get the native tracker
     */
    protected abstract intercom(): (method: string, name?: string, params?: any) => void;
}



// WEBPACK FOOTER //
// ./src/trackers/IntercomTracker.ts