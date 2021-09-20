// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginModalView;
const PluginChromeView = require('app/scripts/views/plugin/plugin-chrome-view');

module.exports = PluginModalView = (function () {
  PluginModalView = class PluginModalView extends PluginChromeView {
    static initClass() {
      this.prototype.className = 'plugin-modal';
    }
    initialize({ content }) {
      this.content = content;
      return this.retain(this.content);
    }
  };
  PluginModalView.initClass();
  return PluginModalView;
})();
