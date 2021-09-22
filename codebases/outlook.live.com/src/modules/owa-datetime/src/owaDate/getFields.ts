import type { OwaDate } from '../schema';
import asDate from '../adapters/asDate';

// Functional replacements for the instance member functions;
// These will allow OwaDate to become a plain JS object, so it can be serialized.
export const getDate = (date: OwaDate) => asDate(date).getDate();
export const getDay = (date: OwaDate) => asDate(date).getDay();
export const getHours = (date: OwaDate) => asDate(date).getHours();
export const getMilliseconds = (date: OwaDate) => asDate(date).getMilliseconds();
export const getMinutes = (date: OwaDate) => asDate(date).getMinutes();
export const getMonth = (date: OwaDate) => asDate(date).getMonth();
export const getSeconds = (date: OwaDate) => asDate(date).getSeconds();
export const getYear = (date: OwaDate) => asDate(date).getFullYear();
export const getTimestamp = (date: OwaDate) => asDate(date).getTime();
export const getTimezoneOffset = (date: OwaDate) => asDate(date).getTimezoneOffset();

// These functions return strings with the UTC value of the given date, similar to JavaScript's Date.
export const getUTCString = (date: OwaDate) => new Date(getTimestamp(date)).toUTCString();
export const getISOString = (date: OwaDate) => new Date(getTimestamp(date)).toISOString();
export const getJSON = (date: OwaDate) => new Date(getTimestamp(date)).toJSON();

// These functions return strings with the time-zone specific value of the given date, with the ISO format.
export const getDateString = (date: OwaDate) => asDate(date).toDateString();
export const getISOStringWithOffset = (date: OwaDate) => asDate(date).toString();
export const getISODateString = (date: OwaDate) => asDate(date).toDateString();
export const getISOTimeString = (date: OwaDate) => asDate(date).toTimeString();

export const toLocaleDateString = (date: OwaDate) => asDate(date).toLocaleDateString();
export const toLocaleTimeString = (date: OwaDate) => asDate(date).toLocaleTimeString();
export const toLocaleString = (date: OwaDate) => asDate(date).toLocaleString();
