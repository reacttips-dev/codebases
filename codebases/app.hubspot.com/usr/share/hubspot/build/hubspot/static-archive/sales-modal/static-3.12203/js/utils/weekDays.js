/*
 * Modified from moment-business on Jun 23, 2020.
 * https://github.com/jamesplease/moment-business
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 James Smith
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use es6';

import { DAY } from 'sales-modal/constants/Milliseconds'; // DOW = day of week

var DOW_SUNDAY = 0;
var DOW_SATURDAY = 6;
var ISO_DOW_MONDAY = 1;
var ISO_DOW_FRIDAY = 5;

function isWeekDay(dayOfWeek) {
  return dayOfWeek !== DOW_SATURDAY && dayOfWeek !== DOW_SUNDAY;
}

export function addWeekDays(moment, numWeekDays) {
  var absNumWeekDays = Math.abs(numWeekDays);

  if (absNumWeekDays === 0) {
    return moment;
  }

  var dayOfWeek = moment.day();
  var sign = numWeekDays > 0 ? 1 : -1; // Calculate number of weekends

  var startDayAdjustment = 0;

  if (isWeekDay(dayOfWeek)) {
    startDayAdjustment = sign === 1 ? dayOfWeek : 6 - dayOfWeek;
  }

  var numWeekends = Math.ceil((startDayAdjustment + absNumWeekDays) / 5) - 1;
  var adjustment = 0; // If the current day is Saturday, then it's not an entire weekend.
  // Add an offset so that:
  //     Saturday + 1 cal. day + adjustment = Monday

  var needSaturdayAdjustment = sign === 1 && dayOfWeek === DOW_SATURDAY; // If the current day is Sunday, then it's not an entire weekend.
  // Add an offset so that:
  //     Sunday - 1 cal. day - adjustment = Friday

  var needSundayAdjustment = sign === -1 && dayOfWeek === DOW_SUNDAY;

  if (needSaturdayAdjustment || needSundayAdjustment) {
    adjustment = 1;
  }

  var calendarDays = absNumWeekDays + numWeekends * 2 + adjustment;
  return moment.clone().add(calendarDays * sign, 'days');
}
export function subtractWeekDays(moment, numWeekDays) {
  return addWeekDays(moment, -numWeekDays);
}
export function addDelayAsBusinessDays(moment, msDelay) {
  return addWeekDays(moment, msDelay / DAY);
}
export function diffWeekDays(startMoment, endMoment) {
  if (endMoment.isBefore(startMoment)) {
    return -1 * diffWeekDays(endMoment, startMoment);
  } // If start or end is a weekend, we bump it to a weekday


  if (!isWeekDay(startMoment.day())) {
    var fridayBeforeStartMoment = startMoment.clone().isoWeekday(ISO_DOW_FRIDAY);
    return diffWeekDays(fridayBeforeStartMoment, endMoment);
  }

  if (!isWeekDay(endMoment.day())) {
    var mondayAfterEndMoment = endMoment.clone().isoWeekday(ISO_DOW_MONDAY + 7);
    return diffWeekDays(startMoment, mondayAfterEndMoment);
  }

  var totalDays = Math.abs(endMoment.diff(startMoment, 'days')); // Calculate number of weekends

  var dayOfWeek = startMoment.day();
  var startDayAdjustment = isWeekDay(dayOfWeek) ? dayOfWeek : 0;
  var numWeekends = Math.ceil((startDayAdjustment + totalDays) / 7) - 1;
  return totalDays - numWeekends * 2;
}