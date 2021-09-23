'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var ApiError = /*#__PURE__*/function () {
  function ApiError(httpRequest, exception) {
    _classCallCheck(this, ApiError);

    this.httpRequest = httpRequest;
    this.exception = exception || null;
  }

  _createClass(ApiError, [{
    key: "getMessage",
    value: function getMessage() {
      if (this.exception) {
        return this.exception.toString();
      }

      if (this.httpRequest && this.httpRequest.readyState === XMLHttpRequest.DONE) {
        return this.httpRequest.statusText;
      }

      return 'httpRequest did not complete';
    }
  }]);

  return ApiError;
}();

export default ApiError;