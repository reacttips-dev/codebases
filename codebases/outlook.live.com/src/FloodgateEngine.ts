import { ActivityTrackingSet } from "./ActivityTrackingSet";
import { IUserFactProvider } from "./Api/Api";
import * as IActivityListener from "./Api/IActivityListener";
import { IFloodgateEnvironmentProvider } from "./Api/IFloodgateEnvironmentProvider";
import { IFloodgateSettingStorageCallback } from "./Api/IFloodgateSettingStorageCallback";
import * as IFloodgateStorageProvider from "./Api/IFloodgateStorageProvider";
import * as IFloodgateStringProvider from "./Api/IFloodgateStringProvider";
import { IFloodgateTelemetryLogger } from "./Api/IFloodgateTelemetryLogger";
import { IOnSurveyActivatedCallback } from "./Api/IOnSurveyActivatedCallback";
import * as ISurvey from "./Api/ISurvey";
import { ISurveyLauncher } from "./Api/ISurveyLauncher";
import { ISurveyLauncherFactory } from "./Api/ISurveyLauncherFactory";
import { ITelemetryProperties } from "./Api/ITelemetryProperties";
import { ITransporterFactory } from "./Api/ITransporterFactory";
import { CampaignDefinition, CampaignNominationSchemeRatioPercentage, FileSystemCampaignDefinitionProvider, ICampaignDefinitionProvider } from "./Campaign/CampaignDefinitionProvider";
import { CampaignManager } from "./Campaign/CampaignManager";
import { CampaignStateProviderFactory, ICampaignStateProvider } from "./Campaign/CampaignStateProvider";
import { IDictionary } from "./Common";
import { TelemetryEvent } from "./Constants";
import { FloodgateSettings } from "./FloodgateSettings";
import { GovernedChannelType, IGovernedChannelData } from "./GovernedChannel";
import { GovernedChannelStateProviderFactory, IGovernedChannelStateProvider } from "./GovernedChannelStateProvider";
import { Governor, IGovernor } from "./Governor";
import { ISurveyClient } from "./ISurveyClient";
import * as SurveyActivityListener from "./SurveyActivityListener";
import { ISurveyActivationStatsProvider, SurveyActivationStats, SurveyActivationStatsProviderFactory,
	SurveyStatCollectionActivation } from "./SurveyStatCollectionActivation";
import { SurveyEventActivityStats, SurveyStatCollectionEventActivity } from "./SurveyStatCollectionEventActivity";

import FileType = IFloodgateStorageProvider.FileType;
import { ActivityTrackingContract } from "./ActivityTrackingContract";
import { isNOU } from "./Utils";

// Telemetry logger with no-op logger
class DefaultFloodgateTelemetryLogger implements IFloodgateTelemetryLogger {
	// @Override
	public log_TriggerMet(campaignId: string, surveyId: string, surveyType: ISurvey.Type, surveyActivityInfo: string,
		additionalSurveyInfo: string): void {}

	// @Override
	public log_UserSelected(campaignId: string, surveyId: string, surveyType: ISurvey.Type,
		additionalSurveyInfo: string): void {}

	// @Override
	public log_CampaignLoad_Failed(errorMessage: string): void {}

	// @Override
	public log_Error(eventId: string, errorMessage: string): void {}

	// @Override
	public log_Event(eventId: string, properties: ITelemetryProperties): void {}
}

export const enum InitializationStatus {
	None = 0,
	Error,
	Initializing,
	Started,
	Stopped,
}

const defaultSurveyActivityListener: SurveyActivityListener.IActivityListenerCallback = {
	run(survey) {
	},
	shouldAcceptActivity(activityName) {
		return true;
	},
};

/**
 * Floodgate Engine class.  The main wiring hub and the brains responsible for
 * linking together the survey definitions, governance, activity tracking, and
 * survey launchers.  Only one-instance-at-a-time of these should be created
 * per app session.
 */
export class FloodgateEngine {
	public static setTelemetryLogger(telemetryLogger: IFloodgateTelemetryLogger): void {
		if (!telemetryLogger) {
			throw new Error("telemetryLogger must not be null");
		}

		FloodgateEngine.telemetryLogger = telemetryLogger;
	}

	public static getTelemetryLogger(): IFloodgateTelemetryLogger {
		return FloodgateEngine.telemetryLogger;
	}

