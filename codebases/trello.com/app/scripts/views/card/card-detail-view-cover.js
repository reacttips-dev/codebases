/* eslint-disable
    eqeqeq,
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Util } = require('app/scripts/lib/util');
const AttachmentViewer = require('app/scripts/views/internal/attachment-viewer');
const { Analytics } = require('@trello/atlassian-analytics');
const Browser = require('@trello/browser');
const { makePreviewCachable } = require('@trello/image-previews');
const {
  getPotentialCovers,
} = require('app/src/components/CardCoverChooser/SelectCover');
const {
  toggleCardCoverChooserPopover,
} = require('app/scripts/views/card/card-cover-chooser-popover.tsx');
const { UnsplashTracker } = require('@trello/unsplash');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const PluginModelSerializer = require('app/scripts/views/internal/plugins/plugin-model-serializer');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const pluginCoverWithDefaults = require('app/scripts/lib/plugins/plugin-cover-with-defaults');

module.exports.openCoverInViewer = function (e) {
  Util.stop(e);
  if (!this.showCover()) {
    return;
  }

  const coverModel = this.model.attachmentList.get(
    this.model.get('idAttachmentCover'),
  );
  if (!AttachmentViewer.isActive()) {
    AttachmentViewer.show({
      model: this.model,
      attachmentModel: coverModel,
    });
  }
};

module.exports.showCover = function () {
  return this.model.getBoard().getPref('cardCovers') && this.model.hasCover();
};

module.exports.checkShowCover = function () {
  const hasCover = this.showCover() || this.hasPluginCover;
  const hasStickers = this.model.hasStickers();

  if (hasCover) {
    this.$('.js-card-cover-box')
      .removeClass('hide window-cover-stickers-only')
      .addClass('is-covered')
      .toggleClass('has-attachment-cover', this.model.hasAttachmentCover());
  } else if (hasStickers) {
    this.$('.js-card-cover-box')
      .removeClass('hide is-covered')
      .addClass('window-cover-stickers-only');
  } else {
    this.$('.js-card-cover-box').addClass('hide');
  }

  if (!this.model.getBoard().getPref('cardCovers')) {
    this.$('.window-cover-menu').addClass('hide');
  }
};

module.exports.clearCover = function () {
  const $cardCoverBox = this.$('.js-card-cover-box');
  $cardCoverBox.css({
    'background-color': '',
    'background-image': '',
    height: '',
    'min-height': '',
    padding: '',
  });

  $cardCoverBox.removeClass((index, className) =>
    (className.match(/\bcolor-card-cover-\S+/g) || []).join(' '),
  );

  const btnClasses = [
    'dialog-close-button-light',
    'dialog-close-button-dark',
    'dialog-close-button-indeterminate',
    'dialog-close-button-full-cover',
  ];

  $('.dialog-close-button').removeClass(btnClasses.join(' '));
  this.$('.window-sidebar').find('.js-card-cover-chooser').removeClass('hide');

  if (this.isFullCoverCardBackEnabled()) {
    this.$el.removeClass('is-full-cover');
    $cardCoverBox.find('.js-full-cover-card-detail-title').addClass('hide');
    this.$('.js-card-detail-header').removeClass('hide');
    this.$('.js-card-detail-list').addClass('hide');

    return this.$('.js-card-detail-title-input:visible').trigger(
      'autosize.resize',
      false,
    );
  }
};

module.exports.renderCover = function () {
  this.clearCover();

  const hasCoverMenu = this.model.editable();
  const canHaveCover = this.model.getBoard().getPref('cardCovers');
  const showHeaderCoverChooser = this.showCover() && hasCoverMenu;
  const showSidebarChooser =
    !showHeaderCoverChooser && canHaveCover && hasCoverMenu;

  const applyCover = ({
    url,
    height,
    size,
    edgeColor,
    color,
    brightness,
    position,
    padding,
    isFullCover,
  }) => {
    if (position == null) {
      position = 'center';
    }
    if (padding == null) {
      padding = '0';
    }
    if (brightness == null) {
      brightness = (() => {
        if (edgeColor && edgeColor !== 'transparent') {
          const [r, g, b] = Array.from(
            edgeColor.match(/[0-9a-f]{2}/gi).map((v) => parseInt(v, 16)),
          );

          const avg = (r + g + b) / 3;
          if (avg >= 140) {
            return 'light';
          } else if (avg < 140) {
            return 'dark';
          }
        }
      })();
    }

    const $cardCoverBox = this.$('.js-card-cover-box');
    // This button isn't contained in the view, but we're trying to control the style
    // anyway
    const $closeButton = $('.dialog-close-button');

    $cardCoverBox.removeClass(
      'card-cover-dark card-cover-light color-card-cover',
    );

    $closeButton.removeClass(
      'dialog-close-button-dark dialog-close-button-light dialog-close-button-indeterminate dialog-close-button-full-cover',
    );

    if (color) {
      $cardCoverBox.addClass(`color-card-cover color-card-cover-${color}`);
      position = 'left';
    } else {
      const backgroundColor = edgeColor != null ? edgeColor : 'transparent';
      $cardCoverBox.css('background-color', backgroundColor);
    }

    const btnClass = (() => {
      // For full image covers, use a fixed color for the close button.
      if (isFullCover && url) {
        return 'full-cover';
      }

      switch (brightness) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'light';
        default:
          return 'indeterminate';
      }
    })();

    if (btnClass != null) {
      $closeButton.addClass(`dialog-close-button-${btnClass}`);
      $cardCoverBox.addClass(`card-cover-${brightness}`);
    }

    $cardCoverBox.css({
      'background-image': url ? `url("${url}")` : '',
      height: isFullCover ? 'auto' : height,
      'min-height': height,
      'background-size': size,
      'background-origin': 'content-box',
      padding: padding,
      'box-sizing': 'border-box',
      'background-position': position,
    });

    // TODO: This was previously indented one level deeper. We need to validate that changing the deptch is still correct.
    $cardCoverBox
      .find('.window-cover-menu')
      .toggleClass('hide', !showHeaderCoverChooser);

    $cardCoverBox.toggleClass(
      'js-open-card-cover-in-viewer',
      this.model.hasAttachmentCover(),
    );

    this.$('.window-sidebar')
      .find('.js-card-cover-chooser')
      .toggleClass('hide', !showSidebarChooser);

    if (this.isFullCoverCardBackEnabled()) {
      this.$el.toggleClass('is-full-cover', isFullCover);
      $cardCoverBox
        .find('.js-full-cover-card-detail-title')
        .toggleClass('hide', !isFullCover);
      this.$('.js-card-detail-header').toggleClass('hide', isFullCover);
      this.$('.js-card-detail-list').toggleClass('hide', !isFullCover);

      return this.$('.js-card-detail-title-input:visible').trigger(
        'autosize.resize',
        false,
      );
    }
  };

  if (this.showCover()) {
    const cover = this.model.get('cover');

    const isFullCover =
      cover.size === 'full' && this.isFullCoverCardBackEnabled();

    const { previews, edgeColor, color, brightness } = (
      cover != null ? cover.color : undefined
    )
      ? { color: cover.color, brightness: cover.brightness }
      : (cover != null ? cover.idAttachment : undefined) ||
        (cover != null ? cover.idUploadedBackground : undefined) ||
        (cover != null ? cover.idPlugin : undefined)
      ? {
          previews: cover.scaled,
          edgeColor: cover.edgeColor,
          brightness: isFullCover ? cover.brightness : undefined,
        }
      : {};

    const MIN_HEIGHT = 116;

    const MAX_HEIGHT = 160;
    const MAX_WIDTH = 730;

    if (color != null || previews != null) {
      let coverImgUrl, left, maxHeight, maxWidth;
      this.hasPluginCover = false;
      if (Browser.isHighDPI()) {
        maxWidth = MAX_WIDTH * 2;
        maxHeight = MAX_HEIGHT * 2;
      } else {
        maxWidth = MAX_WIDTH;
        maxHeight = MAX_HEIGHT;
      }

      if (isFullCover) {
        maxHeight = maxHeight * 2;
      }

      // Find the smallest preview that has a height that exceeds the maximum
      // height we'll give to a card cover, and doesn't exceed the width of a
      // card.
      const preview =
        (left = Util.smallestPreviewBetween(
          previews,
          0,
          maxHeight,
          maxWidth,
          Infinity,
        )) != null
          ? left
          : Util.biggestPreview(previews);

      if (color) {
        height = MIN_HEIGHT;
        size = 'initial';
      } else {
        if (preview != null) {
          coverImgUrl = preview.url;
        } else {
          // NOTE: This fallback is unsuitable if we're showing previews for things that
          // aren't image attachments
          coverImgUrl = attachmentCover.get('url');
        }

        height = Math.max(
          MIN_HEIGHT,
          Math.min(
            (preview != null ? preview.height : undefined) != null
              ? preview != null
                ? preview.height
                : undefined
              : MAX_HEIGHT,
            MAX_HEIGHT,
          ),
        );

        if (isFullCover) {
          size = 'cover';
        } else {
          size =
            (preview != null ? preview.height : undefined) < height
              ? 'initial'
              : 'contain';
        }
      }

      // makePreviewCachable has no effect on backgrounds
      applyCover({
        url: makePreviewCachable(coverImgUrl),
        height,
        size,
        edgeColor,
        color,
        brightness,
        isFullCover,
      });

      if (cover != null ? cover.idUploadedBackground : undefined) {
        UnsplashTracker.trackOncePerInterval(cover.sharedSourceUrl);
      }
    }
  } else if (this.model.getBoard().getPref('cardCovers')) {
    PluginRunner.one({
      command: 'card-cover',
      board: this.model.getBoard(),
      card: this.model,
      list: this.model.getList(),
      timeout: 10000,
      options: {
        attachments: PluginModelSerializer.attachments(
          this.model.attachmentList.models,
          ['id', 'name', 'url'],
        ),
        cardDetail: true,
      },
      // normally we wouldn't specify the plugins as the command is enough
      // because we split the card-cover capability into an old version & new
      // we need to only hit the old style ones here
      fxPluginFilter(plugin) {
        return !(plugin.get('tags') || []).includes('plugin-cover-beta');
      },
    })
      .catch(PluginRunner.Error.NotHandled, () => null)
      .then((pluginCover) => {
        if (!pluginValidators.isValidCover(pluginCover, true)) {
          this.hasPluginCover = false;
          return;
        }
        const {
          url,
          height,
          size,
          edgeColor,
          position,
          padding,
        } = pluginCoverWithDefaults(pluginCover);
        this.hasPluginCover = true;
        applyCover({ url, height, size, edgeColor, position, padding });
        return this.checkShowCover();
      })
      .done();
  }

  this.checkShowCover();

  return this;
};

module.exports.cardCoverChooserSidebar = function (e) {
  Util.preventDefault(e);

  toggleCardCoverChooserPopover({
    elem: this.$(e.currentTarget),
    cardId: this.model.id,
    boardId: this.model.get('idBoard'),
  });

  const inHeader =
    this.$(e.currentTarget).closest('.js-card-cover-box').length > 0;

  const attachments = this.model.attachmentList.toJSON();
  const coverAttachmentCount = getPotentialCovers(attachments).length;
  const hasPotentialCovers = coverAttachmentCount > 0 || this.model.hasCover();
  const hasCoversProperty = hasPotentialCovers
    ? 'Has Potential Covers'
    : 'No Covers';

  Analytics.sendClickedButtonEvent({
    buttonName: 'cardCoverButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      inHeader,
      hasCoversProperty,
      coverAttachmentCount,
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });

  return false;
};
