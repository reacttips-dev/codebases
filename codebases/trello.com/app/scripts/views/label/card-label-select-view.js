/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const LabelsView = require('app/scripts/views/label/labels-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');

class CardLabelSelectView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'labels';
  }

  el() {
    this.labelsView = this.subview(LabelsView, this.model, {
      board: this.model.getBoard(),
      selectLabel: this.toggleLabel.bind(this),
      renderOn: [
        { source: this.model.labelList, events: 'add remove reset change' },
        { source: this.model, events: 'change:labels, change:idLabels' },
      ],
      popOverMethod: 'pushView',
      searchInit: this.options.searchInit,
    });

    return this.labelsView.render().el;
  }

  toggleLabel(idLabel, fromSuggestion) {
    this.model.toggleLabel(this.modelCache.get('Label', idLabel));
    if (this.options.hideOnSelect) {
      PopOver.popView();
    }
  }
}

CardLabelSelectView.initClass();
module.exports = CardLabelSelectView;
