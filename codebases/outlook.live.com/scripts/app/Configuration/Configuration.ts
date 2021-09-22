/**
 * Configuration.ts
 *
 * Module for logic relating to the sdk user configuration
 */

import * as Utils from "./../Utils";
import * as Constants from "./../Constants";
import * as Localization from "./../Localization";
import { ICategoryOptions } from "./ICategoryOptions";
import * as IInitOptions from "./IInitOptions";
import * as ILaunchOptions from "./ILaunchOptions";
import IUISurvey from "./../FloodgateCore/UISurvey/IUISurvey";
import { IOnSurveyActivatedCallback, ISurveyLauncher } from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";

export * from "./IInitOptions";
export * from "./ILaunchOptions";

/**
 * Class representing a configuration (user provided options)
 */

export class Configuration {
	/**
	 * Validate category options, default "show" to false if CategoryOptions is not provided.
	 * @param categories Category options
	 * @returns {ICategoryOptions} the validated CategoryOptions
	 */
	private static validateCategoryOptions(categories?: ICategoryOptions): ICategoryOptions {
		if (!categories) {
			return { show: false };
		}

		Utils.expectBoolean(categories.show, "categories.show");
		if (categories.customCategories) {
			Utils.expectArray(categories.customCategories, "categories.customCategories");

			for (let customCategory of categories.customCategories) {
				Utils.expectString(customCategory, "custom category '" + customCategory + "'");
				if (customCategory.length > 20) {
					throw "custom category '" + customCategory + "' too long, max 20 characters.";
				}
			}
		}

		return categories;
	}

	private commonInitOptions: IInitOptions.IInitOptionsCommon;

	private inAppFeedbackInitOptions: IInitOptions.IInitOptionsInAppFeedback;
	private inAppFeedbackLaunchOptions: ILaunchOptions.ILaunchOptionsInAppFeedback;

	private floodgateInitOptions: IInitOptions.IInitOptionsFloodgate;
	private floodgateSurvey: IUISurvey;

	private sdkSessionId: string;

	private eventSampling: IInitOptions.ISamplingInitOption;

	public getCommonInitOptions(): IInitOptions.IInitOptionsCommon {
		return this.commonInitOptions;
	}

	public getInAppFeedbackInitOptions(): IInitOptions.IInitOptionsInAppFeedback {
		return this.inAppFeedbackInitOptions;
	}

	public getInAppFeedbackLaunchOptions(): ILaunchOptions.ILaunchOptionsInAppFeedback {
		return this.inAppFeedbackLaunchOptions;
	}

	public getFloodgateInitOptions(): IInitOptions.IInitOptionsFloodgate {
		return this.floodgateInitOptions;
	}

	public getFloodgateSurvey(): IUISurvey {
		return this.floodgateSurvey;
	}

	public getSdkSessionId(): string {
		if (!this.sdkSessionId) {
			this.sdkSessionId = Utils.guid();
		}

		return this.sdkSessionId;
	}

	public getEventSampling(): IInitOptions.ISamplingInitOption {
		return this.eventSampling;
	}

