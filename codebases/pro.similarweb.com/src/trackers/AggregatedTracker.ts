import { TrackBuffer } from "../utils/TrackBuffer";
import { ICustomDimensionData, ITrack } from "./ITrack";

/**
 * A tracker that runs an a list of trackers for every method.
 * Trackers are run if ITrack.enable() return true;
 */
export class AggregatedTracker implements ITrack {

    private trackers: ITrack[] = [];

    constructor(trackers: ITrack[]) {
        this.trackers = trackers.slice();
    }

    public trackEvent(category: string, action: string, name: string, value?: number) {
        this.trackers.forEach((tracker: ITrack) => tracker.trackEvent(category, action, name, value));
    }

    public trackPageView(customDimsData: ICustomDimensionData) {
        this.trackers.forEach((tracker: ITrack) => tracker.trackPageView(customDimsData));
    }

    public healthCheck() {
        this.trackers.forEach((tracker: ITrack) => tracker.healthCheck());
    }

    public getBuffer(): TrackBuffer {
        throw new Error("Not implemented: call getBuffer() on the individual tracker");
    }

    public runCustomAction(action: string, ...args) {
        this.trackers.forEach((tracker: ITrack) => tracker.runCustomAction.apply(tracker, [ action, ...args ]));
    }

    public getTrackers() {
        return { ...this.trackers };
    }

}



// WEBPACK FOOTER //
// ./src/trackers/AggregatedTracker.ts