import { TelemetryEvent } from "../Constants";
import { FloodgateEngine } from "../FloodgateEngine";
import * as Utils from "../Utils";
import { IUserFact } from "./IUserFact";
import { ComparatorType, CurrentTimeIntervalType, IUserFactInput, UserFactLatencyType, UserFactType } from "./UserFactModel";

const { isNOU, isNumber, isArray } = Utils;
const commonComparatorTypes: ComparatorType[] = [
	ComparatorType.Equal,
	ComparatorType.NotEqual,
	ComparatorType.GreaterThan,
	ComparatorType.GreaterThanOrEqual,
	ComparatorType.LessThan,
	ComparatorType.LessThanOrEqual,
];

export class UserFact {
	public static deserialize(rawUserFactSpec: any): UserFact {
		return this.validate(rawUserFactSpec) ? new UserFact(rawUserFactSpec) : null;
	}

	private static validate(input: any) {
		if (!input) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecDeserialization.Failed,
				"Input is null or undefined for user fact");
			return false;
		}

		// Values is used for type UserFactType.ListOfStrings
		if (!input.Value && input.Values) {
			input.Value = input.Values;
		}

		if (isNOU(input.Name) || isNOU(input.Type) || isNOU(input.Value)) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecDeserialization.Failed,
				`Either of the required parameters Name: ${input.Name}, Type: ${input.Type} or Value: ${input.Value} are not provided for the user fact`);
			return false;
		}

		if (!this.validateUserFactType(input.Type)) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecDeserialization.Failed,
				`Invalid UserFactType value ${input.Type} is provided for user fact`);
			return false;
		}

		if (input.Type === UserFactType.ListFile) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecDeserialization.Failed,
				`Unsupported UserFactType value ${input.Type} is provided for user fact`);
			return false;
		}

		if (input.LatencyType && !this.validateLatencyType(input.LatencyType)) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecDeserialization.Failed,
				`Invalid LatencyType value ${input.LatencyType} is provided for user fact of type ${input.Type}`);
			return false;
		}

		if (input.LatencyType && input.LatencyType !== UserFactLatencyType.None && isNOU(input.LatencyDurationInSeconds)) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecDeserialization.Failed,
				`LatencyDurationInSeconds value ${input.LatencyDurationInSeconds} is not provided for user fact of type ${input.Type}`);
			return false;
		}

		if (input.LatencyDurationInSeconds && !isNumber(input.LatencyDurationInSeconds)) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecDeserialization.Failed,
				`Invalid LatencyDurationInSeconds value ${input.LatencyDurationInSeconds} is provided for user fact of type ${input.Type}`);
			return false;
		}

		if (input.Type === UserFactType.TimeIntervalInSeconds && isNOU(input.IntervalType)) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecDeserialization.Failed,
				`Required parameter intervalType is not provided for user fact of type ${input.Type}`);
			return false;
		}

		const supportedComparatorTypes = this.getComparatorTypes(input.Type);
		if (input.Comparator && !isComparatorTypeSupported(input.Comparator, supportedComparatorTypes)) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecIsAMatch.Failed,
				`Unsupported comparator type for user fact of type ${input.Type}`);
			return false;
		}

		return true;
	}

	private static getComparatorTypes(userFactType: UserFactType): ComparatorType[]  {
		switch (userFactType) {
			case UserFactType.Boolean:
				return [ComparatorType.Equal, ComparatorType.NotEqual];
			case UserFactType.String:
				return [ComparatorType.Equal, ComparatorType.NotEqual, ComparatorType.In, ComparatorType.NotIn];
			case UserFactType.ListOfStrings:
				return [ComparatorType.In, ComparatorType.NotIn];
			case UserFactType.TimeIntervalInSeconds:
			case UserFactType.DateTimeUTC:
			case UserFactType.Number:
			default:
				return commonComparatorTypes;
		}

		return commonComparatorTypes;
	}

	private static assertNever(_: never) {
		return false;
	}

	private static validateLatencyType(latency: UserFactLatencyType) {
		return (
			latency === UserFactLatencyType.None ||
			latency === UserFactLatencyType.ClientIngestionDateTime ||
			latency === UserFactLatencyType.SourceDateTime ||
			latency === UserFactLatencyType.StorageDateTime
		) ? true : this.assertNever(latency);
	}

	private static validateUserFactType(factType: UserFactType) {
		return (
			factType === UserFactType.Boolean ||
			factType === UserFactType.DateTimeUTC ||
			factType === UserFactType.Number ||
			factType === UserFactType.String ||
			factType === UserFactType.TimeIntervalInSeconds ||
			factType === UserFactType.ListOfStrings ||
			factType === UserFactType.ListFile
		) ? true : this.assertNever(factType);
	}

	private input: IUserFactInput;

	constructor(input: IUserFactInput) {
		this.input = input;
	}

	public isAMatch(rawUserFact: IUserFact): boolean {
		if (!rawUserFact || !rawUserFact.userFactValue) {
			return false;
		}

		if (!this.isLatencyAcceptable(rawUserFact)) {
			return false;
		}

		try {
			const factType = this.getType();
			if (factType === UserFactType.Boolean) {
				return compareBooleanValues(this.getValue(), rawUserFact, this.getComparator());
			} else if (factType === UserFactType.DateTimeUTC) {
				return compareDateTimeUTCValues(this.getValue() as string, rawUserFact, this.getComparator());
			} else if (factType === UserFactType.Number) {
				return compareNumberValues(this.getValue() as string, rawUserFact, this.getComparator());
			} else if (factType === UserFactType.String) {
				return compareStringValues(this.getValue() as string, rawUserFact, this.getComparator());
			} else if (factType === UserFactType.TimeIntervalInSeconds) {
				return compareTimeIntervalValues(this.getValue() as number, rawUserFact, this.getComparator(), this.getIntervalType());
			} else if (factType === UserFactType.ListOfStrings) {
				return compareListValues(this.getValue() as string, rawUserFact, this.getComparator());
			} else {
				FloodgateEngine.getTelemetryLogger().log_Error(
					TelemetryEvent.Floodgate.UserFactsSpecIsAMatch.Failed,
					`Unsupported type of user fact was provided ${factType}`);
				return false;
			}
		} catch (error) {
			FloodgateEngine.getTelemetryLogger().log_Error(
				TelemetryEvent.Floodgate.UserFactsSpecIsAMatch.Failed,
				error);
			return false;
		}
	}

	public getType() {
		return this.input.Type;
	}

	public getName() {
		return this.input.Name;
	}

	public getValue() {
		return this.input.Value;
	}

	public getComparator() {
		return this.input.Comparator || ComparatorType.Equal;
	}

	public getLatencyType() {
		return this.input.LatencyType || UserFactLatencyType.None;
	}

	public getLatencyDurationInSeconds() {
		return this.input.LatencyDurationInSeconds;
	}

	public getIntervalType() {
		return this.input.IntervalType;
	}

	private isLatencyAcceptable(rawUserFact: IUserFact) {
		const factType = this.getType();

		if (!isNOU(this.getLatencyDurationInSeconds()) &&
			!evaluateFactCandidacy(this.getLatencyType(), this.getLatencyDurationInSeconds(), rawUserFact)) {
			FloodgateEngine.getTelemetryLogger().log_Event(
				TelemetryEvent.Floodgate.UserFactsSpecIsAMatch.Mismatch, {
					ErrorMessage: "Latency duration not acceptable",
					Type: `${factType}`,
				},
			);
			return false;
		}

		return true;
	}
}

