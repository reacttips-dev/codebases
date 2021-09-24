'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _defaults;

import { Record, List, fromJS as _fromJS } from 'immutable';
import { QUOTE_ASSOCIATIONS } from './constants/properties';
var defaults = (_defaults = {}, _defineProperty(_defaults, QUOTE_ASSOCIATIONS.QUOTE_TO_DEAL, List()), _defineProperty(_defaults, QUOTE_ASSOCIATIONS.QUOTE_TO_LINE_ITEM, List()), _defineProperty(_defaults, QUOTE_ASSOCIATIONS.QUOTE_TO_CONTACT, List()), _defineProperty(_defaults, QUOTE_ASSOCIATIONS.QUOTE_TO_COMPANY, List()), _defineProperty(_defaults, QUOTE_ASSOCIATIONS.QUOTE_TO_QUOTE_TEMPLATE, List()), _defaults);

var QuoteAssociations = /*#__PURE__*/function (_Record) {
  _inherits(QuoteAssociations, _Record);

  function QuoteAssociations() {
    _classCallCheck(this, QuoteAssociations);

    return _possibleConstructorReturn(this, _getPrototypeOf(QuoteAssociations).apply(this, arguments));
  }

  _createClass(QuoteAssociations, null, [{
    key: "fromJS",
    value: function fromJS(json) {
      return new QuoteAssociations(_fromJS(json));
    }
  }]);

  return QuoteAssociations;
}(Record(defaults));

export { QuoteAssociations as default };