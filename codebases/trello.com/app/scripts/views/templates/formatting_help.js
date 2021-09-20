// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'formatting_help',
);

module.exports = function () {
  t.p(() =>
    t.format(
      'trello-uses-markdown-for-formatting-here-are-the-basics-see-the-complete-syntax',
    ),
  );

  t.hr();

  t.p('.quiet', () => t.format('first-level-header'));
  t.code(function () {
    t.format('making-scrambled-eggs-a-primer');
    t.br();
    return t.text('\n    ===============================\n  ');
  });

  t.hr();

  t.p('.quiet', () => t.format('second-level-header'));
  t.code(function () {
    t.format('1-1-preparation');
    t.br();
    return t.text('\n    ----------------\n  ');
  });

  t.hr();

  t.p('.quiet', () => t.format('paragraphs'));
  t.code(() =>
    t.format(
      'add-two-new-lines-to-start-a-new-paragraph-crack-two-eggs-into-the-bowl-and-whisk',
    ),
  );

  t.hr();

  t.p('.quiet', () => t.format('bold'));
  t.code(() => t.format('carefully-crack-the-eggs'));

  t.hr();

  t.p('.quiet', () => t.format('emphasis'));
  t.code(() => t.format('whisk-the-eggs-vigorously'));

  t.hr();

  t.p('.quiet', () => t.format('lists'));
  t.code(function () {
    t.format('ingredients');
    t.br();
    t.br();
    t.format('eggs');
    t.br();
    t.format('oil');
    t.br();
    return t.format('optional-milk');
  });

  t.hr();

  t.p('.quiet', () => t.format('links'));
  t.code(() =>
    t.format(
      'to-download-a-pdf-version-of-the-recipe-click-here-https-example-com-scrambled-eggs-pdf',
    ),
  );

  t.hr();

  t.p('.quiet', () => t.format('images'));
  return t.code(() => t.format('the-finished-dish-https-example-com-eggs-png'));
};
