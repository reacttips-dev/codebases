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
const $ = require('jquery');
const _ = require('underscore');

const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');

const { BoardTemplateBadge } = require('app/src/components/BoardTemplateBadge');

module.exports.isTemplate = function () {
  return this.templateFlagEnabled && this.model.isTemplate();
};

module.exports.renderBoardTemplateReactSection = function () {
  $('.js-board-template-badge').append(this.boardTemplateBadgeDiv);
  return ReactDOM.render(
    this.boardTemplateBadgeComponent,
    this.boardTemplateBadgeDiv,
  );
};

module.exports.renderBoardTemplateBadge = function () {
  if (!this.model.isTemplate()) {
    if (this.boardTemplateBadgeDiv) {
      ReactDOM.unmountComponentAtNode(this.boardTemplateBadgeDiv);
      this.boardTemplateBadgeDiv = null;
      this.boardTemplateBadgeComponent = null;
    }
    return;
  }

  const previouslyRendered =
    this.boardTemplateBadgeDiv != null &&
    this.boardTemplateBadgeComponent != null;
  if (!previouslyRendered) {
    // Defer here since the target div that is being rendered by Backbone may
    // not be available yet.
    return _.defer(() => {
      this.boardTemplateBadgeComponent = <BoardTemplateBadge />;
      this.boardTemplateBadgeDiv = document.createElement('div');
      return this.renderBoardTemplateReactSection();
    });
  } else {
    return this.renderBoardTemplateReactSection();
  }
};