	public static getTransportFactory(): ITransporterFactory {
		return FloodgateEngine.transporterFactory;
	}

	public static make(
		buildVersion: string,
		launcherFactory: ISurveyLauncherFactory,
		onSurveyActivatedCallback: IOnSurveyActivatedCallback,
		fileBasedStorageProvider: IFloodgateStorageProvider,
		hostBasedStorageProvider: IFloodgateSettingStorageCallback,
		stringProvider: IFloodgateStringProvider,
		environmentProvider: IFloodgateEnvironmentProvider,
		transporterFactory: ITransporterFactory,
		campaignDefinitionProviders: ICampaignDefinitionProvider[],
		userFactsProvider: IUserFactProvider): FloodgateEngine {

		try {
			const governedChannelStateProvider: IGovernedChannelStateProvider
				= GovernedChannelStateProviderFactory.make(fileBasedStorageProvider, hostBasedStorageProvider);

			const surveyActivationStatsProvider: ISurveyActivationStatsProvider
				= SurveyActivationStatsProviderFactory.make(fileBasedStorageProvider, hostBasedStorageProvider);

			const campaignStateProvider: ICampaignStateProvider
				= CampaignStateProviderFactory.make(fileBasedStorageProvider, hostBasedStorageProvider);

			campaignDefinitionProviders.push(new FileSystemCampaignDefinitionProvider(fileBasedStorageProvider));
			return new FloodgateEngine(
				new CampaignManager(
					campaignStateProvider,
					campaignDefinitionProviders,
					stringProvider,
					environmentProvider,
					buildVersion,
					new Date(),
					userFactsProvider,
				),
				new SurveyActivityListener(
					defaultSurveyActivityListener,
					this.getTelemetryLogger,
				),
				launcherFactory,
				onSurveyActivatedCallback,
				fileBasedStorageProvider,
				new Governor(
					governedChannelStateProvider,
				),
				surveyActivationStatsProvider,
				transporterFactory,
			);
		} catch (e) {
			this.telemetryLogger.log_Event(TelemetryEvent.FloodgateEngine.Make.Failed,
				{ ErrorMessage: e && e.toString(), ErrorDetails: e && e.stack });
		}
	}

	// Initialize telemetry logger with no-op logger
	private static telemetryLogger: IFloodgateTelemetryLogger = new DefaultFloodgateTelemetryLogger();
	private static transporterFactory: ITransporterFactory;

	private surveyClient: ISurveyClient;
	private activityListener: SurveyActivityListener;
	private onSurveyActivatedCallback: IOnSurveyActivatedCallback;
	private launcherFactory: ISurveyLauncherFactory;
	private storage: IFloodgateStorageProvider;
	private governor: IGovernor;
	private initializationStatus: InitializationStatus = InitializationStatus.None;
	private loggedFirstStart: boolean;

	private floodgateSettings: FloodgateSettings;
	private previousSurveyActivationStats: SurveyStatCollectionActivation;
	private previousSurveyEventActivityStats: SurveyStatCollectionEventActivity;

	private candidateSurveys: IDictionary<ISurvey> = {};
	private launchedSurveys: IDictionary<ISurvey> = {};
	private launchedLaunchers: ISurveyLauncher[] = [];
	private surveyEventSent: string[] = [];

	private surveyActivationStatsProvider: ISurveyActivationStatsProvider;

