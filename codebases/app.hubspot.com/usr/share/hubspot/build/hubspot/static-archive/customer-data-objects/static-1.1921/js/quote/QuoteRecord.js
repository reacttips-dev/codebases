'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import QuoteInboundDbRecord from './QuoteInboundDbRecord';
import QuoteAssociatedObjects from './QuoteAssociatedObjects';
import QuoteAssociations from './QuoteAssociations';
import { mergeQuoteProperties } from './model/QuoteModel';
var defaults = {
  quote: QuoteInboundDbRecord(),
  associations: new QuoteAssociations(),
  quoteAssociatedObjects: new QuoteAssociatedObjects()
};

var QuoteRecord = /*#__PURE__*/function (_Record) {
  _inherits(QuoteRecord, _Record);

  function QuoteRecord() {
    _classCallCheck(this, QuoteRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(QuoteRecord).apply(this, arguments));
  }

  _createClass(QuoteRecord, null, [{
    key: "fromJS",
    value: function fromJS(json) {
      return new QuoteRecord({
        quote: QuoteInboundDbRecord.fromJS(json.quote),
        associations: QuoteAssociations.fromJS(json.associations),
        quoteAssociatedObjects: QuoteAssociatedObjects.fromJS(json.quoteAssociatedObjects)
      });
    }
  }, {
    key: "hydrateQuote",
    value: function hydrateQuote(quote, CRMContacts, CRMCompany, lineItems) {
      return mergeQuoteProperties(quote, {
        recipientContacts: CRMContacts,
        recipientCompany: CRMCompany || null,
        lineItems: lineItems
      });
    }
  }]);

  return QuoteRecord;
}(Record(defaults));

export { QuoteRecord as default };