/*
 * Utils.ts
 *
 * Module for utility functions
 */

/**
 * Add time to a given date
 * Example, timeAdd(new Date(), 'minute', 5)  //returns 5 minutes from now
 * @param date  Date to start with
 * @param interval  One of: hour or h, minute or m, second or s
 * @param units  units of the given interval to add
 * @return date
 */
export function timeAdd(date: Date, interval: string, units: number): Date {
	switch (interval.toLowerCase()) {
		case "h":
		case "hour":
			return new Date(date.getTime() + (units * 3600000));
		case "m":
		case "minute":
			return new Date(date.getTime() + (units * 60000));
		case "s":
		case "second":
			return new Date(date.getTime() + (units * 1000));
		default:
			throw new Error("Invalid interval value of " + interval);
	}
}

/**
 * Check if an input value is a valid date, null or undefined return false.
 * @param input  input value
 * @return boolean
 */
export function isDate(input: any): boolean {
	if (Object.prototype.toString.call(input) === "[object Date]") {
		// it is a date
		if (!(isNaN(input.getTime()))) {
			return true;
		}
	}
	return false;
}

/**
 * Check if an input value is a valid value in the input enum
 * @param value  input value
 * @param input  input enum
 * Returns true if value exists in the enum
 */
export function isEnumValue(value: any, input: any): boolean {
	return (value in input);
}

/**
 * Check if an input value is a number
 * @param value: input value
 */
export function isNumber(value: any): boolean {
	return (value !== null && !isNaN(value) && isFinite(value));
}

/**
 * Check if an input value is null or undefined
 * @param value: input value
 */
export function isNOU(value: any): boolean {
	return (value === null || value === undefined);
}

/**
 * Check if an input value is an object
 * @param value: input value
 */
export function isObject(value: any): boolean {
	return (value !== null && value !== undefined && (typeof value === "object"));
}

/**
 * Check if an input value is an array
 * @param value: input value
 */
export function isArray(value: any): boolean {
	return (value !== null && value !== undefined && (Array.isArray(value)));
}

/**
 * Check if given value is a string
 * @param {any} value value
 */
export function isString(value: any): boolean {
	return (typeof value === "string");
}

/**
 * Check if value is an object
 * @param {any} value value
 */
export function isBoolean(value: any): boolean {
	return typeof (value) === "boolean";
}

/**
 * Returns a lower temporal boundary
 * @return date
 */
export function getDistantPast(): Date {
	// Corresponds to UTC 1601-01-01T00:00:00Z
	return new Date(-11644473600000);
}

/**
 * Get an upper temporal boundary
 * @return date
 */
export function getDistantFuture(): Date {
	// Corresponds to UTC 4001-01-01T00:00:00Z
	return new Date(64092211200000);
}

export const MAX_DATE_MILLISECONDS: number = 8640000000000000;
export const MIN_DATE_MILLISECONDS: number = -8640000000000000;

/**
 * Adds seconds to a date, if overflows returns Date(Number.Max_VALUE)
 *
 * @param date    date to add to
 * @param seconds seconds as number
 * @return Resulting date
 */
export function addSecondsWithoutOverflow(date: Date, seconds: number): Date {
	if (!date) {
		return null;
	}

	if (seconds < 0) {
		return subtractSecondsWithoutOverflow(date, -1 * seconds);
	} else {
		const milliseconds: number = date.getTime() + seconds * 1000;

		if (milliseconds < MAX_DATE_MILLISECONDS) {
			return new Date(milliseconds);
		} else {
			return new Date(MAX_DATE_MILLISECONDS);
		}
	}
}

/**
 * Subtracts seconds from a date, if overflows returns Date(Number.MIN_VALUE)
 *
 * @param date   date to subtract from
 * @param seconds seconds as number
 * @return Resulting date
 */
export function subtractSecondsWithoutOverflow(date: Date, seconds: number): Date {
	if (!date) {
		return null;
	}

	if (seconds < 0) {
		seconds = -seconds;
		return this.addSecondsWithoutOverflow(date, seconds);
	}

	const milliseconds: number = date.getTime() - (seconds * 1000);

	if (milliseconds > MIN_DATE_MILLISECONDS) {
		return new Date(milliseconds);
	} else {
		return new Date(MIN_DATE_MILLISECONDS);
	}
}

// region Language related

/**
 * Effectively un-anchored on the right side because tags can have many more trailing sub-parts than we care to extract
 * Refer to https://www.ietf.org/rfc/rfc5646.txt
 */
const LANGUAGE_AND_SCRIPT_TAG_PATTERN: string =
	"^" +
	// capture 1:language subtag
	"(" +
	"(?:[a-zA-Z]{2,3}(?:-[a-zA-Z]{3}){0,3})" +  // 2-3 Alpha chars, followed by up to three optional extension tags, each of format -AAA, A=Alpha char
	"|" +
	"(?:[a-zA-Z]{4,8})" +                       // 4-Alpha chars (reserved in standard) or 5-8 Alpha chars
	")" +
	"(?:" +
	"-" +
	// capture 2: optional script subtag (without leading dash), exactly 4 alpha chars
	"([a-zA-Z]{4})" +                           // 4-Alpha chars
	")?" +
	// capture 3: optional region subtag (without leading dash), exactly 2 alpha chars or 3 digits
	"(?:-([a-zA-Z]{2}|[0-9]{3}))?" +
	"(" +
	// capture 4: any left-overs, rejecting remainder strings that don't end here or lead with a dash.
	"-.*" +
	")?" +
	"$";

