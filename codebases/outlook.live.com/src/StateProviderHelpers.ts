import { SurveyActivationStats, SurveyStatCollectionActivation } from "../src/SurveyStatCollectionActivation";
import { CampaignState } from "./Campaign/CampaignStateProvider";
import { IDictionary } from "./Common";
import { GovernedChannelState } from "./GovernedChannelStateProvider";

/**
 * Values for the state list types
 */
export const enum StateListType {
	Merged,
	ToBeUpdated,
}

export interface IKeyedCollection<T> {
	add(key: number, value: T);
	find(key: number): T;
	remove(key: number);
	count(): number;
}

export class ItemCollection<T> implements IKeyedCollection<T> {
	private items: { [key: number]: T } = {};
	private itemCount: number = 0;

	public add(key: number, value: T) {
		if (!this.items[key]) {
			this.itemCount++;
		}
		this.items[key] = value;
	}

	public find(key: number): T {
		return this.items[key];
	}

	public remove(key: number): T {
		const item: T = this.items[key];

		if (item) {
			delete this.items[key];
			this.itemCount--;
		}

		return item;
	}

	public count(): number {
		return this.itemCount;
	}
}

export function extractSettingItemValueSubString(itemValue: string): string {
	if (!itemValue) {
		return itemValue;
	}

	const beginPos: number = itemValue.indexOf(SETTING_DATA_OPEN_TAG) + SETTING_DATA_OPEN_TAG.length;
	const endPos: number = itemValue.indexOf(SETTING_DATA_CLOSE_TAG);

	if (beginPos < 0 || endPos < 0) {
		return itemValue;
	}

	return itemValue.substring(beginPos, endPos);
}

export function makeSettingItemValue(value: string): string {
	if (!value) {
		return SETTING_DATA_OPEN_TAG + SETTING_DATA_CLOSE_TAG;
	}

	return SETTING_DATA_OPEN_TAG + value + SETTING_DATA_CLOSE_TAG;
}

export function MergeAndUpdateGovernedChannelStates(previousStates: GovernedChannelState[],
	currentStates: GovernedChannelState[]): IKeyedCollection<GovernedChannelState[]> {
	const stateCollections: IKeyedCollection<GovernedChannelState[]> = new ItemCollection<GovernedChannelState[]>();

	// Todo: move the following into a generic method to be shared
	if (!previousStates && !currentStates) {
		return stateCollections;
	}

	if (!previousStates) {
		stateCollections.add(StateListType.Merged, currentStates);
		return stateCollections;
	}

	if (!currentStates) {
		stateCollections.add(StateListType.Merged, previousStates);
		stateCollections.add(StateListType.ToBeUpdated, previousStates);
		return stateCollections;
	}

	const mergedStates: GovernedChannelState[] = [];
	const toBeUpdatedStates: GovernedChannelState[] = [];

	if (previousStates) {
		previousStates.forEach((previousState) => {
			// find matching in current states
			let pos = -1;
			let currentState: GovernedChannelState;
			for (let i = 0; i < currentStates.length; i++) {
				currentState = currentStates[i];
				if (currentState.getType() === previousState.getType()) {
					pos = i;
					break;
				}
			}

			// if previous state is not in current states
			if (pos === -1) {
				// add previous state to merged
				mergedStates.push(previousState);

				// add previous state to toUpdated
				toBeUpdatedStates.push(previousState);

				return;
			}

			// if ActivationTimeUtc of previous is greater than current
			if (previousState.getCooldownStartTime() > currentState.getCooldownStartTime()) {
				// add previous state to merged
				mergedStates.push(previousState);

				// add previous state to toUpdated
				toBeUpdatedStates.push(previousState);
			} else {
				// add current state to merged
				mergedStates.push(currentState);
			}

			// remove state from current states
			currentStates.splice(pos, 1);
		});
	}

	// for the remaining current states
	if (currentStates) {
		currentStates.forEach((currentState) => {
			// add current state to merged
			mergedStates.push(currentState);
		});
	}

	stateCollections.add(StateListType.Merged, mergedStates);

	if (toBeUpdatedStates.length > 0) {
		stateCollections.add(StateListType.ToBeUpdated, toBeUpdatedStates);
	}

	return stateCollections;
}

