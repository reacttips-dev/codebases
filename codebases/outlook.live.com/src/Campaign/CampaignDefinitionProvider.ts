import { IFloodgateEnvironmentProvider } from "../Api/IFloodgateEnvironmentProvider";
import * as IFloodgateStorageProvider from "../Api/IFloodgateStorageProvider";
import { TelemetryEvent } from "../Constants";
import { FloodgateEngine } from "../FloodgateEngine";
import { GovernedChannelType } from "../GovernedChannel";
import * as ISurveyInfo from "../ISurveyInfo";
import * as Utils from "../Utils";

import { IUserFactProvider } from "../Api/Api";
import { UserFact } from "../UserFact/UserFact";
import { deserializeUserFacts, validateUserFacts } from "../UserFact/UserFactHelper";
import { CampaignScopeType } from "./CampaignScopeTypes";

const { getDistantFuture, isBoolean, isNOU, isNumber, isString, isUtcDatetimeString, stringToDate } = Utils;

// region Language Range

/**
 * Base class representing a language range in a campaign setting
 */
export abstract class CampaignLanguageRange {
	public static deserialize(input: any): CampaignLanguageRange {
		let result: CampaignLanguageRange;

		if (input && input.Type === 0) {
			result = CampaignLanguageRangeLanguageSubtag.deserialize(input);
		}

		if (result === undefined) {
			return null;
		}

		return result;
	}

	protected constructor() { }

	/**
	 * Returns whether or not the specific language tag (format from RFC 5646) is in this language range specification
	 */
	public abstract isInRange(language: string): boolean;

	protected validate(): boolean {
		return true;
	}
}

/**
 * Represents a range matching on the "language subtag" against fully specified language tags, according to RFC 5646
 */
export class CampaignLanguageRangeLanguageSubtag extends CampaignLanguageRange {
	public static deserialize(input: any): CampaignLanguageRangeLanguageSubtag {
		const result = new CampaignLanguageRangeLanguageSubtag();

		if (input) {
			result.languageSubTag = input.Value;
		}

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("Value")
	public languageSubTag: string;

	// public for UT only
	public constructor() { super(); }

	// @Override
	public isInRange(language: string): boolean {
		if (isNOU(language)) {
			return false;
		}

		const extractedLanguageSubTag: string = Utils.extractLanguageSubtag(language);
		if (isNOU(extractedLanguageSubTag)) {
			return false;
		}

		// compare strings ignoring case
		return extractedLanguageSubTag.toLocaleUpperCase() === this.languageSubTag.toLocaleUpperCase();
	}

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		if (isNOU(this.languageSubTag) || !isString(this.languageSubTag)) {
			return false;
		}
		// Reject any spec that isn't exactly a language subtag
		if (!Utils.isValidLanguageSubTag(this.languageSubTag)) {
			return false;
		}

		return true;
	}
}

// endregion

// region Scope

export abstract class CampaignScope {
	public static deserialize(input: any): CampaignScope {
		let result: CampaignScope;

		if (isNOU(input)) {
			return null;
		}

		switch (input.Type) {
			case CampaignScopeType.CampaignScopeAny:
				result = CampaignScopeAny.deserialize(input);
				break;
			case CampaignScopeType.CampaignScopeEnvironmentCrossProduct:
				result = CampaignScopeEnvironmentCrossProduct.deserialize(input);
				break;
			case CampaignScopeType.CampaignScopeUserFactAny:
				result = CampaignScopeUserFactAny.deserialize(input);
				break;
			case CampaignScopeType.CampaignScopeUserFactAll:
				result = CampaignScopeUserFactAll.deserialize(input);
				break;
		}

		if (result === undefined) {
			return null;
		}

		return result;
	}

	protected constructor() { }

	public abstract isInScope(): boolean;

	protected validate(): boolean {
		return true;
	}
}

export class CampaignScopeAny extends CampaignScope {
	public static deserialize(input: any): CampaignScopeAny {
		return new CampaignScopeAny();
	}

	// public for UT only
	public constructor() { super(); }

	// @Override
	public isInScope(): boolean {
		return true;
	}

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		return true;
	}
}

