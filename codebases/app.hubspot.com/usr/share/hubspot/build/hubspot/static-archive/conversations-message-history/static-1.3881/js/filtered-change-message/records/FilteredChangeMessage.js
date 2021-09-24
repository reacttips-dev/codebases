'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, fromJS, Map as ImmutableMap } from 'immutable';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid.js';
import { FILTERED_CHANGE } from '../constants/messageTypes';
import { buildAudit } from '../../audit/operators/buildAudit';

var FilteredChangeMessage = /*#__PURE__*/function (_Record) {
  _inherits(FilteredChangeMessage, _Record);

  function FilteredChangeMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, FilteredChangeMessage);

    var map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      auditParams: buildAudit(props.auditParams),
      timestamp: props.timestamp || generateUniqueClientTimestamp('FilteredChangeMessage-timestamp')
    })).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(FilteredChangeMessage).call(this, map));
  }

  return FilteredChangeMessage;
}(Record({
  '@type': FILTERED_CHANGE,
  id: null,
  timestamp: null,
  sender: ImmutableMap(),
  messageDeletedStatus: NOT_DELETED,
  auditParams: buildAudit(),
  filteredChangeInfo: ImmutableMap()
}, 'FilteredChangeMessage'));

export default FilteredChangeMessage;