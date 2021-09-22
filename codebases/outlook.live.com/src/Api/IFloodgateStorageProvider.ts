/**
 * Interface for storing and retrieving floodgate-specific data from storage
 */
interface IFloodgateStorageProvider {
	/**
	 * Lock the file to prevent access from another process.
	 */
	fileLock(fileType: IFloodgateStorageProvider.FileType): void;

	/**
	 * Unlock the file.
	 */
	fileUnlock(fileType: IFloodgateStorageProvider.FileType): void;

	/**
	 * Read the file
	 */
	read(fileType: IFloodgateStorageProvider.FileType): string;

	/**
	 * Write to the file
	 */
	write(fileType: IFloodgateStorageProvider.FileType, content: string): void;
}

module IFloodgateStorageProvider {
	/**
	 * Enum for the files used by floodgate
	 */
	export enum FileType {
		FloodgateSettings,
		SurveyActivationStats,
		SurveyEventActivityStats,
		CampaignDefinitions,
		CampaignStates,
		GovernedChannelStates,
		TmsCache_MessageMetadata,
		TmsCache_UserGovernance,
		TmsCache_CampaignContent,
		Tms_DynamicSettings,
		LogLevelSettings,
		UserFacts,
		DebugOverrides,
	}
}

export = IFloodgateStorageProvider;