export class CampaignScopeEnvironmentCrossProduct extends CampaignScope {
	public static deserialize(input: any): CampaignScopeEnvironmentCrossProduct {
		const result = new CampaignScopeEnvironmentCrossProduct();
		let languageRanges: CampaignLanguageRange[] = [];

		if (isNOU(input)) {
			return null;
		}

		for (const key in input.Languages) {
			if (input.Languages.hasOwnProperty(key)) {
				const readRange: CampaignLanguageRange = input.Languages[key];

				if (readRange) {
					languageRanges.push(CampaignLanguageRange.deserialize(readRange));
				}
			}
		}

		if (languageRanges.length === 0) {
			languageRanges = null;
		}

		result.languageRanges = languageRanges;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("Languages")
	public languageRanges: CampaignLanguageRange[];

	private environmentProvider: IFloodgateEnvironmentProvider;

	// public for UT only
	public constructor() { super(); }

	public setEnvironmentProvider(environmentProvider: IFloodgateEnvironmentProvider) {
		this.environmentProvider = environmentProvider;
	}

	// @Override
	public isInScope(): boolean {
		if (isNOU(this.languageRanges)) {
			return true;
		}

		if (isNOU(this.environmentProvider) || !this.environmentProvider.getLanguage()) {
			return false;
		}

		const language = this.environmentProvider.getLanguage();
		// If the environment matches a single pattern, then this is a yes
		for (const key in this.languageRanges) {
			if (this.languageRanges.hasOwnProperty(key)) {
				const range = this.languageRanges[key];

				if (range.isInRange(language)) {
					return true;
				}
			}
		}

		return false;
	}

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		// Null languageRanges is allowed, means will match with everything.
		if (this.languageRanges) {
			for (const key in this.languageRanges) {
				if (this.languageRanges.hasOwnProperty(key) && !this.languageRanges[key]) {
					return false;
				}
			}
		}

		return true;
	}
}

export class CampaignScopeUserFactAny extends CampaignScope {
	public static deserialize(input: any): CampaignScopeUserFactAny {
		const result = new CampaignScopeUserFactAny();
		result.userFacts = deserializeUserFacts(input);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("UserFacts")
	public userFacts: UserFact[];

	private userFactsProvider?: IUserFactProvider;

	// public for UT only
	public constructor() { super(); }

	public setUserFactsProvider(userFactsProvider?: IUserFactProvider) {
		this.userFactsProvider = userFactsProvider;
	}

	// @Override
	public isInScope(): boolean {
		if (isNOU(this.userFacts)) {
			return true;
		}

		if (!this.userFactsProvider) {
			return false;
		}

		// If one of the user fact matches, then this is a yes
		return this.userFacts.some((userFact) => {
			const rawUserFact = this.userFactsProvider.getUserFact(userFact.getName());
			return userFact.isAMatch(rawUserFact);
		});
	}

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		return validateUserFacts(this.userFacts);
	}
}

export class CampaignScopeUserFactAll extends CampaignScope {
	public static deserialize(input: any): CampaignScopeUserFactAll {
		const result = new CampaignScopeUserFactAll();
		result.userFacts = deserializeUserFacts(input);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("UserFacts")
	public userFacts: UserFact[];

	private userFactsProvider?: IUserFactProvider;

	// public for UT only
	public constructor() { super(); }

	public setUserFactsProvider(userFactsProvider?: IUserFactProvider) {
		this.userFactsProvider = userFactsProvider;
	}

	// @Override
	public isInScope(): boolean {
		if (isNOU(this.userFacts)) {
			return true;
		}

		if (!this.userFactsProvider) {
			return false;
		}

		// Get all of the mismatched user facts
		const mismatchedFacts = this.userFacts.filter((userFact) => {
			const rawUserFact = this.userFactsProvider.getUserFact(userFact.getName());
			return !userFact.isAMatch(rawUserFact);
		});

		if (mismatchedFacts.length > 0) {
			const mismatchedNames = mismatchedFacts.map((userFact) => userFact.getName());
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.Floodgate.UserFactsSpecIsAMatch.Summary, {
					Count: mismatchedFacts.length,
					Message: mismatchedNames.toString(),
				});
			return false;
		}

		// If all of the user facts match, then this is a yes
		return true;
	}

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		return validateUserFacts(this.userFacts);
	}
}

// endregion

// region Durations

/**
 * Base class representing a duration in a campaign setting
 */
export abstract class CampaignDuration {
	public static deserialize(input: any): CampaignDuration {
		let result: CampaignDuration;

		if (isNOU(input)) {
			return null;
		}

		switch (input.Type) {
			case 0:
				result = CampaignDurationTimeInterval.deserialize(input);
				break;
			case 1:
				result = CampaignDurationSingleBuildChange.deserialize(input);
				break;
		}

		if (result === undefined) {
			return null;
		}

		return result;
	}

	protected constructor() { }

	public abstract asTimeIntervalSeconds(): number;

	protected validate(): boolean {
		return true;
	}
}

/**
 * A Duration expressed in seconds. UTC datetime comparisons are used to determine expiration.
 */
export class CampaignDurationTimeInterval extends CampaignDuration {
	public static deserialize(input: any): CampaignDurationTimeInterval {
		const result = new CampaignDurationTimeInterval();

		if (input) {
			result.intervalSeconds = input.IntervalSeconds;
		}

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("IntervalSeconds")
	public intervalSeconds: number;

	// public for UT only
	public constructor() { super(); }

	// @Override
	public asTimeIntervalSeconds(): number {
		return this.intervalSeconds;
	}

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		if (!isNumber(this.intervalSeconds)) {
			return false;
		}

		return true;
	}
}

/**
 * A Duration representing exactly 1 change in build number
 */
export class CampaignDurationSingleBuildChange extends CampaignDuration {
	public static deserialize(input: any): CampaignDurationSingleBuildChange {
		return new CampaignDurationSingleBuildChange();
	}

