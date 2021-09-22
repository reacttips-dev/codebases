import { ActivityTrackingData } from "./ActivityTrackingData";
import { ActivityTrackingSet } from "./ActivityTrackingSet";
import { IndexedTracker } from "./IndexedTracker";

/**
 * Class to track ticks against a list of expected counts in a thread-safe way
 * Main API of interest is incrementActivity, which returns an enumerated value indicating
 * whether or not the increment resulted in no thresholds crossed, a single activity threshold crossed,
 * or the final activity threshold crossed.
 */
class ActivityTracker {
	private isOrdered: boolean;
	private trackedActivities: ActivityTrackingData[];
	private currentIndex: number;
	private activationMask: number;
	private currentActivationFlags: number;
	private isActivationByInitPending: boolean;
	private currentCounts: number[];
	private currentSessionCounts: number[];
	private currentStartTimes: Date[];

	public constructor(trackingSet: ActivityTrackingSet) {
		if (!trackingSet) {
			throw new Error("trackingSet must not be null");
		}
		if (trackingSet.getList().length > 32) {
			throw new Error("trackingSet list size must be less than 32");
		}

		this.isOrdered = trackingSet.getIsOrdered();
		this.trackedActivities = trackingSet.getList();

		/**
		 * For ordered sets, the current index.
		 */
		this.currentIndex = 0;
		this.activationMask = 0;
		this.currentActivationFlags = 0;
		this.isActivationByInitPending = false;

		this.currentCounts = new Array<number>(this.trackedActivities.length);
		this.currentStartTimes = new Array<Date>(this.trackedActivities.length);
		this.currentSessionCounts = new Array<number>(this.trackedActivities.length);

		for (let i = 0; i < this.trackedActivities.length; i++) {
			this.currentCounts[i] = 0;
			this.currentSessionCounts[i] = 0;
		}

		for (let i = 0; i < this.trackedActivities.length; i++) {
			this.activationMask |= 0x1 << i;

			if (this.trackedActivities[i].getCount() < 1) {
				this.trackedActivities[i].setCount(1);
			}
		}
	}

	/**
	 * Get the count for the activity at the specified index. Returns 0 for out-of-range indices
	 *
	 * @param index index
	 */
	public getCount(index: number): number {
		if (!this.isValidIndex(index)) {
			return 0;
		}

		return this.currentCounts[index];
	}

	/**
	 * Get the count for the activity at the specified index, as tracked only for this session.
	 * Returns 0 for out-of-range indices
	 *
	 * @param index index
	 */
	public getSessionCount(index: number): number {
		if (!this.isValidIndex(index)) {
			return 0;
		}

		return this.currentSessionCounts[index];
	}

	/**
	 * Get the StartTime for the activity at the specified index. Returns null for out-of-range indices
	 *
	 * @param index index
	 */
	public getStartTime(index: number): Date {
		if (!this.isValidIndex(index)) {
			return null;
		}

		return this.currentStartTimes[index];
	}

	/**
	 * A get-and-set method. Returns the current SessionCount, resetting it to zero and adding it into
	 * the established baseline.
	 *
	 * @param index index
	 */
	public moveSessionCountIntoBaseCount(index: number): number {
		if (!this.isValidIndex(index)) {
			return 0;
		}

		const sessionCount: number = this.currentSessionCounts[index];
		this.currentSessionCounts[index] = 0;

		return sessionCount;
	}

	/**
	 * Forcibly set the counts for the activities in the trackingSet.
	 * Unlike other APIs, this expects vector indices to match the order
	 * of the ActivityTrackingSet.List initially used to construct this tracker.
	 * (When data is copied from a different IndexedTracker, it will properly use the IndexedTracker.Index to query internals)
	 * Note:
	 * 1) Assumes a count of 0 for any missing index in undersized arrays.
	 * 2) Respects and enforces ordered list initialization (i.e. all init values are ignored once a unfinished activity is
	 * encountered in an ordered tracking list).
	 * 3) If the tracker is fully Activated as a result of this call, the next call to IncrementActivity will raise the
	 * IncrementEdgeResult.AllActivitiesActivated, for any valid index accepted by IsPermittedIndexForActivationByInit().
	 */
	public initCounts(baselineCounts: number[], otherTrackers: IndexedTracker[], wasAlreadyActivatedThisSession: boolean = false): void {
		// NOTE: baselineIncrements and sessionIncrements are sorted the same as the initial trackedActivity set, which
		// for this class is the same as trackedActivities

		for (let i = 0; i < this.trackedActivities.length; i++) {
			// Only accept values up to the current index, when ordered
			if (this.isOrdered && i > this.currentIndex) {
				break;
			}

			// Start off by pulling values from this session
			if (i < otherTrackers.length && otherTrackers[i]) {
				this.currentSessionCounts[i] = this.currentCounts[i] = otherTrackers[i].tracker.getSessionCount(otherTrackers[i].index);
				this.currentStartTimes[i] = otherTrackers[i].tracker.getStartTime(otherTrackers[i].index);
			}

			// If we've got a baseline from previous sessions, add it in as well
			if (this.trackedActivities[i].getIsAggregate() && i < baselineCounts.length) {
				this.currentCounts[i] += baselineCounts[i];
			}

			if (this.hasCountCrossedThreshold(i)) {
				this.finishActivityAtIndex(i);
			}
		}

		if (this.isActivated() && !wasAlreadyActivatedThisSession) {
			// Mark this object so that the next time any permitted activation event is logged, the survey will activate
			this.isActivationByInitPending = true;
		}
	}

