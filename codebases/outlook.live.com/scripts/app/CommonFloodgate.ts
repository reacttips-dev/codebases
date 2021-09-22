/**
 * CommonFloodgate.ts
 *
 * Common functionalities shared by App_Floodgate and App_Floodgate_Bare modules.
 */

import * as Configuration from "./Configuration/Configuration";
import * as Window from "./Window/Window";
import AdaptiveSurveyLauncherFactory from "./FloodgateCore/AdaptiveSurveyLauncherFactory";
import TransporterFactory from "./FloodgateCore/TransporterFactory";
import FloodgateEnvironmentProvider from "./FloodgateCore/FloodgateEnvironmentProvider";
import FloodgateStorageProvider from "./FloodgateCore/FloodgateStorageProvider";
import FloodgateStringProvider from "./FloodgateCore/FloodgateStringProvider";
import { TargetedMessagingCampaignDefinitionProvider } from
	"./TargetedMessaging/TargetedMessagingCampaignDefinitionProvider";
import { UserFactsProvider } from "./TargetedMessaging/UserFactsProvider";

import * as Api from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";
import { FloodgateEngine } from "@ms-ofb/officefloodgatecore";
import { FilterValidCampaignDefinitions } from
	"@ms-ofb/officefloodgatecore/dist/src/Campaign/CampaignDefinitionProvider";
import { IFloodgateStorageProvider } from "@ms-ofb/officefloodgatecore/dist/src/Api/Api";
import { TelemetryEvent } from "@ms-ofb/officefloodgatecore/dist/src/Constants";

import { getDynamicSetting, SettingKey } from "./Configuration/DynamicConfiguration";

import { Governor } from "@ms-ofb/officefloodgatecore/dist/src/Governor";
import { GovernedChannelType } from "@ms-ofb/officefloodgatecore/dist/src/GovernedChannel";
import SurveyActivityListener from "@ms-ofb/officefloodgatecore/dist/src/SurveyActivityListener";

/**
 * Has floodgate been initialized
 */
let initialized: boolean = false;
let startCount: number = 0;

let engine: FloodgateEngine;
let engineStartPromise: Promise<any> = null;
let engineTmsProvider: TargetedMessagingCampaignDefinitionProvider = null;
let userFactsProvider: UserFactsProvider = null;
let stringProvider: Api.IFloodgateStringProvider;

export function initialize(): void {
	if (!FloodgateStorageProvider.isStorageAvailable()) {
		throw new Error("window.localStorage is not available.");
	}

	Window.get().OfficeBrowserFeedback.floodgate = Window.get().OfficeBrowserFeedback.floodgate || {} as any;

	let floodgateInitOptions = Window.get().OfficeBrowserFeedback.floodgate.initOptions;
	floodgateInitOptions = floodgateInitOptions || {} as any;

	// Validate and copy campaign definitions to local storage
	if (floodgateInitOptions.campaignDefinitions !== undefined) {
		const filteredResult = FilterValidCampaignDefinitions(floodgateInitOptions.campaignDefinitions);

		if (filteredResult.error) {
			throw new Error("floodgate.initOptions.campaignDefinitions error: " + filteredResult.error);
		}

		(new FloodgateStorageProvider()).write(
			IFloodgateStorageProvider.FileType.CampaignDefinitions,
			JSON.stringify(floodgateInitOptions.campaignDefinitions)
		);
	}

	Configuration.get().setFloodgateInitOptions(floodgateInitOptions);
	SurveyActivityListener.resetSessionActivity();
	initialized = true;

	if (!Configuration.get().getFloodgateInitOptions().surveyEnabled) {
		const telemetryLogger = FloodgateEngine.getTelemetryLogger();
		if (telemetryLogger) {
			telemetryLogger.log_Event(TelemetryEvent.Floodgate.Start.SurveysDisabled,
				{ Count: startCount, Message: "Floodgate initialized with surveys disabled (surveyEnabled is false)" });
		}
	}
}

export function setInitialized(initValue: boolean): void {
	initialized = initValue;
}

export function getInitialized(): boolean {
	return initialized;
}

export function setEngineStartPromise(startPromise: Promise<any>): any {
	engineStartPromise = startPromise;
}

export function getEngineStartPromise(): Promise<any> {
	return engineStartPromise;
}

export function setStringProvider(provider: Api.IFloodgateStringProvider): void {
	stringProvider = provider;
}

/**
 * To support the multi-window scenario on web we need to initialize the engine on each resume.
 * Hence this separate method which does make() and start() together.
 */
