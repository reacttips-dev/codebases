import { OrderedMap } from 'immutable';
import get from 'transmute/get';
import RegisteredFromNumber from '../../records/registered-from-number/RegisteredFromNumber';
export function buildPhoneNumbers(phoneNumbers) {
  if (!phoneNumbers) {
    return OrderedMap();
  }

  return phoneNumbers.reduce(function (orderedMap, number) {
    return orderedMap.set(get('friendlyName', number), new RegisteredFromNumber(number));
  }, OrderedMap());
}