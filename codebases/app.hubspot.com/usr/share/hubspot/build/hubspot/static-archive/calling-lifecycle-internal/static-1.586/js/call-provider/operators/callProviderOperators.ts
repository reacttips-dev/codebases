import { TWILIO, HUBSPOT } from '../constants/ProviderNames';
import { TWILIO_WIDGET_OPTIONS } from 'calling-lifecycle-internal/constants/twilioWidgetOptions';
import CallingProvider from '../records/CallingProvider';
var width = TWILIO_WIDGET_OPTIONS.width,
    height = TWILIO_WIDGET_OPTIONS.height;
export var getTwilioCallingProvider = function getTwilioCallingProvider() {
  return new CallingProvider({
    name: TWILIO,
    width: width,
    height: height,
    supportsCustomObjects: true
  });
};
export var getHubSpotCallingProvider = function getHubSpotCallingProvider() {
  return new CallingProvider({
    name: HUBSPOT,
    width: width,
    height: height,
    supportsCustomObjects: true
  });
};