export function startInternal(loadSynchronously: boolean, customEngine: FloodgateEngine = null): Promise<any> {
	if (engineStartPromise) {
		return engineStartPromise;
	}

	startCount++;
	const startPromise = new Promise((resolve, reject) => {
		const rejectAndLogError = (errorMessage: string, error?: Error) => {
			const telemetryLogger = FloodgateEngine.getTelemetryLogger();
			if (telemetryLogger) {
				telemetryLogger.log_Event(TelemetryEvent.Floodgate.Start.Failed,
					{ Count: startCount, ErrorMessage: errorMessage, ErrorDetails: error && error.stack });
			}

			reject(errorMessage);
		};

		try {
			const commonInitOptions = Configuration.get().getCommonInitOptions();
			if (!commonInitOptions) {
				rejectAndLogError("Invalid floodgate common init options, state: " + initialized);
				return;
			}

			let floodgateInitOptions = Configuration.get().getFloodgateInitOptions();
			if (!floodgateInitOptions) {
				const telemetryLogger = FloodgateEngine.getTelemetryLogger();
				if (telemetryLogger) {
					telemetryLogger.log_Event(TelemetryEvent.Floodgate.Start.Warning,
						{ Count: startCount, ErrorMessage: "Invalid floodgate init options, state: " + initialized });
				}

				Configuration.get().setFloodgateInitOptions({} as any);
				floodgateInitOptions = Configuration.get().getFloodgateInitOptions();
			}

			if (!customEngine && !engineTmsProvider) {
				// AssetsProvider wraps auth callbacks which should not run every time we start()
				const authTokenCallback = floodgateInitOptions && floodgateInitOptions.authTokenCallback;
				if (authTokenCallback) {
					engineTmsProvider = new TargetedMessagingCampaignDefinitionProvider();
					userFactsProvider = new UserFactsProvider();
				}
			}

			const currentTeachingCooldown = Governor.GetChannelCoolDown(GovernedChannelType.TeachingMessage);
			const teachingCooldown = getDynamicSetting(SettingKey.teachingMessageCooldown, currentTeachingCooldown);
			Governor.SetDefaultChannelCoolDown(GovernedChannelType.TeachingMessage, teachingCooldown);

			engine = customEngine || FloodgateEngine.make(
				commonInitOptions.build || "",
				AdaptiveSurveyLauncherFactory.make(),
				floodgateInitOptions.onSurveyActivatedCallback,
				new FloodgateStorageProvider(),
				floodgateInitOptions.settingStorageCallback,
				stringProvider ? stringProvider : new FloodgateStringProvider(),
				new FloodgateEnvironmentProvider(),
				new TransporterFactory(),
				[engineTmsProvider],
				userFactsProvider,
			);

			if (!engine) {
				setEngineStartPromise(null);
				rejectAndLogError("Failed to create floodgate engine");
				return;
			}

			// start subsequent invocations in sync mode
			const shouldStartEngineInSync = loadSynchronously || startCount > 1;
			if (shouldStartEngineInSync) {
				engine.start();
				resolve();
			} else {
				const enginePromise = engine.startAsync();
				if (!enginePromise) {
					// ideally this should never happen
					setEngineStartPromise(null);
					rejectAndLogError("Failed to get floodgate engine");
					return;
				}

				enginePromise.then(
					function onFulfilled() {
						resolve();
					}
				).catch(
					function onRejected(startError: Error) {
						setEngineStartPromise(null);
						rejectAndLogError("Failed to start floodgate engine", startError);
					}
				);
			}
		} catch (e) {
			setEngineStartPromise(null);
			rejectAndLogError("Failed to load floodgate engine: " + (e && e.toString()), e);
		}
	});

	setEngineStartPromise(startPromise);

	// reset on error
	startPromise.catch((error) => {
		setEngineStartPromise(null);
	});

	return startPromise;
}

export function start(loadSynchronously: boolean = false): Promise<any> {
	return startInternal(loadSynchronously);
}

/**
 * A proxy for the engine.stop() method for consistency with the start() method.
 */
export function stop() {
	if (engine) {
		engine.stop();
	}

	setEngineStartPromise(null);
}

/**
 * Get the engine object
 * @returns the engine object
 */
export function getEngine(): FloodgateEngine {
	return engine;
}

/**
 * Reset the floodgate engine state. Used in unit tests.
 */
export function resetEngine() {
	startCount = 0;
	engineStartPromise = null;
	engine = null;
	engineTmsProvider = null;
	userFactsProvider = null;
}

/**
 * Reset the floodgate module. Used in unit tests.
 */
export function reset() {
	initialized = false;
	resetEngine();
}

Window.setFloodgateGetEngine(getEngine);
Window.setFloodgateStart(start);
Window.setFloodgateStop(stop);
