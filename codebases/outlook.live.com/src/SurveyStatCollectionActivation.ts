import { IFloodgateSetting } from "./Api/IFloodgateSetting";
import { IFloodgateSettingStorageCallback } from "./Api/IFloodgateSettingStorageCallback";
import * as IFloodgateStorageProvider from "./Api/IFloodgateStorageProvider";
import FileType = IFloodgateStorageProvider.FileType;
import * as ISurvey from "./Api/ISurvey";
import { IDictionary, ISerializable } from "./Common";
import { TelemetryEvent } from "./Constants";
import { FloodgateEngine } from "./FloodgateEngine";
import * as StateProviderHelpers from "./StateProviderHelpers";
import { SurveyStatCollection } from "./SurveyStatCollection";
import * as Utils from "./Utils";

/**
 * StatCollection for activated surveys.  Should be used to track the SurveyIds
 * that have been recently shown to a user
 */
// TODO (gachoi) Check if this applies - VSOBug: 1443010 One bad Stat object fails the entire serialization
export class SurveyStatCollectionActivation extends SurveyStatCollection<SurveyActivationStats> implements ISerializable {
	/**
	 * Load from Json
	 */
	public static fromJson(json: string): SurveyStatCollectionActivation {
		const statCollection = new SurveyStatCollectionActivation();

		if (!json) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.SurveyStatCollectionActivation.FromJson.Failed, { ErrorMessage: "Input json is null or empty." });
			return statCollection;
		}

		let readStats: SurveyStatCollectionActivation;
		try {
			readStats = JSON.parse(json);
		} catch (e) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.SurveyStatCollectionActivation.FromJson.Failed, { ErrorMessage: "Json parsing failed. " + e.toString() });
			return statCollection;
		}

		if (!statCollection.deserialize(readStats)) {
			return new SurveyStatCollectionActivation();
		}

		return statCollection;
	}

	/**
	 * Convert to Json
	 */
	public static toJson(object: SurveyStatCollectionActivation): string {
		if (!object) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.SurveyStatCollectionActivation.ToJson.Failed, { ErrorMessage: "Input json is null or empty." });
			object = new SurveyStatCollectionActivation();
		}

		return JSON.stringify(object);
	}

	/**
	 * Add another SurveyStatCollectionActivation object
	 */
	public accumulate(other: SurveyStatCollectionActivation): void {
		if (!other) {
			return;
		}

		const stats: IDictionary<SurveyActivationStats> = other.getStats();
		// SurveyActivationStats accumulation simply overwrites any keys from 'other' into our collection
		for (const key in stats) {
			if (stats.hasOwnProperty(key)) {
				this.addStats(key, stats[key]);
			}
		}
	}

	/**
	 * Method to deserialize SurveyStatCollectionActivation
	 * @param input: collection of SurveyStatCollectionActivation
	 * Returns result of validation check
	 */
	public deserialize(input: any): boolean {
		const rawStats: IDictionary<SurveyActivationStats> = input.Surveys;
		const now = new Date();

		for (const key in rawStats) {
			if (rawStats.hasOwnProperty(key)) {
				const newStat = new SurveyActivationStats();

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

export interface ISurveyActivationStatsProvider {
	load(): SurveyStatCollectionActivation;

	save(surveyStatCollectionActivation: SurveyStatCollectionActivation): void;
}

export class SurveyActivationStatsProviderFactory {
	public static make(fileBasedStorage: IFloodgateStorageProvider,
		hostBasedStorage: IFloodgateSettingStorageCallback): ISurveyActivationStatsProvider {
		if (hostBasedStorage) {
			return new HostBasedSurveyActivationStatsProvider(fileBasedStorage, hostBasedStorage);
		}

		return new FileBasedSurveyActivationStatsProvider(fileBasedStorage);
	}
}

export class HostBasedSurveyActivationStatsProvider implements ISurveyActivationStatsProvider {
	private fileBasedStorageProvider: FileBasedSurveyActivationStatsProvider;
	private hostBasedStorage: IFloodgateSettingStorageCallback;

	public constructor(fileBasedStorageProvider: IFloodgateStorageProvider, hostBasedStorage: IFloodgateSettingStorageCallback) {
		if (!hostBasedStorage) {
			throw new Error("host-based storage must not be null");
		}

		this.hostBasedStorage = hostBasedStorage;

		// file based provider is optional
		if (fileBasedStorageProvider) {
			this.fileBasedStorageProvider = new FileBasedSurveyActivationStatsProvider(fileBasedStorageProvider);
		}
	}

	// @Override
	public load(): SurveyStatCollectionActivation {
		const surveyStatsFromHost: SurveyStatCollectionActivation = this.getSurveyStatsFromHost();

		let surveyStatsFromFile: SurveyStatCollectionActivation = new SurveyStatCollectionActivation();
		if (this.fileBasedStorageProvider) {
			surveyStatsFromFile = this.fileBasedStorageProvider.load();
		}

		const surveyStatsCollections = StateProviderHelpers.MergeAndUpdateSurveyActivationStats(surveyStatsFromFile, surveyStatsFromHost);
		return surveyStatsCollections.find(StateProviderHelpers.StateListType.Merged);
	}

	// @Override
	public save(stats: SurveyStatCollectionActivation): void {
		if (!stats) {
			return;
		}

		const statsFromHost: SurveyStatCollectionActivation = this.getSurveyStatsFromHost();
		const statCollection = StateProviderHelpers.MergeAndUpdateSurveyActivationStats(stats, statsFromHost);
		const toBeUpdatedStats: SurveyStatCollectionActivation = statCollection.find(StateProviderHelpers.StateListType.ToBeUpdated);
		const mergedStates: SurveyStatCollectionActivation = statCollection.find(StateProviderHelpers.StateListType.Merged);

		// write delta_data to Roaming
		if (toBeUpdatedStats) {
			const toBeUpdatedStatsDictionary: IDictionary<SurveyActivationStats> = toBeUpdatedStats.getStats();
			for (const surveyId in toBeUpdatedStatsDictionary) {
				if (toBeUpdatedStatsDictionary.hasOwnProperty(surveyId)) {
					const item: string = StateProviderHelpers.makeSettingItemValue(
						JSON.stringify(toBeUpdatedStatsDictionary[surveyId]));

					this.hostBasedStorage.upsertSettingItem(FileType[FileType.SurveyActivationStats],
						surveyId, item);
				}
			}
		}

		// Write merged data to File
		if (this.fileBasedStorageProvider) {
			this.fileBasedStorageProvider.save(mergedStates);
		}
	}

	private getSurveyStatsFromHost(): SurveyStatCollectionActivation {
		const statsCollection: SurveyStatCollectionActivation = new  SurveyStatCollectionActivation();
		const itemData: IFloodgateSetting = this.hostBasedStorage.readSettingList(FileType[FileType.SurveyActivationStats]);

		for (const surveyId in itemData) {
			if (!itemData.hasOwnProperty(surveyId)) {
				continue;
			}

			const dataString: string = StateProviderHelpers.extractSettingItemValueSubString(itemData[surveyId]);
			const newStats: SurveyActivationStats = new SurveyActivationStats();

			let readStats: SurveyActivationStats;
			try {
				readStats = JSON.parse(dataString);
				newStats.deserialize(readStats);
			} catch (e) {
				FloodgateEngine.getTelemetryLogger().log_Event(
					TelemetryEvent.HostBasedSurveyActivationStatsProvider.GetSurveyStatsFromHost.Failed,
					{ ErrorMessage: "Json parsing/deserializing failed. " + e.toString() + ".  Input:" + dataString });
			}

			const now = new Date();
			if (newStats.ExpirationTimeUtc <= now) {
				// Delete survey stat from host storage if it's expired.
				this.hostBasedStorage.deleteSettingItem(FileType[FileType.SurveyActivationStats], surveyId);
			} else {
				statsCollection.addStats(surveyId, newStats);
			}
		}
		return statsCollection;
	}
}
export class FileBasedSurveyActivationStatsProvider implements ISurveyActivationStatsProvider {
	private storage: IFloodgateStorageProvider;

	public constructor(storage: IFloodgateStorageProvider) {
		if (!storage) {
			throw new Error("storage must not be null");
		}

		this.storage = storage;
	}

	// @Override
	public load(): SurveyStatCollectionActivation {
		const readString: string = this.storage.read(IFloodgateStorageProvider.FileType.SurveyActivationStats);
		if (!readString) {
			return new SurveyStatCollectionActivation();
		}

		return SurveyStatCollectionActivation.fromJson(readString);
	}

	// @Override
	public save(surveyStatCollectionActivation: SurveyStatCollectionActivation): void {
		if (!surveyStatCollectionActivation) {
			return;
		}

		const writeString: string = SurveyStatCollectionActivation.toJson(surveyStatCollectionActivation);
		this.storage.write(IFloodgateStorageProvider.FileType.SurveyActivationStats, writeString);
	}
}

export class SurveyActivationStats implements ISerializable {
	// The following property names match JSON property names for proper serialization/deserialization
	public ExpirationTimeUtc: Date;
	public ActivationTimeUtc: Date;
	public Type: ISurvey.Type;

	/**
	 * Method to deserialize a JSON object to class object
	 * @param input: JSON object
	 * Returns result of validation check
	 */
	public deserialize(input: any): boolean {
		this.ActivationTimeUtc = input.ActivationTimeUtc;
		this.ExpirationTimeUtc = input.ExpirationTimeUtc;
		this.Type = input.Type;

		return this.validate();
	}

	/**
	 * Method to call after deserialization to validate generated object.
	 * Returns false if not valid.
	 */
	public validate(): boolean {
		// make it a date object if it's a valid UTC date time value
		if (Utils.isUtcDatetimeString(this.ActivationTimeUtc)) {
			this.ActivationTimeUtc = Utils.stringToDate(this.ActivationTimeUtc);
		} else {
			return false;
		}

		// make it a date object if it's a valid UTC date time value
		if (Utils.isUtcDatetimeString(this.ExpirationTimeUtc)) {
			this.ExpirationTimeUtc = Utils.stringToDate(this.ExpirationTimeUtc);
		} else {
			return false;
		}

		return Utils.isEnumValue(this.Type, ISurvey.Type);
	}
}
