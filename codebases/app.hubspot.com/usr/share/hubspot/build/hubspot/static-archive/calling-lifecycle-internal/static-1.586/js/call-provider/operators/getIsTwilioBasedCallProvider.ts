import get from 'transmute/get';
import { HUBSPOT, TWILIO } from '../constants/ProviderNames';
export var TWILIO_BASED_PROVIDERS = [TWILIO, HUBSPOT];
export function getIsTwilioBasedCallProvider(widgetInfo) {
  if (!widgetInfo) {
    return false;
  }

  var widgetName = get('name', widgetInfo);
  return TWILIO_BASED_PROVIDERS.includes(widgetName);
}
export function getIsProviderHubSpot(widgetInfo) {
  var widgetName = get('name', widgetInfo);
  return widgetName === HUBSPOT;
}