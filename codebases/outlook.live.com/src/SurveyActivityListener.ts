import * as ActivityTracker from "./ActivityTracker";
import { ActivityTrackingContract } from "./ActivityTrackingContract";
import { ActivityTrackingSet } from "./ActivityTrackingSet";
import * as IActivityListener from "./Api/IActivityListener";
import { IFloodgateTelemetryLogger } from "./Api/IFloodgateTelemetryLogger";
import { TelemetryEvent } from "./Constants";
import { IndexedTracker } from "./IndexedTracker";
import { SurveyEventActivityStats, SurveyStatCollectionEventActivity } from "./SurveyStatCollectionEventActivity";
import { fyShuffle, isNOU } from "./Utils";

let queuedActivities: SurveyActivityListener.IQueuedActivityParams[] = [];
let pendingActivityCount: number = 0;
let previousTrackedActivityMap: { [id: string]: IndexedTracker[] } = {};

/**
 * This class tracks log calls against named activity strings (matched on strict case-sensitive equality)
 * and calls the provided callback when all activity thresholds for a given survey have been crossed
 */
class SurveyActivityListener implements IActivityListener {
	public static FloodgateStartActivityName = "FloodgateFirstStart";
	// The size of the dropped activities is set to 100 due to the following two reasons.
	// 1) To prevent the array growing too big and causing memory issues.
	// 2) Based on the telemetry analysis of number of dropped activities, the count is very small and much lesser than 100.
	public static MaxPendingActivitiesQueueSize = 100;

	public static resetSessionActivity(): void {
		previousTrackedActivityMap = {};
	}

	private trackedActivityMap: { [id: string]: IndexedTracker[] };
	private callback: SurveyActivityListener.IActivityListenerCallback;
	private loggerCallback: () => IFloodgateTelemetryLogger;

	public constructor(callback: SurveyActivityListener.IActivityListenerCallback, loggerCallback?: () => IFloodgateTelemetryLogger) {
		if (!callback) {
			throw new Error("callback must not be null");
		}

		this.trackedActivityMap = {};
		this.callback = callback;
		this.loggerCallback = loggerCallback;
	}

	public logActivity(activityName: string, increment: number = 1): void {
		this.logActivity_private(activityName, SurveyActivityListener.LogActionType.Increment, increment, null);
	}

	public logActivityStartTime(activityName: string, startTime?: Date): void {
		this.logActivity_private(activityName, SurveyActivityListener.LogActionType.StartTime, 0, startTime);
	}

	public logActivityStopTime(activityName: string, stopTime?: Date): void {
		this.logActivity_private(activityName, SurveyActivityListener.LogActionType.StopTime, 0, stopTime);
	}

