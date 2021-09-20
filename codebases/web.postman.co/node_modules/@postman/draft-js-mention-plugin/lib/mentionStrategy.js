'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getTypeByTrigger = require('./utils/getTypeByTrigger');

var _getTypeByTrigger2 = _interopRequireDefault(_getTypeByTrigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findMentionEntities = function findMentionEntities(trigger) {
  return function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === (0, _getTypeByTrigger2.default)(trigger);
    }, callback);
  };
};

exports.default = findMentionEntities;