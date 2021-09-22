import { IFloodgateEnvironmentProvider } from "../Api/IFloodgateEnvironmentProvider";
import * as IFloodgateStringProvider from "../Api/IFloodgateStringProvider";
import * as ISurvey from "../Api/ISurvey";
import { IDictionary } from "../Common";
import { FloodgateEngine } from "../FloodgateEngine";
import { GovernedChannelType } from "../GovernedChannel";
import { ISurveyClient } from "../ISurveyClient";
import * as ISurveyInfo from "../ISurveyInfo";
import * as Utils from "../Utils";
import {
	CampaignDefinition, CampaignDuration, CampaignDurationSingleBuildChange,
	CampaignDurationTimeInterval, CampaignScopeEnvironmentCrossProduct, CampaignScopeUserFactAll, CampaignScopeUserFactAny, ICampaignDefinitionProvider,
} from "./CampaignDefinitionProvider";
import { CampaignState, ICampaignStateProvider } from "./CampaignStateProvider";
import { CampaignSurveyFactory } from "./CampaignSurveyFactory";

import { IUserFact, IUserFactProvider } from "../Api/Api";
import { TelemetryEvent } from "../Constants";

const { getDistantFuture, getDistantPast, isArray, isNOU } = Utils;

/**
 * The CampaignManager is responsible for combining read-only campaign definitions with previously stored campaign state,
 * running re-nomination elections, and ultimately generating surveys
 */
export interface ICampaignManager {
	// Get the list of active surveys targeting this user
	getActiveSurveys(): IDictionary<ISurvey>;

	// Updates the campaign state based on the fact that the user just took that campaign's survey
	onCampaignSurveyActivated(campaignId: string, date: Date): void;
}

/**
 * The standard campaign manager implementation.
 */
export class CampaignManager implements ICampaignManager, ISurveyClient {
	public static isStateUpForNomination(state: CampaignState, definition: CampaignDefinition, date: Date, buildNumber: string): boolean {
		if (!state || !definition) {
			return false;
		}

		date = date ? date : new Date();

		// Check manual override
		if (state.ForceCandidacy) {
			return true;
		}

		// Figure out which duration we're using based on whether or not the user triggered the survey
		const campaignCooldownDuration: CampaignDuration
			= definition.nominationScheme.getCampaignCooldown(state.IsCandidate && state.DidCandidateTriggerSurvey);

		if (!campaignCooldownDuration) {
			return false;
		}
		// First check for build-based rules. Eventually this could get more complex if we supported counting differently seen build numbers
		if (CampaignManager.hasBuildChangeDurationElapsed(campaignCooldownDuration, state.LastNominationBuildNumber, buildNumber)) {
			return true;
		}

		// Next check date rules
		return CampaignManager.hasTimeIntervalDurationElapsed(campaignCooldownDuration, state.getCooldownStartDate(), date);
	}

	public static isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
		date = date ? date : new Date();
		startDate = startDate ? startDate : getDistantPast();
		endDate = endDate ? endDate : getDistantFuture();

		// Check Start/Expire date range
		if (startDate.getTime() <= date.getTime() && endDate.getTime() >= date.getTime()) {
			return true;
		}