	public constructor(surveyClient: ISurveyClient, activityListener: SurveyActivityListener, launcherFactory: ISurveyLauncherFactory,
		onSurveyActivatedCallback: IOnSurveyActivatedCallback, storage: IFloodgateStorageProvider, governor: IGovernor,
		surveyActivationStatsProvider: ISurveyActivationStatsProvider, transporterFactory: ITransporterFactory) {

		if (!surveyClient) {
			throw new Error("surveyClient must not be null");
		}
		if (!activityListener) {
			throw new Error("activityListener must not be null");
		}
		if (!launcherFactory) {
			throw new Error("launcherFactory must not be null");
		}
		if (!onSurveyActivatedCallback) {
			throw new Error("onSurveyActivatedCallback must not be null");
		}
		if (!storage) {
			throw new Error("storage must not be null");
		}
		if (!governor) {
			throw new Error("governor must not be null");
		}
		if (!transporterFactory) {
			throw new Error("transporterFactory must not be null");
		}

		this.surveyClient = surveyClient;
		this.activityListener = activityListener;
		this.launcherFactory = launcherFactory;
		this.onSurveyActivatedCallback = onSurveyActivatedCallback;
		this.storage = storage;
		this.governor = governor;
		this.surveyActivationStatsProvider = surveyActivationStatsProvider;
		FloodgateEngine.transporterFactory = transporterFactory;

		this.loggedFirstStart = false;

		// Initialize our list to a valid, empty collection
		this.setPendingSurveys(null);

		// If the listener was pre-configured with survey for some reason, clear it now
		this.activityListener.clearSurveys();

		// Link ourselves with the listener
		const thisObj = this; // Save current object in a variable to allow access from callback.
		this.activityListener.setCallback({
			run(surveyId: string) {
				thisObj.onSurveyActivated(surveyId);
			},
			shouldAcceptActivity(activityName: string) {
				return thisObj.shouldAcceptActivity(activityName);
			},
		});
	}

	/**
	 * Save all internal stats and floodgateSettings (merging with existing file contents), without stopping the engine.
	 */
	public mergeAndSave(): void {
		this.saveSettings();
		this.saveSurveyActivationHistory();
		this.saveSurveyEventActivityHistory();

		// Inform surveyClient to save its state
		this.surveyClient.saveCurrentState();

		// Save governed channel states
		this.governor.saveChannelStates();
	}

	/**
	 * Start the engine.  Checks feature enable state, causes survey definitions to be read, and tracked activities to be set on the listener.
	 */
	public start(): void {
		if (this.initializationStatus === InitializationStatus.Initializing ||
			this.initializationStatus === InitializationStatus.Started) {
			return;
		}

		try {
			this.setInitializationStatus(InitializationStatus.Initializing);
			this.loadSettingsAndPriorEventCounts();

			const channelTypes: GovernedChannelType[] = this.getAvailableChannelTypes();

			this.surveyClient.refreshSurveyDefinitions(channelTypes);

			this.setPendingSurveysAndStartFloodgate();
			this.setInitializationStatus(InitializationStatus.Started);
		} catch (e) {
			this.setInitializationStatus(InitializationStatus.Error);
			FloodgateEngine.getTelemetryLogger().log_Event(TelemetryEvent.FloodgateEngine.Start.Failed,
				{ ErrorMessage: e && e.toString(), ErrorDetails: e && e.stack });
		}
	}

	/**
	 * Start the engine.  Checks feature enable state, causes survey definitions to be read, and tracked activities to be set on the listener.
	 */
	public startAsync(): Promise<void> {
		if (this.initializationStatus === InitializationStatus.Initializing ||
			this.initializationStatus === InitializationStatus.Started) {
			return Promise.resolve();
		}

		try {
			this.setInitializationStatus(InitializationStatus.Initializing);
			this.loadSettingsAndPriorEventCounts();

			const channelTypes: GovernedChannelType[] = this.getAvailableChannelTypes();

			const thisFloodgateEngine = this;
			return new Promise((resolve, reject) => {
				thisFloodgateEngine.surveyClient.refreshSurveyDefinitionsAsync(channelTypes).then(
					function onFulfilled() {
						// Handle any stop() calls that happened while initializing
						if (thisFloodgateEngine.initializationStatus === InitializationStatus.Stopped) {
							thisFloodgateEngine.setInitializationStatus(InitializationStatus.Started);
							thisFloodgateEngine.stop();
							FloodgateEngine.getTelemetryLogger().log_Event(TelemetryEvent.FloodgateEngine.StartAsync.Stopped,
								{ ErrorMessage: "Stopped because of a pending stop() call" });
						} else {
							thisFloodgateEngine.setPendingSurveysAndStartFloodgate();
						}

						resolve();
					},
				).catch(
					function OnRejected(error: Error) {
						thisFloodgateEngine.setInitializationStatus(InitializationStatus.Error);
						FloodgateEngine.getTelemetryLogger().log_Event(TelemetryEvent.FloodgateEngine.StartAsync.Failed,
							{ ErrorMessage: "Survey refresh error " + (error && error.message) });

						reject(error);
					},
				);
			});
		} catch (e) {
			this.setInitializationStatus(InitializationStatus.Error);
			FloodgateEngine.getTelemetryLogger().log_Event(TelemetryEvent.FloodgateEngine.StartAsync.Failed,
				{ ErrorMessage: e && e.toString(), ErrorDetails: e && e.stack });
			return Promise.resolve();
		}
	}

