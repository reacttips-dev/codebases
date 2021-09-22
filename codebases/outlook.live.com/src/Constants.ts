/**
 * Constants.ts
 *
 * A module for all the constants.
 */

/**
 * Telemetry events
 */
export class TelemetryEvent {
	public static CampaignState = class {
		public static Deserialize = class {
			public static Failed: string = "FloodgateCore_CampaignState_Deserialize_Failed";
		};
	};

	public static FileBasedCampaignStateProvider = class {
		public static Load = class {
			public static Failed: string = "FloodgateCore_FileBasedCampaignStateProvider_Load_Failed";
		};
	};

	public static HostBasedCampaignStateProvider = class {
		public static GetStatesFromHost = class {
			public static Failed: string = "FloodgateCore_HostBasedCampaignStateProvider_GetStatesFromHost_Failed";
		};
	};

	public static Floodgate = class {
		public static Initialize = class {
			public static Failed: string = "FloodgateCore_Floodgate_Initialize_Failed";
		};

		public static Start = class {
			public static Failed: string = "FloodgateCore_Floodgate_Start_Failed";
			public static Warning: string = "FloodgateCore_Floodgate_Start_Warning";
			public static SurveysDisabled: string = "FloodgateCore_Floodgate_Start_SurveysDisabled";
		};

		public static UserFactsLoad = class {
			public static Failed: string = "FloodgateCore_Floodgate_UserFactsLoad_Failed";
		};

		public static UserFactsSpecDeserialization = class {
			public static Failed: string = "FloodgateCore_Floodgate_UserFactsSpecDeserialization_Failed";
		};

		public static UserFactsSpecIsAMatch = class {
			public static Failed: string = "FloodgateCore_Floodgate_UserFactsSpecIsAMatch_Failed";
			public static Mismatch: string = "FloodgateCore_Floodgate_UserFactsSpecIsAMatch_Mismatch";
			public static Summary: string = "FloodgateCore_Floodgate_UserFactsSpecIsAMatch_Summary";
		};
	};

	public static FloodgateEngine = class {
		public static Make = class {
			public static Failed: string = "FloodgateCore_FloodgateEngine_Make_Failed";
		};

		public static Common = class {
			public static Error: string = "FloodgateCore_FloodgateEngine_Common_Error";
		};

		public static Start = class {
			public static Failed: string = "FloodgateCore_FloodgateEngine_Start_Failed";
		};

		public static StartAsync = class {
			public static Failed: string = "FloodgateCore_FloodgateEngine_StartAsync_Failed";
			public static Stopped: string = "FloodgateCore_FloodgateEngine_StartAsync_Stopped";
		};

		public static OnSurveyActivated = class {
			public static ActivationStatsSuppressedSurvey: string = "FloodgateCore_FloodgateEngine_OnSurveyActivated_ActivationStatsSuppressedSurvey";
			public static ClosedChannelType: string = "FloodgateCore_FloodgateEngine_OnSurveyActivated_ClosedChannelType";
			public static SurveyNotDefined: string = "FloodgateCore_FloodgateEngine_OnSurveyActivated_SurveyNotDefined";
		};
	};

	public static GovernedChannelState = class {
		public static Deserialize = class {
			public static Failed: string = "FloodgateCore_GovernedChannelState_Deserialize_Failed";
		};
	};

	public static FileBasedGovernedChannelStateProvider = class {
		public static Load = class {
			public static Failed: string = "FloodgateCore_FileBasedGovernedChannelStateProvider_Load_Failed";
		};
	};

	public static HostBasedGovernedChannelStateProvider = class {
		public static GetStatesFromHost = class {
			public static Failed: string = "FloodgateCore_HostBasedGovernedChannelStateProvider_GetStatesFromHost_Failed";
		};
	};

	public static SurveyStatCollectionActivation = class {
		public static FromJson = class {
			public static Failed: string = "FloodgateCore_SurveyStatCollectionActivation_FromJson_Failed";
		};

		public static ToJson = class {
			public static Failed: string = "FloodgateCore_SurveyStatCollectionActivation_ToJson_Failed";
		};
	};

	public static HostBasedSurveyActivationStatsProvider = class {
		public static GetSurveyStatsFromHost = class {
			public static Failed: string = "FloodgateCore_HostBasedSurveyActivationStatsProvider_GetSurveyStatsFromHost_Failed";
		};
	};

	public static SurveyStatCollectionEventActivity = class {
		public static FromJson = class {
			public static Failed: string = "FloodgateCore_SurveyStatCollectionEventActivity_FromJson_Failed";
		};

		public static ToJson = class {
			public static Failed: string = "FloodgateCore_SurveyStatCollectionEventActivity_ToJson_Failed";
		};
	};

	public static SurveyActivity = class {
		public static LogActivity = class {
			public static EventsReprocessed: string = "FloodgateCore_SurveyActivity_LogActivity_EventsReprocessed";
		};

		public static SetActivityTrackingContracts = class {
			public static DuplicateSurveyID: string = "FloodgateCore_SurveyActivity_SetActivityTrackingContracts_DuplicateSurveyID";
		};
	};
}
