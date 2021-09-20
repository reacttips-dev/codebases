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

    t.div('.js-team-type-select');

    t.div(function () {
      if (t.mustacheVar('enterprises').length === 1) {
        t.input({
          type: 'hidden',
          name: 'enterprise',
          value: t.mustacheVar('enterprises').first().id,
        });

        t.label(() => t.text('Enterprise'));
        return t.p(() =>
          t.text(t.mustacheVar('enterprises').first().get('displayName')),
        );
      } else {
        t.label({ for: 'ent-select' }, () => t.text('Enterprise'));
        return t.select({ id: 'ent-select', name: 'enterprise' }, () =>
          t
            .mustacheVar('enterprises')
            .forEach((enterprise) =>
              t.option({ value: enterprise.id }, () =>
                t.text(enterprise.get('displayName')),
              ),
            ),
        );
      }
    });

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

  return t.p('.quiet.u-bottom', () =>
    t.format('a-team-is-a-group-of-boards-and-people-owned'),
  );
};