		return false;
	}

	public static hasTimeIntervalDurationElapsed(duration: CampaignDuration, startDate: Date, date: Date): boolean {
		if (isNOU(duration) || !(duration instanceof CampaignDurationTimeInterval)) {
			return false;
		}
		if (!startDate || !date) {
			return false;
		}

		const endDate: Date = Utils.addSecondsWithoutOverflow(startDate, duration.intervalSeconds);
		return date.getTime() >= endDate.getTime();
	}

	public static hasBuildChangeDurationElapsed(duration: CampaignDuration, startBuild: string, build: string): boolean {
		if (isNOU(duration) || !(duration instanceof CampaignDurationSingleBuildChange)) {
			return false;
		}
		if (isNOU(startBuild) || isNOU(build)) {
			return (startBuild === null) !== (build === null);
		}

		return !(startBuild === build);
	}

	private static isCampaignInScope(
		definition: CampaignDefinition,
		date: Date,
		environmentProvider: IFloodgateEnvironmentProvider,
		userFactsProvider: IUserFactProvider): boolean {
		if (!definition) {
			return false;
		}

		date = date ? date : new Date();

		// Check Start/Expire date range
		if (!CampaignManager.isDateInRangeWithDefinition(date, definition)) {
			return false;
		}

		if (definition.scope) {
			if (definition.scope instanceof CampaignScopeUserFactAny || definition.scope instanceof CampaignScopeUserFactAll) {
				definition.scope.setUserFactsProvider(userFactsProvider);
			}
			if (definition.scope instanceof CampaignScopeEnvironmentCrossProduct) {
				definition.scope.setEnvironmentProvider(environmentProvider);
			}
			if (!definition.scope.isInScope()) {
				return false;
			}
		}

		// If we get here, the definition is relevant
		return true;
	}

	private static isDateInRangeWithDefinition(date: Date, definition: CampaignDefinition): boolean {
		if (!definition) {
			return false;
		}

		date = date ? date : new Date();

		return CampaignManager.isDateInRange(date,
			// null start dates should be impossible, but if set, should mean the campaign is disabled
			definition.startTime ? definition.startTime : getDistantFuture(),
			definition.endTime);
	}

	private campaignStates: IDictionary<CampaignState>;
	private campaignDefinitions: IDictionary<CampaignDefinition>;
	private userFacts: IUserFact[];
	private currentBuildNumber: string;
	private stateProvider: ICampaignStateProvider;
	private definitionProviders: ICampaignDefinitionProvider[];
	private stringProvider: IFloodgateStringProvider;
	private environmentProvider: IFloodgateEnvironmentProvider;
	private userFactsProvider: IUserFactProvider;

	public constructor(stateProvider: ICampaignStateProvider,
		definitionProviders: ICampaignDefinitionProvider[],
		stringProvider: IFloodgateStringProvider,
		environmentProvider: IFloodgateEnvironmentProvider,
		currentBuildNumber: string,
		currentDate: Date,
		userFactsProvider?: IUserFactProvider) {

		if (!stateProvider) {
			throw new Error("stateProvider must not be null");
		}

		if (!isArray(definitionProviders)) {
			throw new Error("definitionProviders is either null or not an array type");
		}

		if (!stringProvider) {
			throw new Error("stringProvider must not be null");
		}

		if (isNOU(currentBuildNumber)) {
			throw new Error("currentBuildNumber must not be null");
		}

		this.campaignStates = {};
		this.campaignDefinitions = {};
		this.userFacts = [];
		this.stateProvider = stateProvider;
		this.definitionProviders = definitionProviders;
		this.stringProvider = stringProvider;
		this.userFactsProvider = userFactsProvider;
		this.environmentProvider = environmentProvider; // Can be null
		this.currentBuildNumber = currentBuildNumber;

		currentDate = currentDate ? currentDate : new Date();
	}

	// @Override
	public getActiveSurveys(): IDictionary<ISurvey> {
		const surveys: IDictionary<ISurvey> = {};

		for (const key in this.campaignStates) {
			if (this.campaignStates.hasOwnProperty(key)) {
				const state: CampaignState = this.campaignStates[key];
				if (!state.IsCandidate) {
					continue;
				}

				// This is a requirement because we keep some otherwise "stale" campaigns around for the save routine
				const definition: CampaignDefinition = this.campaignDefinitions[state.CampaignId];
				if (!definition) {
					continue;
				}

				const survey: ISurvey = CampaignSurveyFactory.makeSurvey( state, definition.governedChannelType, definition.surveyTemplate,
					this.stringProvider, definition.additionalDataRequested, definition.launcherType);
				if (!survey) {
					continue;
				}

				surveys[survey.getSurveyInfo().getId()] = survey;
			}
		}

		return surveys;
	}

	// @Override
	public onCampaignSurveyActivated(campaignId: string, takenDate: Date): void {
		const state: CampaignState = this.campaignStates[campaignId];
		if (!state) {
			return;
		}

		takenDate = takenDate ? takenDate : new Date();

		state.markCurrentSurveyTakenOnDate(takenDate, this.campaignDefinitions[campaignId].nominationScheme.cooldownPeriod.asTimeIntervalSeconds());

		this.saveCurrentState();
	}

	public getCampaignStates(): IDictionary<CampaignState> {
		return this.campaignStates;
	}

	public getCampaignDefinitions(): IDictionary<CampaignDefinition> {
		return this.campaignDefinitions;
	}

	public getUserFacts(): IUserFact[] {
		return this.userFacts;
	}

	// region ISurveyClient methods

	// @Override
	public onSurveyActivated(surveyInfo: ISurveyInfo): void {
		if (!surveyInfo) {
			return;
		}

		this.onCampaignSurveyActivated(surveyInfo.getBackEndId(), new Date());
	}

	// @Override
	public refreshSurveyDefinitions(channelTypes?: GovernedChannelType[], date?: Date): void {
		this.refreshSurveyDefinitionsPrivate(channelTypes, (date ? date : new Date()));
	}

	// @Override
	public refreshSurveyDefinitionsAsync(channelTypes?: GovernedChannelType[], date?: Date): Promise<void> {
		return new Promise((resolve, reject) => {
			this.refreshSurveyDefinitionsPrivateAsync(channelTypes, (date ? date : new Date())).then(
				function onFulfilled() {
					resolve();
				},
			).catch(
				function OnRejected(errReason) {
					reject(errReason);
				},
			);
		});
	}

	// @Override
	public getAppSurveys(): { [id: string]: ISurvey } {
		return this.getActiveSurveys();
	}

	// @Override
	public saveCurrentState(): void {
		// Sort by campaignId, ascending for uniformity
		const states: CampaignState[] = Utils.makeArrayFromObjectValuesSortedByKeyString(this.campaignStates);

		this.stateProvider.save(states);
	}

	// endregion

	private refreshSurveyDefinitionsPrivate(channelTypes: GovernedChannelType[], date: Date): void {
		this.campaignStates = {};
		this.campaignDefinitions = {};
		this.userFacts = [];

		this.loadAndFilterCampaignData(date, channelTypes);
		this.evaluateCampaigns(date);
	}

	private refreshSurveyDefinitionsPrivateAsync(channelTypes: GovernedChannelType[], date: Date): Promise<void> {
		this.campaignStates = {};
		this.campaignDefinitions = {};
		this.userFacts = [];

		const thisCampaignManager = this;
		return new Promise((resolve, reject) => {
			thisCampaignManager.loadAndFilterCampaignDataAsync(date, channelTypes).then(
				function onFulfilled() {
					thisCampaignManager.evaluateCampaigns(date);
					resolve();
				},
			).catch(
				function OnRejected(errReason) {
					reject(errReason);
				},
			);
		});
	}

	/**
	 * Load and filter the campaigns definitions and states
	 */
	private loadAndFilterCampaignDataAsync(currentDate: Date, channelTypes: GovernedChannelType[]): Promise<void> {
		currentDate = currentDate ? currentDate : new Date();
		let loadedDefinitions: CampaignDefinition[] = [];
		const promises = [];

		const userFactsPromise = this.userFactsProvider && this.userFactsProvider.loadAsync() as Promise<IUserFact[]>;

		for (const i of Object.keys(this.definitionProviders)) {
			const provider = this.definitionProviders[i];
			let promise: any = provider && provider.loadAsync();
			if (!isNOU(promise)) {
				// Promise.all fails even if one promise fails.
				// We want to ignore the promise that failed and continue with the ones
				// those are succesful, hence overriding the catch to always resolve.
				// responsibility of logging failures should be with the provider.
				promise = promise.catch(() => {
					FloodgateEngine.getTelemetryLogger().log_CampaignLoad_Failed("Failed to load from campaign definition provider");
					Promise.resolve();
				});
				promises.push(promise);
			}
		}

		const thisCampaignManager = this;
		return new Promise((resolve, reject) => {
			Promise.all(promises).then(
				function onFulfilled(values) {
					for (const i of Object.keys(values)) {
						const campaignDefinitions = values[i];
						if (isArray(campaignDefinitions)) {
							// If there are campaign defintions with duplicate campaign Id's
							// Floodgate will load the last one it found. FilterCampaignData does this filteration
							loadedDefinitions = loadedDefinitions.concat(campaignDefinitions);
						}
					}

					const setUserFacts = (userFacts?: IUserFact[]) => {
						thisCampaignManager.userFacts = userFacts || [];
						thisCampaignManager.FilterCampaignData(currentDate, channelTypes, loadedDefinitions);
						resolve();
					};

					// Before filtering and evaluating the campaign definitions,
					// wait until the user facts are loaded as they will be used in evaluating campaign scopes
					if (!isNOU(userFactsPromise)) {
						userFactsPromise.then((userFacts: IUserFact[]) => {
							setUserFacts(userFacts);
						}).catch(() => {
							// this should never happen as user facts promise will always be resolved by the user facts provider
							FloodgateEngine.getTelemetryLogger().log_Error(TelemetryEvent.Floodgate.UserFactsLoad.Failed, "Failed to load from user facts provider");
							setUserFacts();
						});
					} else {
						setUserFacts();
					}
				},
			).catch(
				function OnRejected(error) {
					// this should never happen as Promise.all will always be resolved
					// because of hack at the top of the function.
					FloodgateEngine.getTelemetryLogger().log_CampaignLoad_Failed("Failed to load from campaign definition provider");
				},
			);
		});
	}

	private loadAndFilterCampaignData(currentDate: Date, channelTypes: GovernedChannelType[]): void {
		currentDate = currentDate ? currentDate : new Date();
		let loadedDefinitions: CampaignDefinition[] = [];

		for (const index of Object.keys(this.definitionProviders)) {
			try {
				const definitions = this.definitionProviders[index] && this.definitionProviders[index].load();
				if (isArray(definitions)) {
					// If there are campaign defintions with duplicate campaign Id's
					// Floodgate will load the last one it found. FilterCampaignData does this filteration
					loadedDefinitions = loadedDefinitions.concat(definitions);
				}
			} catch (error) {
				// Log error, but continue with other providers
				// It should be the responsibility of provider to log detailed errors
				FloodgateEngine.getTelemetryLogger().log_CampaignLoad_Failed("Failed to load from campaign definition provider. " + error.toString());
			}
		}

		// Load the user facts before all the campaign definitions are evaluated
		try {
			this.userFacts = (this.userFactsProvider && this.userFactsProvider.load()) || [];
		} catch (error) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsLoad.Failed, "Failed to load from user facts provider. " + error);
		}

		this.FilterCampaignData(currentDate, channelTypes, loadedDefinitions);
	}

	/**
	 * Load and filter the campaigns definitions and states
	 */
	private FilterCampaignData(currentDate: Date, channelTypes: GovernedChannelType[], loadedDefinitions: CampaignDefinition[]): void {
		const loadedDefinitionsMap: IDictionary<CampaignDefinition> = {};

		// Load filtered campaign definitions
		for (const key in loadedDefinitions) {
			if (loadedDefinitions.hasOwnProperty(key)) {
				const definition: CampaignDefinition = loadedDefinitions[key];

				loadedDefinitionsMap[definition.campaignId] = definition;

				if (channelTypes && (channelTypes.indexOf(definition.governedChannelType) < 0)) {
					continue;
				}

				if (!CampaignManager.isCampaignInScope(definition, currentDate, this.environmentProvider, this.userFactsProvider)) {
					continue;
				}

				this.campaignDefinitions[definition.campaignId] = definition;
			}
		}

		// Load campaign state, filtering out the expired definitions
		const loadedStates: CampaignState[] = this.stateProvider.load();
		const staleLoadedStates: CampaignState[] = [];

		for (const key in loadedStates) {
			if (loadedStates.hasOwnProperty(key)) {
				const state: CampaignState = loadedStates[key];

				if (!this.campaignDefinitions.hasOwnProperty(state.CampaignId)) {
					staleLoadedStates.push(state);
				}

				this.campaignStates[state.CampaignId] = state;
			}
		}

		/*
		 * Stale State data cleanup
		 * State needs to be cleaned up when:
		 * 1) The campaign has expired
		 * 2) The campaign is no longer present in the definitions (think ECS or other outages or very old expirations)
		 *    In this case the state should still be cleaned up on it's reelection date
		 * 3) When the user is out of scope (for an otherwise active campaign) and is up for nomination

		 * This optimizes the user experience in case the campaign pops up or gets renewed when we would have preferred the user remain in cool down

		 * 2&3 are basically the same, and 1 is a special case optimization on top of 2&3 for earlier clean up

		 * To do 2 & 3, we just look at states with no matching definition (after filtering), and reject them if they are past their nomination period
		 * To do 1, we just need to keep a list/hash of the definitions that we filtered out this load cycle, specifically for expiration dates, and bypass
		 * the cool down "wait" for these specifically

		 * For now, allowing some "grace" for "missing"/"blippy" campaign definitions (in case they pop in and out of ECS) by deferring missing
		 * deletion by a delay-time specified by the original campaign.
		 */
		for (const key in staleLoadedStates) {
			if (staleLoadedStates.hasOwnProperty(key)) {
				const state: CampaignState = staleLoadedStates[key];
				if (!state) {
					continue;
				}

				const definition: CampaignDefinition = loadedDefinitionsMap[state.CampaignId];
				let shouldRemove = false;

				if (!definition) {
					if (state.LastNominationTimeUtc.getTime() <= Utils.subtractSecondsWithoutOverflow(currentDate, state.DeleteAfterSecondsWhenStale).getTime()) {
						shouldRemove = true;
					}
				} else if (CampaignManager.isStateUpForNomination(state, definition, currentDate, this.currentBuildNumber)) {
					shouldRemove = true;
				}

				// The next time we write to storage, these will be removed
				if (shouldRemove) {
					delete this.campaignStates[state.CampaignId];
				}
			}
		}
	}

	/**
	 * Given the loaded campaign definitions and states from previous sessions, run anything up for nomination
	 */
	private evaluateCampaigns(currentDate: Date): void {
		// Loop through campaigns definitions, and update their state if necessary
		currentDate = currentDate ? currentDate : new Date();

		for (const key in this.campaignDefinitions) {
			if (this.campaignDefinitions.hasOwnProperty(key)) {
				const definition: CampaignDefinition = this.campaignDefinitions[key];
				const state: CampaignState = this.campaignStates[definition.campaignId];

				if (!state || CampaignManager.isStateUpForNomination(state, definition, currentDate, this.currentBuildNumber)) {
					let lastSurveyId: string = state ? state.LastSurveyId : "";
					let lastSurveyStartTime: Date = state ? state.LastSurveyStartTimeUtc : getDistantPast();
					let lastSurveyExpirationTime: Date = state ? state.LastSurveyExpirationTimeUtc : getDistantPast();
					const lastSurveyActivatedTime: Date = state ? state.LastSurveyActivatedTimeUtc : getDistantPast();
					const lastCooldownEndTimeUtc: Date = state ? state.LastCooldownEndTimeUtc : getDistantPast();

					// Run the nomination
					const isCandidate: boolean = (state && state.ForceCandidacy) || definition.nominationScheme.evaluateNominationRules();
					if (isCandidate) {
						// Make new survey properties for the next call to get the active surveys
						lastSurveyId = Utils.guid();
						lastSurveyStartTime = definition.nominationScheme.calculateSurveyStartTimeFromDate(currentDate);
						lastSurveyExpirationTime = definition.nominationScheme.calculateSurveyExpirationTimeFromSurveyStartTime(lastSurveyStartTime);
					}

					const newState: CampaignState = new CampaignState(
						definition.campaignId,
						currentDate,
						this.currentBuildNumber,
						definition.nominationScheme.getActiveSurveyTimeIntervalSeconds(),
						false,
						isCandidate,
						false,
						lastSurveyActivatedTime,
						lastSurveyId,
						lastSurveyStartTime,
						lastSurveyExpirationTime,
						lastCooldownEndTimeUtc,
					);

					// Save the new state to our local cache
					this.campaignStates[newState.CampaignId] = newState;
				}
			}
		}
	}
}
