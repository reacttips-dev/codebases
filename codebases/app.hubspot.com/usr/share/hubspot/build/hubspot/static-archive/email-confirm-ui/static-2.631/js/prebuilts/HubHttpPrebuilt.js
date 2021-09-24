'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import UserData from 'hub-http-shims/UserDataJS/user';
import http from 'hub-http/clients/apiClient';
import BaseEmailConfirmBarLoader from '../lib/BaseEmailConfirmBarLoader';
import { getEmailVerificationEndpoint } from '../constants/EmailVerificationEndpoints';
import defer from 'hs-promise-utils/defer';

var HapiJSPrebuilt = /*#__PURE__*/function (_BaseEmailConfirmBarL) {
  _inherits(HapiJSPrebuilt, _BaseEmailConfirmBarL);

  function HapiJSPrebuilt() {
    _classCallCheck(this, HapiJSPrebuilt);

    return _possibleConstructorReturn(this, _getPrototypeOf(HapiJSPrebuilt).apply(this, arguments));
  }

  _createClass(HapiJSPrebuilt, [{
    key: "getRequiredData",
    value: function getRequiredData() {
      var deferred = defer();
      UserData.then(function (user) {
        deferred.resolve({
          email: user.get('email'),
          isVerified: !!(user.get('verified') || user.get('verifiedAt')),
          userId: user.id // not immutable

        });
      });
      return deferred.promise;
    }
  }, {
    key: "handleResend",
    value: function handleResend(id) {
      return http.post(getEmailVerificationEndpoint(id));
    }
  }]);

  return HapiJSPrebuilt;
}(BaseEmailConfirmBarLoader);

export default HapiJSPrebuilt;