	public SetActivityTrackingContracts(activityTrackingContracts: ActivityTrackingContract[],
		baseline = new SurveyStatCollectionEventActivity()): void {

		let duplicateCounter = 0;

		if (!activityTrackingContracts || activityTrackingContracts.length === 0 || !baseline) {
			return;
		}

		// Populate a new map based on the passed in surveys, but propagating and tracking activity counts
		// we may have seen against those events
		// NOTE: We will lose activity counts for survey events that are no longer relevant.
		const newMap: { [id: string]: IndexedTracker[] } = {};
		const trackedSurveyIds: string[] = [];

		for (const activityTrackingContract of activityTrackingContracts) {
			const trackingSet: ActivityTrackingSet = activityTrackingContract.trackingSet;

			// Added to the new set to make sure they are not duplicated. Based on MSO.
			if (trackedSurveyIds.indexOf(activityTrackingContract.surveyId) === -1) {
				trackedSurveyIds.push(activityTrackingContract.surveyId);
			} else {
				// Duplicate surveyId being added, count it for the log.
				duplicateCounter++;
				continue;
			}

			// At this point, the survey's activities are safe to add.
			// Set up the structures we need to transfer baseline counts (from previous sessions) or current counts (from previous trackers)
			// Both vectors must be sorted in the same order as the trackingSet.List items
			const baselineStats: SurveyEventActivityStats = baseline.getBySurveyId(activityTrackingContract.surveyId);
			const baselineCounts: number[] = [trackingSet.getList().length];
			const currentIndexedTrackers: IndexedTracker[] = new Array<IndexedTracker>(trackingSet.getList().length);

			let currentBaselineIndex = 0;
			let currentIndex = 0;

			for (const trackingData of trackingSet.getList()) {
				// Baseline stats count is 0 for events with "IsAggregate = false"
				baselineCounts[currentIndex] = 0;
				if (trackingData.getIsAggregate() && baselineStats && currentBaselineIndex < baselineStats.Counts.length) {
					baselineCounts[currentIndex] = baselineStats.Counts[currentBaselineIndex++];
				}

				// Session stats may be available in the previous trackedActivityMap
				// Transfer the old "current session" count to the new tracker
				// Is set to null if not available
				if (previousTrackedActivityMap[trackingData.getActivity()]) {
					for (const tracker of previousTrackedActivityMap[trackingData.getActivity()]) {
						if (tracker.surveyId === activityTrackingContract.surveyId) {
							currentIndexedTrackers[currentIndex] = tracker;
							break;
						}
					}
				}

				currentIndex++;
			}

			// Make a new tracker and init the counts appropriately.
			const newTracker = new ActivityTracker(trackingSet);
			// If in a future change we start keeping trackers registered past activation, this will change
			newTracker.initCounts(baselineCounts, currentIndexedTrackers, false /*wasActivatedThisSession*/);

			// Setup the indexed trackers
			for (const activityIndex of newTracker.generateActivityIndexList()) {
				const indexedTracker = new IndexedTracker();
				indexedTracker.index = activityIndex.index;
				indexedTracker.surveyId = activityTrackingContract.surveyId;
				indexedTracker.tracker = newTracker;

				if (!newMap[activityIndex.activity]) {
					newMap[activityIndex.activity] = [];
				}

				// Register the new tracker in our new map
				newMap[activityIndex.activity].push(indexedTracker);
			}
		}

		if (duplicateCounter > 0) {
			const telemetryLogger = this.loggerCallback && this.loggerCallback();
			if (telemetryLogger) {
				telemetryLogger.log_Error(TelemetryEvent.SurveyActivity.SetActivityTrackingContracts.DuplicateSurveyID,
					"Duplicate surveyId passed in activityTrackingContracts. Duplicate count: " + duplicateCounter);
			}
		}

		// Set the new map in place of the old
		this.copyObject(this.trackedActivityMap, newMap);
	}

	public clearSurveys(): void {
		Object.getOwnPropertyNames(this.trackedActivityMap).forEach((key) => {
			delete this.trackedActivityMap[key];
		});
	}

	public saveSessionTrackingActivity(activity: string): void {
		// Set the new activity in place of the old
		previousTrackedActivityMap[activity] = this.trackedActivityMap[activity];
	}

	// Get the indexedTracker that corresponds to the SurveyID and return that count. otherwise return 0.
	public getCount(activity: string, surveyId: string): number {
		const indexedTracker = this.getIndexedTracker(activity, surveyId);
		if (!indexedTracker) {
			return 0;
		}

		return indexedTracker.tracker.getCount(indexedTracker.index);
	}

	public getSessionCount(activity: string, surveyId: string): number {
		const indexedTracker = this.getIndexedTracker(activity, surveyId);
		if (!indexedTracker) {
			return 0;
		}

		return indexedTracker.tracker.getSessionCount(indexedTracker.index);
	}

	/**
	 * An atomic get-and-set method.  Returns the current SessionCount, resetting it to zero and adding it into the established baseline
	 */
	public moveSessionCountIntoBaseCount(activity: string, surveyId: string): number {
		const indexedTracker = this.getIndexedTracker(activity, surveyId);
		if (!indexedTracker) {
			return 0;
		}

		return indexedTracker.tracker.moveSessionCountIntoBaseCount(indexedTracker.index);
	}

	public getSurveyIds(activity: string): string[] | undefined {
		if (isNOU(activity)) {
			return undefined;
		}

		const indexedTrackers = this.trackedActivityMap[activity];
		if (!indexedTrackers) {
			return undefined;
		}

		const surveyIds = indexedTrackers.map((indexedTracker) => indexedTracker.surveyId);
		return surveyIds;
	}

	public setCallback(callback: SurveyActivityListener.IActivityListenerCallback): void {
		this.callback = callback;
	}

