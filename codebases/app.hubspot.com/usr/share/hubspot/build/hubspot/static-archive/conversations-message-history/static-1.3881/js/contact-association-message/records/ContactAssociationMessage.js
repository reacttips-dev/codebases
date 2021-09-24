'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import { CONTACT_ASSOCIATION } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';

var ContactAssociationMessage = /*#__PURE__*/function (_Record) {
  _inherits(ContactAssociationMessage, _Record);

  function ContactAssociationMessage() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ContactAssociationMessage);

    var map = fromJS(Object.assign({}, props)).filterNot(function (value) {
      return typeof value === 'undefined';
    });
    return _possibleConstructorReturn(this, _getPrototypeOf(ContactAssociationMessage).call(this, map));
  }

  return ContactAssociationMessage;
}(Record({
  '@type': CONTACT_ASSOCIATION,
  id: null,
  timestamp: null,
  sender: ImmutableMap(),
  messageDeletedStatus: NOT_DELETED,
  clientType: null,
  newVid: null,
  newMessagesUtk: {
    empty: true,
    present: false
  },
  threadId: null
}, 'ContactAssociationMessage'));

export default ContactAssociationMessage;