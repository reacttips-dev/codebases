/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let _ = require('underscore');
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const CustomStickerSelectionView = require('app/scripts/views/stickers/custom-sticker-selection-view');
const DragSort = require('app/scripts/views/lib/drag-sort');
const { ModelLoader } = require('app/scripts/db/model-loader');
const BluebirdPromise = require('bluebird');
const { Sticker } = require('app/scripts/models/Sticker');
const { Stickers } = require('app/scripts/data/stickers');
const StickerSelectionView = require('app/scripts/views/stickers/sticker-selection-view');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
_ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { dontUpsell } = require('@trello/browser');
const productPromoDisableOverlay = require('app/scripts/views/templates/product_promo_disable_overlay');
const stickerSelect = require('app/scripts/views/templates/sticker_select');
const {
  getGiphyApi,
  giphyStickersToTrelloStickers,
  mapTrelloLocaleToGiphyLocale,
} = require('@trello/giphy');
const { getKey, Key } = require('@trello/keybindings');
const { MemberState } = require('app/scripts/view-models/member-state');
const Language = require('@trello/locale');
const { isChrome } = require('@trello/browser');

class StickerPickerView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'stickers';
    this.prototype.viewIcon = 'sticker';
    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'keyup .js-search-stickers': 'onQueryChange',
      'change .js-upload-image': 'setUploadImage',
      'change .js-use-animated-stickers': 'onAnimationPreferenceChange',
    };
  }

  initialize() {
    let left;
    this.me = Auth.me();
    const org = (left = this.model.getOrganization()) != null ? left : null;

    if (
      this.me.hasPremiumFeature('additionalStickers') ||
      org?.hasPremiumFeature('additionalStickers') ||
      false
    ) {
      ModelLoader.loadMemberCustomStickers(this.me.id).done();
    }

    this.listenTo(
      this.me.customStickerList,
      'change add remove reset',
      this.renderCustomStickers,
    );

    return (this.searchForStickerDebounced = _.debounce(
      this.searchForSticker,
      1000,
    ));
  }

  render() {
    let left;
    this.$el.empty();
    const org = (left = this.model.getOrganization()) != null ? left : null;
    const data = this.model.toJSON();
    data.additionalStickersEnabled =
      this.me.hasPremiumFeature('additionalStickers') ||
      org?.hasPremiumFeature('additionalStickers') ||
      false;
    data.upsellEnabled = !dontUpsell();
    data.useAnimatedStickers = MemberState.getUseAnimatedStickers();

    this.$el.html(stickerSelect(data));

    this.renderStandardStickers();
    this.renderPremiumStickers();
    this.renderCustomStickers();

    this.defer(() => DragSort.refreshDraggableStickers());

    return this;
  }

  _getStickers(pack) {
    const { premium } = Stickers[pack];
    return Stickers[pack].stickers.map(
      (data) =>
        new Sticker(_.extend({ premium }, data), {
          modelCache: this.modelCache,
        }),
    );
  }

  _loadStickers($stickerList) {
    const loadingClass = 'sticker-list-loading';
    $stickerList.addClass(loadingClass);

    const imgs = $stickerList.find('.sticker-select-image').get();
    const imgLoads = imgs.map(function (img) {
      const $img = $(img);
      return new BluebirdPromise(function (resolve) {
        $img.load(resolve);
        return $img.error(resolve);
      });
    });

    return BluebirdPromise.all(imgLoads)
      .then(() => $stickerList.removeClass(loadingClass))
      .done();
  }

  renderStandardStickers() {
    const $standardStickers = this.$('.js-standard-sticker-list');

    const stickerViews = this._getStickers('standard').map((sticker) => {
      return this.subview(StickerSelectionView, sticker);
    });

    this.appendSubviews(stickerViews, $standardStickers);

    this._loadStickers($standardStickers);

    return this;
  }

  renderPremiumStickers() {
    let left;
    const org = (left = this.model.getOrganization()) != null ? left : null;
    const $parent = this.$('.js-premium-stickers');
    const enabled =
      this.me.hasPremiumFeature('additionalStickers') ||
      org?.hasPremiumFeature('additionalStickers') ||
      false;

    for (const pack in Stickers) {
      const { premium } = Stickers[pack];
      if (premium) {
        const $stickerPack = $(
          templates.fill(
            require('app/scripts/views/templates/sticker_pack_selection_list'),
            { displayName: l(['sticker packs', pack]) },
          ),
        );

        const $stickerPackList = $stickerPack.filter('.js-sticker-list');

        const stickerViews = this._getStickers(pack).map((sticker) => {
          return this.subview(StickerSelectionView, sticker, { org });
        });

        this.appendSubviews(stickerViews, $stickerPackList);

        this._loadStickers($stickerPackList);

        $parent.append($stickerPack);

        if (!enabled) {
          $stickerPackList.append(productPromoDisableOverlay());
        }
      }
    }

    return this;
  }

  renderCustomStickers() {
    let left;
    const org = (left = this.model.getOrganization()) != null ? left : null;
    const $customStickerList = this.$('.js-custom-sticker-list');
    $customStickerList.children().detach();

    const hasCustomStickers =
      this.me.hasPremiumFeature('customStickers') ||
      org?.hasPremiumFeature('customStickers') ||
      false;

    if (hasCustomStickers) {
      const stickerSubviews = this.me.customStickerList.map((sticker) => {
        return this.subview(CustomStickerSelectionView, sticker, { org });
      });
      this.appendSubviews(stickerSubviews, $customStickerList);
    } else {
      $customStickerList.append(productPromoDisableOverlay());
    }
    $customStickerList.append(
      templates.fill(
        require('app/scripts/views/templates/sticker_select_item_upload'),
        { id: this.me.id },
      ),
    );

    this.defer(() => DragSort.refreshDraggableStickers());

    return this;
  }

  setUploadImage(e) {
    Util.stop(e);
    const $file = this.$('.js-upload-image');

    if ($file.prop('files') == null && $file.val()) {
      // Yuck, it's IE.  Let's submit the form.
      Util.uploadFile(Auth.myToken(), $file, function () {});
      return;
    }

    const { files } = $file[0];
    if (files.length > 0) {
      this.uploadStickers(files);
    }
  }

  uploadStickers(files) {
    _.each(files, (file) => {
      const traceId = Analytics.startTask({
        taskName: 'create-attachment/sticker',
        source: 'boardMenuDrawerStickersScreen',
      });

      const reader = new FileReader();

      if (!Util.validFileSize(file)) {
        Analytics.taskAborted({
          taskName: 'create-attachment/sticker',
          traceId,
          source: 'boardMenuDrawerStickersScreen',
          error: new Error('file too large'),
          attributes: {
            fileSize: file.size,
            fileType: file.type,
          },
        });
        Alerts.flash('file too large', 'error', 'sticker-picker');
        return;
      }

      const fd = new FormData();
      fd.append('token', Auth.myToken());
      fd.append('file', file);
      const idOrganization = this.model?.getOrganization()?.id;
      if (idOrganization) {
        fd.append('idOrganization', idOrganization);
      }

      reader.onload = (file) => {
        const url = file.target.result;
        return this.me.customStickerList.createWithTracing(
          { url },
          {
            data: fd,
            processData: false,
            contentType: false,
            traceId,
            error: (model) => {
              model.set('error', 'Failed');
              return this.setTimeout(() => model.destroy(), 5000);
            },
          },
          tracingCallback(
            {
              taskName: 'create-attachment/sticker',
              traceId,
              source: 'boardMenuDrawerStickersScreen',
              attributes: {
                fileSize: file.size,
                fileType: file.type,
              },
            },
            (_err, sticker) => {
              const board = this.model;
              if (sticker && board) {
                Analytics.sendTrackEvent({
                  action: 'uploaded',
                  actionSubject: 'stickerAttachment',
                  source: 'boardMenuDrawerStickersScreen',
                  attributes: {
                    taskId: traceId,
                    fileSize: file.size,
                    fileType: file.type,
                  },
                  containers: {
                    board: { id: board.id },
                    organization: { id: board.getOrganization()?.id },
                    enterprise: { id: board.getEnterprise()?.id },
                  },
                });
              }
            },
          ),
        );
      };

      return reader.readAsDataURL(file);
    });
  }

  onAnimationPreferenceChange(e) {
    Util.stop(e);
    return MemberState.setUseAnimatedStickers(e.target.checked);
  }

  onQueryChange(e) {
    Util.stop(e);

    const key = getKey(e);
    if ([Key.Enter, Key.Escape].includes(key)) {
      return;
    }

    const query = e.target.value;

    if (this.currentQuery !== query) {
      this.showSearchSpinner();
    }

    this.currentQuery = query;
    if (!(query != null ? query.length : undefined)) {
      this.showStaticStickers();
      return;
    }

    return this.searchForStickerDebounced(query);
  }

  searchForSticker(query) {
    if (query != null ? query.length : undefined) {
      return getGiphyApi()
        .search(query, {
          limit: 48,
          rating: 'g',
          lang: mapTrelloLocaleToGiphyLocale(Language.currentLocale),
          type: 'stickers',
        })
        .then((results) => {
          // In case a previous search completes after the latest search.
          if (query === this.currentQuery) {
            const stickers = giphyStickersToTrelloStickers(
              results.data,
              isChrome(),
            );
            return this.renderStickerSearchResults(stickers);
          }
        })
        .catch(() => {
          // For now just say that there are no results.
          return this.renderStickerSearchResults([]);
        });
    }
  }

  renderStickerSearchResults(results) {
    let left;
    this.$('.js-giphy-stickers-no-results').toggleClass(
      'hide',
      results.length !== 0,
    );

    const org = (left = this.model.getOrganization()) != null ? left : null;
    const stickerViews = results.map((data) => {
      const sticker = new Sticker(
        _.extend({ isGiphySticker: true, image: data.url }, data),
        { modelCache: this.modelCache },
      );
      return this.subview(StickerSelectionView, sticker, { org });
    });

    this.ensureSubviews(stickerViews, this.$('.js-search-sticker-list'));

    this.showSearchResults();

    this.defer(() => DragSort.refreshDraggableStickers());

    return this;
  }

  showSearchSpinner() {
    this.hideStaticStickers();
    this.hideSearchResults();
    return this.$('.js-search-spinner').removeClass('hide');
  }

  showStaticStickers() {
    this.hideSearchSpinner();
    this.hideSearchResults();
    return this.$('.js-static-stickers').removeClass('hide');
  }

  showSearchResults() {
    this.hideSearchSpinner();
    this.hideStaticStickers();
    return this.$('.js-giphy-stickers').removeClass('hide');
  }

  hideStaticStickers() {
    return this.$('.js-static-stickers').addClass('hide');
  }

  hideSearchSpinner() {
    return this.$('.js-search-spinner').addClass('hide');
  }

  hideSearchResults() {
    return this.$('.js-giphy-stickers').addClass('hide');
  }
}

StickerPickerView.initClass();
module.exports = StickerPickerView;
