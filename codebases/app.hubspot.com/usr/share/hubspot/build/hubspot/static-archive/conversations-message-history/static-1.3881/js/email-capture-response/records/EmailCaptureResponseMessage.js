'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import Status from '../../common-message-format/records/Status';
import { buildStatus } from '../../common-message-format/operators/buildStatus';
import { EMAIL_CAPTURE_RESPONSE } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid.js';

var EmailCaptureResponseMessage = /*#__PURE__*/function (_Record) {
  _inherits(EmailCaptureResponseMessage, _Record);

  function EmailCaptureResponseMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EmailCaptureResponseMessage);

    var map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      status: buildStatus(props.status),
      timestamp: props.timestamp || generateUniqueClientTimestamp('EmailCaptureResponseMessage-timestamp')
    })).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(EmailCaptureResponseMessage).call(this, map));
  }

  return EmailCaptureResponseMessage;
}(Record({
  '@type': EMAIL_CAPTURE_RESPONSE,
  id: null,
  text: '',
  timestamp: null,
  sender: ImmutableMap(),
  status: Status(),
  messageDeletedStatus: NOT_DELETED
}, 'EmailCaptureResponseMessage'));

export default EmailCaptureResponseMessage;