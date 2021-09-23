import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import BaseReporter from './BaseReporter';
import { INTERNAL_ERROR_MARKERS } from '../Constants';

var _INTERNAL_ERROR_MARKE = _slicedToArray(INTERNAL_ERROR_MARKERS, 2),
    __ = _INTERNAL_ERROR_MARKE[0],
    RHUMB_GLOBAL_ERROR_BOUNDARY = _INTERNAL_ERROR_MARKE[1];

var GlobalErrorReporter = /*#__PURE__*/function (_BaseReporter) {
  _inherits(GlobalErrorReporter, _BaseReporter);

  function GlobalErrorReporter() {
    var _this;

    _classCallCheck(this, GlobalErrorReporter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GlobalErrorReporter).call(this));
    _this.stopped = false;
    return _this;
  }

  _createClass(GlobalErrorReporter, [{
    key: "report",
    value: function report(action) {
      if (this.stopped) {
        return;
      }

      if (action.type === 'GLOBAL_ERROR') {
        var _action$payload = action.payload,
            entry = _action$payload.entry,
            extra = _action$payload.extra;
        var error = extra.error;
        var pathname = entry.pathname;
        this.captureError(error, {
          data: {
            pathname: pathname
          },
          tags: _defineProperty({}, RHUMB_GLOBAL_ERROR_BOUNDARY, 'true')
        });
        this.stopped = true;
      }
    }
  }]);

  return GlobalErrorReporter;
}(BaseReporter);

export { GlobalErrorReporter as default };