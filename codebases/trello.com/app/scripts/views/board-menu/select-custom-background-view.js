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
const CustomBackgroundOptionsView = require('app/scripts/views/board-menu/custom-background-options-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { Analytics } = require('@trello/atlassian-analytics');
const templates = require('app/scripts/views/internal/templates');
const _ = require('underscore');
const View = require('app/scripts/views/internal/view');

class SelectCustomBackgroundView extends View {
  static initClass() {
    this.prototype.className = 'board-background-select js-select-background';

    this.prototype.events = {
      'click .js-options': 'openOptions',
      click: 'selectBackground',
    };
  }
  initialize() {
    this.listenTo(this.model, 'change:id', this.render);
    return this.listenTo(this.model, 'change:error', this.render);
  }

  render() {
    const data = this.model.toJSON();
    data.pending = this.getId() == null && data.error == null;

    if (data.color == null) {
      let left;
      data.backgroundImageThumbnail =
        (left = Util.previewBetween(this.model.get('scaled'), 90, 60, 600, 400)
          ?.url) != null
          ? left
          : this.model.get('fullSizeUrl');
    }

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/board_background_selection'),
        data,
      ),
    );

    this.$el.toggleClass('is-still-uploading-background', data.pending);

    return this;
  }

  openOptions(e) {
    Util.stop(e);
    Analytics.sendClickedLinkEvent({
      linkName: 'backgroundOptionsLink',
      source: 'boardMenuDrawerBackgroundScreen',
    });
    return PopOver.toggle({
      elem: this.$('.js-options'),
      view: new CustomBackgroundOptionsView({
        model: this.model,
        modelCache: this.modelCache,
      }),
    });
  }

  getId() {
    return this.model.id;
  }

  selectBackground(e) {
    let left, left1;
    Util.stop(e);
    if (this.getId() == null) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-board/prefs/background',
      source: 'boardMenuDrawerBackgroundScreen',
    });

    const { board } = this.options;
    // Update the local data so we don't have to wait for the server to respond
    _.extend(board.attributes.prefs, {
      backgroundColor: this.model.get('color'),
      backgroundImage: this.model.get('fullSizeUrl'),
      backgroundImageScaled: this.model.get('scaled'),
      backgroundTile: (left = this.model.get('tile')) != null ? left : false,
      backgroundBrightness:
        (left1 = this.model.get('brightness')) != null ? left1 : 'unknown',
    });

    board.setPrefWithTracing('background', this.getId(), {
      taskName: 'edit-board/prefs/background',
      source: 'boardMenuDrawerBackgroundScreen',
      traceId,
      next: (_err, res) => {
        if (res) {
          Analytics.sendUpdatedBoardFieldEvent({
            field: 'background',
            value: this.getId(),
            source: 'boardMenuDrawerBackgroundScreen',
            containers: {
              board: {
                id: board.id,
              },
              organization: {
                id: board.getOrganization()?.id,
              },
            },
            attributes: {
              backgroundType: 'custom',
            },
          });
        }
      },
    });
  }
}

SelectCustomBackgroundView.initClass();
module.exports = SelectCustomBackgroundView;
