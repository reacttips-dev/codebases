'use es6';

import { CALL_FROM_PHONE } from '../constants/CallMethods';
import CallFromPhoneInterface from '../interface/CallFromPhoneInterface';
import CallFromBrowserInterface from '../interface/CallFromBrowserInterface';
export var createInterfaceByType = function createInterfaceByType(selectedCallMethod) {
  switch (selectedCallMethod) {
    case CALL_FROM_PHONE:
      return CallFromPhoneInterface;

    default:
      return CallFromBrowserInterface;
  }
};