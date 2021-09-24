'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _GMAIL$OUTLOOK;

import { GMAIL, OUTLOOK365 } from './EmailClientTypes';
import { GOOGLE_FREE, GOOGLE_APPS, OUTLOOK365 as OUTLOOK_365 } from './EmailProviderTypes';
export default (_GMAIL$OUTLOOK = {}, _defineProperty(_GMAIL$OUTLOOK, GMAIL, {
  key: 'gmail',
  serviceType: 'google',
  providerTypes: [GOOGLE_FREE, GOOGLE_APPS]
}), _defineProperty(_GMAIL$OUTLOOK, OUTLOOK365, {
  key: 'outlook365',
  serviceType: 'office365',
  providerTypes: [OUTLOOK_365]
}), _GMAIL$OUTLOOK);