function evaluateFactCandidacy(latencyType: UserFactLatencyType, latencyDurationInSeconds: number, userFact: IUserFact) {
	let userFactTime: string;
	switch (latencyType) {
		case UserFactLatencyType.None:
			break;
		case UserFactLatencyType.SourceDateTime:
			userFactTime = userFact.sourceDateTime;
			break;
		case UserFactLatencyType.StorageDateTime:
			userFactTime = userFact.storageDateTime;
			break;
		case UserFactLatencyType.ClientIngestionDateTime:
			userFactTime = userFact.clientIngestionDateTime;
			break;
	}

	if (!isNOU(userFactTime)) {
		const userFactTimeInMilliseconds = Date.parse(userFactTime);
		const currentTimeInMilliseconds = Date.now();

		return currentTimeInMilliseconds - userFactTimeInMilliseconds <= (latencyDurationInSeconds * 1000);
	}

	return true;
}

function compareBooleanValues(userFactSpecValue: any, rawUserFact: IUserFact, comparator: ComparatorType) {
	const rawUserFactValueInBoolean = JSON.parse(rawUserFact.userFactValue.toLowerCase());
	return compareValues(!!userFactSpecValue, !!rawUserFactValueInBoolean, comparator);
}

function compareDateTimeUTCValues(userFactSpecValue: string, rawUserFact: IUserFact, comparator: ComparatorType) {
	const rawUserFactValueInMilliseconds = Date.parse(rawUserFact.userFactValue);
	if (!isAValidNumber(rawUserFactValueInMilliseconds, rawUserFact.userFactValue, rawUserFact.userFactName)) {
		return false;
	}
	const userFactSpecValueInMilliseconds = Date.parse(userFactSpecValue);
	if (!isAValidNumber(userFactSpecValueInMilliseconds, userFactSpecValue, null, UserFactType.DateTimeUTC)) {
		return false;
	}

	return compareValues(userFactSpecValueInMilliseconds, rawUserFactValueInMilliseconds, comparator);
}