	/**
	 * Set initOptions for common functionality.
	 */
	public setCommonInitOptions(passedInitOptions: IInitOptions.IInitOptionsCommon) {
		Utils.expectObject(passedInitOptions, "passedInitOptions");
		let initOptions: IInitOptions.IInitOptionsCommon = {
			appId: passedInitOptions.appId,
			applicationGroup: passedInitOptions.applicationGroup || {},
			build: passedInitOptions.build,
			cid: passedInitOptions.cid,
			environment: passedInitOptions.environment,
			intlFilename: passedInitOptions.intlFilename,
			intlUrl: passedInitOptions.intlUrl,
			webSurfacesResourceBaseUrl: passedInitOptions.webSurfacesResourceBaseUrl,
			locale: passedInitOptions.locale,
			onError: passedInitOptions.onError,
			originalLocale: passedInitOptions.locale,
			primaryColour: passedInitOptions.primaryColour,
			secondaryColour: passedInitOptions.secondaryColour,
			sessionId: passedInitOptions.sessionId,
			stylesUrl: passedInitOptions.stylesUrl,
			telemetryGroup: passedInitOptions.telemetryGroup || {},
			userEmail: passedInitOptions.userEmail,
			userEmailConsentDefault: passedInitOptions.userEmailConsentDefault,
			webGroup: passedInitOptions.webGroup || {},
			eventSampling: passedInitOptions.eventSampling,
			petrolTimeout: passedInitOptions.petrolTimeout,
			isCommercialHost: passedInitOptions.isCommercialHost,
		};

		Utils.expectNumber(initOptions.appId, "initOptions.appId");
		if (!(initOptions.appId % 1 === 0 && initOptions.appId > 0)) {
			throw "initOptions.appId is not a positive integer: " + initOptions.appId;
		}

		Utils.expectString(initOptions.stylesUrl, "initOptions.stylesUrl");
		Utils.expectString(initOptions.intlUrl, "initOptions.intlUrl");

		if (initOptions.intlFilename !== undefined) {
			Utils.expectString(initOptions.intlFilename, "initOptions.intlFilename");
		} else {
			initOptions.intlFilename = "officebrowserfeedbackstrings.js";
		}

		Utils.expectNumber(initOptions.environment, "initOptions.environment");
		if (!(initOptions.environment === 1 || initOptions.environment === 0)) {
			throw "initOptions.environment has a bad value: " + initOptions.environment;
		}

		if (initOptions.userEmail !== undefined) {
			Utils.expectString(initOptions.userEmail, "initOptions.userEmail");
		}

		if (initOptions.userEmailConsentDefault !== undefined) {
			Utils.expectBoolean(initOptions.userEmailConsentDefault, "initOptions.userEmailConsentDefault");
		}

		if (initOptions.sessionId !== undefined) {
			Utils.expectString(initOptions.sessionId, "initOptions.sessionId");
		} else {
			initOptions.sessionId = "00000000-0000-0000-0000-000000000000";
		}

		// Copy sessionID over to telemetryGroup
		initOptions.telemetryGroup.processSessionId = initOptions.sessionId;

		if (initOptions.cid !== undefined) {
			Utils.expectString(initOptions.cid, "initOptions.cid");

			// Copy cid over to extendedManifestData of applicationGroup
			initOptions.applicationGroup.extendedManifestData = JSON.stringify({ cid: initOptions.cid });
		}

		if (initOptions.build !== undefined) {
			Utils.expectString(initOptions.build, "initOptions.build");
			let buildRegex = "^[0-9]{1,9}(\\.[0-9]{1,9})?(\\.[0-9]{1,9})?(\\.[0-9]{1,9})?$";
			if (!new RegExp(buildRegex).test(initOptions.build)) {
				initOptions.build = "0.0.0.0";
			}
		} else {
			initOptions.build = "0.0.0.0";
		}
		// Copy build over to telemetryGroup
		initOptions.telemetryGroup.officeBuild = initOptions.build;

		let hexColourRegex = new RegExp("^#[0-9a-f]{3}([0-9a-f]{3})?$", "i");
		if (initOptions.primaryColour !== undefined) {
			if (!hexColourRegex.test(initOptions.primaryColour)) {
				initOptions.primaryColour = undefined;
			}
		}

		if (initOptions.secondaryColour !== undefined) {
			if (!hexColourRegex.test(initOptions.secondaryColour)) {
				initOptions.secondaryColour = undefined;
			}
		}

		if (initOptions.locale !== undefined) {
			Utils.expectString(initOptions.locale, "initOptions.locale");
			initOptions.locale = Localization.validate(initOptions.locale);
		} else {
			initOptions.locale = "en";
		}

		if (initOptions.onError === undefined) {
			initOptions.onError = (err: string) => { return; };
		}

		if (initOptions.petrolTimeout !== undefined) {
			Utils.expectNumber(initOptions.petrolTimeout, "initOptions.petrolTimeout");
		}

		this.eventSampling = this.parseEventSamplingOption(initOptions.eventSampling);

		this.commonInitOptions = initOptions;

		if (initOptions.isCommercialHost === undefined || initOptions.isCommercialHost == null) {
			initOptions.isCommercialHost = false; // By default privacy consent is not shown. (From SDK's perspective)
		} else {
			Utils.expectBoolean(initOptions.isCommercialHost, "initOptions.isCommercialHost");
		}
	}

