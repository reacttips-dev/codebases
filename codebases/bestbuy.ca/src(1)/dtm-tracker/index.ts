import { WebappError } from "../errors";
export class DTMTracker {
    constructor() {
        this.isDTMEnabled = () => {
            // s is an object added to the window by adobe scripts
            const { s } = typeof window === "undefined" ? {} : window;
            return !!s && !!s.tl;
        };
    }
    send({ linkName, el = true, variableOverrides = null, doneAction = "navigate" }) {
        const isDTMEnabled = this.isDTMEnabled();
        if (this.isDTMEnabled()) {
            const { s } = window;
            const appMeasurement = s;
            appMeasurement.linkTrackVars = "";
            appMeasurement.linkTrackEvents = "";
            appMeasurement.tl(el, "o", linkName, variableOverrides, doneAction);
        }
        return isDTMEnabled;
    }
    dispatchEvent({ category, action, label }, elSelector = "#root") {
        const document = global.document || window.document;
        const trackedEl = document.querySelector(elSelector);
        if (!category || !action || !label) {
            throw new WebappError("DTMTracker: Could not dispatch analytics-ui-event: Missing parameters");
        }
        if (typeof window !== "undefined" && trackedEl !== null) {
            trackedEl.dispatchEvent(new CustomEvent("analytics-ui-event", {
                detail: {
                    action: `${category}:${action}:${label}`,
                },
            }));
        }
    }
}
export const tracker = new DTMTracker();
export default tracker;
//# sourceMappingURL=index.js.map