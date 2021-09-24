'use es6';

import { RENAMING_ERRORS, INVALID_SYMBOLS } from '../constants/campaignName';
import { HTTP_STATUS_CODES } from '../constants/httpStatusCode';
var INVALID_NAME_RE = new RegExp("[" + INVALID_SYMBOLS.join('') + "]");
export var EXISTING_NAME_MESSAGE = 'Campaign with this name already exists';
export var EXISTING_UTM_MESSAGE = 'Campaign with this utm already exists';
export var getCampaignRenamingErrorType = function getCampaignRenamingErrorType(error) {
  switch (error.status) {
    case HTTP_STATUS_CODES.CONFLICT:
      switch (error.responseJSON.message) {
        case EXISTING_NAME_MESSAGE:
          return RENAMING_ERRORS.EXISTING_NAME;

        case EXISTING_UTM_MESSAGE:
          return RENAMING_ERRORS.EXISTING_UTM;

        default:
          return RENAMING_ERRORS.GENERIC;
      }

    default:
      return RENAMING_ERRORS.GENERIC;
  }
};
export var getIsCampaignNameValid = function getIsCampaignNameValid(name) {
  return !INVALID_NAME_RE.test(name || '');
};