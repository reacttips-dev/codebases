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
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'select_member',
);
const { localizeCount } = require('app/scripts/lib/localize-count');
const { Analytics } = require('@trello/atlassian-analytics');

class AutoCompleteMultiBoardGuestAlert extends React.Component {
  static initClass() {
    this.prototype.displayName = 'AutoCompleteMultiBoardGuestAlert';

    this.prototype.shouldComponentUpdate = naiveShouldComponentUpdate;

    this.prototype.render = t.renderable(function () {
      const { displayOrg, isDesktop } = this.props;

      const owned = displayOrg != null ? displayOrg.owned() : undefined;
      const teamUrl = displayOrg != null ? displayOrg.get('url') : undefined;

      return t.div(
        {
          onMouseDown: this.onMouseDown.bind(this),
        },
        () => {
          if (owned && displayOrg && !isDesktop) {
            if (displayOrg.getAvailableLicenseCount() > 0) {
              t.format('multi-board-guest-alert-as-admin');
            } else {
              t.format('multi-board-guest-alert-as-admin-no-seats');
            }
          } else if (isDesktop) {
            t.format('multi-board-guest-alert-desktop');
          } else {
            if (displayOrg != null) {
              const admins = displayOrg.adminList.map(
                (member) => member.get('fullName') || member.get('username'),
              );
              if (admins.length === 1) {
                t.format('multi-board-guest-alert-as-member-with-1-admin', {
                  admin1: admins[0],
                });
              } else if (admins.length === 2) {
                t.format('multi-board-guest-alert-as-member-with-2-admins', {
                  admin1: admins[0],
                  admin2: admins[1],
                });
              } else if (admins.length === 3) {
                t.format('multi-board-guest-alert-as-member-with-3-admins', {
                  admin1: admins[0],
                  admin2: admins[1],
                  admin3: admins[2],
                });
              } else {
                const others = localizeCount('others', admins.length - 3);
                t.format('multi-board-guest-alert-as-member-with-more-admins', {
                  admin1: admins[0],
                  admin2: admins[1],
                  admin3: admins[2],
                  others,
                  othersUrl: `${teamUrl}/members`,
                });
              }
            } else {
              t.format('multi-board-guest-alert-as-guest');
            }
          }

          if (!isDesktop) {
            t.text(' ');
            const helpUrl =
              'https://help.trello.com/article/1123-multi-board-guests';
            return t.a(
              {
                href: helpUrl,
                target: '_blank',
                onMouseDown(e) {
                  window.open(helpUrl, '_blank');
                  Analytics.sendClickedLinkEvent({
                    linkName: 'inviteMultiBoardGuestLearnMoreLink',
                    source: 'inviteToBoardInlineDialog',
                    containers: {
                      workspace: {
                        id: displayOrg.id,
                      },
                    },
                  });
                  e.preventDefault();
                  return e.stopPropagation();
                },
              },
              () => t.format('learn-more'),
            );
          }
        },
      );
    });
  }

  constructor(props) {
    super(props);
  }

  onMouseDown(e) {
    if (e.target.classList.contains('stop-propagation')) {
      e.preventDefault();
      if (e.target.href) {
        return window.open(e.target.href, '_blank');
      }
    }
  }
}

AutoCompleteMultiBoardGuestAlert.initClass();
module.exports = AutoCompleteMultiBoardGuestAlert;
