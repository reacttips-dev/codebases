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
const $ = require('jquery');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const Confirm = require('app/scripts/views/lib/confirm');
const StickerSelectionView = require('app/scripts/views/stickers/sticker-selection-view');
const { Util } = require('app/scripts/lib/util');

module.exports = (function () {
  class CustomStickerSelectionView extends StickerSelectionView {
    static initClass() {
      this.prototype.events = { 'click .js-delete-sticker': 'deleteSticker' };
    }
    initialize() {
      this.toggleSelectable();
      this.waitForId(this.model, () => {
        return this.toggleSelectable();
      });

      return this.listenTo(this.model, 'change:error', this.render);
    }

    enabled() {
      return (
        Auth.me().hasPremiumFeature('customStickers') ||
        this.options?.org?.hasPremiumFeature('customStickers') ||
        false
      );
    }

    toggleSelectable() {
      const selectable = this.model.id != null;
      this.$el.toggleClass('js-draggable-sticker', selectable);
      return this.$el.toggleClass('sticker-unselectable', !selectable);
    }

    deleteSticker(e) {
      Util.stop(e);

      return Confirm.toggle('delete sticker', {
        elem: $(e.target).closest('.js-delete-sticker'),
        top: 32,
        model: this.model,
        confirmBtnClass: 'nch-button nch-button--danger',
        fxConfirm: () => {
          const traceId = Analytics.startTask({
            taskName: 'delete-attachment/sticker',
            source: 'boardMenuDrawerStickersScreen',
          });
          return this.model.destroyWithTracing(
            {
              traceId,
            },
            tracingCallback(
              {
                taskName: 'delete-attachment/sticker',
                traceId,
                source: 'boardMenuDrawerStickersScreen',
              },
              (_err, sticker) => {
                if (sticker) {
                  const org = this.options?.org;
                  Analytics.sendTrackEvent({
                    action: 'deleted',
                    actionSubject: 'stickerAttachment',
                    source: 'boardMenuDrawerStickersScreen',
                    attributes: {
                      taskId: traceId,
                      stickerId: sticker.id,
                    },
                    containers: {
                      organization: { id: org?.id },
                      enterprise: { id: org?.getEnterprise()?.id },
                    },
                  });
                }
              },
            ),
          );
        },
      });
    }
  }
  CustomStickerSelectionView.initClass();
  return CustomStickerSelectionView;
})();
