// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'org_create',
);

module.exports = function () {
  t.form(function () {
    t.p('.error', { style: 'display:none' });

    t.label({ for: 'org-display-name' }, () => t.format('name'));
    t.input('.js-autofocus.js-display-name', {
      type: 'text',
      name: 'displayName',
      id: 'org-display-name',
      value: t.mustacheVar('displayName'),
      dir: 'auto',
      maxLength: 100,
    });

    t.div('.js-team-type-select.create-org-team-type-select');

    if (!t.mustacheVar('teamVerticalSelectionEnabled')) {
      t.label({ for: 'org-desc' }, () => t.format('description-optional'));
      t.textarea({ id: 'org-desc', name: 'desc', dir: 'auto' }, () =>
        t.text(t.mustacheVar('desc')),
      );
    }

    if (t.mustacheVar('boardToAddToOrg') && t.mustacheVar('memberCount') > 1) {
      t.div('.check-div', function () {
        t.input('.js-add-members', {
          type: 'checkbox',
          checked: true,
          id: 'addMembers',
        });
        return t.label(
          { for: 'addMembers', class: 'create-team-add-members' },
          () => t.format('add-the-members-of-this-board-to-the-team'),
        );
      });
    }

    return t.input('.nch-button.nch-button--primary.wide.js-save', {
      type: 'submit',
      value: t.l('create'),
    });
  });

  t.hr();

  if (t.mustacheVar('isPrivateTemplate')) {
    t.p('.create-org-template-alert-notice', () =>
      t.format('moving-a-template'),
    );
  }

  t.p('.quiet', () => t.format('a-team-is-a-group-of-boards-and-people'));
};
