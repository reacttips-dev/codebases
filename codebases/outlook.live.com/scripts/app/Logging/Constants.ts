/**
 * Constants.ts
 *
 * Module to hold logging-related constants
 */

export interface ICustomProperties {
	CampaignId?: string;
	CorrelationId?: string;
	Count?: number;
	Data?: string;
	ErrorMessage?: string;
	FeedbackType?: number;
	PanelType?: number;
	FileName?: string;
	Flights?: string;
	HttpStatusCode?: number;
	HttpStatusText?: string;
	IsBugEnabled?: boolean;
	IsDiagnosticsIncluded?: boolean;
	IsEmailIncluded?: boolean;
	IsEmailPolicyEnabled?: boolean;
	IsIdeaEnabled?: boolean;
	IsScreenshotIncluded?: boolean;
	Message?: string;
	SessionId?: string;
	SurveyId?: string;
	SurveyType?: number;
	TimeMilliseconds?: number;
	Type?: string;
	ClientFeedbackId?: string;
	PromptAutoDismiss?: string;
	AdditionalSurveyInfo?: string;
	SurveyActivityInfo?: string;
}

export interface IEventId {
	name: string;
}

export class EventIds {
	public static InApp = class {
		public static UI = class {
			public static Picker = class {
				public static Shown = class {
					public static VALUE: IEventId = { name: "InApp_UI_Picker_Shown" };
				};
			};

			public static Form = class {
				public static Shown = class {
					public static VALUE: IEventId = { name: "InApp_UI_Form_Shown" };
				};

				public static Submit = class {
					public static VALUE: IEventId = { name: "InApp_UI_Form_Submit" };
				};
			};
		};
	};

	// This saves ~400 bytes (minified) vs nested classes
	public static SURVEY_FLOODGATE_CAMPAIGNLOAD_FAILED: IEventId = { name: "Survey_Floodgate_CampaignLoad_Failed" };
	public static SURVEY_FLOODGATE_FILEREAD_FAILED: IEventId = { name: "Survey_Floodgate_FileRead_Failed" };
	public static SURVEY_FLOODGATE_FILEWRITE_FAILED: IEventId = { name: "Survey_Floodgate_FileWrite_Failed" };
	public static SURVEY_FLOODGATE_TRIGGERMET: IEventId = { name: "Survey_Floodgate_TriggerMet" };
	public static SURVEY_FLOODGATE_USERSELECTED: IEventId = { name: "Survey_Floodgate_UserSelected" };
	public static SURVEY_UI_FORM_SHOWN: IEventId = { name: "Survey_UI_Form_Shown" };
	public static SURVEY_UI_FORM_SUBMIT: IEventId = { name: "Survey_UI_Form_Submit" };
	public static SURVEY_UI_FORM_USERCLOSED: IEventId = { name: "Survey_UI_Form_UserClosed" };
	public static SURVEY_UI_PROMPT_AUTODISMISSED: IEventId = { name: "Survey_UI_Prompt_AutoDismissed" };
	public static SURVEY_UI_PROMPT_SHOWN: IEventId = { name: "Survey_UI_Prompt_Shown" };
	public static SURVEY_UI_PROMPT_USERCLOSED: IEventId = { name: "Survey_UI_Prompt_UserClosed" };
	public static SURVEY_UI_PROMPT_CLICKED: IEventId = { name: "Survey_UI_Prompt_Clicked" };
	public static SURVEY_UI_REDIRECTIONFAILURE: IEventId = { name: "Survey_UI_RedirectionFailure" };

	public static Shared = class {
		public static Upload = class {
			public static Failed = class {
				public static VALUE: IEventId = { name: "Shared_Upload_Failed" };
			};
		};

		public static Screenshot = class {
			public static Render = class {
				public static Failed = class {
					public static VALUE: IEventId = { name: "Shared_Screenshot_Render_Failed" };
				};
				public static Success = class {
					public static VALUE: IEventId = { name: "Shared_Screenshot_Render_Success" };
				};
			};

			public static GetContent = class {
				public static Failed = class {
					public static DefaultImage = class {
						public static Returned = class {
							public static VALUE: IEventId = { name: "Shared_Screenshot_GetContent_Failed_DefaultImage_Returned" };
						};
					};
				};
			};
		};
	};

	public static WebSurfaces = class {
		public static Common = class {
			public static Error = class {
				public static VALUE: IEventId = { name: "WebSurfaces_Common_Error" };
			};
			public static Info = class {
				public static VALUE: IEventId = { name: "WebSurfaces_Common_Info" };
			};
		};

		public static Messaging = class {
			public static Requests = class {
				public static VALUE: IEventId = { name: "WebSurfaces_Messaging_Requests" };
			};
		};
	};

	public static UserFacts = class {
		public static Common = class {
			public static Error = class {
				public static VALUE: IEventId = { name: "UserFacts_Common_Error" };
			};
			public static Info = class {
				public static VALUE: IEventId = { name: "UserFacts_Common_Info" };
			};
		};

		public static Messaging = class {
			public static Requests = class {
				public static VALUE: IEventId = { name: "UserFacts_Messaging_Requests" };
			};
		};

		public static AugLoop = class {
			public static Requests = class {
				public static VALUE: IEventId = { name: "UserFacts_AugLoop_Requests" };
			};
			public static Error = class {
				public static VALUE: IEventId = { name: "UserFacts_AugLoop_Error" };
			};
		};

		public static Provider = class {
			public static Info = class {
				public static VALUE: IEventId = { name: "UserFacts_Provider_Summary" };
			};
		};
	};

	public static Common = class {
		public static Error = class {
			public static VALUE: IEventId = { name: "Common_Error" };
		};
		public static Info = class {
			public static VALUE: IEventId = { name: "Common_Info" };
		};
	};
}
