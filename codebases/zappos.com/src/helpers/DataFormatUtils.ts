/* eslint-disable no-redeclare */
/* This lint rule doesn't play well with TS overloads :( */
import { DASH_UNDERSCORE_WITH_FOLLOWING_LETTER_RE_GEN } from 'common/regex';
import { numberToUsd, usdToNumber } from 'helpers/NumberFormats';
import { CamelCasedProps } from 'types/utility';

/*
  Formats objects with snake_case keys to camelCase keys. Does not impact the values.
  This is recursive and will transform the entire object.
  This is meant for simple objects coming from JSON responses. (nothing crazy like Date()'s).
*/
export function dashOrSnakeCaseToCamelCaseDeep<T extends Record<string, any>>(snakeCaseData: T): CamelCasedProps<T>;
export function dashOrSnakeCaseToCamelCaseDeep<T extends Record<string, any>[]>(snakeCaseData: T): CamelCasedProps<T>;
export function dashOrSnakeCaseToCamelCaseDeep(snakeCaseData: any): any {

  if (Array.isArray(snakeCaseData)) {
    return snakeCaseData.map(val => {
      // If object or array recursively check for more non-camelCase keys
      if (typeof val === 'object' && val !== null) {
        return dashOrSnakeCaseToCamelCaseDeep(val);
      }
      return val;
    });

  } else if (typeof snakeCaseData === 'object' && snakeCaseData !== null) {
    const camelCaseObject: Record<string, any> = {};
    Object.keys(snakeCaseData).forEach(key => {

      let newKey = '';
      if (key.length <= 1) {
        // If the key isn't more than 1 character, leave as is.
        newKey = key;
      } else if (key) {
        // Replace letters preceeded by '-' or '_' with their uppercase form. Handles multiple underscores & dashes if present.
        newKey = key.replace(DASH_UNDERSCORE_WITH_FOLLOWING_LETTER_RE_GEN(), (_, x) => x.toUpperCase());
      }

      camelCaseObject[newKey] = dashOrSnakeCaseToCamelCaseDeep(snakeCaseData[key]);
    });

    return camelCaseObject;
  }

  return snakeCaseData;
}

/**
    Attempts to parse a string into a data structure.
    This is not currently built for anything else that JSON.parse can parse,
    but it should act accordingly (for example, taking string "true" or "false" values)

    @param {string} string The string that we'll attempt to JSON.parse
    @param {*} [returnValue=null] An optional default return when the method triggers a catch
*/
export const tryParse = (string: string, returnValue: any = null) => {
  try {
    return JSON.parse(string);
  } catch (e) {
    return returnValue; // returns an optional argument, or defaults to null
  }
};

/**
 * Converts a string with spaces to camelCase
*/
export const stringToCamelCase = (value: string) => value.split(' ').map((v, i) => {
  const caseMethod = i === 0 ? 'toLowerCase' : 'toUpperCase';
  return v.charAt(0)[caseMethod]() + v.slice(1);
}).join('');

/**
 * @return {boolean}
*/
export const toBool = (v: string) => (typeof v === 'string' ? v === 'true' : v);

export interface CurrencyObj {
  int: string | undefined;
  string: string | undefined;
}

/**
 * This method returns a currency object
 * @param {string}
 * @param {boolean}
 * @returns {object}
 * Examples:
 * input: 10.00 || '10.00' || '$10.00'
 * output: { int: 10.00, string: '$10.00' }
 */
export const createCurrencyObj = (v: string | number) => {
  const obj: CurrencyObj = { int: undefined, string: undefined };

  if (v) {
    obj.int = usdToNumber(v);
    obj.string = numberToUsd(v);
    if (!obj.string?.includes('$')) {
      obj.string = numberToUsd(+(obj.string as string));
    }
  }

  return obj;
};
