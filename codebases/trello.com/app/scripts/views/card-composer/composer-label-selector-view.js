/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const templates = require('app/scripts/views/internal/templates');
const { Analytics } = require('@trello/atlassian-analytics');

class ComposerLabelSelectorView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'select labels';
    this.prototype.tagName = 'ul';
    this.prototype.className = 'edit-labels-pop-over';

    this.prototype.events = {
      'mouseenter .item': 'hoverLabelSelect',
      'click .card-label': 'addOrRemoveLabel',
    };
  }

  populate(populatedLabelList) {
    this.populatedLabelList = populatedLabelList;
  }

  render() {
    let labels = [];

    const currentLabels = this.model.getLabels();

    const labelList =
      this.populatedLabelList != null
        ? this.populatedLabelList
        : this.model.getBoard().getLabels();

    labels = (() => {
      const result = [];
      for (const label of Array.from(labelList)) {
        const isActive = _.include(currentLabels, label);
        result.push({
          id: label.id,
          color: label.get('color'),
          name: label.get('name'),
          isActive,
        });
      }
      return result;
    })();

    const data = { labels };

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/select_labels'),
        data,
      ),
    );

    Util.selectMenuItem(
      this.$('.edit-labels-pop-over'),
      '.js-select-label',
      this.$('.js-select-label').first(),
    );
    return this;
  }

  hoverLabelSelect(e) {
    return Util.selectMenuItem(
      this.$('.edit-labels-pop-over'),
      '.js-select-label',
      $(e.target).closest('.js-select-label'),
    );
  }

  addOrRemoveLabel(e) {
    Util.stop(e);
    const $label = $(e.target).closest('.js-select-label');
    $label.toggleClass('active');

    const idLabel = $label.attr('data-idlabel');
    if (this.model.toggleLabel(this.modelCache.get('Label', idLabel))) {
      // GAS migration cleanup: this is likely dead code
      // https://bitbucket.org/trello/web/pull-requests/5317/
      Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'label',
        source: 'cardComposerLabelSelectorInlineDialog',
      });
    } else {
      // GAS migration cleanup: this is likely dead code
      // https://bitbucket.org/trello/web/pull-requests/5317/
      Analytics.sendTrackEvent({
        action: 'removed',
        actionSubject: 'label',
        source: 'cardComposerLabelSelectorInlineDialog',
      });
    }
  }
}

ComposerLabelSelectorView.initClass();
module.exports = ComposerLabelSelectorView;
