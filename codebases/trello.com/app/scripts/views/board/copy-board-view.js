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
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const React = require('react');
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const BoardDisplayHelpers = require('app/scripts/views/internal/board-display-helpers');
const { Controller } = require('app/scripts/controller');
const CreateOrgView = require('app/scripts/views/organization/create-org-view');
const Language = require('@trello/locale');
const lastOrganization = require('app/common/lib/util/last-organization')
  .default;
const { ModelLoader } = require('app/scripts/db/model-loader');
const NewBoardHelperAddOrgView = require('app/scripts/views/board/new-board-helper-add-org-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const BluebirdPromise = require('bluebird');
const { TrelloStorage } = require('@trello/storage');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { forTemplate } = require('@trello/i18n');
const { featureFlagClient } = require('@trello/feature-flag-client');
const boardMenuVisTemplate = require('app/scripts/views/templates/board_menu_vis');
const isDesktop = require('@trello/browser').isDesktop();
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  CopyBoardFromTemplatePopoverButton,
} = require('app/src/components/UpgradePathAudit/');
const LastOrganization = lastOrganization(TrelloStorage);

const format = forTemplate('board_copy');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class CopyBoardView extends View {
  static initClass() {
    this.prototype.events = {
      'change select[name="org-id"]': 'changeOrg',
      'click .js-helper-add-org': 'helperAddOrg',
      'submit form': 'submit',
      'input input[id="boardNewTitle"]': 'onBoardNameChange',
      'click .js-submit': 'submit',
      'click .js-create-org': 'newOrg',
      'click .js-change-vis': 'openChangeVis',
      'click .js-select': 'selectVis',
      'click .js-confirm-public': 'confirmPublic',
      'click .js-cancel-public': 'cancelPublic',
    };
  }

  constructor(options) {
    super(options);
    this.getViewTitle = this.getViewTitle.bind(this);
  }

  initialize({ boardNameInputValue, gasSource }) {
    this.boardNameInputValue = boardNameInputValue;
    this.gasSource = gasSource;
    this.blockTeamlessBoardsEnabled = featureFlagClient.get(
      'btg.block-teamless-boards',
      false,
    );
  }

  getData() {
    this.loading = true;
    return ModelLoader.loadBoardMinimal(this.model.get('id')).finally(() => {
      this.loading = false;
      // Send screen event only when the popover has finished loading
      Analytics.sendScreenEvent({
        name: 'copyBoardInlineDialog',
        containers: {
          board: {
            id: this.model.id,
          },
          organization: {
            id: __guard__(this.model.getOrganization(), (x) => x.id),
          },
        },
        attributes: {
          isTemplate: this.model.isTemplate(),
        },
      });
      return this.render();
    });
  }

  getViewTitle() {
    if (this.model.isTemplate()) {
      return l(['view title', 'create board from template']);
    }

    return l(['view title', 'copy board']);
  }

  getOrganization() {
    switch (this.model.typeName) {
      case 'Organization':
        return this.model;
      case 'Board':
        return this.model.getOrganization();
      case 'Member':
        return null;
    }
  }

  getDefaultIdOrganization(idOrgs) {
    let id, idOrganization;
    if (idOrgs.length === 0) {
      return null;
    }

    if (this.options.useLastOrganization) {
      if (idOrgs.length === 1) {
        return idOrgs[0];
      }

      const idLastOrganization = LastOrganization.get();
      if (idLastOrganization === LastOrganization.NO_ORGANIZATION) {
        return null;
      } else if (
        idLastOrganization != null &&
        Array.from(idOrgs).includes(idLastOrganization)
      ) {
        return idLastOrganization;
      } else {
        // Use the most recently created org
        idOrganization = null;
        for (id of Array.from(idOrgs)) {
          if (idOrganization == null || id > idOrganization) {
            idOrganization = id;
          }
        }
        return idOrganization;
      }
    } else {
      if (
        (idOrganization = __guard__(this.getOrganization(), (x) => x.id)) !=
        null
      ) {
        return idOrganization;
      } else {
        const bestOrgId = __guard__(
          Auth.me().getBestOrganization(),
          (x1) => x1.id,
        );
        if (bestOrgId != null) {
          return bestOrgId;
        } else {
          return null;
        }
      }
    }
  }

  render() {
    let boardEnterprise;
    const me = Auth.me();

    const idOrganization = this.getDefaultIdOrganization(
      me.organizationList.pluck('id'),
    );

    let orgs = me.organizationList;

    const isPublicTemplate =
      this.model.get('prefs').isTemplate &&
      this.model.get('prefs').permissionLevel === 'public';
    const boardHasEnterprise = this.model.get('enterpriseOwned');
    const isPaidManagedEntMember = me.isPaidManagedEntMember();

    // restrict the dropdown to enterprise teams for managed enterprise members
    if (isPaidManagedEntMember) {
      orgs = orgs.filter((org) => org.belongsToRealEnterprise());
    }

    if (boardHasEnterprise && !isPublicTemplate) {
      // We may or may not know anything about the board's enterprise. If we do, restrict copies
      // to that board's enterprise. The one exception is a public template.
      // If the user is associated with multiple enterprises, it's possible they
      // could select the wrong one, but at least the server will enforce the content
      // restrictions
      boardEnterprise = this.model.getEnterprise();
      if (boardEnterprise) {
        orgs = orgs.filter(
          (org) => org.get('idEnterprise') === boardEnterprise.get('id'),
        );
      } else {
        orgs = orgs.filter((org) => org.get('idEnterprise'));
      }
    }

    orgs = orgs.map((org) =>
      _.extend(org.toJSON(), {
        selectOrg: org.id === idOrganization,
      }),
    );

    // We'll only show the "(none)" option for enterprise boards if they're explicitly
    // owned by an enterprise, i.e. if their `idEnterprise` field is set. When that field is set we know
    // that the board will retain the enterprise owneship status when moved to a user's "private space".
    const showPrivateBoardsOptionForEntBoards =
      this.model.get('idEnterprise') != null;

    const data = {
      orgs,
      canAddToOrgs: orgs.length !== 0,
      willRemovePowerUps:
        this.model.powerUpsCount() >
        me.getPowerUpsLimit(this.getOrganization()),
      isDesktop,
      loading: this.loading,
      boardHasEnterprise,
      showPrivateBoardsOptionForEntBoards,
      blockTeamlessBoardsEnabled: this.blockTeamlessBoardsEnabled,
    };
    if (boardEnterprise) {
      data.enterpriseName = boardEnterprise.get('displayName');
    }
    // Yes, this is implicit coupling to the number of placeholders
    // we have in the strings file. If we ever have another nondeterministic
    // string, we can think about doing this more formally...
    const placeholderKey = Math.floor(Math.random() * 13).toString();
    data.placeholder = l(['board name placeholder', placeholderKey]);

    data.publicConfirmationText = l([
      'confirm',
      'public board confirmation',
      'text',
    ]);
    data.publicConfirmationConfirm = l([
      'confirm',
      'public board confirmation',
      'confirm',
    ]);
    data.publicConfirmationCancel = l(['cancel']);
    data.isTemplate = this.model.isTemplate();

    if (this.boardNameInputValue) {
      data.boardNameInputValue = this.boardNameInputValue;
    }

    data.pLevel = 'private';
    if (this.model.owned()) {
      data.pLevel = this.model.get('prefs').permissionLevel;
    } else if (idOrganization != null) {
      data.pLevel = 'org';
    }

    if (this.options != null ? this.options.newOrgBoard : undefined) {
      data.hideOrg = true;
    }

    this.$el.html(
      templates.fill(require('app/scripts/views/templates/board_copy'), data),
    );

    this.checkBoardPermissions();

    return this;
  }

  checkBoardPermissions() {
    const orgId = this.$('select[name="org-id"]').val();
    if (!orgId) {
      this.renderBoardVisChooser();
      return;
    }

    return this.loadOrg(orgId).then((org) => {
      // Show the board limits CTA
      if (org != null ? org.isAtOrOverFreeBoardLimit() : undefined) {
        this.$('.js-board-limits-upgrade-ad').removeClass('hide');
        this.$('.js-target-team').text(org.get('displayName'));
        this.$('.js-upgrade-link').attr(
          'href',
          this.onDisplayPlanSelection(org?.get('id'), org.get('displayName')),
        );
        this.disableSubmit();
      } else {
        this.renderBoardVisChooser();
      }

      this.renderCustomFieldsWarning(org);
    });
  }

  isBoardCreationRestricted(org) {
    if (
      org.attributes.prefs.boardVisibilityRestrict.org !== 'org' ||
      org.attributes.prefs.boardVisibilityRestrict.private !== 'org' ||
      org.attributes.prefs.boardVisibilityRestrict.public !== 'org'
    ) {
      return true;
    }
    return false;
  }

  loadOrg(orgId) {
    return BluebirdPromise.try(() => {
      if (orgId) {
        const org = this.modelCache.get('Organization', orgId);
        // we are checking for org memberships because they’re sometimes not populated in the ModelCache
        if (
          org != null ||
          (!this.isBoardCreationRestricted(org) && org.memberships)
        ) {
          return org;
        } else {
          return ModelLoader.loadOrganizationMinimal(orgId);
        }
      } else {
        return null;
      }
    });
  }

  renderBoardVisChooser(selectedVis) {
    this.$('.js-permissions').removeClass('hide');
    const orgId = this.$('select[name="org-id"]').val();

    const visData = {
      isNewBoard: true,
      canChange: true,
    };

    this.disableSubmit();

    const localizedParagraph = (key) => `<p>${l(key)}</p>`;
    this.$('.js-vis-display').html(
      localizedParagraph('checking visibility permissions'),
    );

    this.loadOrg(orgId)
      .then((org) => {
        if (org != null) {
          const enterprise = org != null ? org.getEnterprise() : undefined;
          if (!this.canChangeOrg(org, selectedVis)) {
            selectedVis = null;
          }

          _.extend(visData, {
            hasOrg: true,
            orgName: org.get('displayName'),
            hasSuperAdmins: org.hasPremiumFeature('superAdmins'),
            privateRestricted: !this.canChangeOrg(org, 'private'),
            orgRestricted: !this.canChangeOrg(org, 'org'),
            enterpriseRestricted: !this.canChangeOrg(org, 'enterprise'),
            publicRestricted: !this.canChangeOrg(org, 'public'),
            hasEnterprise:
              org != null ? org.belongsToRealEnterprise() : undefined,
            enterpriseName:
              enterprise != null ? enterprise.get('displayName') : undefined,
            isTemplate: this.model.isTemplate(),
            isOrgPremium: org != null ? org.isPremium() : undefined,
          });
        } else if (Auth.me().isPaidManagedEntMember()) {
          const enterprise = Auth.me().getEnterprise();
          if (enterprise) {
            if (!enterprise.canSetTeamlessBoardVisibility(selectedVis)) {
              selectedVis = null;
            }
            _.extend(visData, {
              hasOrg: false,
              hasSuperAdmins: false,
              privateRestricted: !enterprise.canSetTeamlessBoardVisibility(
                'private',
              ),
              orgRestricted: true,
              enterpriseRestricted: true,
              publicRestricted: !enterprise.canSetTeamlessBoardVisibility(
                'public',
              ),
              hasEnterprise: true,
              enterpriseName: enterprise.get('displayName'),
              isTemplate: this.model.isTemplate(),
              isOrgPremium: false,
              isTeamlessOwnedBoard: true,
            });
          }
        }

        const defaultVis =
          org != null && this.canChangeOrg(org, 'org')
            ? this.model.isPrivate() && this.canChangeOrg(org, 'private')
              ? 'private'
              : 'org'
            : visData.isTeamlessOwnedBoard &&
              visData.privateRestricted &&
              !visData.publicRestricted
            ? 'public'
            : 'private';
        visData.current = selectedVis != null ? selectedVis : defaultVis;

        return { org, visData };
      })

      .then(({ org, visData }) => {
        // It's possible that there's no valid permission level for us, in which
        // case we can't create a board at all
        let noValidPrivs = false;
        if (
          visData.privateRestricted &&
          visData.orgRestricted &&
          visData.enterpriseRestricted &&
          visData.publicRestricted
        ) {
          noValidPrivs = true;
          const $noValidPrivs = this.$('.js-no-valid-org-privs');
          if (org != null && org.owned()) {
            $noValidPrivs.html(
              l('board create restriction admin', {
                urlSettings: `/${org.get('name')}/account`,
              }),
            );
          } else if (visData.isTeamlessOwnedBoard) {
            $noValidPrivs.html(l('board create restriction enterprise'));
          } else {
            $noValidPrivs.html(l('board create restriction not admin'));
          }
          $noValidPrivs.removeClass('hide');
          this.$('.js-vis-chooser,.js-vis-display').addClass('hide');
        }

        this.$('.js-vis-chooser').html(boardMenuVisTemplate(visData));

        const previousLevel = this.getPermissionLevel();
        const currentLevel = visData.current;

        // Only show confirmation if changing visibility to public
        if (previousLevel !== currentLevel && currentLevel === 'public') {
          return this.openPublicConfirmation();
        } else {
          this.setPermissionLevel(currentLevel);
          this.renderVisDisplay(currentLevel);
          const isTrimmedInputHasText = this.$('input[id="boardNewTitle"]')
            .val()
            .trim();
          const isCreateButtonEnabled = !this.$('.js-submit').hasClass(
            'disabled',
          );
          if (
            !noValidPrivs &&
            isTrimmedInputHasText &&
            !isCreateButtonEnabled
          ) {
            this.enableSubmit();
          }
        }
      })
      .done();

    return this;
  }

  enableSubmit() {
    return this.$('.js-submit').removeClass('disabled');
  }

  disableSubmit() {
    return this.$('.js-submit').addClass('disabled');
  }

  renderVisDisplay(vis) {
    return this.$('.js-vis-display').html(
      templates.fill(require('app/scripts/views/templates/board_copy_vis'), {
        visIconClass: BoardDisplayHelpers.getPermLevelIconClass(vis),
        visDisplayText: l(['board perms', vis, 'name']),
      }),
    );
  }

  resetVisChooser() {
    this.$('.js-no-valid-org-privs').addClass('hide');
  }

  openPublicConfirmation() {
    this.$('.js-vis-display').addClass('hide');
    return this.$('.js-confirm-public-message').removeClass('hide');
  }

  hidePublicConfirmation() {
    this.$('.js-confirm-public-message').addClass('hide');
    return this.$('.js-vis-display').removeClass('hide');
  }

  confirmPublic() {
    Analytics.sendUpdatedBoardFieldEvent({
      field: 'visibility',
      value: 'public',
      source: 'copyBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x) => x.id),
        },
      },
      attributes: {
        previous: this.model.getPermLevel(),
        change: this.model.getPermLevel() !== 'public',
        isTemplate: this.model.isTemplate(),
      },
    });

    this.setPermissionLevel('public');
    this.renderVisDisplay('public');
    this.hidePublicConfirmation();
    this.enableSubmit();
  }

  cancelPublic() {
    const previousPermissionLevel = this.getPermissionLevel();
    this.renderBoardVisChooser(previousPermissionLevel);
    this.hidePublicConfirmation();

    return Analytics.sendTrackEvent({
      action: 'cancelled',
      actionSubject: 'visibility',
      source: 'copyBoardInlineDialog',
      attributes: {
        visibility: 'public',
      },
    });
  }

  openChangeVis(e) {
    Util.stop(e);
    this.$('.js-vis-display').addClass('hide');
    this.$('.js-vis-chooser').removeClass('hide');
    this.$('.js-confirm-public-message').addClass('hide');
  }

  onBoardNameChange(e) {
    const idOrganization = this.$('select[name="org-id"]').val();

    const isTrimmedInputHasText = $(e.target).val().trim();
    const isCreateButtonEnabled = !this.$('.js-submit').hasClass('disabled');

    if (isTrimmedInputHasText && !isCreateButtonEnabled) {
      this.loadOrg(idOrganization).then((org) => {
        if (org && org.isAtOrOverFreeBoardLimit()) {
          return;
        }

        this.enableSubmit();
      });

      return;
    }

    if (!isTrimmedInputHasText && isCreateButtonEnabled) {
      this.disableSubmit();
    }
  }

  selectVis(e) {
    Util.stop(e);

    const $target = $(e.target).closest('.js-select');
    if ($target.hasClass('disabled')) {
      return;
    }

    this.$('.js-vis-display').removeClass('hide');
    this.$('.js-vis-chooser').addClass('hide');

    const originalVis = this.getPermissionLevel();
    const vis = $target.attr('name');
    this.renderBoardVisChooser(vis);

    Analytics.sendUpdatedBoardFieldEvent({
      field: 'visibility',
      value: vis,
      source: 'copyBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.model.getOrganization(), (x1) => x1.id),
        },
      },
      attributes: {
        previous: originalVis,
        change: originalVis !== vis,
        isTemplate: this.model.isTemplate(),
      },
    });
  }

  setPermissionLevel(permissionLevel) {
    return this.$('input[name="permissionLevel"]').val(permissionLevel);
  }

  getPermissionLevel() {
    let left;
    return (left = this.$('input[name="permissionLevel"]').val()) != null
      ? left
      : '';
  }

  canChangeOrg(org, setting) {
    return org.canSetVisibility(setting);
  }

  allowBoardCopy() {
    this.$('.js-board-limits-upgrade-ad').addClass('hide');
    this.resetVisChooser();
    this.$('.js-vis-display').removeClass('hide');
    this.$('.js-vis-chooser').addClass('hide');
    return this.renderBoardVisChooser();
  }

  // Open Free trial or BC Plan Selection
  onDisplayPlanSelection(orgId, teamName) {
    const container = this.$('.copy-board-upsell-react-component')[0];

    if (!orgId || !container) {
      return;
    }

    renderComponent(
      <CopyBoardFromTemplatePopoverButton orgId={orgId} teamName={teamName} />,
      container,
    );
  }

  changeOrg(e) {
    const orgId = e.target.value;

    Analytics.sendUpdatedBoardFieldEvent({
      field: 'organization',
      source: 'copyBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: orgId,
        },
      }, // new organization
      attributes: {
        previous: __guard__(this.model.getOrganization(), (x) => x.id),
        change:
          __guard__(this.model.getOrganization(), (x1) => x1.id) !== orgId,
        isTemplate: this.model.isTemplate(),
      },
    });

    this.hidePublicConfirmation();

    // personal boards have no restrictions
    if (!orgId) {
      this.allowBoardCopy();
      return;
    }

    // Use the permission check as a loading state when checking
    // the board limit
    const localizedParagraph = (key) => `<p>${l(key)}</p>`;
    this.$('.js-vis-display').html(
      localizedParagraph('checking visibility permissions'),
    );

    // Hide any existing CTAs while we determine if the new ones are necessary
    this.$('.js-board-limits-upgrade-ad').addClass('hide');

    this.disableSubmit();
    return this.loadOrg(orgId).then((org) => {
      // Show the board limits CTA
      if (org != null ? org.isAtOrOverFreeBoardLimit() : undefined) {
        this.$('.js-permissions').addClass('hide');
        this.$('.js-board-limits-upgrade-ad').removeClass('hide');
        this.$('.js-target-team').text(org.get('displayName'));
        this.$('.js-upgrade-link').attr(
          'href',
          this.onDisplayPlanSelection(org?.get('id'), org.get('displayName')),
        );
      } else {
        this.allowBoardCopy();
      }

      this.renderCustomFieldsWarning(org);
    });
  }

  // show a warning that custom fields wont be enabled on the copy if applicable
  renderCustomFieldsWarning(org) {
    const customFieldsWarning = this.$('.js-custom-fields-disabled-warning');
    if (!customFieldsWarning) {
      return;
    }

    if (
      !org?.hasPremiumFeature('paidCorePlugins') &&
      this.model.isCustomFieldsEnabled()
    ) {
      customFieldsWarning.removeClass('hide');
      customFieldsWarning.html(
        format('upgrade-workspace-to-use-custom-fields', {
          name: org.get('name'),
          displayName: org.get('displayName'),
        }),
      );
    } else {
      customFieldsWarning.addClass('hide');
    }
  }

  helperAddOrg(e) {
    Util.stop(e);
    PopOver.pushView({
      view: new NewBoardHelperAddOrgView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'icon',
      actionSubjectId: 'infoIcon',
      source: 'copyBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.getOrganization(), (x1) => x1.id),
        },
      },
      attributes: {
        isTemplate: this.model.isTemplate(),
      },
    });
  }

  defaultBackgroundColor() {
    if (Language.usesEnglish()) {
      const now = new Date();
      const month = now.getMonth();
      const date = now.getDate();

      if (month === 2 && date === 17) {
        // It's March 17th, St. Patricks Day
        return 'green';
      }
    }

    return 'blue';
  }

  submit(e) {
    let left;
    Util.stop(e);

    if (this.$('.js-submit').hasClass('disabled')) {
      return;
    }

    // Figure out the name they want, and abort if it's blank
    const $name = this.$('input[name="name"]');
    const name = $name.val().trim();
    if (name === '') {
      $name.focus().select();
      return;
    }

    const eventSource = this.gasSource || 'copyBoardInlineDialog';
    const taskName = this.model.isTemplate()
      ? 'create-board/template'
      : 'create-board/copy';
    const traceId = Analytics.startTask({
      taskName,
      source: eventSource,
    });
    Analytics.sendClickedButtonEvent({
      buttonName: 'createButton',
      source: this.gasSource || 'copyBoardInlineDialog',
      attributes: {
        isTemplate: this.model.isTemplate(),
        taskId: traceId,
      },
    });

    const idOrganization =
      (left = this.$('select[name="org-id"]').val()) != null ? left : '';

    LastOrganization.set(idOrganization);

    // Data that we'll use in the body of the POST to create the board
    const initialData = {
      name,
      idOrganization,
    };

    const permissionLevel = this.$('input[name="permissionLevel"]').val();

    // Data that we're going to send in the create request; not all of the
    // fields will be board attributes
    let requestData = _.extend(
      {
        prefs_permissionLevel: permissionLevel,
      },
      initialData,
    );

    if (this.model.isTemplate()) {
      requestData = _.extend(
        {
          prefs_isTemplate: false,
        },
        requestData,
      );
    }

    requestData.idBoardSource = this.model.id;
    requestData.keepFromSource = this.$('input:checkbox:checked')
      .map(function () {
        return this.name;
      })
      .get()
      .join();

    Auth.me().boardList.createWithTracing(initialData, {
      modelCache: this.modelCache,
      requestData,
      traceId,
      success: (board) => {
        let currentBoards, needle;
        Alerts.hide('copy-board');
        Alerts.hide('templates');

        Analytics.sendCopiedBoardEvent({
          source: eventSource,
          containers: {
            board: {
              id: board.id,
            },
            organization: {
              id: idOrganization,
            },
          },
          attributes: {
            sourceBoardId: this.model.id,
            fromTemplate: this.model.isTemplate(),
            templateCategory: this.model.get('templateGallery')?.category,
            visibility: board.getPermLevel(),
            isBCFeature: true,
            requiredBC: false,
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName,
          traceId,
          source: eventSource,
        });

        // this fixes an issue with idBoards not being updated at the time that
        // the board gets rendered and the client thinking the member is not on
        // the board
        if (
          ((needle = board.id),
          !Array.from((currentBoards = Auth.me().get('idBoards'))).includes(
            needle,
          ))
        ) {
          Auth.me().set('idBoards', currentBoards.concat(board.id));
        }

        // We have to wait until we the board id back before we can
        // display the board
        Controller.displayBoard({
          idBoard: board.id,
        }).done();
      },
      error: (model, error, xhrResponse) => {
        const textStatus = xhrResponse.responseText;
        if (/ENTERPRISE_OWNED_ENTITY/.test(textStatus)) {
          Analytics.taskAborted({
            taskName,
            traceId,
            source: eventSource,
            error,
          });
          Alerts.hide('copy-board');
          return Alerts.show(
            [
              'unlicensed member cannot copy enterprise board',
              {
                enterpriseName: __guard__(this.model.getEnterprise(), (x) =>
                  x.get('displayName'),
                ),
              },
            ],
            'error',
            'copy-board',
            7000,
          );
        } else if (
          /SOURCE_TEMPLATE_CONTAINS_FORBIDDEN_ENTERPRISE_POWER_UPS/.test(
            textStatus,
          )
        ) {
          Analytics.taskAborted({
            taskName,
            traceId,
            source: eventSource,
            error,
          });
          const powerUpsNames = this.parseTemplateContainsForbiddenPowerUpsError(
            textStatus,
          );

          Alerts.hide('templates');
          return Alerts.show(
            [
              'source template contains forbidden enterprise power ups',
              { powerUps: powerUpsNames },
            ],
            'error',
            'forbiddenPowerUps',
            7000,
          );
        } else {
          Analytics.taskFailed({
            taskName,
            traceId,
            source: eventSource,
            error,
          });

          return Alerts.flash('could not create board', 'error', 'copy-board');
        }
      },
    });

    if (this.model.isTemplate()) {
      Alerts.show('creating-board', 'info', 'templates');
    } else {
      Alerts.show('copying', 'info', 'copy-board');
    }

    return PopOver.hide();
  }

  newOrg(e) {
    Analytics.sendClickedLinkEvent({
      linkName: 'createNewOrgLink',
      source: 'copyBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: __guard__(this.getOrganization(), (x) => x.id),
        },
      },
      attributes: {
        isTemplate: this.model.isTemplate(),
      },
    });

    const createOpts = {};

    if (Auth.me().isPaidManagedEntMember()) {
      createOpts.isEnterprise = true;
    }

    Util.stop(e);
    PopOver.pushView({
      view: new CreateOrgView({
        model: this.model,
        modelCache: this.modelCache,
        createOpts,
        trackingOpts: {
          category: 'board',
          method: 'by clicking create team in copy board menu',
        },
      }),
    });
  }

  parseTemplateContainsForbiddenPowerUpsError(errorStatusText) {
    const { message } = JSON.parse(errorStatusText);
    const forbiddenPowerUpsNames = message.slice(1 + message.indexOf(':'));

    return forbiddenPowerUpsNames.trimLeft();
  }
}

CopyBoardView.initClass();
module.exports = CopyBoardView;
