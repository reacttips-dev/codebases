export const guardType = <T>(val: T, type: string): T | undefined => (typeof val === type ? val : undefined);

/**
 * isObject lets us validate a value of type "unknown" is an object
 * without the need for us to cast it to "any".
 * TODO: Record<PropertyKey, any> to be Record<PropertyKey, unknown> after TS upgrade
 */
export const isObject = <T>(val: T): val is Record<PropertyKey, any> & T =>
    typeof val === "object" && !Array.isArray(val) && !!val;

/**
 * isObject() was added to be used with array filter to tell TS
 * to exclude any undefined values from its typing
 * e.g.
 * [1,2,3,undefined].filter((i) => i !== undefined) - is still considered (number | undefined)[]
 * [1,2,3,undefined].filter(isDefined) - is now considered number[]
 */
export const isDefined = <T>(val?: T | null): val is T => val !== undefined && val !== null;
