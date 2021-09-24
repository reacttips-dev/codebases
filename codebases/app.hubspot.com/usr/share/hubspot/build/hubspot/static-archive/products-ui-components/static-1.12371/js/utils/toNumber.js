'use es6';

import I18n from 'I18n';
export default function (value) {
  // prevents null conversion to 0 for inital price calculations
  if (value === null) return null;
  var number = Number(value);
  return isNaN(number) ? null : number;
} // ported from https://git.hubteam.com/HubSpot/CRM/blob/master/crm_ui/static/js/utils/FormatNumber.js

export function parseNumber(number) {
  if (typeof number === 'number') {
    return number;
  }

  var parsed = Number(number);

  if (!isNaN(parsed)) {
    return parsed;
  }

  return I18n.parseNumber(number);
}