// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'member_large_avatar',
);

module.exports = t.renderable(function ({
  avatarUrl,
  viewTitle,
  avatarSource,
}) {
  const title = viewTitle;
  let className = '';
  if (avatarSource === 'atlassianAccount') {
    className = 'pop-over-atlassian-account-avatar';
  }
  return t.img({
    src: [avatarUrl, 'original.png'].join('/'),
    class: className,
    alt: title,
    title,
  });
});