function compareNumberValues(userFactSpecValue: string, rawUserFact: IUserFact, comparator: ComparatorType) {
	const rawUserFactValueInNumber = parseInt(rawUserFact.userFactValue, 10);
	if (!isAValidNumber(rawUserFactValueInNumber, rawUserFact.userFactValue, rawUserFact.userFactName)) {
		return false;
	}

	return compareValues(userFactSpecValue, rawUserFactValueInNumber, comparator);
}

function compareStringValues(userFactSpecValue: string, rawUserFact: IUserFact, comparator: ComparatorType) {
	return compareValues(userFactSpecValue.toLowerCase(), rawUserFact.userFactValue.toLowerCase(), comparator);
}

function compareTimeIntervalValues(
	userFactSpecValue: number, rawUserFact: IUserFact, comparator: ComparatorType, intervalType: CurrentTimeIntervalType) {
	const rawUserFactValueInMilliseconds = Date.parse(rawUserFact.userFactValue);
	if (!isAValidNumber(rawUserFactValueInMilliseconds, rawUserFact.userFactValue, rawUserFact.userFactName)) {
		return false;
	}

	// Diff from now and users input date
	// IntervalTo - Internval to current date from fact date (fact date is expected to be before current date)
	// IntervalFrom - Interval from current date to fact date (fact date is expected to be after current date)
	const currentTimeInMilliseconds = Date.now();
	const currentDateDiff = intervalType === CurrentTimeIntervalType.IntervalTo ?
		(currentTimeInMilliseconds - rawUserFactValueInMilliseconds) : (rawUserFactValueInMilliseconds - currentTimeInMilliseconds);
	if (currentDateDiff < 0) {
		FloodgateEngine.getTelemetryLogger().log_Event(
			TelemetryEvent.Floodgate.UserFactsSpecIsAMatch.Mismatch, {
				ErrorMessage: "Interval type not acceptable",
				Type: `${UserFactType.TimeIntervalInSeconds}`,
			},
		);

		return false;
	}

	const dayInMilliseconds = 86400000;
	const userFactSpecValueInMilliseconds = userFactSpecValue * dayInMilliseconds;

	// check if the above diff satisfies the comparison criteria
	return compareValues(userFactSpecValueInMilliseconds, currentDateDiff, comparator);
}

function compareListValues(userFactSpecValue: string, rawUserFact: IUserFact, comparator: ComparatorType) {
	return compareValues(userFactSpecValue, rawUserFact.userFactValue, comparator);
}

function isComparatorTypeSupported(comparator: ComparatorType, supportedComparatorTypes: ComparatorType[]) {
	return supportedComparatorTypes.indexOf(comparator) !== -1;
}

function compareValues<T extends string | boolean | number>(
	userFactSpecValue: T | T[], userFactRawValue: string | boolean | number, comparator: ComparatorType): boolean {
	switch (comparator) {
		case ComparatorType.Equal:
			return userFactRawValue === userFactSpecValue;
		case ComparatorType.NotEqual:
			return userFactRawValue !== userFactSpecValue;
		case ComparatorType.GreaterThan:
			return userFactRawValue > userFactSpecValue;
		case ComparatorType.GreaterThanOrEqual:
			return userFactRawValue >= userFactSpecValue;
		case ComparatorType.LessThan:
			return userFactRawValue < userFactSpecValue;
		case ComparatorType.LessThanOrEqual:
			return userFactRawValue <= userFactSpecValue;
		case ComparatorType.In:
			return isFactInSpecItem(userFactSpecValue as T[], userFactRawValue);
		case ComparatorType.NotIn:
			return !isFactInSpecItem(userFactSpecValue as T[], userFactRawValue);
	}
}

function isFactInSpecItem<T>(userFactSpecValues: T | T[], userFactRawValue: T): boolean {
	if (typeof userFactRawValue === "string") {
		const factValue = userFactRawValue.toLowerCase();
		if (typeof userFactSpecValues === "string") {
			// both the inputs are strings do a plain indexOf
			return (userFactSpecValues as string).toLowerCase().indexOf(factValue) !== -1;
		}

		if (isArray(userFactSpecValues)) {
			const specValues = userFactSpecValues as unknown as string[];
			return specValues.some((specValue) => specValue && specValue.toString().toLowerCase() === factValue);
		}
	}

	if (isArray(userFactSpecValues)) {
		return (userFactSpecValues as T[]).indexOf(userFactRawValue as T) !== -1;
	}

	return false;
}

function isAValidNumber(numberValue: number, value: string, rawUserFactName: string, factType?: UserFactType) {
	if (!isNumber(numberValue)) {
		let errorMessage = `User fact ${rawUserFactName} has invalid value ${value}`;
		if (factType) {
			errorMessage = `Invalid value ${value} was provided for user fact of type ${factType}`;
		}

		FloodgateEngine.getTelemetryLogger().log_Error(
			TelemetryEvent.Floodgate.UserFactsSpecIsAMatch.Failed,
			errorMessage);

		return false;
	}

	return true;
}
