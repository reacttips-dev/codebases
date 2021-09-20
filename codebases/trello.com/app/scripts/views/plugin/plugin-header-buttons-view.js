// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginHeaderButtonsView;
const PluginButtonsView = require('app/scripts/views/plugin/plugin-buttons-view');
const PluginHeaderButtonView = require('app/scripts/views/plugin/plugin-header-button-view');

module.exports = PluginHeaderButtonsView = (function () {
  PluginHeaderButtonsView = class PluginHeaderButtonsView extends (
    PluginButtonsView
  ) {
    static initClass() {
      this.prototype.tagName = 'span';
      this.prototype.className = 'board-header-plugin-btns';
      this.prototype.buttonView = PluginHeaderButtonView;
    }
    runnerOptions() {
      return {
        command: 'board-buttons',
        timeout: 10000,
        board: this.model,
      };
    }
  };
  PluginHeaderButtonsView.initClass();
  return PluginHeaderButtonsView;
})();
