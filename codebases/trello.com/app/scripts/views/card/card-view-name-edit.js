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
const {
  getSeparatorClassName,
} = require('app/scripts/views/card/SeparatorCard/SeparatorCard');
const cardTitleTemplate = require('app/scripts/views/templates/card_title_on_card_front');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const QuickCardEditorView = require('app/scripts/views/card/quick-card-editor-view');
const { track } = require('@trello/analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');

module.exports.renderName = function () {
  const data = this.model.toJSON();

  if (!featureFlagClient.get('wildcard.card-types-separator', false))
    data.separatorClassName = getSeparatorClassName(data.name);

  const html = cardTitleTemplate(data);

  this.$('.js-card-name').html(html);

  return this;
};

module.exports.openQuickCardEditor = function (e) {
  if (this.options.quickEditHidden || !this.model.editable()) {
    return;
  }

  Util.stop(e);
  PopOver.hide();
  QuickCardEditorView.open(this);
  track(
    'Card Front',
    'Open Quick Card Editor',
    undefined,
    this.model.trackProperty(),
  );

  return this;
};
