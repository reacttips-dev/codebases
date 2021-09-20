/* eslint-disable
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
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { ActionList } = require('app/scripts/models/collections/action-list');
const CustomFieldsButtonView = require('app/scripts/views/custom-field/custom-fields-button-view');
const ActionListView = require('app/scripts/views/action/action-list-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const { Backgrounds } = require('app/scripts/data/backgrounds');
const BoardSidebarPowerUpSlotsView = require('app/scripts/views/board-menu/board-sidebar-power-up-slots-view');
const { TrelloStorage } = require('@trello/storage');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const boardMenuTemplate = require('app/scripts/views/templates/board_menu_default');
const pluginsChangedSignal = require('app/scripts/views/internal/plugins/plugins-changed-signal');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { localizeCount } = require('app/scripts/lib/localize-count');
const { asNumber } = require('@trello/i18n/formatters');
const ViewWithActions = require('app/scripts/views/internal/view-with-actions');
const {
  latestPowerUpsMessage,
} = require('app/scripts/data/latest-power-ups-message');
const {
  UpgradeSmartComponentConnected,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const { Controller } = require('app/scripts/controller');
const { LazyCustomFieldsButton } = require('app/src/components/CustomFields');
const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class BoardSidebarDefaultView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'menu';

    this.prototype.viewIcon = 'member';

    this.prototype.className = 'board-menu-content-frame';

    this.prototype.headerDisplayTypeClass = 'is-board-menu-default-view';

    this.prototype.events = {
      'click .js-about-this-board': 'openAboutThisBoard',
      'click .js-change-background': 'changeBackground',
      'click .js-open-power-ups'(e) {
        Analytics.sendClickedLinkEvent({
          linkName: 'boardMenuPowerUpLink',
          attributes: {
            boardId: this.model.id,
            organizationId: this.model.get('idOrganization'),
          },
          source: 'boardMenuDrawer',
        });
        return this.showPowerUps(e);
      },
      'click .js-open-stickers': 'openStickers',
      'click .js-open-card-filter': 'showCardFilter',
      'click .js-open-activity': 'openActivity',
      'click .js-open-more': 'openMore',
      'click .js-power-up-empty-slot': 'showPowerUps',
      'click .js-enterprise-upsell-dismiss': 'enterpriseUpsellDismiss',
      'click .js-enterprise-upsell-learn-more': 'enterpriseUpsellLearnMore',
      'click .js-open-butler': 'openButler',
      'click .js-board-custom-fields-old': 'openEditFieldsMenu',
    };
  }

  initialize({ sidebarView }) {
    this.sidebarView = sidebarView;
    this.numActionsToShow = 15;

    this.makeDebouncedMethods('render', 'renderMembers');

    this.listenTo(this.model, {
      'change:datePluginDisable': this.renderPowerUpDisableTimer,
      'change:prefs.permissionLevel': this.renderDebounced,
      'change:prefs.isTemplate': this.renderDebounced,
      'change:powerUps': this.renderEnabledPowerUpCount,
      'change:desc': this.renderAboutThisBoardSummary,
      'change:memberships': this.renderAboutThisBoardSummary,
      'change:idOrganization': () => {
        this.renderButlerButton();
        return this.renderEnabledPowerUpCount();
      },
    });

    this.listenTo(Auth.me().organizationList, 'change', () => {
      return this.renderDebounced();
    });

    this.listenTo(this.model.boardPluginList, {
      'add remove reset': (e) => {
        this.renderEnabledPowerUpCount();
        return this.renderButlerButton();
      },
    });

    this.subscribe(pluginsChangedSignal(this.model), () => {
      return this.renderEnabledPowerUpCount();
    });

    this.actionListView = this.collectionSubview(
      ActionListView,
      new ActionList([], { modelCache: this.modelCache }),
      {
        renderOpts: {
          limit: this.numActionsToShow,
          context: this.model,
          compact: true,
          truncateComments: (action) => {
            return action.get('date') < this.model.get('dateLastView');
          },
          excludeTypes: ['copyCommentCard'],
          source: 'boardMenuDrawerDefaultScreen',
        },
      },
    );

    this.waitForId(this.model, () => {
      this.listenTo(
        this.modelCache,
        `add:Action:${this.model.id} remove:Action:${this.model.id} change:Action:${this.model.id}`,
        this.frameDebounce(() => {
          this.renderActionCount();
          return this.actionListView.collection.reset(this.getActions());
        }),
      );

      return this.actionListView.collection.reset(this.getActions());
    });

    this.enterpriseUpsellsEnabled =
      this.model.canUpsellToEnterprise() &&
      featureFlagClient.get('enterprise.up_sells', false);
  }

  renderAboutThisBoardSummary() {
    const canEditDesc = this.model.isMember(Auth.me());
    const hasDesc = this.model.get('desc').length > 0;
    this.$('.board-menu-about-this-board-summary').toggleClass(
      'hide',
      hasDesc || !canEditDesc,
    );

    return this;
  }

  render() {
    const me = Auth.me();

    const data = {
      editable: this.model.editable(),
      hasPaidOrgPowerUps: me.hasPaidOrgPowerUps(),
      hasGoldPowerUps: me.isFeatureEnabled('threePlugins'),
      isTemplate: this.model.isTemplate(),
      showEnterpriseUpsell: this.enterpriseUpsellsEnabled,
      isCustomFieldsCore: this.model.isCustomFieldsCore(),
      isCustomFieldsPluginEnabled: this.model.isPluginEnabled(CUSTOM_FIELDS_ID),
    };

    this.$el.html(boardMenuTemplate(data));

    if (this.enterpriseUpsellsEnabled) {
      const idOrganization = this.model.get('idOrganization');
      Analytics.sendScreenEvent({
        name: 'boardMenuDrawerEnterpriseUpsellInlineDialog',
        containers: {
          organization: {
            id: idOrganization,
          },
        },
      });
    }

    if (this.$('.js-menu-action-list').length) {
      this.actionListView.setElement(this.$('.js-menu-action-list')[0]);
      this.renderActions();
      this.renderActionCount();
    }

    this.renderEnabledPowerUpCount();
    this.renderBackgroundPreview();
    this.renderPowerUpDisableTimer();
    if (!featureFlagClient.get('ecosystem.pup-header-cleanup', false)) {
      this.renderPowerUpSlots();
    }
    this.renderAboutThisBoardSummary();
    this.renderButlerButton();
    this.renderBoardCustomFields();
    this.renderBoardCustomFieldsPill();
    this.renderBoardCustomFieldsPrompt();

    return this;
  }

  renderBackgroundPreview() {
    let backgroundColor, backgroundImageUrl;
    const $preview = this.$('.js-fill-background-preview').css({
      'background-image': '',
      'background-color': '',
    });

    if (
      __guard__(Backgrounds[this.model.getPref('background')], (x) => x.tile) !=
      null
    ) {
      backgroundImageUrl = this.model.getPref('backgroundImage');
    } else if (
      this.model.getPref('backgroundImageScaled') != null ||
      this.model.getPref('backgroundImage') != null
    ) {
      let left, left1;
      backgroundImageUrl =
        (left =
          (left1 = __guard__(
            Util.previewBetween(
              this.model.getPref('backgroundImageScaled'),
              90,
              60,
              600,
              400,
            ),
            (x1) => x1.url,
          )) != null
            ? left1
            : this.model.get('fullSizeUrl')) != null
          ? left
          : this.model.getPref('backgroundImage');
    } else if (this.model.getPref('backgroundColor') != null) {
      backgroundColor = this.model.getClientBackgroundColor(
        this.model.getPref('background'),
      );
    } else {
      backgroundColor = this.model.getClientBackgroundColor('blue');
    }

    $preview.css({
      'background-image': backgroundImageUrl
        ? `url(${backgroundImageUrl})`
        : '',
      'background-color': backgroundColor,
    });

    return this;
  }

  getDateLastViewedActionsStorageKey() {
    if (this.model.id) {
      return `timeLastViewedActions-${this.model.id}`;
    } else {
      return null;
    }
  }

  setDateLastViewedActions(date) {
    let key;
    if ((key = this.getDateLastViewedActionsStorageKey()) != null) {
      TrelloStorage.set(key, date.toISOString());
    }
  }

  setDateLastViewedActionsAsNow() {
    this.setDateLastViewedActions(new Date());
  }

  getDateLastViewedActions() {
    let key;
    if ((key = this.getDateLastViewedActionsStorageKey()) != null) {
      let isoString;
      if ((isoString = TrelloStorage.get(key)) != null) {
        return new Date(isoString);
      }
    }
    return null;
  }

  renderActionCount() {
    if (!this.$('.js-unread-activity-count').length) {
      return;
    }

    this.$('.js-unread-activity-count').empty();

    let dateSince = this.getDateLastViewedActions();
    const maxNumber = 50;

    if (dateSince == null) {
      dateSince = new Date();
      this.setDateLastViewedActions(dateSince);
    }

    const isCountable = (action) => {
      const isNew = new Date(action.get('date')) > dateSince;
      const isNotMe = action.get('idMemberCreator') !== Auth.me().id;
      return isNew && isNotMe;
    };

    let count = 0;
    for (const action of Array.from(this.model.getActions())) {
      if (isCountable(action)) {
        count++;
      }
    }

    // we show some comments on the top view which we consider viewed.
    // don't set the actions as viewed if it's 0, because…
    //   1. renderActionCount could have been called before actions were
    //   returned, and we don't want to erroneously set the time and ruin the
    //   count.
    //   2. it's not doing anything anyway
    if (0 < count && count <= this.numActionsToShow) {
      this.setDateLastViewedActionsAsNow();
    }

    let countText = count;
    if (count >= maxNumber) {
      countText = `${maxNumber}+`;
    }

    if (count > this.numActionsToShow) {
      this.$('.js-unread-activity-count').text(countText);
    }

    const data = {
      count: countText,
      hasCount: count > this.numActionsToShow,
    };

    this.$('.js-fill-activity-button')
      .empty()
      .append(
        templates.fill(
          require('app/scripts/views/templates/board_menu_more_activity_button'),
          data,
        ),
      );

    return this;
  }

  renderPowerUpDisableTimer() {
    const daysRemaining = this.model.daysUntilPluginsDisable();
    if (daysRemaining !== null) {
      return this.$('.js-power-up-disable-timer')
        .removeClass('hide')
        .text(localizeCount('days remaining', daysRemaining));
    } else {
      return this.$('.js-power-up-disable-timer').addClass('hide');
    }
  }

  getEnabledPowerUpCount() {
    // There is a situation where this.model.get('powerUps') returns undefined. This probably shouldn't happen and the
    // root cause is not known, but for now we'll act defensively by returning '0' in this case.
    return (
      (this.model.get('powerUps') ? this.model.get('powerUps').length : 0) +
      this.model.powerUpsCount()
    );
  }

  renderButlerButton() {
    return this.$('.js-butler-button').toggleClass(
      'hide',
      !this.model.isButlerCore(),
    );
  }

  renderEnabledPowerUpCount() {
    // Show the new banner for the "one power-up for all teams launch"
    const me = Auth.me();
    const showNew =
      me && latestPowerUpsMessage && !me.isDismissed(latestPowerUpsMessage);

    if (showNew) {
      this.$('.js-enabled-power-up-count').text('');
      this.$('.js-power-up-new').removeClass('hide');
    } else {
      this.$('.js-power-up-new').addClass('hide');

      const count = this.getEnabledPowerUpCount();
      if (count > 0) {
        this.$('.js-enabled-power-up-count').text(asNumber(count));
      } else {
        this.$('.js-enabled-power-up-count').text('');
      }
    }
    return this;
  }

  renderActions() {
    this.actionListView.render();
    return this;
  }

  showPowerUps(e) {
    Util.stop(e);
    const me = Auth.me();
    if (me && latestPowerUpsMessage && !me.isDismissed(latestPowerUpsMessage)) {
      me.dismiss(latestPowerUpsMessage);
    }

    const boardView = this.sidebarView.getBoardView();
    boardView.toggleDirectory();

    if (!this.model.canEnableAdditionalPowerUps()) {
      Analytics.sendTrackEvent({
        action: 'exceeded',
        actionSubject: 'powerUpLimit',
        source: 'inBoardPowerUpDirectory',
        containers: {
          board: {
            id: this.model.id,
          },
          organization: {
            id: this.model?.get('idOrganization'),
          },
          enterprise: {
            id: this.model?.get('idEnterprise'),
          },
        },
        attributes: {
          fromBoardMenu: true,
          fromCard: false,
        },
      });
    }

    if (!boardView.directoryView) {
      const isEmptySlot = this.$(e.target).hasClass('js-power-up-empty-slot');
      if (isEmptySlot) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'emptyPowerUpSlotButton',
          source: 'boardMenuDrawerDefaultScreen',
          containers: {
            board: {
              id: this.model.id,
            },
          },
        });
      } else {
        this.sidebarView.sendClickedDrawerNavItemEvent(
          'default',
          'powerUpDirectory',
        );
      }
    }
  }

  showCardFilter(e) {
    Util.stop(e);
    this.sidebarView.pushView('filter');
  }

  openEditFieldsMenu(e) {
    Util.stop(e);

    PopOver.toggle({
      elem: this.$('.js-board-custom-fields-old'),
      view: CustomFieldsButtonView,
      options: {
        board: this.model,
      },
    });
  }

  renderBoardCustomFieldsPill(e) {
    const customFieldsPillReactRoot = this.$(
      '.js-board-menu-pill-custom-fields-upgrade',
    )[0];
    if (customFieldsPillReactRoot) {
      renderComponent(
        <UpgradeSmartComponentConnected
          orgId={this.model.get('idOrganization')}
          promptId="boardMenuMainCustomFieldsPromptPill"
        />,
        customFieldsPillReactRoot,
      );
    }
  }

  renderBoardCustomFieldsPrompt(e) {
    const customFieldsPromptReactRoot = this.$(
      '.js-board-menu-prompt-custom-fields',
    )[0];
    if (customFieldsPromptReactRoot) {
      renderComponent(
        <UpgradeSmartComponentConnected
          orgId={this.model.get('idOrganization')}
          promptId="boardMenuMainCustomFieldsPromptFull"
        />,
        customFieldsPromptReactRoot,
      );
    }
  }

  renderBoardCustomFields(e) {
    const customFieldsReactRoot = this.$('.js-board-custom-fields')[0];
    if (customFieldsReactRoot) {
      renderComponent(
        React.createElement(LazyCustomFieldsButton, {
          isBoardButton: true,
          idBoard: this.model.id,
          idOrganization: this.model.get('idOrganization'),
          idEnterprise: this.model.get('idEnterprise'),
        }),
        customFieldsReactRoot,
      );
    }
    return this;
  }

  openStickers(e) {
    Util.stop(e);
    this.sidebarView.pushView('stickers');
  }

  openAboutThisBoard(e) {
    Util.stop(e);
    this.sidebarView.pushView('about');
  }

  changeBackground(e) {
    Util.stop(e);
    this.sidebarView.pushView('background');
  }

  openActivity(e) {
    Util.stop(e);
    this.sidebarView.pushView('activity');
    this.setDateLastViewedActionsAsNow();
  }

  openMore(e) {
    Util.stop(e);
    this.sidebarView.pushView('more');
  }

  remove() {
    if (typeof this.unmountBCPrompt === 'function') {
      this.unmountBCPrompt();
    }
    this.setDateLastViewedActionsAsNow();
    return super.remove(...arguments);
  }

  renderPowerUpSlots() {
    const $powerUpSlotsContainer = this.$('.js-power-up-slots-container');
    const subview = this.subview(BoardSidebarPowerUpSlotsView, this.model);
    return this.appendSubview(subview, $powerUpSlotsContainer);
  }

  enterpriseUpsellDismiss() {
    const idOrganization = this.model.get('idOrganization');
    Auth.me().dismiss('enterprise-upsell-board-sidebar');
    Analytics.sendDismissedComponentEvent({
      componentType: 'inlineDialog',
      componentName: 'boardMenuDrawerEnterpriseUpsellInlineDialog',
      containers: {
        organization: {
          id: idOrganization,
        },
      },
    });
    return this.$('.enterprise-up-sell.on-board').remove();
  }

  enterpriseUpsellLearnMore() {
    const idOrganization = this.model.get('idOrganization');
    const orgType = this.model?.getOrganization()?.isBusinessClass()
      ? 'bc'
      : this.model?.getOrganization()?.isStandard()
      ? 'standard'
      : 'free';
    Analytics.sendClickedLinkEvent({
      linkName: 'learnMoreLink',
      source: 'boardMenuDrawerEnterpriseUpsellInlineDialog',
      containers: {
        organization: {
          id: idOrganization,
          type: orgType,
        },
      },
    });
    return window.open(
      `/enterprise?app_source=board_sidebar&org_id=${idOrganization}&org_type=${orgType}`,
    );
  }

  openButler(e) {
    return Controller.getCurrentBoardView().toggleButlerView(this.model.id);
  }
}
BoardSidebarDefaultView.initClass();

_.extend(BoardSidebarDefaultView.prototype, ViewWithActions);

module.exports = BoardSidebarDefaultView;
