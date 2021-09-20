// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'manage_members',
);

const Member = require('./member');

module.exports = t.statelessRenderable(
  'MemberList',
  ({ members, selectedMembers, toggleMember }) =>
    t.div(function () {
      t.div('.member-list-header', function () {
        t.div('.name.quiet', () => t.format('name'));
        return t.div('.select.quiet', () => t.format('select'));
      });
      return members.forEach(function (member) {
        const isSelected = selectedMembers.some((id) => id === member.id);

        return t.createElement(Member, { isSelected, member, toggleMember });
      });
    }),
);
