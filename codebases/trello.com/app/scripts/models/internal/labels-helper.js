/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

// Mixing-in classes must implement a labelCreateUrl method and have a
// labelList property that the mixin can access.
module.exports.LabelsHelper = {
  getLabels() {
    return this.labelList.models;
  },

  dataForLabel(label) {
    return _.extend(label.toJSON(), { isActive: this.hasLabel(label) });
  },

  toggleLabelColor(color) {
    const label = this.getBoard().labelForColor(color);
    if (label != null) {
      return this.toggleLabel(label);
    }
  },

  hasLabel(label) {
    return this.labelList.contains(label);
  },

  toggleLabel(label, toggleOn) {
    if (toggleOn == null) {
      toggleOn = !this.hasLabel(label);
    }

    if (typeof this.recordAction === 'function') {
      this.recordAction({
        type: toggleOn ? 'add-label' : 'remove-label',
        idLabel: label.id,
      });
    }

    return this.toggle('idLabels', label.id, toggleOn);
  },

  createLabel(name, color, traceId, onFail, onAbort, onSuccess) {
    const label = _.find(
      this.getBoard().getLabels(),
      (label) => label.get('name') === name && label.get('color') === color,
    );
    if (label) {
      if (!this.hasLabel(label)) {
        this.toggleLabel(label);
      }

      onAbort(new Error('Label already exists'));
      return;
    }

    this.labelList.createWithTracing(
      { name, color: color != null ? color : '', idBoard: this.get('idBoard') },
      {
        url: this.labelCreateUrl(),
        traceId,
        error: (model, err) => {
          onFail(err);
        },
        success: () => {
          onSuccess();
        },
      },
    );
  },
};
