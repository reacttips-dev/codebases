import { IFloodgateSetting } from "./Api/IFloodgateSetting";
import { IFloodgateSettingStorageCallback } from "./Api/IFloodgateSettingStorageCallback";
import * as IFloodgateStorageProvider from "./Api/IFloodgateStorageProvider";
import { TelemetryEvent } from "./Constants";
import { FloodgateEngine } from "./FloodgateEngine";
import { GovernedChannelType } from "./GovernedChannel";
import * as StateProviderHelpers from "./StateProviderHelpers";
import * as Utils from "./Utils";
import FileType = IFloodgateStorageProvider.FileType;
import StateListType = StateProviderHelpers.StateListType;

export class GovernedChannelState {
	/**
	 * Method to deserialize a JSON object to class object
	 * @param input: JSON object
	 * Returns class object
	 */
	public static deserialize(input: any): GovernedChannelState {
		let result: GovernedChannelState;

		if (!input) {
			return null;
		}

		// Validation is handled by GovernedChannelState's constructor
		try {
			result = new GovernedChannelState(
				input.ChannelType,
				input.CooldownStartTimeUtc,
			);
		} catch (e) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.GovernedChannelState.Deserialize.Failed, { ErrorMessage: e.toString() });
			return null;
		}

		return result;
	}

	// @SerializedName("ChannelType")
	private ChannelType: GovernedChannelType;

	// @SerializedName("CooldownStartTimeUtc")
	private CooldownStartTimeUtc: Date;

	public constructor(type: GovernedChannelType, cooldownStartTime: Date) {
		this.ChannelType = type;
		this.CooldownStartTimeUtc = cooldownStartTime;

		if (!this.validate()) {
			throw new Error("Constructor arguments are not valid");
		}
	}

	public validate(): boolean {
		if (!Utils.isEnumValue(this.ChannelType, GovernedChannelType)) {
			return false;
		}

		// make it a date object if it's a valid UTC date time value
		if (Utils.isUtcDatetimeString(this.CooldownStartTimeUtc)) {
			this.CooldownStartTimeUtc = Utils.stringToDate(this.CooldownStartTimeUtc);
		// Allow null and bad cooldownStartTime
		} else if (Utils.isNOU(this.CooldownStartTimeUtc) || !Utils.isDate(this.CooldownStartTimeUtc)) {
			this.CooldownStartTimeUtc = Utils.getDistantPast();
		}

		return true;
	}

	public getType(): GovernedChannelType {
		return this.ChannelType;
	}

	public getCooldownStartTime(): Date {
		return this.CooldownStartTimeUtc;
	}
}

export interface IGovernedChannelStateProvider {
	load(): GovernedChannelState[];

	save(channels: GovernedChannelState[]): void;
}

export class GovernedChannelStateProviderFactory {
	public static make(fileBasedStorage: IFloodgateStorageProvider,
		hostBasedStorage: IFloodgateSettingStorageCallback): IGovernedChannelStateProvider {
		if (hostBasedStorage) {
			return new HostBasedGovernedChannelStateProvider(fileBasedStorage, hostBasedStorage);
		}

		return new FileBasedGovernedChannelStateProvider(fileBasedStorage);
	}
}

/**
 * Class representing what is stored in the file.
 */
class FileData {
	// @SerializedName("ChannelStates")
	public ChannelStates: GovernedChannelState[];
}

export class HostBasedGovernedChannelStateProvider implements IGovernedChannelStateProvider {
	private fileBasedStateProvider: IGovernedChannelStateProvider;
	private hostBasedStorage: IFloodgateSettingStorageCallback;

	public constructor(fileBasedStorage: IFloodgateStorageProvider, hostBasedStorage: IFloodgateSettingStorageCallback) {
		if (!hostBasedStorage) {
			throw new Error("host-based storage must not be null");
		}

		this.hostBasedStorage = hostBasedStorage;

		// file-based provider is optional
		if (fileBasedStorage) {
			this.fileBasedStateProvider = new FileBasedGovernedChannelStateProvider(fileBasedStorage);
		}
	}

