'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';

var QuoteFeeRecord = /*#__PURE__*/function (_Record) {
  _inherits(QuoteFeeRecord, _Record);

  function QuoteFeeRecord() {
    _classCallCheck(this, QuoteFeeRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(QuoteFeeRecord).apply(this, arguments));
  }

  _createClass(QuoteFeeRecord, [{
    key: "getSign",
    value: function getSign() {
      // this doesn't belong here
      return this.category && this.category === 'DISCOUNT' ? -1 : 1;
    }
  }]);

  return QuoteFeeRecord;
}(Record({
  name: '',
  amount: 0,
  category: 'FEE',
  // one of ['TAX', 'FEE', 'DISCOUNT']
  isPercentage: false
}, 'QuoteFeeRecord'));

export { QuoteFeeRecord as default };