	// public for UT only
	public constructor() { super(); }

	// @Override
	public asTimeIntervalSeconds(): number {
		return null;
	}
}

/**
 * Class representing AdditionalDataRequested in CampaignDefinition
 */
export class CampaignAdditionalDataRequested {
	public static deserialize(additionalDataRequested: string[]): CampaignAdditionalDataRequested {
		const result = new CampaignAdditionalDataRequested();

		if (!isNOU(additionalDataRequested)) {
			// Convert from AdditionalDataRequested string to enum
			result.additionalData = [];
			for (const additionalData of additionalDataRequested) {
				if (additionalData === "EmailAddress") {
					result.additionalData.push(ISurveyInfo.AdditionalDataType.EmailAddress);
				}
			}
		}

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	public additionalData: ISurveyInfo.AdditionalDataType[];

	private validate(): boolean {
		if (isNOU(this.additionalData)) {
			return false;
		}

		return true;
	}
}
// endregion

// region Distribution Schemes

export abstract class CampaignDistribution {
	public static deserialize(input: any): CampaignDistribution {
		let result: CampaignDistribution;

		if (input && input.Type === 0) {
			result = CampaignDistributionRamp.deserialize(input);
		}

		if (result === undefined) {
			return null;
		}

		return result;
	}

	protected constructor() { }

	protected validate(): boolean {
		return true;
	}
}

export class CampaignDistributionRamp extends CampaignDistribution {
	public static deserialize(input: any): CampaignDistributionRamp {
		const result = new CampaignDistributionRamp();

		if (input) {
			result.maxDelaySeconds = input.MaxDelaySeconds;
			result.chunks = input.Chunks;
		}

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// The time window over which the ramp will distribute start dates.
	// @SerializedName("MaxDelaySeconds")
	public maxDelaySeconds: number;

	// The number of discrete buckets to divide the time window (maxDelaySeconds) into
	// @SerializedName("Chunks")
	public chunks: number;

	private constructor() { super(); }

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		if (!isNumber(this.maxDelaySeconds) || this.maxDelaySeconds < 0) {
			return false;
		}

		if (!isNumber(this.chunks) || this.chunks < 0) {
			return false;
		}

		return true;
	}
}

// endregion

// region Nomination Scheme

export abstract class CampaignNominationScheme {
	public static deserialize(input: any): CampaignNominationScheme {
		let result: CampaignNominationScheme;

		if (input && input.Type === 0) {
			result = CampaignNominationSchemeRatioPercentage.deserialize(input);
		}

		if (result === undefined) {
			return null;
		}

		return result;
	}

	// The amount of time (in seconds) for which the survey is active, if the nominationPeriod can't be interpreted as a time interval
	// note: This is only used when nominationPeriod is not of a type that can be interpreted as a time interval, otherwise
	// that value is used instead
	// @SerializedName("FallbackSurveyDurationSeconds")
	public fallbackSurveyDurationSeconds: number;

	// When the user never sees the survey during their candidacy (or anti-candidacy), this is the duration that must lapse
	// before re- nominating
	// @SerializedName("NominationPeriod")
	public nominationPeriod: CampaignDuration;

	// When the user does sees the survey during their candidacy, this is the duration that must lapse before re-evaluating
	// candidacy. Generally recommended that this be greater than nominationPeriod
	// @SerializedName("CooldownPeriod")
	public cooldownPeriod: CampaignDuration;

	protected constructor() { }

	/**
	 * @return The amount of time the survey should be active, in seconds. Abstracts the difference between nominationPeriod and the fallback
	 */
	public getActiveSurveyTimeIntervalSeconds(): number {
		const nominationTimIntervalSeconds: number = this.nominationPeriod.asTimeIntervalSeconds();

		if (isNumber(nominationTimIntervalSeconds)) {
			return nominationTimIntervalSeconds;
		}

		return this.fallbackSurveyDurationSeconds;
	}

	/**
	 * @return The survey start time, possibly adjusted by an underlying DistributionModel.
	 */
	public calculateSurveyStartTimeFromDate(soonestStartTime: Date): Date {
		// No adjustment in base class.  Derived classes can override and implement delays like a "ramp"
		return soonestStartTime ? soonestStartTime : new Date();
	}

	/**
	 * @return The survey expiration time, based on the nomination periods and the survey's adjusted start time
	 */
	public calculateSurveyExpirationTimeFromSurveyStartTime(surveyStartTime: Date): Date {
		surveyStartTime = surveyStartTime ? surveyStartTime : new Date();
		return Utils.addSecondsWithoutOverflow(surveyStartTime, this.getActiveSurveyTimeIntervalSeconds());
	}

	/**
	 * @return The appropriate campaign cool down based on whether or not the user activated the survey
	 */
	public getCampaignCooldown(didUserActivateSurvey: boolean): CampaignDuration {
		if (didUserActivateSurvey) {
			return this.cooldownPeriod;
		} else {
			return this.nominationPeriod;
		}
	}

