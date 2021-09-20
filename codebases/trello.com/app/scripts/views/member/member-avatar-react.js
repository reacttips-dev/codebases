/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  naiveShouldComponentUpdate,
} = require('app/scripts/lib/util/naive-should-component-update');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')('member');

class MemberAvatar extends React.Component {
  static initClass() {
    this.prototype.displayName = 'MemberAvatar';

    this.prototype.shouldComponentUpdate = naiveShouldComponentUpdate;

    this.prototype.render = t.renderable(function () {
      const {
        avatarUrl,
        email,
        username,
        initials,
        isDeactivated,
        isBoardAdmin,
        isOrganizationAdmin,
        viewTitle,
      } = this.props;
      return t.div('.autocomplete-member-avatar', function () {
        const title = viewTitle;
        if (avatarUrl) {
          const avatarUrl1x = [avatarUrl, '30.png'].join('/');
          const avatarUrl2x = [avatarUrl, '50.png'].join('/');
          t.img({
            class: 'member-avatar',
            height: '30',
            width: '30',
            src: avatarUrl1x,
            srcSet: `${avatarUrl1x} 1x, ${avatarUrl2x} 2x`,
            alt: title,
            title,
          });
        } else if (initials != null && initials !== '') {
          t.span('.member-initials', { title }, () => t.text(initials));
        } else if (username != null) {
          t.div('.member-icon-container', () => t.icon('member'));
        } else if (email != null) {
          t.span('.member-initials', { title }, () =>
            t.text(email[0].toUpperCase()),
          );
        }

        if (!isDeactivated) {
          if (isBoardAdmin) {
            t.span('.member-type.admin', {
              title: t.l('this-member-is-an-admin-of-this-board'),
            });
          }
          if (isOrganizationAdmin) {
            t.span('.member-type.admin', {
              title: t.l('this-member-is-an-admin-of-this-organization'),
            });
          }
        }

        return t.span('.member-gold-badge', {
          title: t.l('this-member-has-trello-gold'),
        });
      });
    });
  }

  constructor(props) {
    super(props);
  }
}

MemberAvatar.initClass();
module.exports = MemberAvatar;
