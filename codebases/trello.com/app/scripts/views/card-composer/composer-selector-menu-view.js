/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics } = require('@trello/atlassian-analytics');
const CardLabelSelectView = require('app/scripts/views/label/card-label-select-view');
const CardMemberSelectView = require('app/scripts/views/card/card-member-select-view');
const ComposerPosSelectorView = require('app/scripts/views/card-composer/composer-pos-selector-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const selectorMenuTemplate = require('app/scripts/views/templates/popover_selector_menu');

class ComposerSelectorMenuView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'options';

    this.prototype.events = {
      'click .js-mem-selector': 'openMemSelector',
      'click .js-label-selector': 'openLabelSelector',
      'click .js-pos-selector': 'openPosSelector',
    };
  }

  initialize() {
    if (this.sendGASEvent) {
      return Analytics.sendScreenEvent({
        name: 'cardComposerMenuInlineDialog',
        containers: {
          board: {
            id: __guard__(
              this.model != null ? this.model.getBoard() : undefined,
              (x) => x.id,
            ),
          },
          list: {
            id: __guard__(
              __guard__(
                this.model != null ? this.model.attributes : undefined,
                (x2) => x2.list,
              ),
              (x1) => x1.id,
            ),
          },
          organization: {
            id: __guard__(
              __guard__(
                this.model != null ? this.model.getBoard() : undefined,
                (x4) => x4.getOrganization(),
              ),
              (x3) => x3.id,
            ),
          },
        },
      });
    }
  }

  render() {
    this.$el.html(
      selectorMenuTemplate({
        isTemplate: this.model.board.isTemplate(),
      }),
    );

    return this;
  }

  openMemSelector(e) {
    Util.stop(e);
    return PopOver.pushView({
      view: CardMemberSelectView,
      options: { model: this.model, modelCache: this.modelCache },
    });
  }

  openLabelSelector(e) {
    Util.stop(e);
    return PopOver.pushView({
      view: CardLabelSelectView,
      options: {
        model: this.model,
        modelCache: this.modelCache,
        hideOnSelect: false,
      },
    });
  }

  openPosSelector(e) {
    Util.stop(e);
    return PopOver.pushView({
      view: ComposerPosSelectorView,
      options: { model: this.model, modelCache: this.modelCache },
    });
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
ComposerSelectorMenuView.initClass();
module.exports = ComposerSelectorMenuView;