	/**
	 * Stop the engine.  Causes tracked activities to be cleared and any in-progress counters not otherwise saved to be thrown out.
	 */
	public stop(): void {
		if (this.initializationStatus === InitializationStatus.Started) {
			this.mergeAndSave();

			// Clear our Survey list, and push that through to the listener
			this.setPendingSurveys(null);
			this.updateActivityListenerWithCurrentSurveyDefinitions();
		}

		this.setInitializationStatus(InitializationStatus.Stopped);
	}

	/**
	 * Gets the IActivityListener logging interface for callers that want to log directly rather than through telemetry
	 */
	public getActivityListener(): IActivityListener {
		return this.activityListener;
	}

	private setInitializationStatus(status: InitializationStatus): void {
		this.initializationStatus = status;
	}

	private saveSettings(): void {
		this.storage.fileLock(FileType.FloodgateSettings);

		try {
			this.writeString(FileType.FloodgateSettings, FloodgateSettings.toJson(this.floodgateSettings));
		} finally {
			this.storage.fileUnlock(FileType.FloodgateSettings);
		}
	}

	private loadSettingsAndPriorEventCounts(): void {
		try {
			// Load up the prior survey history and prior event counts
			this.previousSurveyActivationStats = this.surveyActivationStatsProvider.load();

			this.previousSurveyEventActivityStats =
				SurveyStatCollectionEventActivity.fromJson(this.readString(FileType.SurveyEventActivityStats));

			// get the list of survey Id - all the survey should have event sent already
			const stats: IDictionary<SurveyEventActivityStats> = this.previousSurveyEventActivityStats.getStats();
			for (const key in stats) {
				if (stats.hasOwnProperty(key)) {
					this.surveyEventSent.push(key);
				}
			}

			// Load up the general floodgateSettings
			this.floodgateSettings = FloodgateSettings.fromJson(this.readString(FileType.FloodgateSettings));
		} catch (e) {
			FloodgateEngine.getTelemetryLogger().log_Event(TelemetryEvent.FloodgateEngine.Common.Error,
				{ ErrorMessage: "Error loading prior settings/events " + (e && e.toString()) });
		}
	}

	private getAvailableChannelTypes(): GovernedChannelType[] {
		// Make sure we've loaded the current survey definitions
		const channels: IGovernedChannelData[] = this.governor.getAvailableChannelData();
		const channelTypes: GovernedChannelType[] = [];

		channels.forEach((channel) => {
			if (channel) {
				channelTypes.push(channel.getType());
			}
		});

		return channelTypes;
	}

	private setPendingSurveysAndStartFloodgate(): void {
		// Update our survey list, and push that through to the listener
		this.setPendingSurveys(this.surveyClient.getAppSurveys());
		this.updateActivityListenerWithCurrentSurveyDefinitions();

		// Mark us as started
		this.setInitializationStatus(InitializationStatus.Started);

		// Log our first start (aka floodgate boot) event
		if (!this.loggedFirstStart) {
			this.loggedFirstStart = true;
			this.getActivityListener().logActivity(SurveyActivityListener.FloodgateStartActivityName);
		}
	}

	private saveSurveyActivationHistory(): void {
		this.storage.fileLock(FileType.SurveyActivationStats);

		try {
			const statCollection: SurveyStatCollectionActivation = this.surveyActivationStatsProvider.load();

			// Build the update collection
			const updateCollection = new SurveyStatCollectionActivation();
			for (const key in this.launchedSurveys) {
				if (this.launchedSurveys.hasOwnProperty(key)) {
					const stats: SurveyActivationStats = new SurveyActivationStats();
					const survey: ISurvey = this.launchedSurveys[key];
					stats.Type = survey.getType();
					stats.ExpirationTimeUtc = survey.getSurveyInfo().getExpirationTimeUtc();
					stats.ActivationTimeUtc = new Date();

					// Make this part of the update list
					updateCollection.addStats(survey.getSurveyInfo().getId(), stats);
				}
			}

			// Actually merge our updates into the full collection
			statCollection.accumulate(updateCollection);
			this.surveyActivationStatsProvider.save(statCollection);

			// Make sure to keep our internal collection consistent with what we just wrote
			this.previousSurveyActivationStats = statCollection;
		} finally {
			this.storage.fileUnlock(FileType.SurveyActivationStats);
		}
	}

