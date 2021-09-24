import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _fromJS;

import { BIZOPS_INTERACTION, CRM_API_ERROR, CRM_DEBUG, CRM_ONBOARDING, INDEX_INTERACTION, INTERNAL_CRM_TRACKING, RECORD_INTERACTION, SETTINGS_INTERACTION } from './constants/eventNames';
import { fromJS } from 'immutable';
import { isCustomObject } from './utils/isCustomObject';
var SCREENS = fromJS((_fromJS = {}, _defineProperty(_fromJS, RECORD_INTERACTION, {
  CONTACT: 'Contact',
  COMPANY: 'Company',
  DEAL: 'Deal',
  QUOTE: 'Quote',
  TICKET: 'Ticket',
  TASK: 'Tasks'
}), _defineProperty(_fromJS, INDEX_INTERACTION, {
  CONTACT: 'Contact index',
  COMPANY: 'Company index',
  DEAL: 'Deal Index',
  TICKET: 'Ticket index',
  TASK: 'Tasks',
  VISIT: 'Visits'
}), _defineProperty(_fromJS, INTERNAL_CRM_TRACKING, {
  CONTACT: 'Contacts',
  COMPANY: 'Companies',
  DEAL: 'Deals',
  TASK: 'Tasks',
  VISIT: 'Visits'
}), _defineProperty(_fromJS, SETTINGS_INTERACTION, {
  CONTACT: 'Contact',
  COMPANY: 'Company',
  DEAL: 'Deal'
}), _defineProperty(_fromJS, CRM_ONBOARDING, {
  CONTACT: 'Contact',
  COMPANY: 'Company',
  DEAL: 'Deal',
  QUOTE: 'Quote',
  TASK: 'Tasks',
  SETTINGS: 'Settings'
}), _defineProperty(_fromJS, CRM_API_ERROR, {
  CONTACT: 'Contact',
  COMPANY: 'Company',
  DEAL: 'Deal',
  TASK: 'Tasks'
}), _defineProperty(_fromJS, CRM_DEBUG, {
  CONTACT: 'Contact',
  COMPANY: 'Company',
  DEAL: 'Deal',
  TASK: 'Tasks'
}), _defineProperty(_fromJS, BIZOPS_INTERACTION, {
  CONTACT: 'Contact',
  COMPANY: 'Company',
  DEAL: 'Deal'
}), _fromJS));
var defaultProps = {
  app: 'CRM'
};

var _isValidConfig = function _isValidConfig(event, objectType) {
  return SCREENS.hasIn([event, objectType]) || isCustomObject(objectType);
};

export function includeScreen(_ref) {
  var event = _ref.event,
      objectType = _ref.objectType,
      eventProps = _ref.eventProps;

  if (!_isValidConfig(event, objectType)) {
    // eslint-disable-next-line no-console
    console.warn('Invalid event or objectType sent to MakeLogEventProps: ', event, objectType);
    return undefined;
  }

  var screen = isCustomObject(objectType) ? 'custom' : SCREENS.getIn([event, objectType]);
  return {
    event: event,
    objectType: objectType,
    eventProps: Object.assign({
      screen: screen
    }, defaultProps, {}, eventProps)
  };
}