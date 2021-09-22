import swLog from "@similarweb/sw-log";
import {TrackBuffer} from "../utils/TrackBuffer";
import {ICustomDimensionData, ITrack} from "./ITrack";

/**
 * Base Tracker Class
 * contains some base implementations
 */
export abstract class BaseTracker implements ITrack {

    // tracker buffer
    private buffer = new TrackBuffer(this.shouldBuffer);

    public trackEvent(category: string | string[], action: string, name: string, value?: number) {
        if (this.enabled()) {
            this.trackEventInternal(category, action, name, value);
        }
    }

    public trackPageView(customDimsData: ICustomDimensionData) {
        if (this.enabled()) {
            this.trackPageViewInternal(customDimsData);
        }
    }

    public healthCheck() {
        if (this.enabled()) {
            this.healthCheckInternal();
        }
    }

    public getBuffer(): TrackBuffer {
        return this.buffer;
    }

    public runCustomAction(action: string, ...args) {
        const actionName = `${action}Action`;
        if (typeof this[actionName] === "function") {
            (this[actionName] as () => void).apply(this, args);
        } else {
            swLog.error(`Base tracker: missing action '${action}' on tracker`);
        }
    }

    public enabled() {
        return this.isEnabled();
    }

    protected abstract trackEventInternal(category: string | string[], action: string, name: string, value?: number);

    protected abstract trackPageViewInternal(customDimsData: ICustomDimensionData);

    protected abstract healthCheckInternal();

    protected abstract isEnabled(): boolean;

    protected shouldBuffer(): boolean {
        return false;
    }
}



// WEBPACK FOOTER //
// ./src/trackers/BaseTracker.ts