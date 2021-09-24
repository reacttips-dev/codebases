'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, List } from 'immutable';
import LineItemRecord from 'customer-data-objects/lineItem/LineItemRecord';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import QuoteFee from './QuoteFeeRecord';
import QuoteSignerRecord from './QuoteSignerRecord';
import { DEFAULT_QUOTE_ASSOCIATED_OBJECTS } from './constants/properties';

var QuoteAssociatedObjects = /*#__PURE__*/function (_Record) {
  _inherits(QuoteAssociatedObjects, _Record);

  function QuoteAssociatedObjects() {
    _classCallCheck(this, QuoteAssociatedObjects);

    return _possibleConstructorReturn(this, _getPrototypeOf(QuoteAssociatedObjects).apply(this, arguments));
  }

  _createClass(QuoteAssociatedObjects, null, [{
    key: "fromJS",
    value: function fromJS(json) {
      if (json.lineItems) {
        json.lineItems = List(json.lineItems).map(LineItemRecord.fromJS);
      }

      if (json.recipientCompany) {
        json.recipientCompany = CompanyRecord.fromJS(json.recipientCompany).set('companyId', json.recipientCompany.objectId);
      }

      if (json.recipientContacts) {
        json.recipientContacts = List(json.recipientContacts.map(function (contact) {
          return ContactRecord.fromJS(contact).set('vid', contact.objectId);
        }));
      }

      if (json.additionalFees) {
        json.additionalFees = List(json.additionalFees.map(function (fee) {
          return new QuoteFee(fee);
        }));
      }

      if (json.quoteSigners) {
        json.quoteSigners = List(json.quoteSigners.map(function (quoteSigner) {
          return new QuoteSignerRecord(quoteSigner);
        }));
      }

      if (json.contactSigners) {
        json.contactSigners = List(json.contactSigners.map(function (contactSigner) {
          return new QuoteSignerRecord(contactSigner);
        }));
      }

      if (json.userSigners) {
        json.userSigners = List(json.userSigners.map(function (userSigner) {
          return new QuoteSignerRecord(userSigner);
        }));
      }

      return new QuoteAssociatedObjects(json);
    }
  }]);

  return QuoteAssociatedObjects;
}(Record(DEFAULT_QUOTE_ASSOCIATED_OBJECTS));

export { QuoteAssociatedObjects as default };