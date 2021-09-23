import I18n from 'I18n';
import { PhoneNumberSources } from 'calling-lifecycle-internal/constants/PhoneNumberSources';
export function getFromNumberDescription(fromNumber) {
  switch (fromNumber) {
    case PhoneNumberSources.HUBSPOT_NUMBER:
      return I18n.text('fromNumbers.hubSpotProvidedDescription');

    default:
      return I18n.text('fromNumbers.externalDescription');
  }
}