export function isValidLanguageSubTag(subTag: string): boolean {
	if (!subTag) {
		return false;
	}

	const extractedSubTag: string = extractLanguageSubtag(subTag);
	if (!extractedSubTag) {
		return false;
	}

	return extractedSubTag === subTag;
}

export function extractLanguageSubtag(language: string): string {
	if (!language) {
		return null;
	}

	const matches = language.match(LANGUAGE_AND_SCRIPT_TAG_PATTERN);
	if (!matches || matches.length < 1 || !isNOU(matches[4])) {
		return null;
	}

	// return the first capture group which should be the original input if there is a match
	// For example, "en-US" input should return "en-US", and "en" input should return "en".
	return matches[0];
}

// endregion

/**
 * Create guid string
 */
export function guid(): string {
	// Stitch in '4' in the third group
	return (randomHex4() + randomHex4() + "-" + randomHex4() + "-4" + randomHex4().substr(0, 3) + "-" + randomHex4() + "-"
		+ randomHex4() + randomHex4() + randomHex4()).toLowerCase();
}

/**
 * Create random Hex4 string
 */
function randomHex4(): string {
	return (Math.floor(((1 + Math.random()) * 0x10000))).toString(16).substring(1);
}

/**
 * Create an array from input object values sorted by object key
 * @param Object input object
 * @return array
 */
export function makeArrayFromObjectValuesSortedByKeyString(object: object): any[] {
	const keys: string[] = Object.keys(object);
	keys.sort();

	const values: any[] = [];
	for (const id in keys) {
		if (keys.hasOwnProperty(id)) {
			const key: string = keys[id];
			values.push(object[key]);
		}
	}

	return values;
}

/**
 * Create a date object from an input string
 * @param Object input string
 * @return date
 */
export function stringToDate(input: any): Date {
	if (!isString(input)) {
		return null;
	}

	const newDate: Date = input ? new Date(input) : null;
	return isDate(newDate) ? newDate : null;
}

/**
 * Takes two objects (source, target) and returns the target object with values in the source added to it.
 * It overwrites any source properties which already exist in target.
 */
export function overrideValues<T>(sourceObject: T, targetobject: T): T {
	if (!targetobject) {
		return targetobject;
	}

	const result: T = targetobject;

	if (sourceObject) {
		for (const field in sourceObject) {
			if (sourceObject.hasOwnProperty(field)) {
				(result as any)[field] = (sourceObject as any)[field];
			}
		}
	}

	return result;
}

/**
 * Test a string is in our supported ISO8601 UTC format of "yyyy-MM-ddTHH:mm:ssZ" and "yyyy-MM-ddTHH:mm:ss.fffZ"
 * @param input Input string to be evaluated.
 */
export function isUtcDatetimeString(input: any): boolean {
	if (!isString(input)) {
		return false;
	}

	const supportedUtcRegex = /^(\d{4}\-\d\d\-\d\dT\d\d:\d\d:\d\d(\.\d\d\d)?Z)$/;
	return supportedUtcRegex.test(input);
}

/**
 * Convert a date object to a string in ISO8601 UTC format supported by Floodgate ("yyyy-MM-ddTHH:mm:ssZ")
 * @param input Input date object
 */
export function dateToShortUtcString(input: Date): string {
	if (!isDate(input)) {
		return null;
	}

	function pad(n: number): string {
		return (n < 10) ? ("0" + n) : n.toString();
	}

	return input.getUTCFullYear() +
		"-" + pad(input.getUTCMonth() + 1) +
		"-" + pad(input.getUTCDate()) +
		"T" + pad(input.getUTCHours()) +
		":" + pad(input.getUTCMinutes()) +
		":" + pad(input.getUTCSeconds()) +
		"Z";
}

/*
Implementing the Fisher-Yates Shuffle
(Shuffles in situ)
*/
export function fyShuffle(arrIn: number[]): number[] | undefined {

	if (isNOU(arrIn)) {
		return undefined;
	}

	// If the array is empty or has one element, do nothing.
	if (arrIn.length === 0 || arrIn.length === 1) {
		return arrIn;
	}

	let lastNonShuffledElement = arrIn.length - 1;

	// While there is still a non shuffled element.
	while (lastNonShuffledElement > 0) {

		// Pick one of the non shuffled elements (num range [0,lastNonShuffledElement+1))
		const pickIndex = Math.floor(Math.random() * (lastNonShuffledElement + 1));

		// And swap it with the last non shuffled element
		const temp = arrIn[lastNonShuffledElement];
		arrIn[lastNonShuffledElement] = arrIn[pickIndex];
		arrIn[pickIndex] = temp;

		lastNonShuffledElement--;
	}

	return arrIn;
}
