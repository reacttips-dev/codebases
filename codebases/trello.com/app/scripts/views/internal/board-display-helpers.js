// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { l } = require('app/scripts/lib/localize');

const functions = {
  getPermLevelAltTextForBoard(board) {
    const level = board.getPermLevel();
    return l(['board perms', level, 'short summary']);
  },

  getPermLevelAltTextForTemplate(board) {
    const level = board.getPermLevel();
    return l(['template perms', level, 'short summary']);
  },

  getPermLevelIconClass(level) {
    if (level === 'org') {
      return 'organization-visible';
    } else if (level === 'enterprise') {
      return 'enterprise';
    } else {
      return level;
    }
  },

  getPermLevelIconClassForBoard(board) {
    return functions.getPermLevelIconClass(board.getPermLevel());
  },
};

module.exports = functions;
