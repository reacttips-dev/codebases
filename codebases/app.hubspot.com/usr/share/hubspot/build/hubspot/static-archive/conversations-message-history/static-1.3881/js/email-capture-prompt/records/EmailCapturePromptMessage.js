'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import Status from '../../common-message-format/records/Status';
import { buildStatus } from '../../common-message-format/operators/buildStatus';
import { EMAIL_CAPTURE_PROMPT } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid.js';

var EmailCapturePromptMessage = /*#__PURE__*/function (_Record) {
  _inherits(EmailCapturePromptMessage, _Record);

  function EmailCapturePromptMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EmailCapturePromptMessage);

    var map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      status: buildStatus(props.status),
      timestamp: props.timestamp || generateUniqueClientTimestamp('EmailCapturePromptMessage-timestamp')
    })).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(EmailCapturePromptMessage).call(this, map));
  }

  return EmailCapturePromptMessage;
}(Record({
  '@type': EMAIL_CAPTURE_PROMPT,
  id: null,
  text: '',
  timestamp: null,
  sender: ImmutableMap(),
  status: Status(),
  messageDeletedStatus: NOT_DELETED
}, 'EmailCapturePromptMessage'));

export default EmailCapturePromptMessage;