export function MergeAndUpdateCampaignStates(previousStates: CampaignState[],
	currentStates: CampaignState[]): IKeyedCollection<CampaignState[]> {
	const stateCollections: IKeyedCollection<CampaignState[]> = new ItemCollection<CampaignState[]>();

	if (!previousStates && !currentStates) {
		return stateCollections;
	}

	if (!previousStates) {
		stateCollections.add(StateListType.Merged, currentStates);
		return stateCollections;
	}

	if (!currentStates) {
		stateCollections.add(StateListType.Merged, previousStates);
		stateCollections.add(StateListType.ToBeUpdated, previousStates);
		return stateCollections;
	}

	const mergedStates: CampaignState[] = [];
	const toBeUpdatedStates: CampaignState[] = [];

	if (previousStates) {
		previousStates.forEach((previousState) => {
			const current = new Date();

			// find matching in current states
			let pos = -1;
			let currentState: CampaignState;
			for (let i = 0; i < currentStates.length; i++) {
				currentState = currentStates[i];
				if (currentState.CampaignId === previousState.CampaignId) {
					pos = i;
					break;
				}
			}

			// if previous state is not in current states
			if (pos === -1) {
				// add previous state to merged
				mergedStates.push(previousState);

				// add previous state to toUpdated
				toBeUpdatedStates.push(previousState);

				return;
			}

			// if current state is in cooldown, add to merged list
			if (currentState.LastCooldownEndTimeUtc > current) {
				// add previous state to merged list
				mergedStates.push(currentState);

				// emove state from current states
				currentStates.splice(pos, 1);

				return;
			}

			// if previous state is in cooldown, add to merged and toUpdated lists
			if (previousState.LastCooldownEndTimeUtc > current) {
				// add previous state to merged list
				mergedStates.push(previousState);

				// add previous state to to-be-updated list
				toBeUpdatedStates.push(previousState);

				// emove state from current states
				currentStates.splice(pos, 1);
				return;
			}

			// add previous state to toUpdated and merged for the following two conditions:
			//  1. previous cooldown time wins, or
			//  2. cooldown times are the same and previous nomination wins
			if (previousState.getCooldownStartDate() > currentState.getCooldownStartDate()
				|| (previousState.getCooldownStartDate() === currentState.getCooldownStartDate()
					&& previousState.LastNominationTimeUtc > currentState.LastNominationTimeUtc)
			) {
				mergedStates.push(previousState);

				toBeUpdatedStates.push(previousState);
			} else {
				// add current state to merged
				mergedStates.push(currentState);
			}

			// remove state from current states
			currentStates.splice(pos, 1);
		});
	}

	// for the remaining current states
	if (currentStates) {
		currentStates.forEach((current) => {
			// add current state to merged
			mergedStates.push(current);
		});
	}

	stateCollections.add(StateListType.Merged, mergedStates);

	if (toBeUpdatedStates.length > 0) {
		stateCollections.add(StateListType.ToBeUpdated, toBeUpdatedStates);
	}

	return stateCollections;
}

export function MergeAndUpdateSurveyActivationStats(previousStats: SurveyStatCollectionActivation,
	currentStats: SurveyStatCollectionActivation): IKeyedCollection<SurveyStatCollectionActivation> {

	const statsCollections: IKeyedCollection<SurveyStatCollectionActivation> = new ItemCollection<SurveyStatCollectionActivation>();

	// Handle previousStats and/or currentStats equal to null
	if (!previousStats && !currentStats) {
		return statsCollections;
	}

	if (!previousStats) {
		statsCollections.add(StateListType.Merged, currentStats);
		return statsCollections;
	}

	if (!currentStats) {
		statsCollections.add(StateListType.Merged, previousStats);
		statsCollections.add(StateListType.ToBeUpdated, previousStats);
		return statsCollections;
	}

	// Enumerate preivous stats
	const mergedStats: SurveyStatCollectionActivation = new SurveyStatCollectionActivation();
	const toBeUpdatedStats: SurveyStatCollectionActivation = new SurveyStatCollectionActivation();

	const previousStatsDictionary: IDictionary<SurveyActivationStats> = previousStats.getStats();
	const currentStatsDictionary: IDictionary<SurveyActivationStats> = currentStats.getStats();

	for (const surveyId in previousStatsDictionary) {
		if (previousStatsDictionary.hasOwnProperty(surveyId)) {
			// if an updated stat is not found
			const currentActivationStats: SurveyActivationStats = currentStatsDictionary[surveyId];
			if (!currentActivationStats) {
				// add to merged collection
				mergedStats.addStats(surveyId, previousStatsDictionary[surveyId]);
				// add to-be-updated collection
				toBeUpdatedStats.addStats(surveyId, previousStatsDictionary[surveyId]);
				continue;
			}
			// if previous stat has higher activation time
			const previousActivationStats: SurveyActivationStats = previousStatsDictionary[surveyId];
			if (previousActivationStats.ActivationTimeUtc > currentActivationStats.ActivationTimeUtc) {
				// add to merged collection
				mergedStats.addStats(surveyId, previousStatsDictionary[surveyId]);
				// add to-be-updated collection
				toBeUpdatedStats.addStats(surveyId, previousStatsDictionary[surveyId]);
			} else {
				// add to current stat merged collection
				mergedStats.addStats(surveyId, currentStatsDictionary[surveyId]);
			}

			// delete from stats
			delete currentStatsDictionary[surveyId];
		}
	}

	// merge any remaining stats
	for (const surveyId in currentStatsDictionary) {
		if (currentStatsDictionary.hasOwnProperty(surveyId)) {
			mergedStats.addStats(surveyId, currentStatsDictionary[surveyId]);
		}
	}

	// always return merged list
	statsCollections.add(StateListType.Merged, mergedStats);

	// since dictionaries don't have an empty check, enumerate the  first entry to check for non-empty
	const toBeUpdatedStatsDictionary: IDictionary<SurveyActivationStats> = toBeUpdatedStats.getStats();
	for (const toBeUpdated in toBeUpdatedStatsDictionary) {
		if (toBeUpdatedStatsDictionary.hasOwnProperty(toBeUpdated)) {
			// not empty, return to-be-updated
			statsCollections.add(StateListType.ToBeUpdated, toBeUpdatedStats);
			break;
		}
	}

	return statsCollections;
}

const SETTING_DATA_OPEN_TAG = "<data>";
const SETTING_DATA_CLOSE_TAG = "</data>";