	/**
	 * Evaluate this rule set based on a random number
	 *
	 * @return true if the user should be a candidate, false if they should be an anti-candidate
	 */
	public abstract evaluateNominationRules(): boolean;

	protected validate(): boolean {
		if (isNOU(this.nominationPeriod)) {
			return false;
		}

		if (isNOU(this.cooldownPeriod)) {
			this.cooldownPeriod = this.nominationPeriod;
		}

		if (!isNumber(this.nominationPeriod.asTimeIntervalSeconds())) {
			if (!isNumber(this.fallbackSurveyDurationSeconds) || this.fallbackSurveyDurationSeconds <= 0) {
				return false;
			}
		}

		return true;
	}
}

/**
 * Class representing a set of campaign nomination rules to evaluate for in-scope campaigns:
 * percentage
 * re-election durations
 * distribution model (for "nominated" candidates)
 */
export class CampaignNominationSchemeRatioPercentage extends CampaignNominationScheme {
	public static deserialize(input: any): CampaignNominationSchemeRatioPercentage {
		const result = new CampaignNominationSchemeRatioPercentage();

		if (isNOU(input)) {
			return null;
		}

		if (input.DistributionModel) {
			result.distributionModel = CampaignDistribution.deserialize(input.DistributionModel);
		}

		if (input.CooldownPeriod) {
			result.cooldownPeriod = CampaignDuration.deserialize(input.CooldownPeriod);
		}

		if (input.NominationPeriod) {
			result.nominationPeriod = CampaignDuration.deserialize(input.NominationPeriod);
		}

		result.fallbackSurveyDurationSeconds = input.FallbackSurveyDurationSeconds;
		result.percentageDenominator = input.PercentageDenominator;
		result.percentageNumerator = input.PercentageNumerator;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// The numerator when calculating the percentage of users that should be selected as candidates.  Must
	// satisfy 0 <= percentageNumerator <= percentageDenominator
	// @SerializedName("PercentageNumerator")
	public percentageNumerator: number;

	// The denominator when calculating the percentage of users that should be selected as candidates.  Must be greater than 0.
	// @SerializedName("PercentageDenominator")
	public percentageDenominator: number;

	// NYI - For candidates, allows the Survey start/end dates to be shifted forward in time, to help achieve a smoother signal
	// @SerializedName("DistributionModel")
	public distributionModel: CampaignDistribution;

	private constructor() { super(); }

	// @Override
	public evaluateNominationRules(): boolean {
		const rand: number = Math.random();
		// Creates a random number between [0 to (percentageDenominator - 1)]
		// In range [0 to (percentageDenominator - 1)] exactly 'percentageNumerator' values are < percentageNumerator
		return Math.floor(rand * this.percentageDenominator) < this.percentageNumerator;
	}

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		if (!isNumber(this.percentageDenominator) || !isNumber(this.percentageNumerator)) {
			return false;
		}

		if (this.percentageDenominator <= 0 || this.percentageNumerator < 0) {
			return false;
		}

		if (this.percentageNumerator > this.percentageDenominator) {
			return false;
		}

		// distribution model may be null
		return true;
	}
}

// endregion

// region Survey Event Definitions
export abstract class CampaignSurveyEvent {
	public static deserialize(input: any): CampaignSurveyEvent {
		let result: CampaignSurveyEvent;

		if (isNOU(input)) {
			return null;
		}

		switch (input.Type) {
			case 0:
				result = CampaignSurveyEventCountedActivity.deserialize(input);
				break;
			case 1:
				result = CampaignSurveyEventCountedActivitySequence.deserialize(input);
				break;
		}

		if (result === undefined) {
			return null;
		}

		return result;
	}

	protected constructor() { }

