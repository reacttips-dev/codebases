/* eslint-disable
    default-case,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiPromise } = require('app/scripts/network/api-promise');
const { Auth } = require('app/scripts/db/auth');
const {
  BillableGuestsAlert,
} = require('app/src/components/BillableGuestsAlert');
const BillableGuestListPopoverView = require('app/scripts/views/board/billable-guest-list-popover-view');
const BoardOrgSelectPermLevelView = require('app/scripts/views/board-menu/board-org-select-perm-level-view');
const BoardEntSelectPermLevelView = require('app/scripts/views/board-menu/board-ent-select-perm-level-view');
const ChangeBoardOrgTemplate = require('app/scripts/views/templates/popover_change_board_org');
const Confirm = require('app/scripts/views/lib/confirm');
const CreateOrgView = require('app/scripts/views/organization/create-org-view');
const {
  BoardInviteRestrictValues,
} = require('app/scripts/views/organization/constants');
const { ModelLoader } = require('app/scripts/db/model-loader');
const ProductFeatures = require('@trello/product-features').ProductFeatures;
const { PopOver } = require('app/scripts/views/lib/pop-over');
const BluebirdPromise = require('bluebird');
const ReactDOM = require('@trello/react-dom-wrapper');
const React = require('react');
const { ApiError } = require('app/scripts/network/api-error');
const { Controller } = require('app/scripts/controller');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const { featureFlagClient } = require('@trello/feature-flag-client');
const _ = require('underscore');
const isDesktop = require('@trello/browser').isDesktop();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardSelectOrganizationView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'change organization';

    this.prototype.events = {
      'click .js-submit': 'submit',
      'change .js-org': 'orgSelected',
      'click .js-new-org': 'newOrg',
    };
  }

  initialize() {
    this.makeDebouncedMethods('render');
    this.haveAvailableLicenses = true;
    this.listenTo(this.model, 'change:memberships', this.updateOrgOptions);

    this.blockTeamlessBoardsEnabled = featureFlagClient.get(
      'btg.block-teamless-boards',
      false,
    );
  }

  getTemplateData() {
    let org;
    const data = this.model.toJSON({ org: true });
    let orgs = this.model.owned() ? Auth.me().organizationList.models : [];
    data.isMemberOfBoardOrg = orgs.find((o) => o.id === data.idOrganization);

    if (this.model.hasEnterprise()) {
      data.hasEnterprise = true;
      data.enterpriseName = __guard__(this.model.getEnterprise(), (x) =>
        x.get('displayName'),
      );

      orgs = _.filter(orgs, function (org) {
        const idEnterprise = org.get('idEnterprise');

        if (data.idEnterprise != null && idEnterprise === data.idEnterprise) {
          return true;
        }

        if (data.org && idEnterprise === data.org.idEnterprise) {
          return true;
        }

        return false;
      });

      // We'll only show the "Private boards (no team)" option for enterprise boards if they're explicitly
      // owned by the enterprise, i.e. if their `idEnterprise` field is set. When that field is set we know
      // that the board will retain the enterprise ownership status when moved to a user's "private space".
      data.showPrivateBoardsOptionForEntBoards =
        this.model.get('idEnterprise') != null;
    }

    data.orgs = (() => {
      const result = [];
      for (org of Array.from(orgs)) {
        result.push(org.toJSON());
      }
      return result;
    })();
    data.hasOrgs = data.orgs.length !== 0;
    data.isDesktop = isDesktop;

    const currentSelection = this.selectedOrganization || data.idOrganization;

    if (currentSelection) {
      for (org of Array.from(data.orgs)) {
        if (org.id === currentSelection) {
          org.select = true;
        }
      }
    }

    data.isPrivate = this.model.isPrivate();
    data.isTemplate = this.model.isTemplate();
    data.allowsSelfJoin = this.model.allowsSelfJoin();

    data.addToTeam = false;

    return data;
  }

  render() {
    const data = this.getTemplateData();

    Analytics.sendScreenEvent({
      name: 'changeBoardWorkspaceInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });

    data.blockTeamlessBoardsEnabled = this.blockTeamlessBoardsEnabled;

    this.$el.html(ChangeBoardOrgTemplate(data));

    this.updateOrgOptions();
    return this;
  }

  remove() {
    if (this.reactRoot) {
      ReactDOM.unmountComponentAtNode(this.reactRoot);
    }
    return super.remove(...arguments);
  }

  showOrgBoardVisPerms(organization, idOrganizationSource) {
    return PopOver.pushView({
      view: new BoardOrgSelectPermLevelView({
        model: this.model,
        organization,
        idOrganizationSource,
        modelCache: this.modelCache,
      }),
    });
  }

  showEntBoardVisPerms(enterprise, idOrganizationSource) {
    return PopOver.pushView({
      view: new BoardEntSelectPermLevelView({
        model: this.model,
        enterprise,
        idOrganizationSource,
        modelCache: this.modelCache,
      }),
    });
  }

  changeOrg(idOrganizationTarget, idOrganizationSource, settings = {}) {
    const traceId = Analytics.startTask({
      taskName: 'edit-board/idOrganization',
      source: 'changeBoardWorkspaceInlineDialog',
    });
    let targetOrg;
    const orgChanged = idOrganizationTarget !== idOrganizationSource;

    // We aren't subscribed to the boards or the orgs, so we manually update the
    // client-side boardLists
    if (orgChanged && idOrganizationSource) {
      // We may not be able to load the source organization model
      __guard__(
        this.modelCache.get('Organization', idOrganizationSource),
        (x) => x.boardList.remove(this.model),
      );
    }

    settings.idOrganization = idOrganizationTarget;

    if (idOrganizationTarget) {
      // If we're switching to an organization, we might set additional org
      // friendly permissions.

      // We only show this checkbox if the board is currently private, so it's
      // only used to make a private -> org transition, and if it isn't checked
      // there isn't any change being made
      if (this.$('.js-make-org-visible').is(':checked')) {
        settings['prefs/permissionLevel'] = 'org';
      }

      // We only display this checkbox if the org isn't currently org joinable
      // If it isn't checked then there's no change being made to the org
      if (this.$('.js-make-org-joinable').is(':checked')) {
        settings['prefs/selfJoin'] = true;
      }
    }
    if (orgChanged && idOrganizationTarget) {
      targetOrg = this.modelCache.get('Organization', idOrganizationTarget);
      settings.keepBillableGuests =
        (targetOrg != null ? targetOrg.owned() : undefined) &&
        this.haveAvailableLicenses &&
        !isDesktop;
    }

    if (
      this.model.isTemplate() &&
      orgChanged &&
      !this.model.isPublic() &&
      !(targetOrg != null ? targetOrg.isPremium() : undefined)
    ) {
      settings['prefs/isTemplate'] = false;
    }

    settings.traceId = traceId;
    this.model.update(
      settings,
      tracingCallback(
        {
          taskName: 'edit-board/idOrganization',
          source: 'changeBoardWorkspaceInlineDialog',
          traceId,
        },
        (error) => {
          // TRELP-978: Unauthorized error when a team admin moves
          // someone else's private board from BC team to Free team
          if (error instanceof ApiError.Unauthorized) {
            Controller.displayErrorPage({
              errorType: 'notPermissionsToSeeBoard',
            });
          }
        },
      ),
    );

    if (targetOrg != null) {
      targetOrg.boardList.add(this.model);
    }

    return PopOver.hide();
  }

  newOrg(e) {
    let createOpts;
    Analytics.sendClickedLinkEvent({
      linkName: 'createNewOrgLink',
      source: 'changeBoardWorkspaceInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });

    Util.stop(e);

    if (Auth.me().isPaidManagedEntMember()) {
      createOpts = { boardToAddToOrg: this.model, isEnterprise: true };
    } else {
      const isPrivateTemplate =
        this.model.isTemplate() && !this.model.isPublic();
      createOpts = { boardToAddToOrg: this.model, isPrivateTemplate };
    }

    const trackingOpts = {
      category: 'board',
      method: 'by clicking create team in board change team menu',
    };

    return PopOver.pushView({
      view: new CreateOrgView({
        model: this.model,
        modelCache: this.modelCache,
        createOpts,
        trackingOpts,
      }),
    });
  }

  canAddToOrg(organizationTarget) {
    return organizationTarget.canAddBoard(this.model);
  }

  submit(e) {
    if (this.$('.js-submit').hasClass('disabled')) {
      Util.stop(e);
      return;
    }

    this.$('.js-submit').prop('disabled', true).toggleClass('disabled', true);

    Util.stop(e);
    const idOrganizationTarget = this.$('.js-org').val();
    const idOrganizationSource = this.model.get('idOrganization');
    const organizationTarget = this.modelCache.get(
      'Organization',
      idOrganizationTarget,
    );

    Analytics.sendUpdatedBoardFieldEvent({
      field: 'organization',
      source: 'changeBoardWorkspaceInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: idOrganizationTarget,
        },
      },
      attributes: {
        previous: idOrganizationSource,
        change: idOrganizationTarget !== idOrganizationSource,
      },
    });

    return BluebirdPromise.try(() => {
      const targetMembershipRestricted =
        organizationTarget && organizationTarget.boardMembershipRestricted();

      if (!targetMembershipRestricted) {
        return;
      }

      const boardInviteRestrict = organizationTarget.getPref(
        'boardInviteRestrict',
      );
      const filterRestrictedMembers = function (member) {
        switch (boardInviteRestrict) {
          case BoardInviteRestrictValues.ORG:
            return !organizationTarget.isMember(member);
          case BoardInviteRestrictValues.MANAGED:
            return !member.isManagedEntMemberOf(
              organizationTarget.get('idEnterprise'),
            );
          case BoardInviteRestrictValues.ORG_OR_MANAGED:
            return (
              !organizationTarget.isMember(member) &&
              !member.isManagedEntMemberOf(
                organizationTarget.get('idEnterprise'),
              )
            );
        }
      };

      return ModelLoader.loadOrganizationMembersData(idOrganizationTarget).then(
        () => {
          const restrictedMembers = this.model.memberList
            .chain()
            .filter((member) => filterRestrictedMembers(member))
            .map((member) => member.get('fullName'))
            .value();

          const count = restrictedMembers.length;

          if (count === 0) {
            return;
          }

          const confirmKey = (() => {
            switch (boardInviteRestrict) {
              case BoardInviteRestrictValues.ORG:
                if (count === 1) {
                  return 'external member not allowed';
                } else {
                  return 'external members not allowed';
                }
              case BoardInviteRestrictValues.MANAGED:
                if (count === 1) {
                  return 'non managed member not allowed';
                } else {
                  return 'non managed members not allowed';
                }
              case BoardInviteRestrictValues.ORG_OR_MANAGED:
                if (count === 1) {
                  return 'external and non managed member not allowed';
                } else {
                  return 'external and non managed members not allowed';
                }
            }
          })();

          return BluebirdPromise.fromNode((next) => {
            return Confirm.toggle(confirmKey, {
              elem: e.currentTarget,
              model: this.model,
              confirmBtnClass: 'nch-button nch-button--danger',
              templateData: {
                count: String(count),
                members:
                  restrictedMembers.length > 20
                    ? _.first(restrictedMembers, 20).join(', ') + '…'
                    : restrictedMembers.join(', '),
                team: organizationTarget.get('displayName'),
              },
              fxConfirm: () => {
                return next();
              },
              fxCancel: () => {
                return next(new Error('cancelled'));
              },
            });
          });
        },
      );
    })
      .then(() => {
        if (
          organizationTarget &&
          (organizationTarget.isFeatureEnabled('restrictVis') ||
            this.model.getPref('permissionLevel') === 'enterprise')
        ) {
          return ModelLoader.loadOrganizationMembersData(idOrganizationTarget)
            .then(() => {
              if (this.canAddToOrg(organizationTarget)) {
                this.changeOrg(idOrganizationTarget, idOrganizationSource);
              } else {
                this.showOrgBoardVisPerms(
                  organizationTarget,
                  idOrganizationSource,
                );
              }
            })
            .done();
        } else if (this.model.get('idEnterprise')) {
          const enterprise = this.model.getEnterprise();
          if (enterprise && !enterprise.canAddTeamlessBoard(this.model)) {
            this.showEntBoardVisPerms(enterprise, idOrganizationSource);
          } else {
            return this.changeOrg(idOrganizationTarget, idOrganizationSource);
          }
        } else {
          return this.changeOrg(idOrganizationTarget, idOrganizationSource);
        }
      })
      .error(function () {})
      .done();
  }

  showTemplateAlert() {
    return this.$('.js-template-alert').addClass('show-template-alert');
  }

  hideTemplateAlert() {
    return this.$('.js-template-alert').removeClass('show-template-alert');
  }

  allowBoardCreate() {
    this.$('.js-submit').removeClass('disabled');
    this.$('.js-board-limits-upgrade-ad').addClass('hide');
    return this.$('.js-permissions').removeClass('hide');
  }

  updateOrgOptions() {
    this.$('.js-submit').addClass('disabled');
    this.$('.js-billable-guests-warning').addClass('hide');

    this.selectedOrganization = this.$('.js-org').val();
    const hasOrgSelected = this.selectedOrganization !== '';

    this.$('.js-make-org-visible,.js-make-org-joinable')
      .closest('.js-check-div')
      .toggleClass('hide', !hasOrgSelected);

    // show template alert message if trying to move a non-public template to a free or personal team
    if (
      this.model.isTemplate() &&
      !this.model.isPublic() &&
      this.model.get('idOrganization') !== this.selectedOrganization
    ) {
      const targetOrg = this.modelCache.get(
        'Organization',
        this.selectedOrganization,
      );

      if (
        !hasOrgSelected ||
        !(targetOrg != null ? targetOrg.isPremium() : undefined)
      ) {
        this.showTemplateAlert();
      } else {
        this.hideTemplateAlert();
      }
    } else {
      this.hideTemplateAlert();
    }

    if (!hasOrgSelected) {
      this.hideSpinner();
      this.allowBoardCreate();
      return;
    }

    this.showSpinner();

    if (this.model.get('idOrganization') === this.selectedOrganization) {
      this.hideSpinner();
      this.allowBoardCreate();
      return;
    }

    return BluebirdPromise.all([
      ApiPromise({
        type: 'GET',
        url: `/1/organizations/${this.selectedOrganization}/newBillableGuests/${this.model.id}`,
      }),
      ModelLoader.loadOrganizationMembersMinimalWithAvailableLicenseCount(
        this.selectedOrganization,
      ),
    ])
      .spread((newBillableGuests, org) => {
        // Show the 'new' board limits CTA
        if (org != null ? org.isAtOrOverFreeBoardLimit() : undefined) {
          this.$('.js-board-limits-upgrade-ad').removeClass('hide');
          this.$('.js-permissions').addClass('hide');
          this.$('.js-target-team').text(org.get('displayName'));
          this.$('.js-upgrade-link').attr('href', org.getBillingUrl());
          return this.hideSpinner();

          // Show the new billable guests information
        } else if (newBillableGuests.length > 0) {
          this.renderBillableGuestAlert({ org, newBillableGuests });
          return (this.haveAvailableLicenses =
            newBillableGuests.length <= org.getAvailableLicenseCount());
        } else {
          return this.allowBoardCreate();
        }
      })
      .finally(() => {
        return this.hideSpinner();
      });
  }

  renderBillableGuestAlert({ org, newBillableGuests }) {
    const productCode = org.getProduct();
    const props = {
      adminNames: org.adminList.map(
        (member) => member.get('fullName') || member.get('username'),
      ),
      newBillableGuestsCount: newBillableGuests.length,
      availableLicenseCount: org.getAvailableLicenseCount(),
      orgName: org.get('displayName') || org.get('name'),
      pricePerGuest: ProductFeatures.getPrice(productCode),
      isMonthly: ProductFeatures.isMonthly(productCode),
      isOrgAdmin: org.owned(),
      orgUrl: org.url,
      isReopen: false,
      isDesktop,
      onCountClick: () =>
        PopOver.pushView({
          view: new BillableGuestListPopoverView({ newBillableGuests }),
        }),
    };

    const Element = <BillableGuestsAlert {...props} />;
    this.reactRoot = this.$('.js-billable-guests-warning')[0];
    ReactDOM.render(Element, this.reactRoot);
    this.$('.js-billable-guests-warning').removeClass('hide');
    return this.allowBoardCreate();
  }

  orgSelected(e) {
    return this.updateOrgOptions();
  }

  showSpinner() {
    this.$('.js-loading').toggleClass('hide', false);
    return this.$('.js-loaded').toggleClass('hide', true);
  }

  hideSpinner() {
    this.$('.js-loading').toggleClass('hide', true);
    return this.$('.js-loaded').toggleClass('hide', false);
  }
}

BoardSelectOrganizationView.initClass();
module.exports = BoardSelectOrganizationView;
