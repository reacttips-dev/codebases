'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import Status from '../../common-message-format/records/Status';
import { buildStatus } from '../../common-message-format/operators/buildStatus';
import { OFFICE_HOURS } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid.js';

var OfficeHoursMessage = /*#__PURE__*/function (_Record) {
  _inherits(OfficeHoursMessage, _Record);

  function OfficeHoursMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, OfficeHoursMessage);

    var map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      status: buildStatus(props.status),
      timestamp: props.timestamp || generateUniqueClientTimestamp('OfficeHoursMessage-timestamp')
    })).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(OfficeHoursMessage).call(this, map));
  }

  return OfficeHoursMessage;
}(Record({
  '@type': OFFICE_HOURS,
  id: null,
  text: '',
  officeHoursStartTime: null,
  timestamp: null,
  sender: ImmutableMap(),
  status: Status(),
  messageDeletedStatus: NOT_DELETED
}, 'OfficeHoursMessage'));

export default OfficeHoursMessage;