	protected validate(): boolean {
		return true;
	}
}

export class CampaignSurveyEventCountedActivity extends CampaignSurveyEvent {
	public static deserialize(input: any): CampaignSurveyEventCountedActivity {
		const result = new CampaignSurveyEventCountedActivity();

		if (isNOU(input)) {
			return null;
		}

		result.activity = input.Activity;
		result.count = input.Count;
		result.isAggregate = input.IsAggregate;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("Activity")
	public activity: string;

	// @SerializedName("Count")
	public count: number;

	// @SerializedName("IsAggregate")
	public isAggregate: boolean;

	// public for UT only
	public constructor() { super(); }

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		if (isNOU(this.activity) || !isString(this.activity)) {
			return false;
		}

		if (!isNumber(this.count) || this.count <= 0) {
			return false;
		}

		if (!isBoolean(this.isAggregate)) {
			return false;
		}

		return true;
	}
}

export class CampaignSurveyEventCountedActivitySequence extends CampaignSurveyEvent {
	public static deserialize(input: any): CampaignSurveyEventCountedActivitySequence {
		const result = new CampaignSurveyEventCountedActivitySequence();
		let sequence: CampaignSurveyEventCountedActivity[] = [];

		if (isNOU(input)) {
			return null;
		}

		for (const key in input.Sequence) {
			if (input.Sequence.hasOwnProperty(key)) {
				const readActivity: CampaignSurveyEventCountedActivity = input.Sequence[key];

				if (readActivity) {
					sequence.push(CampaignSurveyEventCountedActivity.deserialize(readActivity));
				}
			}
		}

		if (sequence.length === 0) {
			sequence = null;
		}

		result.sequence = sequence;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("Sequence")
	public sequence: CampaignSurveyEventCountedActivity[];

	// public for UT only
	public constructor() { super(); }

	// @Override
	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		if (isNOU(this.sequence)) {
			return false;
		}

		for (const key in this.sequence) {
			if (this.sequence.hasOwnProperty(key) && !this.sequence[key]) {
				return false;
			}
		}

		return true;
	}
}

// endregion

// region Survey Content Definitions

export class CampaignSurveyContent {
	public static deserialize(input: any, optionalComponents?: boolean): CampaignSurveyContent {
		const result = new CampaignSurveyContent();

		if (isNOU(input)) {
			return null;
		}

		result.prompt = CampaignSurveyContentPrompt.deserialize(input.Prompt);
		result.rating = CampaignSurveyContentRating.deserialize(input.Rating);
		result.comment = CampaignSurveyContentComment.deserialize(input.Question);
		result.multipleChoice = CampaignSurveyContentMultipleChoice.deserialize(input.MultipleChoice);
		result.intercept = CampaignSurveyContentIntercept.deserialize(input.Intercept);

		if (!result.validate(optionalComponents)) {
			return null;
		}

		return result;
	}

	// @SerializedName("Prompt")
	public prompt: CampaignSurveyContentPrompt;

	// @SerializedName("Rating")
	public rating: CampaignSurveyContentRating;

	// @SerializedName("Qustion")
	public comment: CampaignSurveyContentComment;

	// @SerializedName("MultipleChoice")
	public multipleChoice: CampaignSurveyContentMultipleChoice;

	// @SerializedName("Intercept")
	public intercept: CampaignSurveyContentIntercept;