	private saveSurveyEventActivityHistory(): void {
		this.storage.fileLock(FileType.SurveyEventActivityStats);

		try {
			const statCollection: SurveyStatCollectionEventActivity =
				SurveyStatCollectionEventActivity.fromJson(this.readString(FileType.SurveyEventActivityStats));

			const now = new Date();
			// Fill out our list of updates
			const updateCollection = new SurveyStatCollectionEventActivity();
			for (const key in this.candidateSurveys) {
				if (this.candidateSurveys.hasOwnProperty(key)) {
					const stats: SurveyEventActivityStats = new SurveyEventActivityStats();
					const survey: ISurvey = this.candidateSurveys[key];

					if (!survey.getSurveyInfo().isActiveForDate(now)) {
						continue;
					}

					stats.ExpirationTimeUtc = survey.getSurveyInfo().getExpirationTimeUtc();

					// Get the activities which are aggregated, if there aren't any continue
					const allActivities: ActivityTrackingSet = survey.getSurveyInfo().getActivationEvent().getTrackingSet();
					const aggregateActivities: string[] = [];
					const nonAggregateActivities: string[] = [];

					allActivities.getList().forEach((data) => {
						if (data) {
							if (data.getIsAggregate()) {
								aggregateActivities.push(data.getActivity());
							} else {
								nonAggregateActivities.push(data.getActivity());
							}
						}
					});

					stats.Counts = new Array(aggregateActivities.length);

					// Save off the counts we've added for this session
					for (let i = 0; i < aggregateActivities.length; i++) {
						stats.Counts[i] = this.activityListener.moveSessionCountIntoBaseCount(aggregateActivities[i], survey.getSurveyInfo().getId());
					}

					for (const activity of nonAggregateActivities) {
						this.activityListener.saveSessionTrackingActivity(activity);
					}

					// Make this part of the update list
					updateCollection.addStats(survey.getSurveyInfo().getId(), stats);
				}
			}

			// Actually merge our updates into the full collection
			statCollection.accumulate(updateCollection);

			this.writeString(FileType.SurveyEventActivityStats, SurveyStatCollectionEventActivity.toJson(statCollection));
			// Make sure to keep our internal collection consistent with what we just wrote
			this.previousSurveyEventActivityStats = statCollection;
		} finally {
			this.storage.fileUnlock(FileType.SurveyEventActivityStats);
		}
	}

	private setPendingSurveys(pendingSurveys: IDictionary<ISurvey>): void {
		this.candidateSurveys = {};
		if (pendingSurveys) {
			for (const key in pendingSurveys) {
				if (pendingSurveys.hasOwnProperty(key)) {
					const survey: ISurvey = pendingSurveys[key];
					if (this.launcherFactory.AcceptsSurvey(survey)) {
						this.candidateSurveys[key] = survey;
					}
				}
			}
		}
	}

	private getCurrentSurveyDefinitions(): ISurvey[] {
		// Get a vector of Surveys from our id-based map
		const surveyList: ISurvey[] = new Array<ISurvey>();

		const allCampaignDefinitionIDs = this.getAllCampaignDefinitionIDs();
		const allCandidateCampaignDefinitionIDs = this.getAllCandidateCampaignDefinitionIDs();

		for (const key in this.candidateSurveys) {
			if (this.candidateSurveys.hasOwnProperty(key)) {
				const survey: ISurvey = this.candidateSurveys[key];

				// Skip over any candidate surveys that have been previously completed
				if (this.previousSurveyActivationStats.getBySurveyId(survey.getSurveyInfo().getId())) {
					continue;
				}

				if (!survey.getSurveyInfo().isActiveForDate(new Date())) {
					continue;
				}

				// send the UserSelected event if it is not sent before
				if (this.surveyEventSent.indexOf(key) < 0) {
					this.surveyEventSent.push(key);

					const additionalSurveyInfo = this.getAdditionalSurveyInfoForTelemetry(survey, allCampaignDefinitionIDs, allCandidateCampaignDefinitionIDs);

					FloodgateEngine.telemetryLogger.log_UserSelected(survey.getSurveyInfo().getBackEndId(),
						survey.getSurveyInfo().getId(),
						survey.getType(),
						JSON.stringify(additionalSurveyInfo));
				}
				surveyList.push(survey);
			}
		}
		return surveyList;
	}

