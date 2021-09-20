/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const MemberAvatar = require('app/scripts/views/member/member-avatar-react');
const AutoCompleteMultiBoardGuestAlert = require('app/scripts/views/organization/invite-member-autocomplete-multi-board-guest-alert');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'select_member',
);
const { TeamTestIds } = require('@trello/test-ids');
const {
  BoardInviteRestrictValues,
} = require('app/scripts/views/organization/constants');

const DisabledReasonsEnum = {
  JOINED: 'joined',
  INVITED: 'invited',
  BLOCKED: 'blocked',
  RESTRICT_ORG: 'org-restrict-org',
  RESTRICT_MANAGED: 'org-restrict-managed',
  RESTRICT_MANAGED_OR_ORG: 'org-restrict-managed-or-org',
};

class AutocompleteMemberAvatar extends React.Component {
  static initClass() {
    this.prototype.displayName = 'AutocompleteMemberAvatar';

    this.prototype.render = t.renderable(function () {
      let title;
      const {
        member,
        onRemoveClick,
        displayDetails,
        displayOrg,
        displayUsername,
        activeMember,
        isDesktop,
      } = this.props;

      const {
        active,
        username,
        email,
        confirmed,
        fullName,
        idOrganizations,
        wouldBecomeBillableGuest,
        hasError,
        blockInvite,
      } = member;

      const disabledReason = this.getDisabledReason();
      const isClickable = this.isClickable();

      if (displayUsername) {
        title = `${fullName} (${username})`;
      } else {
        title = fullName || email;
        if (title === username) {
          // if fullName was chosen, but it is not public
          title = `@${title}`;
        }
      }

      // using mousedown instead of click on the option allows us to
      // select the option and then have the input blur happen afterwards
      return t.div(
        '.autocomplete-option',
        {
          onMouseDown: this.onMouseDown,
          class: t.classify({
            disabled: !isClickable,
            active: activeMember && isClickable,
            'has-links': wouldBecomeBillableGuest && !disabledReason,
            'has-error': hasError || blockInvite,
          }),
          'data-test-id': TeamTestIds.TeamInviteeOption,
        },
        () => {
          t.div('.member-container', () => {
            if (displayDetails) {
              t.div(
                '.member',
                {
                  class: t.classify({
                    'member-deactivated': member.activityBlocked,
                  }),
                },
                () => {
                  return t.createElement(MemberAvatar, this.props.member);
                },
              );
            }

            t.div('.member-info', function () {
              t.div('.full-name', () => t.text(title));

              if (
                displayOrg != null &&
                displayDetails &&
                idOrganizations &&
                Array.from(idOrganizations).includes(displayOrg.id)
              ) {
                t.span(
                  '.quiet.sub-name',
                  {
                    style: {
                      marginRight: 4,
                    },
                  },
                  () => t.text(displayOrg.get('displayName')),
                );
              }

              if (displayDetails) {
                if (disabledReason) {
                  t.span('.quiet.sub-name', () => t.format(disabledReason));
                }
              }

              if (displayDetails && !disabledReason) {
                if (confirmed === false) {
                  return t.span('.quiet.sub-name', () =>
                    t.format('unconfirmed-user'),
                  );
                } else if (active === false) {
                  return t.span('.quiet.sub-name', () =>
                    t.format('inactive-account'),
                  );
                }
              }
            });

            if (onRemoveClick) {
              return t.a('.icon-sm .icon-close', {
                onClick: this.onRemoveClick,
                href: '#',
              });
            }
          });
          if (this.showMultiBoardGuestAlert()) {
            return t.div('.multi-board-guest-autocomplete-alert', () =>
              t.createElement(AutoCompleteMultiBoardGuestAlert, {
                displayOrg,
                isDesktop,
              }),
            );
          }
        },
      );
    });
  }