	public validate(optionalComponents?: boolean): boolean {
		if (!isNOU(this.intercept)) {
			// An intercept survey only requires intercept.
			return true;
		}

		if (isNOU(this.prompt)) {
			return false;
		}

		if (optionalComponents) {
			return !isNOU(this.rating) ||
				!isNOU(this.multipleChoice) ||
				!isNOU(this.comment);
		}

		return !isNOU(this.rating) && !isNOU(this.comment);
	}
}

export class CampaignSurveyContentMultipleChoice {
	public static deserialize(input: any): CampaignSurveyContentMultipleChoice {
		const result = new CampaignSurveyContentMultipleChoice();

		if (isNOU(input)) {
			return null;
		}

		result.question = input.Question;
		result.availableOptions = input.AvailableOptions;
		result.minNumberOfSelectedOptions = input.MinNumberOfSelectedOptions;
		result.maxNumberOfSelectedOptions = input.MaxNumberOfSelectedOptions;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("Question")
	public question: string;

	// @SerializedName("AvailableOptions")
	public availableOptions: string[];

	// @SerializedName("MinNumberOfSelectedOptions")
	public minNumberOfSelectedOptions: number;

	// @SerializedName("MaxNumberOfSelectedOptions")
	public maxNumberOfSelectedOptions: number;

	private validate(): boolean {
		if (isNOU(this.question) || !isString(this.question) ||
			isNOU(this.availableOptions) || !Array.isArray(this.availableOptions) || this.availableOptions.length < 2 ||
			isNOU(this.minNumberOfSelectedOptions) || !isNumber(this.minNumberOfSelectedOptions) ||
			isNOU(this.maxNumberOfSelectedOptions) || !isNumber(this.maxNumberOfSelectedOptions)) {

			return false;
		}

		// expect all availableOptions values to be string
		for (const key in this.availableOptions) {
			if (this.availableOptions.hasOwnProperty(key)) {
				if (!isString(this.availableOptions[key])) {
					return false;
				}
			}
		}
		return true;
	}
}

export class CampaignSurveyContentPrompt {
	public static deserialize(input: any): CampaignSurveyContentPrompt {
		const result = new CampaignSurveyContentPrompt();

		if (isNOU(input)) {
			return null;
		}

		result.title = input.Title;
		result.question = input.Question;
		result.yesLabel = input.YesLabel;
		result.noLabel = input.NoLabel;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("Title")
	public title: string;

	// @SerializedName("Question")
	public question: string;

	// @SerializedName("YesLabel")
	public yesLabel: string;

	// @SerializedName("NoLabel")
	public noLabel: string;

	private validate(): boolean {
		if (isNOU(this.title) || !isString(this.title) ||
			isNOU(this.question) || !isString(this.question) ||
			isNOU(this.yesLabel) || !isString(this.yesLabel) ||
			isNOU(this.noLabel) || !isString(this.noLabel)) {

			return false;
		}

		return true;
	}
}

export class CampaignSurveyContentIntercept {
	public static deserialize(input: any): CampaignSurveyContentIntercept {
		const result = new CampaignSurveyContentIntercept();

		if (isNOU(input)) {
			return null;
		}

		result.title = input.Title;
		result.question = input.Question;
		result.url = input.Url;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("Title")
	public title: string;

	// @SerializedName("Question")
	public question: string;

	// @SerializedName("Url")
	public url: string;

	private validate(): boolean {
		if (isNOU(this.title) || !isString(this.title) ||
			isNOU(this.question) || !isString(this.question) ||
			isNOU(this.url) || !isString(this.url)) {

			return false;
		}

		return true;
	}
}

export class CampaignSurveyContentRating {
	public static deserialize(input: any): CampaignSurveyContentRating {
		const result = new CampaignSurveyContentRating();

		if (isNOU(input)) {
			return null;
		}

		result.isZeroBased = input.IsZeroBased;
		result.question = input.Question;
		result.ratingValuesAscending = input.RatingValuesAscending;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("IsZeroBased")
	public isZeroBased: boolean;

	// @SerializedName("Question")
	public question: string;

	// @SerializedName("RatingValuesAscending")
	public ratingValuesAscending: string[];

	private validate(): boolean {
		// expect ratingValuesAscending to contain between 2 to 11 values
		if (isNOU(this.question) || !isString(this.question) ||
			isNOU(this.ratingValuesAscending) || !Array.isArray(this.ratingValuesAscending) ||
			this.ratingValuesAscending.length < 2 || this.ratingValuesAscending.length > 11) {

			return false;
		}

		if (isNOU(this.isZeroBased)) {
			// default to false if not provided
			this.isZeroBased = false;
		} else if (!isBoolean(this.isZeroBased)) {
			// fail validation if non boolean value is provided
			return false;
		}

		// expect all ratingValuesAscending values to be string
		for (const key in this.ratingValuesAscending) {
			if (this.ratingValuesAscending.hasOwnProperty(key)) {
				if (!isString(this.ratingValuesAscending[key])) {
					return false;
				}
			}
		}

		return true;
	}
}

export class CampaignSurveyContentComment {
	public static deserialize(input: any): CampaignSurveyContentComment {
		const result = new CampaignSurveyContentComment();

		if (isNOU(input)) {
			return null;
		}

		// @SerializedName("Question")
		result.question = input.Question;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("Question")
	public question: string;

	private validate(): boolean {
		if (isNOU(this.question) || !isString(this.question)) {
			return false;
		}

		return true;
	}
}

// endregion

// region Survey Metadata Definitions

export class CampaignSurveyMetadata {
	public static deserialize(input: any): CampaignSurveyMetadata {
		if (isNOU(input)) {
			return null;
		}

		const result = new CampaignSurveyMetadata();
		result.contentMetadata = input.ContentMetadata;

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("ContentMetadata")
	public contentMetadata: object;

	public validate(): boolean {
		if (isNOU(this.contentMetadata) || !Utils.isObject(this.contentMetadata)) {
			return false;
		}

		return true;
	}
}

// endregion

// region Survey Template definitions

export abstract class CampaignSurveyTemplate {
	public static deserialize(input: any): CampaignSurveyTemplate {
		let result: CampaignSurveyTemplate;

		if (isNOU(input)) {
			return null;
		}

		switch (input.Type) {
			case CampaignSurveyTemplate.Type.Nps5PointStatic:
				result = CampaignSurveyTemplateNps5PointStatic.deserialize(input);
				break;
			case CampaignSurveyTemplate.Type.Nps11PointStatic:
				result = CampaignSurveyTemplateNps11PointStatic.deserialize(input);
				break;
			case CampaignSurveyTemplate.Type.Fps:
				result = CampaignSurveyTemplateFps.deserialize(input);
				break;
			case CampaignSurveyTemplate.Type.Nlqs:
				result = CampaignSurveyTemplateNlqs.deserialize(input);
				break;
			case CampaignSurveyTemplate.Type.Nps:
				result = CampaignSurveyTemplateNps.deserialize(input);
				break;
			case CampaignSurveyTemplate.Type.GenericMessagingSurface:
				result = CampaignSurveyTemplateGenericMessagingSurface.deserialize(input);
				break;
			case CampaignSurveyTemplate.Type.Intercept:
				result = CampaignSurveyTemplateIntercept.deserialize(input);
				break;
		}

		if (result === undefined) {
			return null;
		}

		return result;
	}

	// @SerializedName("ActivationEvent")
	public activationEvent: CampaignSurveyEvent;

	// @SerializedName("Content")
	public content: CampaignSurveyContent;

	// @SerializedName("Metadata")
	public metadata: CampaignSurveyMetadata;

	protected constructor() { }