	/**
	 * Set init options for inAppFeedback
	 */
	public setInAppFeedbackInitOptions(passedInitOptions: IInitOptions.IInitOptionsInAppFeedback) {
		Utils.expectObject(passedInitOptions, "passedInitOptions");

		let initOptions: IInitOptions.IInitOptionsInAppFeedback = {
			bugForm: passedInitOptions.bugForm,
			onDismiss: passedInitOptions.onDismiss,
			screenshot: passedInitOptions.screenshot,
			showEmailAddress: passedInitOptions.showEmailAddress,
			userEmail: passedInitOptions.userEmail,
			userVoice: passedInitOptions.userVoice !== undefined ?
				{
					url: passedInitOptions.userVoice.url,
				} :
				undefined,
				transitionEnabled: passedInitOptions.transitionEnabled,
			isShowThanks: passedInitOptions.isShowThanks,
		};

		if (initOptions.onDismiss === undefined) {
			initOptions.onDismiss = function (submitted: boolean) { return; };
		}

		if (initOptions.bugForm !== undefined) {
			Utils.expectBoolean(initOptions.bugForm, "initOptions.bugForm");
		} else {
			initOptions.bugForm = false;
		}

		if (initOptions.userEmail !== undefined) {
			Utils.expectString(initOptions.userEmail, "initOptions.userEmail");
		}

		if (initOptions.screenshot !== undefined) {
			Utils.expectBoolean(initOptions.screenshot, "initOptions.screenshot");
		} else {
			initOptions.screenshot = true;
		}

		if (initOptions.showEmailAddress !== undefined) {
			Utils.expectBoolean(initOptions.showEmailAddress, "initOptions.showEmailAddress");
		} else {
			initOptions.showEmailAddress = true;
		}

		if (initOptions.userVoice !== undefined) {
			Utils.expectObject(initOptions.userVoice, "initOptions.userVoice");
			Utils.expectString(initOptions.userVoice.url, "initOptions.userVoice.url");
		}

		if (initOptions.isShowThanks !== undefined) {
			Utils.expectBoolean(initOptions.isShowThanks, "initOptions.isShowThanks");
		} else {
			initOptions.isShowThanks = false;
		}

		if (initOptions.transitionEnabled === undefined) {
			initOptions.transitionEnabled = true;
		}

		this.inAppFeedbackInitOptions = initOptions;
	}

	/**
	 * Set launch options for inAppFeedback
	 */
	public setInAppFeedbackLaunchOptions(launchOptions?: ILaunchOptions.ILaunchOptionsInAppFeedback) {
		if (!this.commonInitOptions) {
			throw "commonInitOptions not set";
		}

		if (!launchOptions) {
			launchOptions = {};
		}

		// Override any setting done in LaunchOptions for the metadataGroups
		this.commonInitOptions.applicationGroup = Utils.overrideValues(launchOptions.applicationGroup,
			this.commonInitOptions.applicationGroup);
		this.commonInitOptions.telemetryGroup = Utils.overrideValues(launchOptions.telemetryGroup,
			this.commonInitOptions.telemetryGroup);
		this.commonInitOptions.webGroup = Utils.overrideValues(launchOptions.webGroup,
			this.commonInitOptions.webGroup);

		launchOptions.categories = Configuration.validateCategoryOptions(launchOptions.categories);

		this.inAppFeedbackLaunchOptions = launchOptions;
	}

