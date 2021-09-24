'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _wrapNativeSuper from "@babel/runtime/helpers/esm/wrapNativeSuper";

var ObjectCreatorError = /*#__PURE__*/function (_Error) {
  _inherits(ObjectCreatorError, _Error);

  function ObjectCreatorError(object) {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ObjectCreatorError);

    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ObjectCreatorError)).call.apply(_getPrototypeOf2, [this].concat(params)));

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_assertThisInitialized(_this), ObjectCreatorError);
    }

    _this.object = object;
    return _this;
  }

  return ObjectCreatorError;
}(_wrapNativeSuper(Error));

export { ObjectCreatorError as default };