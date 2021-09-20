// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const CardLabelSelectView = require('app/scripts/views/label/card-label-select-view');
const { Analytics } = require('@trello/atlassian-analytics');
const { Label } = require('app/scripts/models/label');
const labelTemplate = require('app/scripts/views/templates/label');
const cardDetailAddButtonTemplate = require('app/scripts/views/templates/card_detail_add_button');

module.exports.openLabelsPopOver = function (elem, options) {
  PopOver.toggle({
    elem,
    view: CardLabelSelectView,
    options: _.extend(
      { model: this.model, modelCache: this.modelCache },
      options,
    ),
  });
};

module.exports.editLabelsMainSingleLabel = function (e) {
  Util.stop(e);
  this.openLabelsPopOver(this.$(e.target).closest('.card-label'));
  Analytics.sendClickedButtonEvent({
    buttonName: 'labelsButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      type: 'label',
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });
};

module.exports.editLabelsMain = function (e) {
  Util.stop(e);
  this.openLabelsPopOver(this.$('.js-details-edit-labels'));
  Analytics.sendClickedButtonEvent({
    buttonName: 'labelsButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      type: 'badge',
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });
};

module.exports.editLabelsSidebar = function (e) {
  Util.stop(e);
  Analytics.sendClickedButtonEvent({
    buttonName: 'labelsButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      type: 'sidebar',
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });

  return this._openEditLabelsSidebar();
};

module.exports.renderLabels = function () {
  const activeLabels = this.model.getLabels().sort(Label.compare);

  const $labels = this.$('.js-card-detail-labels-list').empty();

  const labelsHtml = (() => {
    const result = [];
    for (const label of Array.from(activeLabels)) {
      const data = this.model.dataForLabel(label);
      data.extraClasses = ['mod-card-detail'];
      if (this.model.editable()) {
        data.extraClasses.push('mod-clickable');
      }
      result.push(labelTemplate(data));
    }
    return result;
  })();

  $labels.append(labelsHtml);

  if (this.model.editable()) {
    $labels
      .append(cardDetailAddButtonTemplate({ klass: 'js-details-edit-labels' }))
      .addClass('js-edit-label');
  }

  this.$('.js-card-detail-labels').toggleClass(
    'hide',
    activeLabels.length === 0,
  );

  return this;
};

module.exports._openEditLabelsSidebar = function (options) {
  return this.openLabelsPopOver(this.$('.js-edit-labels'), options);
};
