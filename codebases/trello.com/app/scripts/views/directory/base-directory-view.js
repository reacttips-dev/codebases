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
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  ReactRootComponent,
} = require('app/scripts/views/internal/react-root-component');
const View = require('app/scripts/views/internal/view');

module.exports = class BaseDirectoryView extends View {
  initialize() {
    return this.$reactRoot ?? (this.$reactRoot = $('<div></div>'));
  }

  renderContent() {
    throw new Error('BaseDirectoryView renderContent method is not defined.');
  }

  getReactRoot() {
    return <ReactRootComponent>{this.renderContent()}</ReactRootComponent>;
  }

  render() {
    this.$el.append(this.$reactRoot);
    ReactDOM.render(this.getReactRoot(), this.$reactRoot[0]);
    return this;
  }
};
