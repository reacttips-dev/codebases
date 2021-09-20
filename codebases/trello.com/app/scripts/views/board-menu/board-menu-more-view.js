/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const BoardDisplayHelpers = require('app/scripts/views/internal/board-display-helpers');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const Confirm = require('app/scripts/views/lib/confirm');
const SharePopoverView = require('app/scripts/views/board/share-popover-view');
const EditEmailSettingsView = require('app/scripts/views/board-menu/edit-email-settings-view');
const CopyBoardView = require('app/scripts/views/board/copy-board-view');
const ConvertToTemplateView = require('app/scripts/views/board/convert-board-template-view');
const { l } = require('app/scripts/lib/localize');
const boardMenuMore = require('app/scripts/views/templates/board_menu_more');
const { dontUpsell } = require('@trello/browser');
const { ModelLoader } = require('app/scripts/db/model-loader');
const BoardAddToTeam = require('app/scripts/views/board-menu/board-add-to-team-view');
const { featureFlagClient } = require('@trello/feature-flag-client');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  UpgradeSmartComponent,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const {
  UpgradeSmartComponentConnected,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const { QrCodePopover } = require('app/src/components/QrCode');

const TEMPLATES_ALERT_TIMEOUT = 1000;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardMenuMoreView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'more';

    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'click .js-open-collections': 'openCollections',
      'click .js-open-settings': 'openSettings',
      'click .js-open-stickers': 'openStickers',
      'click .js-open-labels': 'openLabels',
      'click .js-open-archive': 'openArchivedItems',
      'click .js-share': 'shareBoard',
      'click .js-email': 'openEmailSettings',
      'click .js-board-subscribe': 'toggleSubscribe',
      'click .js-copy-board': 'copyBoard',
      'click .js-close-board': 'closeConfirm',
      'click .js-leave-board': 'leaveConfirm',
      'click .js-short-url': 'selectUrl',
      'click .js-make-template': 'makeTemplate',
      'click .js-convert-to-board': 'convertToBoard',
      'submit form': 'cancel',
    };
  }

  initialize({ sidebarView }) {
    this.sidebarView = sidebarView;
    this.makeDebouncedMethods('render');

    this.listenTo(this.model, {
      'change:subscribed': this.renderSubscribeState,
      'change:prefs.isTemplate': this.renderDebounced,
      'change:prefs.permissionLevel': this.renderDebounced,
      'change:idOrganization': this.renderDebounced,
      'change:memberships': this.renderDebounced,
    });

    this.listenTo(this.model, 'cancel-add-to-team', () => {
      this.addToTeam = false;
      return this.render();
    });
    this.listenTo(this.model, 'add-to-team', () => {
      if (!this.model.owned()) {
        // We aren't an admin on this board so redirect to business-class page
        return (window.location = '/business-class');
      } else {
        this.addToTeam = true;
        return this.render();
      }
    });
  }

  remove() {
    if (typeof this.unmountCollectionsPromptPill === 'function') {
      this.unmountCollectionsPromptPill();
    }
    if (typeof this.unmountCollectionsPromptFull === 'function') {
      this.unmountCollectionsPromptFull();
    }
    if (typeof this.unmountTemplatesPromptPill === 'function') {
      this.unmountTemplatesPromptPill();
    }
    this.unmountQrCodePopover();
    return super.remove(...arguments);
  }

  render(e) {
    // clears sidebar menu
    let needle;
    this.$el.empty();

    const me = Auth.me();
    const board = this.model;

    const data = this.model.toJSON();
    data.canJoin = this.model.canJoin();
    data.canInviteMembers = this.model.canInviteMembers();
    data.confirmed = me.get('confirmed');
    data.isLoggedIn = me.isLoggedIn();

    const org = this.model.getOrganization();

    const orgId = org ? org.id : undefined;

    data.canCloseBoard =
      this.model.owned() ||
      ((org?.hasPremiumFeature('superAdmins') || false) &&
        (org != null ? org.owned() : undefined));

    data.editableByMember = this.model.editableByMember(me);
    data.canLeaveBoard =
      (this.model.isMemberObserver(me) || this.model.editableByMember(me)) &&
      me.getMembershipData(this.model).canRemove;
    data.canCloseOrLeave = data.canLeaveBoard || data.canCloseBoard;

    data.pLevelClass = BoardDisplayHelpers.getPermLevelIconClassForBoard(
      this.model,
    );
    data.pLevelAltText = BoardDisplayHelpers.getPermLevelAltTextForBoard(
      this.model,
    );
    data.helperText = l([
      'board perms',
      this.model.getPermLevel(),
      'short summary',
    ]);

    const collectionsEnabled =
      org != null ? org.isFeatureEnabled('tags') : undefined;
    data.showCollections =
      this.model.hasOrganization() && (collectionsEnabled || !dontUpsell());

    data.hasMultipleMembers =
      __guard__(this.model.get('memberships'), (x) => x.length) > 1;
    data.isAtOrOverFreeBoardLimit = __guard__(
      this.model.getOrganization(),
      (x1) => x1.isAtOrOverFreeBoardLimit(),
    );
    data.isOrgBcOrEnt = !!(
      org?.isBusinessClass() || org?.belongsToRealEnterprise()
    );
    data.isAdmin = this.model.ownedByMember(me);

    data.isTemplate = this.model.isTemplate();
    data.canBeTemplate =
      this.model.getPermLevel() === 'public' || data.isOrgBcOrEnt;
    data.showTemplateUpgrade =
      this.model.hasOrganization() && data.isAdmin && !dontUpsell();

    // Don't allow guests on enterprise owned boards to copy them
    const isGuest = this.model.isGuest(me);
    const isPublicTemplate = this.model.isPublic() && this.model.isTemplate();
    const isNonMember = !this.model.isMember(me) && !this.model.canJoin();
    const isManagedEntMember =
      this.model.get('idEnterprise') &&
      me.isManagedEntMemberOf(this.model.get('idEnterprise'));
    const isStandardOrg = !!org?.isStandard();
    const isUpgradeDisabledForRole = isStandardOrg && !data.isAdmin;

    // Guests on Enterprise boards cannot copy them unless they are owned by the enterprise
    if (board.get('enterpriseOwned') && isGuest && !isManagedEntMember) {
      data.canCopyBoard = false;
      // If the board is self-joinable and has a permissionLevel of
      // `org` or `enterprise` visible, assume that they can copy the
      // board since they've gotten this far in loading the UI
      // NOTE: this is a temporary fix which can be removed when
      // org-joinable boards has shipped
    } else if (
      this.model.allowsSelfJoin() &&
      ((needle = this.model.getPref('permissionLevel')),
      ['org', 'enterprise'].includes(needle))
    ) {
      data.canCopyBoard = true;
      // Non-members viewing a public Enterprise board cannot copy it unless it is also a template
    } else if (
      board.get('enterpriseOwned') &&
      isNonMember &&
      !isManagedEntMember &&
      !isPublicTemplate
    ) {
      data.canCopyBoard = false;
    } else {
      // Allow copy in all other circumstances
      data.canCopyBoard = true;
    }

    if (this.addToTeam) {
      this.renderAddToTeam();
    } else {
      this.$el.html(boardMenuMore(data));

      if (org?.isMember(me)) {
        const collectionUpgradePillRoot = this.$el.find(
          '.js-board-menu-pill-collections-upgrade',
        )[0];

        if (collectionUpgradePillRoot && !isUpgradeDisabledForRole) {
          this.unmountcollectionsPromptPill = () => {
            ReactDOM.unmountComponentAtNode(collectionUpgradePillRoot);
          };

          renderComponent(
            <UpgradeSmartComponentConnected
              orgId={orgId}
              promptId="boardMenuMoreCollectionsPromptPill"
            />,
            collectionUpgradePillRoot,
          );
        }

        const target = this.$el.find('.js-board-menu-prompt-collections')[0];
        if (target) {
          renderComponent(
            <UpgradeSmartComponent
              orgId={orgId}
              promptId="boardMenuMoreCollectionsPromptFull"
            />,
            target,
          );
        }

        const templatesPromptPillRoot = this.$el.find(
          '.js-board-menu-pill-templates-upgrade',
        )[0];

        if (templatesPromptPillRoot) {
          this.unmountTemplatesPromptPill = () =>
            ReactDOM.unmountComponentAtNode(templatesPromptPillRoot);

          renderComponent(
            <UpgradeSmartComponentConnected
              orgId={orgId}
              promptId="boardMenuMoreTemplatesPromptPill"
            />,
            templatesPromptPillRoot,
          );
        }
      }

      this.renderSubscribeState();
    }

    if (featureFlagClient.get('aaaa.qr-codes', false)) {
      const shortUrl = this.model.get('shortUrl');
      this.mountQrCodePopover(shortUrl);
    }

    return this;
  }

  renderAddToTeam() {
    ModelLoader.loadMyOrganizations();

    return this.appendSubview(
      this.subview(BoardAddToTeam, this.model, {
        menuType: 'More',
      }),
    );
  }

  renderSubscribeState() {
    this.$('.js-subscribed-state').toggleClass(
      'hide',
      !this.model.get('subscribed'),
    );
  }

  openCollections(e) {
    Util.stop(e);

    this.sidebarView.pushView('collections');
  }

  openSettings(e) {
    Util.stop(e);
    this.sidebarView.pushView('settings');
  }

  openLabels(e) {
    Util.stop(e);
    this.sidebarView.pushView('labels');
  }

  openStickers(e) {
    Util.stop(e);
    this.sidebarView.pushView('stickers');
  }

  openArchivedItems(e) {
    Util.stop(e);
    this.sidebarView.pushView('archive');
  }

  shareBoard(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: this.$(e.target).closest('.js-share'),
      view: new SharePopoverView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });
  }

  openEmailSettings(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: this.$(e.target).closest('.js-email'),
      view: new EditEmailSettingsView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });
  }

  copyBoard(e) {
    Util.stop(e);

    if (!$(e.target).hasClass('disabled')) {
      this.sidebarView.sendClickedDrawerNavItemEvent('more', 'copyBoard');

      PopOver.toggle({
        elem: this.$(e.target).closest('.js-copy-board'),
        view: new CopyBoardView({
          model: this.model,
          modelCache: this.modelCache,
        }),
      });
    }
  }

  toggleSubscribe(e) {
    Util.preventDefault(e);

    if (!$(e.target).hasClass('disabled')) {
      const traceId = Analytics.startTask({
        taskName: 'edit-board/subscribed',
        source: 'boardMenuDrawerMoreScreen',
      });
      this.model.subscribeWithTracing(!this.model.get('subscribed'), {
        taskName: 'edit-board/subscribed',
        source: 'boardMenuDrawerMoreScreen',
        traceId,
        next: (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: this.model.get('subscribed')
                ? 'subscribed'
                : 'unsubscribed',
              actionSubject: 'board',
              source: 'boardMenuDrawerMoreScreen',
              containers: {
                board: {
                  id: this.model.id,
                },
              },
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      });
      this.sidebarView.sendClickedDrawerNavItemEvent('more', 'watch', {
        watchEnabled: this.model.get('subscribed'),
      });
    }
  }

  closeConfirm(e) {
    Util.stop(e);

    this.sidebarView.sendClickedDrawerNavItemEvent('more', 'closeBoard');

    Confirm.toggle('close board', {
      elem: $(e.target).closest('a'),
      model: this.model,
      confirmBtnClass: 'nch-button nch-button--danger',
      templateData: {
        boardsPageUrl: `/${Auth.me().get('username')}/boards`,
      },
      fxConfirm: (e) => {
        const traceId = Analytics.startTask({
          taskName: 'edit-board/closed',
          source: 'boardMenuDrawerMoreScreen',
        });

        this.model.close(
          { traceId },
          tracingCallback(
            {
              taskName: 'edit-board/closed',
              source: 'boardMenuDrawerMoreScreen',
              traceId,
            },
            (err, success) => {
              if (success) {
                Analytics.sendTrackEvent({
                  action: 'closed',
                  actionSubject: 'board',
                  source: 'boardMenuDrawerMoreScreen',
                  containers: {
                    board: {
                      id: this.model.id,
                    },
                  },
                  attributes: {
                    taskId: traceId,
                  },
                });
              }
            },
          ),
        );
      },
    });
  }

  leaveConfirm(e) {
    Util.stop(e);
    this.sidebarView.sendClickedDrawerNavItemEvent('more', 'leaveBoard');

    const me = Auth.me();
    const key = me.removeMembershipConfirmationKey(this.model);

    Confirm.toggle(key, {
      elem: $(e.target).closest('a'),
      confirmBtnClass: 'nch-button nch-button--danger',
      fxConfirm: (e) => {
        const traceId = Analytics.startTask({
          taskName: 'edit-board/members/remove',
          source: 'boardMenuDrawerMoreScreen',
        });

        return this.model.removeMemberWithTracing(
          me,
          traceId,
          tracingCallback(
            {
              taskName: 'edit-board/members/remove',
              source: 'boardMenuDrawerMoreScreen',
              traceId,
            },
            (error, response) => {
              if (response) {
                Analytics.sendTrackEvent({
                  action: 'left',
                  actionSubject: 'board',
                  source: 'boardMenuDrawerMoreScreen',
                  containers: {
                    board: {
                      id: this.model.board,
                    },
                  },
                  attributes: {
                    taskId: traceId,
                  },
                });
              }
            },
          ),
        );
      },
    });
  }

  selectUrl(e) {
    return this.$('.js-short-url').focus().select();
  }

  cancel(e) {
    Util.stop(e);
    return false;
  }

  makeTemplate(e) {
    Util.stop(e);

    this.sidebarView.sendClickedDrawerNavItemEvent(
      'more',
      'makeTemplateFromBoard',
    );

    if (!$(e.target).hasClass('disabled')) {
      return PopOver.toggle({
        elem: this.$(e.target).closest('.js-make-template'),
        view: new ConvertToTemplateView({
          model: this.model,
          modelCache: this.modelCache,
        }),
      });
    }
  }

  convertToBoard() {
    Alerts.show('converting', 'info', 'templates', TEMPLATES_ALERT_TIMEOUT);
    const traceId = Analytics.startTask({
      taskName: 'edit-board/prefs/isTemplate',
      source: 'boardMenuDrawerMoreScreen',
    });
    this.model
      .setPrefWithTracing('isTemplate', false, {
        taskName: 'edit-board/prefs/isTemplate',
        source: 'boardMenuDrawerMoreScreen',
        traceId,
        next: (err, board) => {
          if (board) {
            Analytics.sendUpdatedBoardFieldEvent({
              field: 'prefs/isTemplate',
              source: 'boardMenuDrawerMoreScreen',
              containers: {
                board: {
                  id: this.model.id,
                },
                organization: {
                  id: this.model?.getOrganization()?.id,
                },
              },
            });
          }
        },
      })
      .save();

    return this.sidebarView.sendClickedDrawerNavItemEvent(
      'more',
      'convertToBoard',
    );
  }

  mountQrCodePopover(url) {
    const qrCodePopoverRoot = this.$el.find('.js-qr-code')[0];
    if (qrCodePopoverRoot) {
      renderComponent(
        <QrCodePopover url={url} type="board" />,
        qrCodePopoverRoot,
      );
    }
  }

  unmountQrCodePopover() {
    const qrCodePopoverRoot = this.$el.find('.js-qr-code')[0];
    if (qrCodePopoverRoot) {
      ReactDOM.unmountComponentAtNode(qrCodePopoverRoot);
    }
  }
}

BoardMenuMoreView.initClass();
module.exports = BoardMenuMoreView;
