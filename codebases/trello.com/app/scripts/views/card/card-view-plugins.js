/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { MemberState } = require('app/scripts/view-models/member-state');
const { track, trackUe, Noun, Verb } = require('@trello/analytics');
const { stickerClip } = require('app/scripts/lib/util/sticker-clip');
const StickerView = require('app/scripts/views/stickers/sticker-view');
const CustomFieldBadgesView = require('app/scripts/views/custom-field/custom-field-badges-view');
const PluginBadgesView = require('app/scripts/views/plugin/plugin-badges-view');
const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');
const CARD_AGING_POWER_UP_ID = LegacyPowerUps.cardAging;

module.exports.addNewStickerToList = function (sticker, left, top, rotate) {
  const traceId = Analytics.startTask({
    taskName: 'edit-card/stickers',
    source: 'cardView',
    attributes: {
      action: 'added',
    },
  });
  let image = sticker.id != null ? sticker.id : sticker.get('image');
  let imageUrl = sticker.get('url');
  let imageScaled = sticker.get('scaled');
  const isGiphySticker = sticker.get('isGiphySticker');

  if (isGiphySticker) {
    const useAnimatedStickers = MemberState.getUseAnimatedStickers();
    if (!useAnimatedStickers) {
      image = sticker.get('stillUrl');
      imageUrl = sticker.get('stillUrl');
      imageScaled = sticker.get('stillScaled');
    }
    trackUe({
      category: Noun.CARD,
      verb: Verb.ADDS,
      directObj: Noun.GIPHY_STICKER,
      context: {
        useAnimatedStickers,
      },
    });
  }

  track('Card', 'Sticker', image, this.model.trackProperty());

  this.model.stickerList.createWithTracing(
    {
      image,
      left: stickerClip(left),
      top: stickerClip(top),
      rotate,
      zIndex: this.model.stickerList.nextZIndex(),
      imageUrl,
      imageScaled,
      isGiphySticker,
    },
    {
      modelCache: this.modelCache,
      traceId,
    },
    tracingCallback(
      {
        taskName: 'edit-card/stickers',
        traceId,
        source: 'cardView',
        attributes: {
          action: 'added',
        },
      },
      (_err, sticker) => {
        if (sticker) {
          const card = this.model;
          Analytics.sendUpdatedCardFieldEvent({
            field: 'stickers',
            source: 'cardView',
            containers: {
              card: {
                id: card.id,
              },
              board: {
                id: card.get('idBoard'),
              },
              list: {
                id: card.get('idList'),
              },
              organization: {
                id: card.get('idOrg'),
              },
            },
            attributes: {
              taskId: traceId,
              image,
              imageUrl,
              isGiphySticker,
              useAnimatedStickers: MemberState.getUseAnimatedStickers(),
            },
          });
        }
      },
    ),
  );
};

module.exports.showStickers = function () {
  return !this.onCalendar;
};

module.exports.renderStickers = function (e) {
  if (!this.showStickers()) {
    this.$el.removeClass('is-stickered');
    return;
  }

  const $stickersArea = this.$('.js-stickers-area');
  const $stickers = this.$('.js-card-stickers');

  const hasStickers = this.model.hasStickers();
  const editable = this.model.editable();

  if (hasStickers) {
    this.$el.addClass('is-stickered');
    $stickersArea.removeClass('hide');
    const stickerSubViews = this.model.stickerList.map((sticker) => {
      return this.subview(
        StickerView,
        sticker,
        {
          canRemove: editable && sticker.id && !this.options.quickEditHidden,
          fixedHeight: () => {
            return (
              this.$('.js-card-details').get(0).getBoundingClientRect().top -
              $stickersArea.get(0).getBoundingClientRect().top
            );
          },
          // Width of a card, without overlapping the edit control if edit control exists
          fixedWidth: () => {
            const stickerRect = $stickersArea.get(0).getBoundingClientRect();
            const editControl = this.$('.js-card-menu').get(0);
            if (editControl) {
              const editControlRect = editControl.getBoundingClientRect();
              return editControlRect.left - stickerRect.left;
            } else {
              const cardRect = this.$el.get(0).getBoundingClientRect();
              return cardRect.right - stickerRect.left;
            }
          },
          card: this.model,
        },
        sticker.id || sticker.cid,
      );
    });
    this.ensureSubviews(stickerSubViews, $stickers);

    // Make sure that cover especially full covers resize accordingly to stickers.
    this.renderCover();
  } else {
    this.$el.removeClass('is-stickered');
    $stickersArea.addClass('hide');
  }

  return this;
};

module.exports.renderCustomFieldItems = function () {
  const subview = this.subview(CustomFieldBadgesView, this.model);
  this.appendSubview(subview, this.$('.js-custom-field-badges'));
  return this;
};

module.exports.renderPluginBadges = function () {
  const $pluginBadges = this.$('.js-plugin-badges');
  this.ensureSubviews(
    [this.subview(PluginBadgesView, this.model)],
    $pluginBadges,
  );
  return this;
};

module.exports.renderPowerUpEffects = function () {
  const board = this.model.getBoard();

  this.$el.removeClass(this.model.getAllAgingClasses());

  const isEvergreen = this.model.getPluginDataByKey(
    CARD_AGING_POWER_UP_ID,
    'shared',
    'evergreen',
    false,
  );

  if (
    board.isPowerUpEnabled('cardAging') &&
    !this.model.get('closed') &&
    !isEvergreen &&
    !this.model.get('isTemplate')
  ) {
    const data = this.model.getAgingData();
    return this.$el.addClass(data.agingClassesToAdd);
  }
};

module.exports.moveToCalendarDay = function (e, ui, calendarDayView) {
  calendarDayView.getCardView(this.model).delegateEvents();
  const targetDate = new Date(calendarDayView.data.day);
  const traceId = Analytics.startTask({
    taskName: 'edit-card/due',
    source: 'calendarViewScreen',
  });
  this.model.changeDueDateMaintainTime(targetDate, traceId, (err, card) => {
    if (err) {
      throw Analytics.taskFailed({
        taskName: 'edit-card/due',
        traceId,
        source: 'calendarViewScreen',
        error: err,
      });
    } else {
      Analytics.sendUpdatedCardFieldEvent({
        field: 'due',
        source: 'calendarViewScreen',
        containers: {
          card: { id: card.id },
          board: { id: card.idBoard },
          list: { id: card.idList },
        },
        attributes: {
          taskId: traceId,
        },
      });

      Analytics.taskSucceeded({
        taskName: 'edit-card/due',
        traceId,
        source: 'calendarViewScreen',
      });
    }
  });
  calendarDayView.updateHeader();
  return calendarDayView.renderCardsAndListHeaders();
};

module.exports.moveInCalendarDay = function (e, ui, calendarDayView) {
  calendarDayView.getCardView(this.model).delegateEvents();
  return calendarDayView.renderCardsAndListHeaders();
};

module.exports.renderDueComplete = function () {
  this.$el.toggleClass('is-due-complete', this.model.get('dueComplete'));
  return this.updateDueDate();
};