	private getAdditionalSurveyInfoForTelemetry(survey: ISurvey, allCampaignDefinitionIDs: string[] , allCandidateCampaignDefinitionIDs: string[]): {
		allCandidateCampaignDefinitionIDs: string[],
		allCampaignDefinitionIDs: string[],
		surveyLauncherType: string,
		channelType: GovernedChannelType,
		percentageNumerator: number,
		percentageDenominator: number,
		nominationPeriodNumber: number,
		cooldownPeriodNumber: number,
	} {
		// Get all the campaign definitions. We need info from these for telemetry.
		const allCampaignDefinitions = (this.surveyClient as CampaignManager).getCampaignDefinitions();

		// Get the corresponding campaign definition to the survey in question.
		const correspondingCampaignDefinition = allCampaignDefinitions[survey.getCampaignId()];

		// Survey properties to get from its corresponding CampaignDefinition:
		let percentageNumerator: number;
		let percentageDenominator: number;
		let nominationPeriodNumber: number;
		let cooldownPeriodNumber: number;

		percentageNumerator = (correspondingCampaignDefinition.nominationScheme as CampaignNominationSchemeRatioPercentage).percentageNumerator;
		percentageDenominator = (correspondingCampaignDefinition.nominationScheme as CampaignNominationSchemeRatioPercentage).percentageDenominator;

		nominationPeriodNumber = correspondingCampaignDefinition.nominationScheme.nominationPeriod.asTimeIntervalSeconds();
		nominationPeriodNumber = isNOU(nominationPeriodNumber) ? -1 : nominationPeriodNumber; // Setting to -1 if null or undefined

		cooldownPeriodNumber = correspondingCampaignDefinition.nominationScheme.cooldownPeriod.asTimeIntervalSeconds();
		cooldownPeriodNumber = isNOU(cooldownPeriodNumber) ? -1 : cooldownPeriodNumber;  // Setting to -1 if null or undefined

		return {
			allCampaignDefinitionIDs,
			allCandidateCampaignDefinitionIDs,
			channelType: survey.getSurveyInfo().getGovernedChannelType(),
			cooldownPeriodNumber,
			nominationPeriodNumber,
			percentageDenominator,
			percentageNumerator,
			surveyLauncherType: survey.getLauncherType(),
		};
	}

	private getAllCandidateCampaignDefinitionIDs(): string[] {

		const allCandidateCampaignDefinitionIDs: string[] = [];

		// Get all the candidate surveys' campaign definition IDs
		for (const key in this.candidateSurveys) {
			if (this.candidateSurveys.hasOwnProperty(key)) {
				const candidateSurvey: ISurvey = this.candidateSurveys[key];
				allCandidateCampaignDefinitionIDs.push(candidateSurvey.getSurveyInfo().getBackEndId());
			}
		}
		return allCandidateCampaignDefinitionIDs;
	}

	private getAllCampaignDefinitionIDs(): string[] {

		const allCampaignDefinitions = (this.surveyClient as CampaignManager).getCampaignDefinitions();
		const allCampaignDefinitionIDs: string[] = [];

		for (const definitionsKey in allCampaignDefinitions) {
			if (Object.prototype.hasOwnProperty.call(allCampaignDefinitions, definitionsKey)) {
				const definition: CampaignDefinition = allCampaignDefinitions[definitionsKey];
				allCampaignDefinitionIDs.push(definition.campaignId);
			}
		}
		return allCampaignDefinitionIDs;
	}

	private updateActivityListenerWithCurrentSurveyDefinitions(): void {
		const surveyList: ISurvey[] = this.getCurrentSurveyDefinitions();
		const trackingContractList: ActivityTrackingContract[] = [];

		for (const survey of surveyList) {
			const surveyInfo = survey.getSurveyInfo();
			const trackingContract = new ActivityTrackingContract(surveyInfo.getId(), surveyInfo.getActivationEvent().getTrackingSet());
			trackingContractList.push(trackingContract);
		}

		this.activityListener.SetActivityTrackingContracts(trackingContractList, this.previousSurveyEventActivityStats);
	}