	protected validate(): boolean {
		if (isNOU(this.activationEvent)) {
			return false;
		}

		return true;
	}
}

export module CampaignSurveyTemplate {
	export const enum Type {
		Nps5PointStatic = 0,
		Nps11PointStatic = 1,
		Fps = 2,
		Nlqs = 3,
		Nps = 4,
		Intercept = 5,
		// A generic messagibg surface template type, which will make use of
		// content metadata to render ui.
		// As of 4th Feb 2019 there are 20 template types defined in Mso,
		// hence giving 22 as value for this type.
		GenericMessagingSurface = 22,
	}
}

export class CampaignSurveyTemplateFps extends CampaignSurveyTemplate {
	public static deserialize(input: any): CampaignSurveyTemplateFps {
		const result = new CampaignSurveyTemplateFps();

		if (isNOU(input)) {
			return null;
		}

		result.activationEvent = CampaignSurveyEvent.deserialize(input.ActivationEvent);
		result.content = CampaignSurveyContent.deserialize(input.Content, true /* optionalComponents */);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// public for UT only
	public constructor() { super(); }

	protected validate(): boolean {
		if (!super.validate() || isNOU(this.content)) {
			return false;
		}

		return true;
	}
}

export class CampaignSurveyTemplateNlqs extends CampaignSurveyTemplate {
	public static deserialize(input: any): CampaignSurveyTemplateNlqs {
		const result = new CampaignSurveyTemplateNlqs();

		if (isNOU(input)) {
			return null;
		}

		result.activationEvent = CampaignSurveyEvent.deserialize(input.ActivationEvent);
		result.content = CampaignSurveyContent.deserialize(input.Content);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// public for UT only
	public constructor() { super(); }

	protected validate(): boolean {
		if (!super.validate() || isNOU(this.content)) {
			return false;
		}

		return true;
	}
}

export class CampaignSurveyTemplateNps extends CampaignSurveyTemplate {
	public static deserialize(input: any): CampaignSurveyTemplateNps {
		const result = new CampaignSurveyTemplateNps();

		if (isNOU(input)) {
			return null;
		}

		result.activationEvent = CampaignSurveyEvent.deserialize(input.ActivationEvent);
		result.content = CampaignSurveyContent.deserialize(input.Content);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// public for UT only
	public constructor() { super(); }

	protected validate(): boolean {
		if (!super.validate() || isNOU(this.content)) {
			return false;
		}

		return true;
	}
}

export class CampaignSurveyTemplateNps5PointStatic extends CampaignSurveyTemplate {
	public static deserialize(input: any): CampaignSurveyTemplateNps5PointStatic {
		const result = new CampaignSurveyTemplateNps5PointStatic();

		if (isNOU(input)) {
			return null;
		}

		result.activationEvent = CampaignSurveyEvent.deserialize(input.ActivationEvent);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// public for UT only
	public constructor() { super(); }

	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		return true;
	}
}

export class CampaignSurveyTemplateNps11PointStatic extends CampaignSurveyTemplate {
	public static deserialize(input: any): CampaignSurveyTemplateNps11PointStatic {
		const result = new CampaignSurveyTemplateNps11PointStatic();

		if (isNOU(input)) {
			return null;
		}

		result.activationEvent = CampaignSurveyEvent.deserialize(input.ActivationEvent);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	private constructor() { super(); }

	protected validate(): boolean {
		if (!super.validate()) {
			return false;
		}

		return true;
	}
}

export class CampaignSurveyTemplateGenericMessagingSurface extends CampaignSurveyTemplate {
	public static deserialize(input: any): CampaignSurveyTemplateGenericMessagingSurface {
		if (isNOU(input)) {
			return null;
		}

		const result = new CampaignSurveyTemplateGenericMessagingSurface();
		result.activationEvent = CampaignSurveyEvent.deserialize(input.ActivationEvent);
		result.metadata = CampaignSurveyMetadata.deserialize(input.Metadata);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	public constructor() { super(); }

	protected validate(): boolean {
		if (!super.validate() || isNOU(this.metadata)) {
			return false;
		}

		return true;
	}
}

export class CampaignSurveyTemplateIntercept extends CampaignSurveyTemplate {
	public static deserialize(input: any): CampaignSurveyTemplateIntercept {
		const result = new CampaignSurveyTemplateIntercept();

		if (isNOU(input)) {
			return null;
		}

		result.activationEvent = CampaignSurveyEvent.deserialize(input.ActivationEvent);
		result.content = CampaignSurveyContent.deserialize(input.Content);

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// public for UT only
	public constructor() { super(); }

	protected validate(): boolean {
		if (!super.validate() || isNOU(this.content)) {
			return false;
		}

		return true;
	}
}

// endregion

// region Campaign Definition

export class CampaignDefinition {
	/**
	 * Method to deserialize a JSON object to class object
	 * @param input: JSON object
	 * Returns result of validation check
	 */
	public static deserialize(input: any): CampaignDefinition {
		const result: CampaignDefinition = new CampaignDefinition();

		if (isNOU(input)) {
			return null;
		}

		result.campaignId = input.CampaignId;
		result.governedChannelType = input.GovernedChannelType;
		result.startTime = input.StartTimeUtc;
		result.endTime = input.EndTimeUtc;
		result.launcherType = input.LauncherType;

		const additionalDataRequested: CampaignAdditionalDataRequested = CampaignAdditionalDataRequested.deserialize(
			input.AdditionalDataRequested);
		result.additionalDataRequested = additionalDataRequested ? additionalDataRequested.additionalData : [];

		if (input.SurveyTemplate) {
			result.surveyTemplate = CampaignSurveyTemplate.deserialize(input.SurveyTemplate);
		}

		if (input.NominationScheme) {
			result.nominationScheme = CampaignNominationScheme.deserialize(input.NominationScheme);
		}

		if (input.Scope) {
			result.scope = CampaignScope.deserialize(input.Scope);
		}

		if (!result.validate()) {
			return null;
		}

		return result;
	}

