import { userDate, OwaDate, isAfter, isBefore, isEqual, startOfDay } from 'owa-datetime';
import { computed } from 'mobx';
import getStore from './store';

const now = computed(() => userDate(getStore().now));
export const observableNow = () => now.get();

const today = computed(() => userDate(getStore().today));
export const observableToday = () => today.get();

export const isPastTime = (date: OwaDate) => isBefore(date, observableNow());
export const isFutureTime = (date: OwaDate) => isAfter(date, observableNow());

export const isPastDate = (date: OwaDate) => compareWithToday(date, isBefore);
export const isFutureDate = (date: OwaDate) => compareWithToday(date, isAfter);
export const isToday = (date: OwaDate) => compareWithToday(date, isEqual);

const compareWithToday = (date: OwaDate, fn: typeof isAfter) =>
    fn(startOfDay(userDate(date)), observableToday());
