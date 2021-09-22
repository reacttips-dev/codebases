/**
 * Interface for a collection of Floodgate setting names and ids
 */
interface IFloodgateSettingIdMap {
	readonly [key: string]: number;
}

module IFloodgateSettingIdMap {
	/**
	 * Collection of setting names and ids
	 */
	export const RoamingSettingIdMap = {
		CampaignStates: 1258,
		GovernedChannelStates: 1257,
		SurveyActivationStats: 1259,
	};
}

export = IFloodgateSettingIdMap;