  constructor(props) {
    super(props);
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  getDisabledReason() {
    if (!this.props.showRestrictions) {
      return null;
    }

    let orgInviteRestrict;
    const { displayOrg, member } = this.props;

    if (member.joined) {
      if ((member.memberType != null) === 'ghost') {
        return DisabledReasonsEnum.INVITED;
      }
      return DisabledReasonsEnum.JOINED;
    } else if (member.activityBlocked || member.isDeactivated) {
      return DisabledReasonsEnum.BLOCKED;
    } else if (
      displayOrg &&
      (orgInviteRestrict = displayOrg.getPref('boardInviteRestrict'))
    ) {
      // This follows the code on server when you pass
      // onlyOrgOrManagedMembers: true
      // onlyOrgMembers: true
      // onlyManagedMembers: true
      // onlyLicensedOrManagedMembers: true
      // onlyLicensedMembers: true
      // to the api for search. We were previously not showing results via
      // sending those query params. But this confuesed users. So we don't
      // pass those, and instead disable the member based on same criteria.
      const isInOrg =
        member.idOrganizations != null
          ? member.idOrganizations.some(
              (idOrg) => idOrg === displayOrg.get('id'),
            )
          : undefined;
      const isInEnt =
        member.idEnterprise != null &&
        member.idEnterprise === displayOrg.get('idEnterprise');
      if (orgInviteRestrict === BoardInviteRestrictValues.ORG) {
        return !isInOrg && DisabledReasonsEnum.RESTRICT_ORG;
      } else if (orgInviteRestrict === BoardInviteRestrictValues.MANAGED) {
        return !isInEnt && DisabledReasonsEnum.RESTRICT_MANAGED;
      } else if (
        orgInviteRestrict === BoardInviteRestrictValues.ORG_OR_MANAGED
      ) {
        return (
          !(isInOrg || isInEnt) && DisabledReasonsEnum.RESTRICT_MANAGED_OR_ORG
        );
      }
    }
  }

  showMultiBoardGuestAlert() {
    const { onRemoveClick, member } = this.props;
    return (
      !onRemoveClick &&
      member.wouldBecomeBillableGuest &&
      this.getDisabledReason() == null
    );
  }

  isClickable() {
    if (!this.props.showRestrictions) {
      return true;
    }

    const availableLicenseCount =
      this.props.displayOrg != null
        ? this.props.displayOrg.getAvailableLicenseCount()
        : undefined;

    return (
      !this.getDisabledReason() &&
      !this.props.selected &&
      !(
        __guard__(
          this.props != null ? this.props.member : undefined,
          (x) => x.wouldBecomeBillableGuest,
        ) &&
        (!(this.props.displayOrg != null
          ? this.props.displayOrg.owned()
          : undefined) ||
          (this.props != null ? this.props.isDesktop : undefined))
      ) &&
      ((__guard__(
        this.props != null ? this.props.member : undefined,
        (x1) => x1.wouldBecomeBillableGuest,
      ) &&
        availableLicenseCount > 0) ||
        !__guard__(
          this.props != null ? this.props.member : undefined,
          (x2) => x2.wouldBecomeBillableGuest,
        ))
    );
  }

  onMouseDown(e) {
    const { onShowMultiBoardGuestAlert, member } = this.props;

    const wasRemoveClicked = e.target.className.indexOf('icon-close') !== -1;

    // If this is a red lozenge, show the alert on click
    if (
      onShowMultiBoardGuestAlert != null &&
      member.blockInvite &&
      !wasRemoveClicked
    ) {
      onShowMultiBoardGuestAlert(true);
    }

    if (!this.isClickable()) {
      return e.preventDefault();
    } else if (this.props != null ? this.props.onMouseDown : undefined) {
      return this.props.onMouseDown(e);
    }
  }

  onRemoveClick(e) {
    const { onRemoveClick, onShowMultiBoardGuestAlert, member } = this.props;
    if (member.blockInvite && onShowMultiBoardGuestAlert != null) {
      onShowMultiBoardGuestAlert(false);
    }
    return onRemoveClick(e);
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
AutocompleteMemberAvatar.initClass();
module.exports = AutocompleteMemberAvatar;
