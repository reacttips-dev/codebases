import swLog from "@similarweb/sw-log";
import * as isEmpty from "lodash.isempty";
import {BaseTracker} from "./BaseTracker";
import {CustomDimensions, ICustomDimensionData, IDimensions} from "./ITrack";

export abstract class PiwikTracker extends BaseTracker {

    private customUrl = "";

    protected trackEventInternal(category, action, name, value?) {
        try {
            const paq = this.paq();
            if (paq) {
                paq.push(["trackEvent", category, action, name, value]);
            }
            this.getBuffer().add(["trackEvent", category, action, name, value, this.customUrl]);
        } catch (e) {
            swLog.exception("Error in piwik analytics", e);
        }
    }

    protected trackPageViewInternal(customDimsData: ICustomDimensionData) {
        try {
            this.paq().push(["setCustomUrl", window.location.href]);
            this.setCustomDimensions(customDimsData);
            this.paq().push(["trackPageView"]);
        } catch (e) {
            swLog.exception("Error in piwik analytics", e);
        }
    }

    protected healthCheckInternal() {
        const paq = this.paq();
        if (!paq || (Array.isArray(paq) && paq.length > 5)) {
            swLog.serverLogger("Piwik is not loaded", null, "Info");
        }
    }

    /**
     * getter for the native tracker
     */
    protected abstract paq(): any[];

    /**
     * should the tracker be buffered
     */
    protected abstract shouldBuffer(): boolean;

    /**
     * getter for the search params object
     */
    protected abstract searchParams(): any;

    /**
     * getter for the custom dimensions ids
     */
    protected getDimensions(): IDimensions {
        return CustomDimensions;
    }

    private setCustomDimension(customDimensionId, customDimensionValue) {
        this.paq().push(["setCustomDimension", customDimensionId, encodeURIComponent(JSON.stringify(customDimensionValue))]);
    }

    private deleteCustomDimension(customDimensionId) {
        this.paq().push(["deleteCustomDimension", customDimensionId]);
    }

    private setCustomDimensions(customDimsData: ICustomDimensionData) {
        const dimensions = this.getDimensions();
        Object.keys(dimensions).forEach(key => {
            const value = customDimsData && customDimsData[key];
            const type = typeof value;
            const hasValue = (type === "object" && !isEmpty(value)) || type === "boolean" || type === "string";
            const dimensionId = dimensions[key];
            if (hasValue) {
                this.setCustomDimension(dimensionId, value);
            } else {
                this.deleteCustomDimension(dimensionId);
            }
        });
    }

    private setPostRequests() {
        this.paq().push(["setRequestMethod", "POST"]);
    }
}



// WEBPACK FOOTER //
// ./src/trackers/PiwikTracker.ts