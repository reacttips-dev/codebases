/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

module.exports.linksFromMarkdown = function (text, formatter) {
  let tokens = [];
  for (const block of Array.from(formatter.blockLex(text, {}))) {
    if (block.children != null) {
      tokens = [
        ...Array.from(tokens),
        ...Array.from(formatter.inlineLex(block.children.text)),
      ];
    }
  }

  const results = _.chain(tokens)
    .filter((token) => token.type === 'link')
    .map(function (token) {
      text = token.children != null ? token.children.text : undefined;

      if (text != null) {
        return {
          url: token.url,
          text: formatter.textInline(
            token.children != null ? token.children.text : undefined,
          ),
        };
      } else {
        return { url: token.url };
      }
    })
    .value();

  return results;
};
