'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { ENABLED, DISABLED } from './ConnectedAccountFeatureStates';
var EmailIntegrationRecord = Record({
  type: null,
  state: DISABLED
}, 'EmailIntegrationRecord');

var EmailIntegration = /*#__PURE__*/function (_EmailIntegrationReco) {
  _inherits(EmailIntegration, _EmailIntegrationReco);

  function EmailIntegration() {
    _classCallCheck(this, EmailIntegration);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmailIntegration).apply(this, arguments));
  }

  _createClass(EmailIntegration, [{
    key: "exists",
    value: function exists() {
      return !!this.type;
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.state === ENABLED;
    }
  }], [{
    key: "fromJS",
    value: function fromJS(json) {
      if (!json || typeof json !== 'object') {
        return null;
      }

      return new EmailIntegration(json);
    }
  }]);

  return EmailIntegration;
}(EmailIntegrationRecord);

export { EmailIntegration as default };