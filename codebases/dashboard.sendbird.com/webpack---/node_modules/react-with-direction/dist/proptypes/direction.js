'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _object = require('object.values');

var _object2 = _interopRequireDefault(_object);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = _propTypes2['default'].oneOf((0, _object2['default'])(_constants.DIRECTIONS));