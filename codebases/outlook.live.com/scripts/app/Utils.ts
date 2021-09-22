/*
 * Utils.ts
 *
 * Module for utility functions
 */

import { Utils } from "@ms-ofb/officefloodgatecore";
const { guid, overrideValues, isNOU, isBoolean, isString, isObject } = Utils;
export { guid, overrideValues, isNOU, isBoolean }

/**
 * Check if given value is a number
 * @param {any} value value
 */
function isNumber(value: any): boolean {
	return (typeof value === "number");
}

/**
 * Check if given value is an integer
 * @param {any} value value
 */
export function isInteger(value: any): boolean {
	return typeof value === "number" &&
		isFinite(value) &&
		Math.floor(value) === value;
}

/**
 * Check if value is a valid guid
 * @param {any} value value
 */
function isGuid(value: any): boolean {
	return (isString(value) &&
		/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value));
}

/**
 * Throw if not object
 */
export function expectObject(value: any, name: string): void {
	if (!isObject(value)) {
		throw name + " is not an object: " + value;
	}
}

/**
 * Throw if not number
 */
export function expectNumber(value: any, name: string): void {
	if (!isNumber(value)) {
		throw name + " is not a number: " + value;
	}
}

/**
 * Throw if not string
 */
export function expectString(value: any, name: string): void {
	if (!isString(value)) {
		throw name + " is not a string: " + value;
	}
}

/**
 * Throw if not boolean
 */
export function expectBoolean(value: any, name: string): void {
	if (!isBoolean(value)) {
		throw name + " is not a boolean: " + value;
	}
}

/**
 * Throw if not guid
 */
export function expectGuid(value: any, name: string): void {
	if (!isGuid(value)) {
		throw name + " is not a guid: " + value;
	}
}

/**
 * Throw if not array
 */
export function expectArray(value: any, name: string): void {
	if (!Array.isArray(value)) {
		throw name + " is not an array: " + value;
	}
}

// Creates a promise that rejects in <ms> milliseconds and
// returns the race between the created timeout promise and the passed in promise
export function createTimeoutPromise<T>(ms: number, promise: Promise<T>): Promise<T> {
	// Create a promise that rejects in <ms> milliseconds
	const timeout = new Promise((resolve, reject) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			reject("Timed out in " + ms + "ms.");
		}, ms);
	});

	// Returns a race between our timeout and the passed in promise
	return Promise.race([promise, timeout]) as Promise<T>;
}
