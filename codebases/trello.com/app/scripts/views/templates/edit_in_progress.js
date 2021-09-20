// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')();

module.exports = t.renderable(({ members }) =>
  (() => {
    const result = [];
    for (const { avatarUrl, viewTitle, initials, icon } of Array.from(
      members,
    )) {
      result.push(
        t.span('.edit-in-progress', function () {
          t.span('.inline-member', function () {
            const title = viewTitle;
            if (avatarUrl) {
              return t.img('.inline-member-av', {
                src: [avatarUrl, '30.png'].join('/'),
                alt: title,
                title,
              });
            } else {
              return t.span('.initials', { title }, () => t.text(initials));
            }
          });
          if (icon) {
            return t.icon(icon, { class: 'icon' });
          }
        }),
      );
    }
    return result;
  })(),
);