	/**
	 * Set init options for floodgate
	 */
	public setFloodgateInitOptions(passedInitOptions: IInitOptions.IInitOptionsFloodgate) {
		Utils.expectObject(passedInitOptions, "passedInitOptions");

		let initOptions: IInitOptions.IInitOptionsFloodgate = {
			autoDismiss: passedInitOptions.autoDismiss,
			campaignDefinitions: passedInitOptions.campaignDefinitions,
			campaignFlights: passedInitOptions.campaignFlights,
			campaignQueryParameters: passedInitOptions.campaignQueryParameters,
			onDismiss: passedInitOptions.onDismiss,
			onSurveyActivatedCallback: passedInitOptions.onSurveyActivatedCallback,
			settingStorageCallback: passedInitOptions.settingStorageCallback,
			uIStringGetter: passedInitOptions.uIStringGetter,
			authTokenCallback: passedInitOptions.authTokenCallback,
			surveyEnabled: passedInitOptions.surveyEnabled,
			showEmailAddress: passedInitOptions.showEmailAddress,
			augLoopCallback: passedInitOptions.augLoopCallback,
		};

		if (initOptions.autoDismiss === undefined) {
			initOptions.autoDismiss = Constants.AutoDismissValues.NoAutoDismiss;
		}

		if (initOptions.onDismiss === undefined) {
			initOptions.onDismiss = (campaignId: string, submitted: boolean) => { return; };
		}

		if (initOptions.onSurveyActivatedCallback === undefined) {
			let defaultOnSurveyActivatedCallback: IOnSurveyActivatedCallback = {
				onSurveyActivated(launcher: ISurveyLauncher): void {
					launcher.launch();
				},
			};

			initOptions.onSurveyActivatedCallback = defaultOnSurveyActivatedCallback;
		}

		if (initOptions.uIStringGetter === undefined) {
			initOptions.uIStringGetter = (str: string) => str; // By default return the string as is.
		}

		if (initOptions.surveyEnabled === undefined) {
			initOptions.surveyEnabled = true; // By default surveys are enabled. (From SDK's perspective)
		} else {
			Utils.expectBoolean(initOptions.surveyEnabled, "surveyEnabled");
		}

		if (initOptions.showEmailAddress !== undefined) {
			Utils.expectBoolean(initOptions.showEmailAddress, "initOptionsFloodgate.showEmailAddress");
		} else {
			initOptions.showEmailAddress = true;  // By default email field and collection is enabled. (From SDK's perspective)
		}

		this.floodgateInitOptions = initOptions;
	}

	/**
	 * Set the floodgate survey
	 */
	public setFloodgateSurvey(survey: IUISurvey): void {
		this.floodgateSurvey = survey;
	}

	// Checks if the surveyEnabled policy is true or false.
	public checkIfSurveysEnabled(): boolean {
		// If no floodgateInitOptions defined, return true for surveyEnabled
		return this.floodgateInitOptions ? this.floodgateInitOptions.surveyEnabled : true;
	}

	private parseEventSamplingOption(samplingOptions: IInitOptions.ISamplingEvent[]): IInitOptions.ISamplingInitOption {
		let eventInitSampling: IInitOptions.ISamplingInitOption = { event: {} };
		if (samplingOptions !== undefined) {
			// Iterating through init options
			for (const index in samplingOptions) {
				if (samplingOptions.hasOwnProperty(index)) {
					// Check for correct Type
					switch (samplingOptions[index].type) {
						case "Event":
							// Parsing the Name and SampleRate
							let sampleRate = samplingOptions[index].sampleRate;
							Utils.expectNumber(sampleRate, "initOption.EventSampling.SampleRate");
							Utils.expectString(samplingOptions[index].name, "initOption.EventSampling.Name");
							// check the range for sampling percentage
							if (sampleRate < 0 || sampleRate > 1) {
								throw "initOption.EventSampling." + samplingOptions[index].name + ".SampleRate is out of range";
							}
							// finally, save the sampling event
							eventInitSampling.event[samplingOptions[index].name] = sampleRate;
							break;
						default:
							throw "initOption.EventSampling.Type value is not recognized";
					}
				}
			}
		}
		return eventInitSampling;
	}
}

let configuration: Configuration = new Configuration();

/**
 * Get the current configuration
 */
export function get(): Configuration {
	return configuration;
}

/**
 * Validate feedbackType
 * @param feedbackType feedbackType
 * @returns {Constants.FeedbackType} the validated feedbackType
 */
export function validateFeedbackType(feedbackType: string): Constants.FeedbackType {
	Utils.expectString(feedbackType, "feedbackType");

	if (feedbackType === Constants.FeedbackType[Constants.FeedbackType.Smile]) {
		return Constants.FeedbackType.Smile;
	} else if (feedbackType === Constants.FeedbackType[Constants.FeedbackType.Frown]) {
		return Constants.FeedbackType.Frown;
	} else if (feedbackType === Constants.FeedbackType[Constants.FeedbackType.Bug]) {
		return Constants.FeedbackType.Bug;
	} else {
		throw "feedbackType should be one of Smile, Frown or Bug";
	}
}
