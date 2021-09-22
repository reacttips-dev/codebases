import swLog from "@similarweb/sw-log";
import {BaseTracker} from "./BaseTracker";
import { ICustomDimensionData } from "./ITrack";

declare const SW_ENV: { debug: boolean, apiCache: boolean };

/**
 * A Tracker for Google Analytics
 */
export abstract class GoogleTracker extends BaseTracker {

    protected trackPageViewInternal(customDimsData: ICustomDimensionData) {
        try {
            const ga = this.ga();
            if (ga) { ga("send", "pageview", "/" + document.location.hash); }
        } catch (e) {
            swLog.exception("Error in google analytics", e);
        }
    }

    protected trackEventInternal(category: string, action: string, name: string, value?: number) {
        try {
            const ga = this.ga();
            if (ga) { ga("send", "event", category, action, name, value); }
        } catch (e) {
            swLog.exception("Error in google analytics", e);
        }
    }

    protected healthCheckInternal() {
        // check GTM:
        if (!SW_ENV.debug && !window["google_tag_manager"]) {
            swLog.serverLogger("GTM not loaded", null, "Info");
        }
    }

    /**
     * get the native tracker
     */
    protected abstract ga(): (...params) => void;
}



// WEBPACK FOOTER //
// ./src/trackers/GoogleTracker.ts