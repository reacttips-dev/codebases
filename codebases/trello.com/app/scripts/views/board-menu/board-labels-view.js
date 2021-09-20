// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const LabelsView = require('app/scripts/views/label/labels-view');
const View = require('app/scripts/views/internal/view');

class BoardLabelsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'labels';
  }

  el() {
    const labelsView = this.subview(LabelsView, this.model, {
      board: this.model,
      popOverMethod: 'toggle',
      className: 'board-menu-content-frame',
      selectLabel: (idLabel) => {
        if (this.model.editable()) {
          return labelsView.editLabel(idLabel);
        }
      },
    });
    return labelsView.render().el;
  }
}

BoardLabelsView.initClass();
module.exports = BoardLabelsView;
