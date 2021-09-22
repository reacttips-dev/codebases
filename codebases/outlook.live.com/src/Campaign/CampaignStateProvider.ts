import { IFloodgateSetting } from "../Api/IFloodgateSetting";
import { IFloodgateSettingStorageCallback } from "../Api/IFloodgateSettingStorageCallback";
import * as IFloodgateStorageProvider from "../Api/IFloodgateStorageProvider";
import { TelemetryEvent } from "../Constants";
import { FloodgateEngine } from "../FloodgateEngine";
import * as StateProviderHelpers from "../StateProviderHelpers";
import * as Utils from "../Utils";
import FileType = IFloodgateStorageProvider.FileType;
import StateListType = StateProviderHelpers.StateListType;

const { getDistantPast, isBoolean, isDate, isNOU, isString, isUtcDatetimeString, stringToDate } = Utils;

export class CampaignState {
	/**
	 * Method to deserialize a JSON object to class object
	 * @param input: JSON object
	 * Returns class object
	 */
	public static deserialize(input: any): CampaignState {
		let result: CampaignState;

		if (!input) {
			return null;
		}

		try {
			result = new CampaignState(
				input.CampaignId,
				input.LastNominationTimeUtc,
				input.LastNominationBuildNumber,
				input.DeleteAfterSecondsWhenStale,
				false, // ForceCandidacy
				input.IsCandidate,
				input.DidCandidateTriggerSurvey,
				input.LastSurveyActivatedTimeUtc,
				input.LastSurveyId,
				input.LastSurveyStartTimeUtc,
				input.LastSurveyExpirationTimeUtc,
				input.LastCooldownEndTimeUtc,
			);
		} catch (e) {
			FloodgateEngine.getTelemetryLogger().log_Event(TelemetryEvent.CampaignState.Deserialize.Failed, { ErrorMessage: e.toString() });
			return null;
		}

		return result;
	}

	// The Campaign to which this state corresponds
	// @SerializedName("CampaignId")
	public CampaignId: string;

	// The last time the candidacy was evaluated
	// @SerializedName("LastNominationTimeUtc")
	public LastNominationTimeUtc: Date;

	// The build number from the last time the candidacy was evaluated
	// @SerializedName("LastNominationBuildNumber")
	public LastNominationBuildNumber: string;

	// Amount of time to delay cleanup of this state from storage, when it's campaign definition is no longer present
	// @SerializedName("DeleteAfterSecondsWhenStale")
	public DeleteAfterSecondsWhenStale: number;

	// Manual setting that can be used to force this client to be a candidate for this campaign. Not persisted to the file.
	public ForceCandidacy: boolean;

	// Whether or not the user is currently a candidate or anti-candidate
	// @SerializedName("IsCandidate")
	public IsCandidate: boolean;

	// Whether or not the user triggered a survey when they are a Candidate.
	// If isCandidate is false, then this value is meaningless.
	// If isCandidate is true, then this is used to pick a different campaign cooldown time
	// @SerializedName("DidCandidateTriggerSurvey")
	public DidCandidateTriggerSurvey: boolean;

	// The date the last survey was activated
	// @SerializedName("LastSurveyActivatedTimeUtc")
	public LastSurveyActivatedTimeUtc: Date;

	// region Properties of the most recently generated survey.

	// When isCandidate == true for the current election time, this is used to regenerate the same Survey definition
	// each time we are invoked
	// Consider: Putting this in its own subclass

	// The surveyId for the most recently generated survey in this campaign (can differ from campaignId, and is
	// used to guarantee a given survey is shown once)
	// @SerializedName("LastSurveyId")
	public LastSurveyId: string;

	// The start time of the most recently generated survey
	// @SerializedName("LastSurveyStartTimeUtc")
	public LastSurveyStartTimeUtc: Date;

	// The expiration time of the most recently generated survey
	// @SerializedName("LastSurveyExpirationTimeUtc")
	public LastSurveyExpirationTimeUtc: Date;

