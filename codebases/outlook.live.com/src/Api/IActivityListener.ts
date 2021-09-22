/**
 * The main interface to use when instrumenting survey activities in app code
 */
interface IActivityListener {
	/**
	 * Log an activity to Floodgate, incrementing its occurrence count by the given number if specified,
	 * otherwise incrementing its occurrence count by one as default
	 */
	logActivity(activityName: string, increment?: number): void;

	/**
	 * Start an activity timer (overwriting any previously unclosed start).
	 * NOTE: Does not increment the activity count.
	 */
	logActivityStartTime(activityName: string, startTime?: Date): void;

	/**
	 * Stop an activity timer and clears the previous start time.
	 * Adds the elapsed seconds between this stop and the previous start into the count for this activity
	 * \note If no previous start was logged, or start is somehow in the future, results in 0 count increment
	 */
	logActivityStopTime(activityName: string, stopTime?: Date): void;
}

module IActivityListener {
	export class ActivityName {
		public static readonly AppLaunch = "AppLaunch";
		public static readonly AppUsageTime = "AppUsageTime";
		public static readonly AppResume = "AppResume";
	}
}

export = IActivityListener;
