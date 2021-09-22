import { IDictionary } from "./Common";

/**
 * Generic class for managing a collection of survey stats. Includes read-from/write-to json structures or a file,
 * as well as merge routines for combining collections
 */
export abstract class SurveyStatCollection<TStats> {
	// The following property name matches the JSON root key name for proper serialization/ deserialization
	private Surveys: IDictionary<TStats> = {};

	public constructor() {
		this.Surveys = {};
	}

	/**
	 * Add stats. Overwrites if already exists.
	 */
	public addStats(surveyId: string, stats: TStats): void {
		this.Surveys[surveyId] = stats;
	}

	/**
	 * Get a SurveyActivationStats object by surveyId. Returns null if surveyId is not found
	 */
	public getBySurveyId(surveyId: string): TStats {
		return (this.Surveys[surveyId]);
	}

	/**
	 * Get all stats available
	 */
	public getStats(): IDictionary<TStats> {
		return this.Surveys;
	}
}
