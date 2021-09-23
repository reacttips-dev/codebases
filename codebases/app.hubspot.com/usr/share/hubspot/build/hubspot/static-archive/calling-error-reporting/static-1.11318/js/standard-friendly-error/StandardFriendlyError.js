'use es6';
/**
 * https://product.hubteam.com/docs/errors/friendly-errors.html
 *
 * Example Standard Friendly Error:
 * "@result": "ERR",
 * "message": "An application with name `doot` already exists on this account.",
 * "category": "OBJECT_ALREADY_EXISTS",
 * "subCategory": "ApplicationError.NAME_ALREADY_TAKEN",
 * "context": {
 *   "name": ["doot"]
 * },
 * "links": {
 *   "docs": "https://developers.hubspot.com/docs/faq/how-do-i-create-an-app-in-hubspot"
 * },
 * "status": "error",
 * "requestId" : "93e5e1c5-539a-4e13-bcc4-96a385526c58",
 * "correlationId": "7f97d05e-cced-4b3e-a628-3f3b95340382"
 */

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _wrapNativeSuper from "@babel/runtime/helpers/esm/wrapNativeSuper";

var StandardFriendlyError = /*#__PURE__*/function (_Error) {
  _inherits(StandardFriendlyError, _Error);

  function StandardFriendlyError(error) {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, StandardFriendlyError);

    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StandardFriendlyError)).call.apply(_getPrototypeOf2, [this].concat(params)));

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_assertThisInitialized(_this), StandardFriendlyError);
    }

    _this.name = 'StandardFriendlyError'; // Custom debugging information

    _this['@result'] = error['@result'];
    var message = error.message,
        category = error.category,
        subCategory = error.subCategory,
        _error$context = error.context,
        context = _error$context === void 0 ? {} : _error$context,
        _error$links = error.links,
        links = _error$links === void 0 ? {} : _error$links,
        status = error.status,
        requestId = error.requestId,
        correlationId = error.correlationId;
    _this.message = message;
    _this.category = category;
    _this.subCategory = subCategory;
    _this.context = context;
    _this.links = links;
    _this.status = status;
    _this.requestId = requestId;
    _this.correlationId = correlationId;
    return _this;
  }

  return StandardFriendlyError;
}(_wrapNativeSuper(Error));

export default StandardFriendlyError;