	// @SerializedName("CampaignId")
	public campaignId: string;

	// @SerializedName("GovernedChannelType")
	public governedChannelType: GovernedChannelType;

	// @SerializedName("Scope")
	public scope: CampaignScope;

	// @SerializedName("NominationScheme")
	public nominationScheme: CampaignNominationScheme;

	// @SerializedName("SurveyTemplate")
	public surveyTemplate: CampaignSurveyTemplate;

	// @SerializedName("StartTimeUtc")
	public startTime: Date;

	// @SerializedName("EndTimeUtc")
	public endTime: Date;

	// @SerializedName("AdditionalDataRequested")
	public additionalDataRequested: ISurveyInfo.AdditionalDataType[];

	// @SerializedName("LauncherType")
	public launcherType: string;

	public validate(): boolean {
		if (isNOU(this.scope)) {
			this.scope = new CampaignScopeAny();
		}

		if (isNOU(this.campaignId) || !isString(this.campaignId)) {
			return false;
		}

		if (!isNumber(this.governedChannelType) || !Utils.isEnumValue(this.governedChannelType, GovernedChannelType)) {
			return false;
		}

		if (isNOU(this.nominationScheme)) {
			return false;
		}

		if (isNOU(this.surveyTemplate)) {
			return false;
		}

		if (!isNOU(this.launcherType) && !isString(this.launcherType)) {
			return false;
		}

		// Campaigns with no start date are effectively disabled, in fact, this is the supported way to stage a definition but have it be turned off
		if (isNOU(this.startTime)) {
			this.startTime = getDistantFuture();
		} else if (isUtcDatetimeString(this.startTime)) {
			this.startTime = stringToDate(this.startTime);
		} else {
			return false;
		}

		// Campaigns with no end date are effectively on indefinitely
		if (isNOU(this.endTime)) {
			this.endTime = getDistantFuture();
		} else if (isUtcDatetimeString(this.endTime)) {
			this.endTime = stringToDate(this.endTime);
		} else {
			return false;
		}

		return true;
	}
}

/**
 * Given an array of campaign definitions, returns the valid ones and errors if any are invalid.
 * @param input: JSON object
 * Returns the valid definitions and the error as string if any.
 */
export function FilterValidCampaignDefinitions(campaignDefinitions: any): { result: CampaignDefinition[], error: string } {
	const result: CampaignDefinition[] = [];

	if (isNOU(campaignDefinitions)) {
		return { result, error: "Empty" };
	}

	if (!Array.isArray(campaignDefinitions)) {
		return { result, error: "Not an array" };
	}

	const badIndexes: number[] = [];
	for (let i = 0; i < campaignDefinitions.length; i++) {
		const definition: any = campaignDefinitions[i];

		if (definition) {
			const newDefinition: CampaignDefinition = CampaignDefinition.deserialize(definition);

			newDefinition
				? result.push(newDefinition)
				: badIndexes.push(i);
		} else {
			badIndexes.push(i);
		}
	}

	const error: string = badIndexes.length > 0 ? "Invalid campaign definitions at indexes: " + badIndexes.toString() : undefined;
	return { result, error };
}

// endregion

export interface ICampaignDefinitionProvider {
	load(): CampaignDefinition[];
	loadAsync(): Promise<CampaignDefinition[]>;
}

export class FileSystemCampaignDefinitionProvider implements ICampaignDefinitionProvider {
	private storage: IFloodgateStorageProvider;

	public constructor(storage: IFloodgateStorageProvider) {
		if (isNOU(storage)) {
			throw new Error("storage must not be null");
		}

		this.storage = storage;
	}

	public load(): CampaignDefinition[] {
		const definitionString: string = this.storage.read(IFloodgateStorageProvider.FileType.CampaignDefinitions);
		if (isNOU(definitionString)) {
			return [];
		}

		let readDefinitions: any;

		try {
			readDefinitions = JSON.parse(definitionString);
		} catch (e) {
			FloodgateEngine.getTelemetryLogger().log_CampaignLoad_Failed(e.toString());
			return [];
		}

		// This ignores errors in validation for now.
		return FilterValidCampaignDefinitions(readDefinitions).result;
	}

	public loadAsync(): Promise<CampaignDefinition[]> {
		const definitions = this.load();
		return new Promise(
			function onFulfilled(resolve, reject) {
				resolve(definitions);
			},
		);
	}
}
