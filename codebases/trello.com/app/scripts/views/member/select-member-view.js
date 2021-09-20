// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'select_member',
);
const memberTemplate = require('app/scripts/views/templates/member');

const template = t.renderable(function (data) {
  const {
    url,
    extraText,
    id,
    viewTitle,
    username,
    isVirtual,
    fullName,
    inactive,
    unconfirmed,
  } = data;
  return t.a(
    '.name.js-select-member',
    {
      href: url || '#',
      class: t.classify({ 'multi-line': extraText }),
      idMember: id,
      title: viewTitle,
      autocompleteText: username,
    },
    function () {
      t.span(
        '.member.js-member',
        { class: t.classify({ virtual: isVirtual }) },
        () => memberTemplate(data),
      );

      t.span(
        '.full-name',
        {
          name: `${fullName}${username ? ` (${username}` : ''}`,
          'aria-hidden': true,
        },
        function () {
          t.text(fullName);
          t.text(' ');
          if (username) {
            return t.span('.username', () => t.text(`(${username})`));
          }
        },
      );

      if (extraText) {
        t.div('.extra-text.quiet', () => t.format('extratext', { extraText }));
      }

      t.icon('check', {
        class: 'checked-icon',
        'aria-label': t.l('added-to-card'),
      });

      t.icon('forward', { class: 'light option js-open-option' });

      if (inactive) {
        t.span('.quiet.sub-name', () => t.format('inactive-account'));
      }

      if (unconfirmed) {
        return t.span('.quiet.sub-name', () => t.format('unconfirmed-user'));
      }
    },
  );
});

class SelectMemberView extends View {
  static initClass() {
    this.prototype.tagName = 'li';
    this.prototype.className = 'item js-member-item';
  }

  // options: showUnconfirmed, showInactive, linkName
  initialize() {}

  render() {
    const data = this.model.toJSON();

    if (this.model.get('memberType') === 'ghost') {
      data.isVirtual = true;
    }

    data.unconfirmed =
      this.options.showUnconfirmed && !data.isVirtual && !data.confirmed;
    data.inactive = this.options.showInactive && !data.active;

    data.isKnownMember = this.options.isKnownMember;
    data.extraText = this.options.extraText;
    data.disabled = this.options.disabled;

    if (this.options.linkName) {
      data.url = `/${this.model.get('username')}`;
    } else {
      delete data.url;
    }

    this.el.innerHTML = template(data);

    this.$el
      .toggleClass('active', Boolean(data.isActive))
      .toggleClass('unconfirmed', Boolean(data.unconfirmed))
      .toggleClass('inactive', Boolean(data.inactive))
      .toggleClass('js-autoselect', Boolean(data.isKnownMember))
      .toggleClass('disabled', Boolean(data.disabled));

    this.$('.js-member').data('id', this.model.id);

    return this;
  }
}

SelectMemberView.initClass();
module.exports = SelectMemberView;
