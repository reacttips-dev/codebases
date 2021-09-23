'use es6';

import get from 'transmute/get';
import { TWILIO } from '../constants/ProviderNames';
export function getIsProviderTwilioConnect(provider) {
  if (!provider) {
    return false;
  }

  var widgetName = get('name', provider);
  return widgetName === TWILIO;
}