	private getIndexedTracker(activity: string, surveyId: string): IndexedTracker | undefined {
		const indexedTrackers = this.trackedActivityMap[activity];

		if (!indexedTrackers) {
			return undefined;
		}

		let indexedTracker: IndexedTracker | undefined;
		for (const tracker of indexedTrackers) {
			if (tracker.surveyId === surveyId) {
				indexedTracker = tracker;
				break;
			}
		}

		return indexedTracker;
	}

	private resetQueuedActivities(): void {
		queuedActivities = [];
	}

	private logActivity_private(activityName: string, logType: SurveyActivityListener.LogActionType, increment: number, timestamp: Date): void {
		if (this.callback && !this.callback.shouldAcceptActivity(activityName)) {
			pendingActivityCount++;
			if (queuedActivities.length < SurveyActivityListener.MaxPendingActivitiesQueueSize) {
				queuedActivities.push({activityName, logType, increment, timestamp});
			}
		}

		// Count any activities that are posted before 'FloodgateFirstStart' activity happens
		if (activityName === SurveyActivityListener.FloodgateStartActivityName) {
			if (pendingActivityCount > 0) {
				const telemetryLogger = this.loggerCallback && this.loggerCallback();
				if (telemetryLogger) {
					telemetryLogger.log_Event(TelemetryEvent.SurveyActivity.LogActivity.EventsReprocessed, {
						Count: queuedActivities.length, Dropped: pendingActivityCount - queuedActivities.length });
				}

				// replay all the queued activities one by one as the floodgate engine has started now
				queuedActivities.map((queuedActivity) => this.logActivity_core(
					queuedActivity.activityName, queuedActivity.logType, queuedActivity.increment, queuedActivity.timestamp));
			}

			pendingActivityCount = 0;
			this.resetQueuedActivities();
		}

		this.logActivity_core(activityName, logType, increment, timestamp);
	}

	private logActivity_core(activityName: string, logType: SurveyActivityListener.LogActionType, increment: number, timestamp: Date): void {
		const indexedTrackers: IndexedTracker[] = this.trackedActivityMap[activityName];
		if (!indexedTrackers || indexedTrackers.length === 0) {
			return;
		}

		let indices: number[] = [];

		// If we have more than one tracker shuffle trackers to randomize which is evaluated first
		if (indexedTrackers.length > 1) {
			indices = new Array<number>(indexedTrackers.length);
			for (let i = 0; i < indices.length; i++) {
				indices[i] = i;
			}
			indices = fyShuffle(indices); // shuffle and reassign
		} else {
			indices.push(0); // just have a zero. Shuffling is not needed.
		}

		// Loop through trackers in shuffled order
		for (const index of indices) {
			const tracker: IndexedTracker = indexedTrackers[index];

			switch (logType) {
				case SurveyActivityListener.LogActionType.StartTime: {
					tracker.tracker.startTime(tracker.index, timestamp);
					continue; // Look at the next tracker. Increment not needed.
				}
				case SurveyActivityListener.LogActionType.StopTime: {
					increment = tracker.tracker.stopTime(tracker.index, timestamp);
					// fall through to increment the activity as well.
				}
				case SurveyActivityListener.LogActionType.Increment: {
					break;
				}
				default: {
					continue;
				}
			}

			const result: ActivityTracker.IncrementResult = tracker.tracker.incrementActivity(tracker.index, increment);
			if (result === ActivityTracker.IncrementResult.AllActivitiesActivated) {
				this.executeCallback(tracker.surveyId);
				break;
				/* Breaking here to let one and only one callback to be made from a logActivity call.
				This ensures only one survey can fully 'trigger' for a logActivity call. Others that would also
				have triggered must wait until the next call to trigger (without there being a cooldown, of course).
				*/
			}
		}
	}

	private executeCallback(surveyId: string): void {
		this.callback.run(surveyId);
	}

	private copyObject(target: {}, source: {}) {
		Object.keys(source).forEach((key) => {
			target[key] = source[key];
		});
	}
}

module SurveyActivityListener {
	export interface IActivityListenerCallback {
		run(surveyId: string): void;
		shouldAcceptActivity(activityName: string): boolean;
	}

	export const enum LogActionType {
		Increment,
		StartTime,
		StopTime,
	}

	export interface IQueuedActivityParams {
		activityName: string;
		logType: SurveyActivityListener.LogActionType;
		increment: number;
		timestamp: Date;
	}
}

export = SurveyActivityListener;
