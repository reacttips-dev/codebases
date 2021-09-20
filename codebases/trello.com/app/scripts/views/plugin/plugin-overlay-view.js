/* eslint-disable
    default-case,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginOverlayView;
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { sandboxParams } = require('app/scripts/data/plugin-iframe-sandbox');
const t = require('app/scripts/views/internal/teacup-with-helpers')();

const template = t.renderable(function (param) {
  if (param == null) {
    param = {};
  }
  const { content } = param;
  switch (content.type) {
    case 'iframe':
      t.iframe('.plugin-iframe', {
        allow: 'microphone; camera',
        sandbox: sandboxParams,
        src: content.url,
      });
      t.div('.plugin-iframe-popover-overlay');
      break;
  }
});

module.exports = PluginOverlayView = (function () {
  PluginOverlayView = class PluginOverlayView extends PluginView {
    static initClass() {
      this.prototype.className = 'plugin-overlay js-plugin-iframe-container';
    }
    initialize({ content }) {
      this.content = content;
      return this.retain(this.content);
    }

    renderOnce() {
      this.$el.html(template({ content: this.content }));
      this.initIFrames(this.model);
      return this;
    }
  };
  PluginOverlayView.initClass();
  return PluginOverlayView;
})();
