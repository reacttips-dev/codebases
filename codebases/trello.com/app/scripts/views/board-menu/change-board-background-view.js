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
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const { ModelLoader } = require('app/scripts/db/model-loader');
const SelectCustomBackgroundView = require('app/scripts/views/board-menu/select-custom-background-view');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const { dontUpsell } = require('@trello/browser');
const productPromoDisableOverlay = require('app/scripts/views/templates/product_promo_disable_overlay');
const boardChangeBackground = require('app/scripts/views/templates/board_change_background');
const BoardAddToTeam = require('app/scripts/views/board-menu/board-add-to-team-view');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { FeatureId, NewPill } = require('app/src/components/NewFeature');
const ReactDOM = require('@trello/react-dom-wrapper');
const { featureFlagClient } = require('@trello/feature-flag-client');

class ChangeBoardBackgroundView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'change background';

    this.prototype.className = 'board-menu-content-frame';

    this.prototype.events = {
      'click .js-bg-colors': 'openBackgroundColors',
      'click .js-bg-photos': 'openBackgroundPhotos',
      'change .js-upload-image': 'setUploadImage',
    };
  }

  initialize({ sidebarView }) {
    this.sidebarView = sidebarView;
    super.initialize(...arguments);
    this.makeDebouncedMethods('render', 'renderCustomBackgrounds');

    this.listenTo(
      Auth.me().boardBackgroundList,
      'change add remove reset',
      this.renderCustomBackgroundsDebounced,
    );
    this.listenTo(this.model, 'cancel-add-to-team', () => {
      this.addToTeam = false;
      return this.render();
    });

    if (
      Auth.me().hasPremiumFeature('customBoardBackgrounds') ||
      this.model?.getOrganization()?.hasPremiumFeature('customBoardBackgrounds')
    ) {
      ModelLoader.loadMemberCustomBackgrounds(Auth.myId()).done();
    }
  }

  fillBackgroundList($target, bgs, viewType) {
    if (viewType == null) {
      viewType = SelectCustomBackgroundView;
    }
    $target.find('.js-select-background:not(.js-uploader)').remove();
    this.appendSubviews(
      Array.from(bgs).map((bg) =>
        this.subview(viewType, bg, { board: this.model }),
      ),
      $target,
    );
  }

  render() {
    this.$el.empty();

    const data = this.model.toJSON();
    data.enabled_customBoardBackgrounds =
      Auth.me().hasPremiumFeature('customBoardBackgrounds') ||
      this.model
        ?.getOrganization()
        ?.hasPremiumFeature('customBoardBackgrounds');
    data.idMember = Auth.myId();
    data.upsellEnabled = !dontUpsell();

    if (this.addToTeam) {
      ModelLoader.loadMyOrganizations();

      this.$el.parent().addClass('no-padding');
      this.appendSubview(
        this.subview(BoardAddToTeam, this.model, {
          menuType: 'Change Background',
        }),
      );
    } else {
      this.$el.html(boardChangeBackground(data));

      this.renderCustomBackgrounds();
    }

    this.renderGradientsNewPill();

    return this;
  }

  remove() {
    this.removeGradientsNewPill();
    super.remove(...arguments);
  }

  renderCustomBackgrounds() {
    const hasCustomBoardBackgrounds =
      Auth.me().hasPremiumFeature('customBoardBackgrounds') ||
      this.model
        ?.getOrganization()
        ?.hasPremiumFeature('customBoardBackgrounds');
    const $customList = this.$('.js-custom-list');

    if (!hasCustomBoardBackgrounds) {
      $customList.append(productPromoDisableOverlay());
    } else {
      const me = this.modelCache.get('Member', Auth.myId());
      const customBackgrounds = me.boardBackgroundList
        .chain()
        .filter((background) => background.get('type') === 'custom')
        .sortBy('id')
        .reverse()
        .value();
      this.fillBackgroundList(
        $customList,
        customBackgrounds,
        SelectCustomBackgroundView,
      );

      // Move the uploader to the top
      $customList.find('.js-uploader').prependTo($customList);
    }

    return this;
  }

  uploadBackgroundsAndAddPreviews(files) {
    return Array.from(files).map((file, i) =>
      ((i) => {
        const reader = new FileReader();

        if (!Util.validFileSize(file)) {
          Alerts.flash('file too large', 'error', 'change-board-background');
          return;
        }

        const traceId = Analytics.startTask({
          taskName: 'create-attachment/boardBackground',
          source: 'boardMenuDrawerBackgroundUploadScreen',
        });

        const fd = new FormData();
        fd.append('token', Auth.myToken());
        fd.append('file', file);
        const idOrganization = this.model?.getOrganization()?.id;
        if (idOrganization) {
          fd.append('idOrganization', idOrganization);
        }

        reader.onload = (file) => {
          return this.modelCache
            .get('Member', Auth.myId())
            .boardBackgroundList.createWithTracing(
              {
                type: 'custom',
                fullSizeUrl: file.target.result,
              },
              {
                data: fd,
                processData: false,
                contentType: false,
                traceId,
                error: (model, error) => {
                  Analytics.taskFailed({
                    taskName: 'create-attachment/boardBackground',
                    source: 'boardMenuDrawerBackgroundUploadScreen',
                    traceId,
                    error,
                  });
                  model.set('error', 'Failed');
                  this.setTimeout(() => model.destroy(), 5000);
                },
                success: (bgModel) => {
                  const board = this.model;
                  // Update the local data so we don't have to wait for the server to respond
                  _.extend(board.attributes.prefs, {
                    backgroundColor: bgModel.get('color'),
                    backgroundImage: bgModel.get('fullSizeUrl'),
                    backgroundImageScaled: bgModel.get('scaled'),
                    backgroundTile: bgModel.get('tile'),
                    backgroundBrightness: bgModel.get('brightness'),
                  });

                  return board.setPrefWithTracing('background', bgModel.id, {
                    taskName: 'create-attachment/boardBackground',
                    source: 'boardMenuDrawerBackgroundUploadScreen',
                    traceId,
                    next: (_err, res) => {
                      if (res) {
                        Analytics.sendTrackEvent({
                          action: 'uploaded',
                          actionSubject: 'background',
                          source: 'boardMenuDrawerBackgroundUploadScreen',
                          containers: {
                            board: {
                              id: this.model.id,
                            },
                            organization: {
                              id: this.model?.getOrganization()?.id,
                            },
                          },
                          attributes: {
                            backgroundType: 'custom',
                          },
                        });
                      }
                    },
                  });
                },
              },
            );
        };

        return reader.readAsDataURL(file);
      })(i),
    );
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
      this.uploadBackgroundsAndAddPreviews(files);
    }
  }

  openBackgroundColors(e) {
    Util.stop(e);
    this.sidebarView.pushView('backgroundColors', { component: 'colors' });
  }

  openBackgroundPhotos(e) {
    Util.stop(e);
    this.sidebarView.pushView('backgroundPhotos', { component: 'photos' });
  }

  renderGradientsNewPill() {
    const reactRoot = this.$('.js-gradients-new-lozenge')[0];

    if (
      featureFlagClient.get('aaaa.web.board-bkgd-gradients', false) &&
      reactRoot
    ) {
      renderComponent(
        <NewPill
          featureId={FeatureId.BoardBkgdGradients}
          source="boardMenuDrawerBackgroundScreen"
        />,
        reactRoot,
      );
    }
  }

  removeGradientsNewPill() {
    const reactRoot = this.$('.js-gradients-new-lozenge')[0];
    if (reactRoot) {
      ReactDOM.unmountComponentAtNode(reactRoot);
    }
  }
}

ChangeBoardBackgroundView.initClass();
module.exports = ChangeBoardBackgroundView;
