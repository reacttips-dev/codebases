'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, OrderedMap, Map as ImmutableMap } from 'immutable';
import { buildOrderedMessageMap } from '../operators/buildOrderedMessageMap';

var ThreadHistoryMessages = /*#__PURE__*/function (_Record) {
  _inherits(ThreadHistoryMessages, _Record);

  function ThreadHistoryMessages() {
    var properties = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ThreadHistoryMessages);

    var results = properties.results,
        remainingProperties = _objectWithoutProperties(properties, ["results"]);

    return _possibleConstructorReturn(this, _getPrototypeOf(ThreadHistoryMessages).call(this, Object.assign({}, remainingProperties, {
      results: buildOrderedMessageMap(results)
    })));
  }

  return ThreadHistoryMessages;
}(Record({
  results: OrderedMap(),
  hasMore: false,
  offset: ImmutableMap()
}, 'ThreadHistoryMessages'));

export { ThreadHistoryMessages as default };