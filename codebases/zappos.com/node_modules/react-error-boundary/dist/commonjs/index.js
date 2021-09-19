'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBoundaryFallbackComponent = exports.withErrorBoundary = exports.ErrorBoundary = undefined;

var _ErrorBoundaryFallbackComponent = require('./ErrorBoundaryFallbackComponent');

var _ErrorBoundaryFallbackComponent2 = _interopRequireDefault(_ErrorBoundaryFallbackComponent);

var _ErrorBoundary = require('./ErrorBoundary');

var _ErrorBoundary2 = _interopRequireDefault(_ErrorBoundary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ErrorBoundary2.default;
exports.ErrorBoundary = _ErrorBoundary2.default;
exports.withErrorBoundary = _ErrorBoundary.withErrorBoundary;
exports.ErrorBoundaryFallbackComponent = _ErrorBoundaryFallbackComponent2.default;