'use es6';

import I18n from 'I18n';
import { MONTHS, YEARS } from 'products-ui-components/constants/TermLengthUnits';

var createTermProps = function createTermProps(term, termLengthUnit) {
  return {
    term: term,
    termLengthUnit: termLengthUnit
  };
};

export var getMonthsPerTerm = function getMonthsPerTerm(termISOString) {
  if (!termISOString) {
    return null;
  }

  var termDuration = I18n.moment.duration(termISOString.toUpperCase());
  return termDuration.asMonths();
};
export var getTermPropsFromISO = function getTermPropsFromISO(termISOString) {
  // a null term most likely means it was never set, or was deleted
  if (!termISOString) {
    return createTermProps(null, null);
  }

  var monthsPerTerm = getMonthsPerTerm(termISOString);
  var yearsPerTerm = monthsPerTerm / 12; // if term string exists but doesn't last a month or more
  // then the user probably inputted 0, so we should preserve
  // their input

  if (monthsPerTerm < 1) {
    return createTermProps(0, null);
  }

  var showTermInYears = yearsPerTerm % 1 === 0;

  if (showTermInYears) {
    return createTermProps(yearsPerTerm, YEARS);
  }

  return createTermProps(monthsPerTerm, MONTHS);
};
export var getTermHasLength = function getTermHasLength(termISOString) {
  if (!termISOString) {
    return false;
  }

  var monthsPerTerm = getMonthsPerTerm(termISOString);
  var termHasLength = monthsPerTerm >= 1;
  return termHasLength;
};