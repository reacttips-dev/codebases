'use es6';

import getIn from 'transmute/getIn';
import isEmpty from 'transmute/isEmpty';
import { ERROR_MESSAGE_TOKENS } from '../constants/sendFailureKeyPaths';
import ErrorMessageTokens from '../records/ErrorMessageTokens';
import SendFailure from '../records/SendFailure';
import Status from '../records/Status';

var buildSendFailure = function buildSendFailure(sendFailure) {
  if (!sendFailure) {
    return null;
  }

  var errorTokens = getIn(ERROR_MESSAGE_TOKENS, sendFailure);
  return isEmpty(errorTokens) ? SendFailure(sendFailure) : SendFailure(sendFailure).setIn(ERROR_MESSAGE_TOKENS, ErrorMessageTokens(errorTokens));
};

export var buildStatus = function buildStatus(status) {
  var sendFailure = getIn(['sendFailure'], status);
  var statusSendFailure = buildSendFailure(sendFailure);
  return Status(status).setIn(['sendFailure'], statusSendFailure);
};