	// The cooldown end time of the most recently generated survey
	// @SerializedName("LastCooldownEndTimeUtc")
	public LastCooldownEndTimeUtc: Date;

	public constructor(campaignId: string, lastNominationTime: Date, lastNominationBuildNumber: string, deleteAfterSecondsWhenStale: number,
		ForceCandidacy: boolean, isCandidate: boolean, didCandidateTriggerSurvey: boolean, lastSurveyActivatedTime: Date,
		lastSurveyId: string, lastSurveyStartTime: Date, lastSurveyExpirationTime: Date, lastCooldownEndTimeUtc: Date) {
		this.CampaignId = campaignId;
		this.LastNominationTimeUtc = lastNominationTime;
		this.LastNominationBuildNumber = lastNominationBuildNumber;
		this.DeleteAfterSecondsWhenStale = deleteAfterSecondsWhenStale;
		this.ForceCandidacy = ForceCandidacy;
		this.IsCandidate = isCandidate;
		this.DidCandidateTriggerSurvey = didCandidateTriggerSurvey;
		this.LastSurveyActivatedTimeUtc = lastSurveyActivatedTime;
		this.LastSurveyId = lastSurveyId;
		this.LastSurveyStartTimeUtc = lastSurveyStartTime;
		this.LastSurveyExpirationTimeUtc = lastSurveyExpirationTime;
		this.LastCooldownEndTimeUtc = lastCooldownEndTimeUtc;

		if (!this.validate()) {
			throw new Error("Constructor arguments are not valid");
		}
	}

	public validate(): boolean {
		if (!this.CampaignId || !isString(this.CampaignId)) {
			return false;
		}

		if (isNOU(this.LastNominationBuildNumber)
			|| !isString(this.LastNominationBuildNumber)) {
			return false;
		}

		if (!Utils.isNumber(this.DeleteAfterSecondsWhenStale) || this.DeleteAfterSecondsWhenStale < 0) {
			return false;
		}

		if (!isBoolean(this.IsCandidate) || !isBoolean(this.DidCandidateTriggerSurvey)) {
			return false;
		}

		if (this.IsCandidate) {
			// Disallow the following null's if isCandidate == true
			if (isNOU(this.LastSurveyStartTimeUtc) || isNOU(this.LastSurveyExpirationTimeUtc)) {
				return false;
			}

			// LastSurveyId could be ""
			if (!isString(this.LastSurveyId)) {
				return false;
			}
		}

		if (this.DidCandidateTriggerSurvey) {
			// Disallow the following null's if didCandidateTriggerSurvey == true
			if (isNOU(this.LastSurveyActivatedTimeUtc)) {
				return false;
			}
		}

		if (isNOU(this.LastSurveyId)) {
			this.LastSurveyId = "";
		} else if (!isString(this.LastSurveyId)) {
			return false;
		}

		// LastNominationTime does not allow null
		if (isUtcDatetimeString(this.LastNominationTimeUtc)) {
			this.LastNominationTimeUtc = stringToDate(this.LastNominationTimeUtc);
		// invalidate if it's not a Date object
		} else if (!isDate(this.LastNominationTimeUtc)) {
			return false;
		}

		// Set value to distance past if value not provided
		if (isNOU(this.LastSurveyActivatedTimeUtc)) {
			this.LastSurveyActivatedTimeUtc = getDistantPast();
		// check if it's UTC date time string, possibly coming from deserialize method
		} else if (isUtcDatetimeString(this.LastSurveyActivatedTimeUtc)) {
			this.LastSurveyActivatedTimeUtc = stringToDate(this.LastSurveyActivatedTimeUtc);
		// invalidate if it's not a Date object
		} else if (!isDate(this.LastSurveyActivatedTimeUtc)) {
			return false;
		}

		// Set value to distance past if value not provided
		if (isNOU(this.LastSurveyStartTimeUtc)) {
			this.LastSurveyStartTimeUtc = getDistantPast();
		// check if it's string, possibly coming from deserialize method
		} else if (isUtcDatetimeString(this.LastSurveyStartTimeUtc)) {
			this.LastSurveyStartTimeUtc = stringToDate(this.LastSurveyStartTimeUtc);
		// invalidate if it's not a Date object
		} else if (!isDate(this.LastSurveyStartTimeUtc)) {
			return false;
		}

		// Set value to distance past if value not provided
		if (isNOU(this.LastSurveyExpirationTimeUtc)) {
			this.LastSurveyExpirationTimeUtc = getDistantPast();
		// check if it's string, possibly coming from deserialize method
		} else if (isUtcDatetimeString(this.LastSurveyExpirationTimeUtc)) {
			this.LastSurveyExpirationTimeUtc = stringToDate(this.LastSurveyExpirationTimeUtc);
		} else if (!isDate(this.LastSurveyExpirationTimeUtc)) {
			return false;
		}

		// Set value to distance past if value not provided
		if (isNOU(this.LastCooldownEndTimeUtc)) {
			this.LastCooldownEndTimeUtc = getDistantPast();
		// check if it's string, possibly coming from deserialize method
		} else if (isUtcDatetimeString(this.LastCooldownEndTimeUtc)) {
			this.LastCooldownEndTimeUtc = stringToDate(this.LastCooldownEndTimeUtc);
		} else if (!isDate(this.LastCooldownEndTimeUtc)) {
			return false;
		}

		return true;
	}

