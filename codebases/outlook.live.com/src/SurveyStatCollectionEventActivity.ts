import { IDictionary, ISerializable } from "./Common";
import { TelemetryEvent } from "./Constants";
import { FloodgateEngine } from "./FloodgateEngine";
import { SurveyStatCollection } from "./SurveyStatCollection";
import * as Utils from "./Utils";

/**
 * StatCollection for EventActivity counts.  Should be used to store/merge
 * aggregate values between sessions tracking the same surveys/events
 * E.g. A survey that activates after 3 boots.
 */
// TODO (gachoi) check the following - VSOBug: 1443010 One bad Stat object fails the entire serialization
export class SurveyStatCollectionEventActivity extends SurveyStatCollection<SurveyEventActivityStats> implements ISerializable {

	/**
	 * Load from Json
	 */
	public static fromJson(json: string): SurveyStatCollectionEventActivity {
		const statCollection = new SurveyStatCollectionEventActivity();

		if (!json) {
			return statCollection;
		}

		let readStats: SurveyStatCollectionEventActivity;
		try {
			readStats = JSON.parse(json);
		} catch (e) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.SurveyStatCollectionEventActivity.FromJson.Failed,
				{ ErrorMessage: "Json parsing failed. " + e.toString() });
			return statCollection;
		}

		if (!statCollection.deserialize(readStats)) {
			return new SurveyStatCollectionEventActivity();
		}

		return statCollection;
	}

	/**
	 * Convert to Json
	 */
	public static toJson(object: SurveyStatCollectionEventActivity): string {
		if (!object) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.SurveyStatCollectionEventActivity.ToJson.Failed,
				{ ErrorMessage: "Input json is null or empty." });
			object = new SurveyStatCollectionEventActivity();
		}

		return JSON.stringify(object);
	}

	/**
	 * Add another SurveyStatCollectionEventActivity object
	 */
	public accumulate(other: SurveyStatCollectionEventActivity): void {
		if (!other) {
			return;
		}

		const stats: IDictionary<SurveyEventActivityStats> = other.getStats();
		// SurveyEventActivityStats accumulation simply overwrites any keys from 'other' into our collection
		for (const key in stats) {
			if (stats.hasOwnProperty(key)) {
				let ourStats: SurveyEventActivityStats = this.getBySurveyId(key);

				// If it does not already exist
				if (!ourStats) {
					ourStats = new SurveyEventActivityStats();
					ourStats.Counts = [];
					this.addStats(key, ourStats);
				}

				ourStats.ExpirationTimeUtc = stats[key].ExpirationTimeUtc;

				// If for some reason the other counts array is larger, resize ourStats.counts
				if (ourStats.Counts.length < stats[key].Counts.length) {
					const resizedCounts: number[] = ourStats.Counts.slice();
					ourStats.Counts = resizedCounts;
				}

				for (let i = 0; i < stats[key].Counts.length; i++) {
					if (!ourStats.Counts[i]) {
						ourStats.Counts[i] = 0;
					}

					ourStats.Counts[i] += stats[key].Counts[i];
				}
			}
		}
	}

	/**
	 * Method to deserialize SurveyStatCollectionEventActivity
	 * @param input: collection of SurveyStatCollectionEventActivity
	 * Returns result of validation check
	 */
	public deserialize(input: any): boolean {
		const rawStats: IDictionary<SurveyEventActivityStats> = input.Surveys;
		const now = new Date();

		for (const key in rawStats) {
			if (rawStats.hasOwnProperty(key)) {
				const newStat = new SurveyEventActivityStats();

				if (newStat.deserialize(rawStats[key]) && newStat.ExpirationTimeUtc > now) {
					this.addStats(key, newStat);
				}
			}
		}

		return this.validate();
	}

	/**
	 * Validate the Surveys
	 * Returns false if validation fails
	 */
	public validate(): boolean {
		return Utils.isObject(this.getStats());
	}
}

export class SurveyEventActivityStats implements ISerializable {
	// The following property names match JSON property names for proper serialization/deserialization
	public ExpirationTimeUtc: Date;
	public Counts: number[];

	/**
	 * Method to deserialize a JSON object to class object
	 * @param input: JSON object
	 * Returns result of validation check
	 */
	public deserialize(input: any): boolean {
		this.ExpirationTimeUtc = input.ExpirationTimeUtc;
		this.Counts = input.Counts;

		return this.validate();
	}

	/**
	 * Method to call after deserialization to validate generated object.
	 * Returns false if not valid.
	 */
	public validate(): boolean {
		if (!this.Counts) {
			return false;
		}

		for (let i = 0; i < this.Counts.length; i++) {
			const val: number = this.Counts[i];

			if (!Utils.isNumber(val)) {
				return false;
			}

			if (val < 0) {
				this.Counts[i] = 0;
			}
		}

		// make it a date object if it's a valid UTC date time value
		if (Utils.isUtcDatetimeString(this.ExpirationTimeUtc)) {
			this.ExpirationTimeUtc = Utils.stringToDate(this.ExpirationTimeUtc);
		} else {
			return false;
		}

		return true;
	}
}