	public generateActivityIndexList(): ActivityTracker.ActivityIndex[] {
		const indexList = new Array<ActivityTracker.ActivityIndex>();
		for (let i = 0; i < this.trackedActivities.length; i++) {
			const current = new ActivityTracker.ActivityIndex();
			current.activity = this.trackedActivities[i].getActivity();
			current.index = i;
			indexList.push(current);
		}

		return indexList;
	}

	/**
	 * Increments the count at the specified index by the given increment.  Returns a value indicating whether
	 * or not this call triggered a transition edge (activating the activity at 'index', or finishing the activation
	 * of the final pending activity)
	 */
	public incrementActivity(index: number, increment: number): ActivityTracker.IncrementResult {
		if (!this.isValidIndex(index)) {
			return ActivityTracker.IncrementResult.Pending;
		}

		if (increment < 0) {
			throw new Error("increment must be non-negative");
		}

		// Ordered sets must be triggered in order.  We can only track at the current index, or before
		if (this.isOrdered && index > this.currentIndex) {
			return ActivityTracker.IncrementResult.Pending;
		}

		// Add to our counts after storing off our current state
		const startedLessThanThreshold = !this.hasCountCrossedThreshold(index);
		this.currentCounts[index] += increment;
		this.currentSessionCounts[index] += increment;

		if (this.isActivationByInitPending) {
			if (this.isPermittedIndexForActivationByInit(index)) {
				// This tracker was completed due to the initialization from previous increment data
				// now that we've store this activities increments, raise the AllActivitiesActivated signal
				return this.commitActivation();
			} else {
				// Still waiting for a valid re-activation activity
				return ActivityTracker.IncrementResult.Pending;
			}
		}

		if (!(startedLessThanThreshold && this.hasCountCrossedThreshold(index))) {
			// Still waiting for this activity to finish
			return ActivityTracker.IncrementResult.Pending;
		}

		// Mark this activity as complete in our flag collection
		this.finishActivityAtIndex(index);

		if (this.isActivated()) {
			return this.commitActivation();
		}

		return ActivityTracker.IncrementResult.SingleActivityActivated;
	}

	/**
	 * Explicitly sets a start timestamp (now if startTime is null) for the specified activity index. Overwrites any previous StartTime.
	 */
	public startTime(index: number, startTime?: Date): void {
		if (!this.isValidIndex(index)) {
			return;
		}

		this.currentStartTimes[index] = (!startTime) ? new Date() : startTime;
	}

	/**
	 * Computes the "count" delta (delta in whatever units are appropriate for a subsequent call to IncrementActivity)
	 * elapsed between now and a previously logged StartTime for this activity index.
	 * Always clears the previous StartTime.
	 * Returns 0 if no previous StartTime was logged, or if StartTime > StopTime
	 */
	public stopTime(index: number, stopTime?: Date): number {
		if (!this.isValidIndex(index)) {
			return 0;
		}

		const startTime = this.currentStartTimes[index];
		this.currentStartTimes[index] = null;

		if (!startTime) {
			return 0;
		}

		stopTime = (!stopTime) ? new Date() : stopTime;
		if (startTime > stopTime) {
			return 0;
		}

		const deltaMS = stopTime.getTime() - startTime.getTime();
		// Currently all timer activities return seconds as the increment unit
		return deltaMS / 1000;
	}

	/**
	 * Returns true if the index is valid for accessing the stored activity counts, false otherwise
	 */
	public isValidIndex(index: number): boolean {
		return index < this.trackedActivities.length;
	}

	/**
	 * Gets whether or not the full set of activities for this tracker have exceeded their trigger thresholds
	 */
	public isActivated(): boolean {
		return (this.currentActivationFlags & this.activationMask) === this.activationMask;
	}

	/**
		* Marks the activity at the index as finished. Includes setting the proper
		* activation flags and potentially advancing the current index for ordered tracking sets
		*/
	private finishActivityAtIndex(index: number): void {
		if (!this.isValidIndex(index)) {
			throw new Error("Index is not valid");
		}

		this.currentActivationFlags |= 0x1 << index;

		if (index + 1 < this.trackedActivities.length) {
			this.currentIndex = index + 1;
		}
	}

	/**
	 * @param index index
	 * @return true if the counts for the activity at the specified index have met or exceeded the threshold count.
	 */
	private hasCountCrossedThreshold(index: number): boolean {
		if (!this.isValidIndex(index)) {
			throw new Error("Index is not valid");
		}

		return this.currentCounts[index] >= this.trackedActivities[index].getCount();
	}

	/**
	 * Returns true if the index refers to an activity that can re-activate a tracked object (aka return AllActivitiesActivated)
	 * that was initialized as "complete" via initCounts.
	 * Note: For unordered sets, any activity is valid. For ordered sequences, only the final activity is valid
	 */
	private isPermittedIndexForActivationByInit(index: number): boolean {
		return !this.isOrdered || ((index + 1) === this.currentCounts.length);
	}

	private commitActivation(): ActivityTracker.IncrementResult {
		this.isActivationByInitPending = false;
		return ActivityTracker.IncrementResult.AllActivitiesActivated;
	}
}

module ActivityTracker {
	/**
	 * Structure returned by an ActivityTracker to call back into
	 * IncrementActivity with valid index values
	 */
	export class ActivityIndex {
		public activity: string;
		public index: number;
	}

	export const enum IncrementResult {
		/**
		 * No thresholds crossed as a result of this increment operation
		 */
		Pending,

		/**
		 * The threshold for the targeted activity index was crossed as a result of this increment operation
		 */
		SingleActivityActivated,

		/**
		 * The threshold for the targeted activity index was crossed as a result of this increment operation
		 * and this was the final activity being tracked
		 */
		AllActivitiesActivated,
	}
}

export = ActivityTracker;