	/**
	 * Record that the current survey was taken on this date
	 *
	 * @param date date
	 * @param cooldownSeconds number
	 */
	public markCurrentSurveyTakenOnDate(date: Date, cooldownSeconds: number): void {
		this.DidCandidateTriggerSurvey = true;
		this.LastSurveyActivatedTimeUtc = date != null ? date : new Date();
		this.LastCooldownEndTimeUtc = Utils.addSecondsWithoutOverflow(this.LastSurveyActivatedTimeUtc, cooldownSeconds);
	}

	public getCooldownStartDate(): Date {
		if (!this.IsCandidate) {
			return this.LastNominationTimeUtc;
		}

		if (this.DidCandidateTriggerSurvey) {
			return this.LastSurveyActivatedTimeUtc;
		}

		// In practice this wil be equal to lastNominationTime, but
		// distribution models like a ramp effectively cause us to
		// shift our "effective nomination date" forward with the survey start date
		return this.LastSurveyStartTimeUtc;
	}

	// endregion
}

export interface ICampaignStateProvider {
	load(): CampaignState[];

	save(campaignStates: CampaignState[]): void;
}

export class CampaignStateProviderFactory {
	public static make(fileBasedStorage: IFloodgateStorageProvider,
		hostBasedStorage: IFloodgateSettingStorageCallback): ICampaignStateProvider {
		if (hostBasedStorage) {
			return new HostBasedCampaignStateProvider(fileBasedStorage, hostBasedStorage);
		}

		return new FileBasedCampaignStateProvider(fileBasedStorage);
	}
}

/**
 * Class representing what is stored in the file.
 */
class FileData {
	// @SerializedName("CampaignStates")
	public CampaignStates: CampaignState[];

}

export class HostBasedCampaignStateProvider implements ICampaignStateProvider {
	private fileBasedStateProvider: ICampaignStateProvider;
	private hostBasedStorage: IFloodgateSettingStorageCallback;

	public constructor(fileBasedStorage: IFloodgateStorageProvider, hostBasedStorage: IFloodgateSettingStorageCallback) {
		if (!hostBasedStorage) {
			throw new Error("host-based storage must not be null");
		}

		this.hostBasedStorage = hostBasedStorage;

		// file-based provider is optional
		if (fileBasedStorage) {
			this.fileBasedStateProvider = new FileBasedCampaignStateProvider(fileBasedStorage);
		}
	}

