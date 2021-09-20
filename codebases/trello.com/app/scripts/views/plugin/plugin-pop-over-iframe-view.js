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
let PluginPopOverIFrameView;
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const { sandboxParams } = require('app/scripts/data/plugin-iframe-sandbox');
const t = require('app/scripts/views/internal/teacup-with-helpers')();

const template = t.renderable(function (content) {
  if (content == null) {
    content = {};
  }
  const { url, height } = content;
  t.iframe('.plugin-iframe', {
    allow: 'microphone; camera',
    sandbox: sandboxParams,
    src: url,
    style: height ? `height:${height}px;` : undefined,
  });
});

module.exports = PluginPopOverIFrameView = (function () {
  PluginPopOverIFrameView = class PluginPopOverIFrameView extends PluginView {
    static initClass() {
      this.prototype.keepInDOM = true;

      this.prototype.vigor = this.VIGOR.NONE;
    }
    initialize({ title, content, callback }) {
      this.title = title;
      this.content = content;
      this.onDone = callback;
      return this.retain(this.onDone);
    }

    getViewTitle() {
      return this.title;
    }

    renderOnce() {
      this.$el.html(template(this.content));

      this.initIFrames(this.model);

      return this;
    }

    handleIFrameMessage(iframe, message) {
      switch (message) {
        case 'done':
          if (this.onDone != null) {
            return this.onDone({ el: iframe });
          } else {
            PopOver.hide();
            return;
          }
      }
    }
  };
  PluginPopOverIFrameView.initClass();
  return PluginPopOverIFrameView;
})();
