import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import BaseReporter from './BaseReporter';

var UnexpectedRouteReporter = /*#__PURE__*/function (_BaseReporter) {
  _inherits(UnexpectedRouteReporter, _BaseReporter);

  // eslint-disable-next-line no-restricted-globals
  function UnexpectedRouteReporter() {
    var _this;

    _classCallCheck(this, UnexpectedRouteReporter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UnexpectedRouteReporter).call(this));
    _this.resolved = {}; // eslint-disable-next-line no-restricted-globals

    _this.notifiedRoutes = new Set();
    return _this;
  }

  _createClass(UnexpectedRouteReporter, [{
    key: "report",
    value: function report(action) {
      if (action.type === 'COMPONENT_RENDERED' || this.resolved[action.payload.entry.id] && action.type !== 'CHECKS_CHANGED') {
        return;
      }

      var pathname = action.payload.entry.pathname;

      if (action.type === 'ROUTE_UNEXPECTED') {
        if (!this.notifiedRoutes.has(pathname)) {
          this.addPageAction('react-rhumb-event', {
            eventName: 'UnexpectedRouteVisited',
            pathname: pathname
          });
          this.notifiedRoutes.add(pathname);
        }

        this.resolved[action.payload.entry.id] = true;
      }
    }
  }]);

  return UnexpectedRouteReporter;
}(BaseReporter);

export { UnexpectedRouteReporter as default };