	// @Override
	public load(): CampaignState[] {
		const statesFromHost: CampaignState[] = this.getStatesFromHost();

		let statesFromFile: CampaignState[];
		if (this.fileBasedStateProvider) {
			statesFromFile = this.fileBasedStateProvider.load();
		}

		const StateCollections = StateProviderHelpers.MergeAndUpdateCampaignStates(statesFromFile, statesFromHost);
		return StateCollections.find(StateListType.Merged);
	}

	// @Override
	public save(campaignStates: CampaignState[]): void {
		if (!campaignStates) {
			return;
		}

		const statesFromHost: CampaignState[] = this.getStatesFromHost();
		const StateCollections = StateProviderHelpers.MergeAndUpdateCampaignStates(campaignStates, statesFromHost);
		const toBeUpdatedStates: CampaignState[] = StateCollections.find(StateListType.ToBeUpdated);
		const mergedStates: CampaignState[] = StateCollections.find(StateListType.Merged);

		// write delta_data to host
		if (toBeUpdatedStates) {
			toBeUpdatedStates.forEach((state) => {
				const stateValue: string = StateProviderHelpers.makeSettingItemValue(JSON.stringify(state));
				this.hostBasedStorage.upsertSettingItem(FileType[FileType.CampaignStates], state.CampaignId, stateValue);
			});
		}

		// Write merged data to File
		if (this.fileBasedStateProvider) {
			this.fileBasedStateProvider.save(mergedStates);
		}
	}

	private getStatesFromHost(): CampaignState[] {
		const states: CampaignState[] = [];
		const settings: IFloodgateSetting = this.hostBasedStorage.readSettingList(FileType[FileType.CampaignStates]);

		for (const key in settings) {
			if (!settings.hasOwnProperty(key)) {
				continue;
			}

			const value = settings[key];
			const dataString: string = StateProviderHelpers.extractSettingItemValueSubString(value);

			let itemObject: any = {};
			try {
				itemObject = JSON.parse(dataString);

				const newState: CampaignState = CampaignState.deserialize(itemObject);
				if (newState) {
					states.push(newState);
				}
			} catch (e) {
				FloodgateEngine.getTelemetryLogger().log_Event(
					TelemetryEvent.HostBasedCampaignStateProvider.GetStatesFromHost.Failed,
					{ ErrorMessage: "Json parsing/deserializing failed. " + e.toString() + ".  Input:" + dataString });
			}
		}

		return states;
	}
}

export class FileBasedCampaignStateProvider implements ICampaignStateProvider {
	private storage: IFloodgateStorageProvider;

	public constructor(storage: IFloodgateStorageProvider) {
		if (!storage) {
			throw new Error("storage must not be null");
		}

		this.storage = storage;
	}

	// @Override
	public load(): CampaignState[] {
		const readString: string = this.storage.read(FileType.CampaignStates);
		if (!readString) {
			return [];
		}

		let fileData: FileData;
		try {
			fileData = JSON.parse(readString);

			const result: CampaignState[] = [];
			if (fileData && fileData.CampaignStates) {
				fileData.CampaignStates.forEach((state) => {
					const newState: CampaignState = CampaignState.deserialize(state);

					if (newState) {
						result.push(newState);
					}
				});
			}

			return result;
		} catch (e) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.FileBasedCampaignStateProvider.Load.Failed,
				{ ErrorMessage: "Json parsing/deserializing failed. " + e.toString() + ".  Input:" + readString });
			return [];
		}
	}

	// @Override
	public save(campaignStates: CampaignState[]): void {
		if (!campaignStates) {
			return;
		}

		const fileData = new FileData();
		fileData.CampaignStates = campaignStates;
		const writeString: string = JSON.stringify(fileData);
		this.storage.write(FileType.CampaignStates, writeString);
	}
}