	// @Override
	public load(): GovernedChannelState[] {
		const statesFromHost: GovernedChannelState[] = this.getStatesFromHost();

		let statesFromFile: GovernedChannelState[];
		if (this.fileBasedStateProvider) {
			statesFromFile = this.fileBasedStateProvider.load();
		}

		const StateCollections = StateProviderHelpers.MergeAndUpdateGovernedChannelStates(statesFromFile, statesFromHost);
		return StateCollections.find(StateListType.Merged);
	}

	// @Override
	public save(states: GovernedChannelState[]): void {
		if (!states) {
			return;
		}

		const statesFromHost: GovernedChannelState[] = this.getStatesFromHost();
		const StateCollections = StateProviderHelpers.MergeAndUpdateGovernedChannelStates(states, statesFromHost);
		const toBeUpdatedStates: GovernedChannelState[] = StateCollections.find(StateListType.ToBeUpdated);
		const mergedStates: GovernedChannelState[] = StateCollections.find(StateListType.Merged);

		// write delta_data to Host
		if (toBeUpdatedStates) {
			toBeUpdatedStates.forEach((state) => {
				const stateValue: string = StateProviderHelpers.makeSettingItemValue(JSON.stringify(state));
				this.hostBasedStorage.upsertSettingItem(FileType[FileType.GovernedChannelStates], String(state.getType()), stateValue);
			});
		}

		// Write merged data to File
		if (this.fileBasedStateProvider) {
			this.fileBasedStateProvider.save(mergedStates);
		}
	}

	private getStatesFromHost(): GovernedChannelState[] {
		const states: GovernedChannelState[] = [];
		const settings: IFloodgateSetting = this.hostBasedStorage.readSettingList(FileType[FileType.GovernedChannelStates]);

		for (const key in settings) {
			if (!settings.hasOwnProperty(key)) {
				continue;
			}

			const value = settings[key];
			const dataString: string = StateProviderHelpers.extractSettingItemValueSubString(value);

			let itemObject: any = {};
			try {
				itemObject = JSON.parse(dataString);

				const newState: GovernedChannelState = GovernedChannelState.deserialize(itemObject);
				if (newState) {
					states.push(newState);
				}
			} catch (e) {
				FloodgateEngine.getTelemetryLogger().log_Event(
					TelemetryEvent.HostBasedGovernedChannelStateProvider.GetStatesFromHost.Failed,
					{ ErrorMessage: "Json parsing/deserializing failed. " + e.toString() + ".  Input:" + dataString });
			}
		}

		return states;
	}
}

export class FileBasedGovernedChannelStateProvider implements IGovernedChannelStateProvider {
	private storage: IFloodgateStorageProvider;

	public constructor(storage: IFloodgateStorageProvider) {
		if (!storage) {
			throw new Error("storage must not be null");
		}

		this.storage = storage;
	}

	// @Override
	public load(): GovernedChannelState[] {
		// Load channel state from file using _storageProvider (get back string)
		const readString: string = this.storage.read(FileType.GovernedChannelStates);
		if (!readString) {
			return [];
		}

		let fileData: FileData;
		try {
			fileData = JSON.parse(readString);

			const result: GovernedChannelState[] = [];

			if (fileData && fileData.ChannelStates) {
				fileData.ChannelStates.forEach((state) => {
					const newState: GovernedChannelState = GovernedChannelState.deserialize(state);

					if (newState) {
						result.push(newState);
					}
				});
			}

			return result;
		} catch (e) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.FileBasedGovernedChannelStateProvider.Load.Failed,
				{ ErrorMessage: "Json parsing/deserializing failed. " + e.toString() + ".  Input:" + readString });
			return [];
		}
	}

	// @Override
	public save(states: GovernedChannelState[]): void {
		if (!states) {
			return;
		}

		const fileData = new FileData();
		fileData.ChannelStates = states;
		const writeString: string = JSON.stringify(fileData);

		this.storage.write(FileType.GovernedChannelStates, writeString);
	}
}
