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
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { stickerSize } = require('app/scripts/data/sticker-size');
const { MemberState } = require('app/scripts/view-models/member-state');

class StickerSelectionView extends View {
  static initClass() {
    this.prototype.className = 'sticker-select js-draggable-sticker';
  }

  initialize() {
    return this.listenTo(MemberState, {
      'change:useAnimatedStickers': this.render,
    });
  }

  enabled() {
    return (
      !this.model.get('premium') ||
      Auth.me().hasPremiumFeature('additionalStickers') ||
      this.options?.org?.hasPremiumFeature('additionalStickers') ||
      false
    );
  }

  render() {
    const data = this.model.toJSON();
    if (
      this.model.get('isGiphySticker') &&
      !MemberState.getUseAnimatedStickers()
    ) {
      data.url =
        Util.smallestPreviewBiggerThan(data.stillscaled, stickerSize)?.url ??
        data.stillUrl;
    } else {
      data.url =
        Util.smallestPreviewBiggerThan(data.scaled, stickerSize)?.url ??
        data.url;
    }
    data.pending = data.image == null && data.id == null && data.error == null;

    this.$el
      .toggleClass('disabled', !this.enabled())
      .toggleClass('giphy-sticker', !!this.model.get('isGiphySticker'))
      .html(
        templates.fill(
          require('app/scripts/views/templates/sticker_select_item'),
          data,
        ),
      )
      .data('sticker', this.model); // For draggable

    return this;
  }
}

StickerSelectionView.initClass();
module.exports = StickerSelectionView;
