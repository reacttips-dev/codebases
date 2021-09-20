/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const Promise = require('bluebird');
const React = require('react');
const { Auth } = require('app/scripts/db/auth');
const PluginCardButtonsView = require('app/scripts/views/plugin/plugin-card-buttons-view');
const CustomFieldCardDetailBadgesView = require('app/scripts/views/custom-field/custom-field-card-detail-badges-view');
const {
  sendPluginScreenEvent,
  sendPluginUIEvent,
  sendPluginViewedComponentEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const PluginCardDetailBadgesView = require('app/scripts/views/plugin/plugin-card-detail-badges-view');
const StickerView = require('app/scripts/views/stickers/sticker-view');
const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');
const CARD_AGING_POWER_UP_ID = LegacyPowerUps.cardAging;
const { Dates } = require('app/scripts/lib/dates');
const Confirm = require('app/scripts/views/lib/confirm');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const PluginSuggestionPopOver = require('app/scripts/views/plugin/plugin-suggestion-pop-over');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginCardBackSectionView = require('app/scripts/views/plugin/plugin-card-back-section-view');
const { Util } = require('app/scripts/lib/util');
const CustomFieldsButtonView = require('app/scripts/views/custom-field/custom-fields-button-view');
const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;
const MAP_POWER_UP_ID = require('@trello/config').mapPowerUpId;
const SetCardLocationPopoverView = require('app/scripts/views/map/set-card-location-popover-view');
const CardLocationView = require('app/scripts/views/map/card-location-view');
const CardAgingPopoverView = require('app/scripts/views/card-aging/card-aging-popover-view');
const { ButlerCardButtons } = require('app/src/components/Butler');
const { renderComponent } = require('app/src/components/ComponentWrapper');

module.exports.renderPluginButtons = function () {
  const subview = this.subview(PluginCardButtonsView, this.model);
  this.appendSubview(subview, this.$('.js-plugin-buttons'));
  return this;
};

module.exports.renderButlerCardButtons = function () {
  const reactRoot = this.$('.js-butler-card-buttons')[0];
  if (reactRoot) {
    const board = this.model.getBoard();
    const memberId = Auth.myId();
    const isMember = board.memberList.some((m) => m.id === memberId);

    renderComponent(
      <ButlerCardButtons
        idCard={this.model.id}
        idBoard={board.id}
        idOrganization={board.get('idOrganization')}
        isDisabled={!isMember}
      />,
      reactRoot,
    );
  }
  return this;
};

module.exports.renderCustomFieldBadges = function () {
  const subview = this.subview(CustomFieldCardDetailBadgesView, this.model, {
    sendPluginScreenEvent,
    sendPluginUIEvent,
  });
  this.appendSubview(subview, this.$('.js-custom-field-detail-badges'));
  // only show the section if the Custom Fields Power-Up is enabled and there
  // are some fields defined on the board
  const board = this.model.getBoard();
  let hideSection =
    !board.isCustomFieldsEnabled() || board.customFieldList.length === 0;
  if (!hideSection && !this.model.editable()) {
    // hide the section if no custom field item on this card has a value
    hideSection = _.every(this.model.customFieldItemList.models, (cfi) =>
      cfi.isEmpty(),
    );
  }
  this.$('.js-custom-fields-section').toggleClass('hide', hideSection);
  return this;
};

module.exports.renderPluginBadges = function () {
  const subview = this.subview(PluginCardDetailBadgesView, this.model);
  this.appendSubview(subview, this.$('.js-plugin-badges'));
  return this;
};

module.exports.renderStickers = function () {
  const $stickers = this.$('.js-display-stickers').empty();
  const stickers = this.model.stickerList.models;
  const hasStickers = stickers.length > 0;
  const canRemove = this.model.editable();

  if (hasStickers) {
    const subviews = Array.from(stickers).map((sticker) =>
      this.subview(StickerView, sticker, { board: this.model, canRemove }),
    );
    this.appendSubviews(subviews, $stickers);
  }

  this.checkShowCover();

  return this;
};

module.exports.renderAging = function () {
  const board = this.model.getBoard();
  const agingActive = board.isPowerUpEnabled('cardAging');
  const isEvergreen = this.model.getPluginDataByKey(
    CARD_AGING_POWER_UP_ID,
    'shared',
    'evergreen',
    false,
  );

  const $badge = this.$('.js-card-detail-age-badge').removeClass(
    this.model.getAllAgingClasses(),
  );

  if (agingActive) {
    const data = this.model.getAgingData();

    $badge
      // if date data isn't removed, Dates.formatDate will think nothing changed
      // and won't update.
      .removeData('date')
      .attr('dt', this.model.get('dateLastActivity'));

    if (data.mode === 'pirate' && !isEvergreen) {
      $badge.addClass(data.agingClassesToAdd);
    }

    Dates.update(this.$('.js-card-detail-age'));
  }

  this.$('.js-card-detail-age').toggleClass('hide', !agingActive);

  return this;
};

module.exports.dismissPluginSuggestionSection = function (target, idPlugin) {
  Confirm.toggle('dismiss plugin suggestion section', {
    elem: target,
    confirmBtnClass: 'nch-button nch-button--primary',
    fxConfirm: () => {
      const board = this.model.getBoard();
      // store the dismissal in the users private board pluginData
      board.setPluginDataByKey(idPlugin, 'private', 'dismissedSection', true);
      this.renderAttachmentsDebounced();
      // make sure we know about the plugin before generating the event
      return board.getAvailablePlugins().then(() => {
        return sendPluginUIEvent({
          idPlugin,
          idBoard: board.id,
          idCard: this.model.id,
          event: {
            action: 'clicked',
            actionSubject: 'button',
            actionSubjectId: 'dismissPluginSuggestionButton',
            source: 'pluginSuggestionSection',
          },
        });
      });
    },
  });
};

module.exports.enableSuggestedPluginPrompt = function (target, plugin) {
  PopOver.toggle({
    elem: target,
    view: new PluginSuggestionPopOver({
      model: plugin,
      card: this.model,
      board: this.model.getBoard(),
    }),
    autoPosition: true,
    getViewTitle: () => plugin.get('name'),
  });

  sendPluginUIEvent({
    idPlugin: plugin.id,
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    event: {
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'enablePluginSuggestionButton',
      source: 'pluginSuggestionSection',
    },
  });
};

module.exports.renderPluginSections = function () {
  if (this._renderPluginSectionsPromise != null) {
    this._renderPluginSectionsPromise.cancel();
  }

  this._renderPluginSectionsPromise = Promise.try(() => {
    return PluginRunner.all({
      timeout: 5000,
      command: 'card-back-section',
      card: this.model,
      board: this.model.getBoard(),
      list: this.model.getList(),
    });
  })
    .cancellable()
    .then((pluginCardBackSections) => {
      const subviews = _.chain(pluginCardBackSections)
        .filter((section) => pluginValidators.isValidCardBackSection(section))
        .uniq((p) => p.idPlugin)
        .map((section) => {
          const subviewId = `card-back-section_${section.content.url}_${section.idPlugin}`;
          const subview = this.subview(
            PluginCardBackSectionView,
            this.model,
            {},
            subviewId,
          );
          subview.updateSection(section);
          return subview;
        })
        .compact()
        .value();

      const idPlugins = _.chain(pluginCardBackSections)
        .pluck('idPlugin')
        .uniq()
        .value();
      for (const idPlugin of Array.from(idPlugins)) {
        sendPluginViewedComponentEvent({
          idPlugin: idPlugin,
          idBoard: this.model.getBoard().id,
          idCard: this.model.id,
          event: {
            componentType: 'section',
            componentName: 'cardPupSection',
            source: 'cardDetailScreen',
          },
        });
      }

      const $pluginSections = this.$('.js-plugin-card-back-sections');
      return this.ensureSubviews(subviews, $pluginSections);
    })
    .catch(Promise.CancellationError, function () {});

  this._renderPluginSectionsPromise.done();
  return this;
};

module.exports.editFieldsSidebar = function (e) {
  Util.preventDefault(e);

  PopOver.toggle({
    elem: this.$('.js-edit-fields'),
    view: CustomFieldsButtonView,
    options: {
      model: this.model,
      modelCache: this.modelCache,
      board: this.model.getBoard(),
    },
  });

  sendPluginUIEvent({
    idPlugin: CUSTOM_FIELDS_ID,
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    event: {
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'customFieldsButton',
      source: 'cardDetailScreen',
    },
  });
  sendPluginScreenEvent({
    idPlugin: CUSTOM_FIELDS_ID,
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    screenName: 'customFieldsInlineDialog',
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });
  return false;
};

module.exports.editLocationSidebar = function (e) {
  Util.preventDefault(e);

  sendPluginUIEvent({
    idPlugin: MAP_POWER_UP_ID,
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    event: {
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'locationButton',
      source: 'cardDetailScreen',
    },
  });
  sendPluginScreenEvent({
    idPlugin: MAP_POWER_UP_ID,
    idBoard: this.model.getBoard().id,
    idList: this.model.getList().id,
    idCard: this.model.id,
    screenName: 'locationInlineDialog',
  });

  PopOver.toggle({
    elem: this.$('.js-edit-location'),
    view: SetCardLocationPopoverView,
    options: {
      model: this.model,
      modelCache: this.modelCache,
      trackingMethod: 'by clicking on the location button',
    },
  });

  return false;
};

module.exports.renderLocation = function () {
  const isEnabled = this.model.getBoard().isMapPowerUpEnabled();

  const hideSection = !isEnabled || this.model.get('coordinates') == null;
  this.$('.js-location-section').toggleClass('hide', hideSection);

  if (isEnabled && this.model.get('coordinates') != null) {
    if (this.cardLocationSubview == null) {
      this.cardLocationSubview = this.subview(CardLocationView, this.model);
    }
    this.appendSubview(this.cardLocationSubview, this.$('.js-card-location'));
  } else if (this.cardLocationSubview) {
    this.cardLocationSubview.remove();
    this.cardLocationSubview = null;
  }

  return this;
};

module.exports.cardAgingSidebar = function (e) {
  Util.preventDefault(e);
  PopOver.toggle({
    elem: this.$('.js-card-aging-card-button'),
    view: new CardAgingPopoverView({ model: this.model }),
  });

  sendPluginUIEvent({
    idPlugin: CARD_AGING_POWER_UP_ID,
    idBoard: this.model.getBoard().id,
    idCard: this.model.id,
    event: {
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'powerUpCardButton',
      source: 'cardDetailScreen',
    },
  });
  return false;
};