	private shouldAcceptActivity(activityName: string): boolean {
		return this.initializationStatus === InitializationStatus.Started ||
			activityName === SurveyActivityListener.FloodgateStartActivityName;
	}

	private onSurveyActivated(surveyId: string): void {
		// Find the survey object that corresponds to the surveyId passed
		const surveys: ISurvey[] = this.getCurrentSurveyDefinitions();
		let survey: ISurvey;

		for (const tempSurvey of surveys) {
			if (tempSurvey.getSurveyInfo().getId() === surveyId) {
				survey = tempSurvey;
				break;
			}
		}

		if (isNOU(survey)) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.FloodgateEngine.OnSurveyActivated.SurveyNotDefined,
				"Survey is not defined in the current survey definitions.",
			);
			return;
		}

		// Get the stringified json with activity names, counts and isAggregate info for TriggetMet telemetry.
		const activityTrackingString = survey.getSurveyInfo().getActivationEvent().getTrackingSet().getActivityTrackingInfo();

		const additionalSurveyInfo = this.getAdditionalSurveyInfoForTelemetry(survey, this.getAllCampaignDefinitionIDs(),
			this.getAllCandidateCampaignDefinitionIDs());

		FloodgateEngine.telemetryLogger.log_TriggerMet(survey.getSurveyInfo().getBackEndId(), survey.getSurveyInfo().getId(),
			survey.getType(), activityTrackingString, JSON.stringify(additionalSurveyInfo));

		let launchSurvey: boolean = false;
		const governedChannelType: GovernedChannelType = survey.getSurveyInfo().getGovernedChannelType();

		// Figure out if the activated survey is still relevant
		if (!this.candidateSurveys[survey.getSurveyInfo().getId()]) {
			// Survey is no longer relevant but was activated. Suppress it.
		} else if (!survey.getSurveyInfo().isActiveForDate(new Date())) {
			// Survey is no longer active (e.g. it was when we registered it but it has now expired)
		} else {
			// Refresh channels
			this.governor.refreshChannelData();

			if (!this.governor.isChannelOpen(governedChannelType)) {
				// Channel has closed, suppress the survey
				FloodgateEngine.getTelemetryLogger().log_Event(
					TelemetryEvent.FloodgateEngine.OnSurveyActivated.ClosedChannelType,
					{ ClosedChannelType: GovernedChannelType[governedChannelType] });
			} else {
				// Get latest survey states from provider
				const refreshedSurveyActivationStats = this.surveyActivationStatsProvider.load();

				if (refreshedSurveyActivationStats.getBySurveyId(survey.getSurveyInfo().getId())) {
					// Survey stats exists already, don't launch
					FloodgateEngine.getTelemetryLogger().log_Event(
						TelemetryEvent.FloodgateEngine.OnSurveyActivated.ActivationStatsSuppressedSurvey,
						{
							CampaignId: survey.getSurveyInfo().getBackEndId(),
							SurveyId: survey.getSurveyInfo().getId(),
						});
				} else if (Object.keys(this.launchedSurveys).length === 0) {
					// for now we only support launching one survey per session
					// Track this survey activation for the launch history tracker
					this.launchedSurveys[survey.getSurveyInfo().getId()] = survey;
					launchSurvey = true;
				}
			}
		}

		// At this point, regardless of whether or not the survey is still relevant, we should flush out the stats, and shut off further survey launches
		this.mergeAndSave();
		this.activityListener.clearSurveys();

		// Actually launch the survey
		if (launchSurvey) {
			this.governor.startChannelCooldown(governedChannelType);
			this.surveyClient.onSurveyActivated(survey.getSurveyInfo());
			this.launchLauncher(survey);
		}
	}

	private readString(fileType: FileType): string {
		return this.storage.read(fileType);
	}

	private writeString(fileType: FileType, str: string): void {
		this.storage.write(fileType, str);
	}

	private launchLauncher(survey: ISurvey): void {
		const launcher: ISurveyLauncher = this.launcherFactory.makeSurveyLauncher(survey);
		if (launcher) {
			this.launchedLaunchers.push(launcher);
			this.onSurveyActivatedCallback.onSurveyActivated(launcher, survey);
		}
	}
}
