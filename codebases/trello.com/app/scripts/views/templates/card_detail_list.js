// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_detail_list',
);

module.exports = t.renderable(
  ({ editable, listName, showBoardName, boardName, boardUrl }) =>
    t.p('.u-inline-block.u-bottom', function () {
      const className = t.classify({
        'js-open-move-from-header': editable,
        disabled: !editable,
      });
      if (showBoardName) {
        return t.format('board-in-list', {
          boardClassName: '',
          boardName,
          boardUrl,
          listClassName: className,
          listName,
        });
      } else {
        return t.format('in-list', { className, listName });
      }
    }),
);
