/* eslint-disable
    @typescript-eslint/no-unused-vars,
    default-case,
    eqeqeq,
    no-shadow,
*/

let PluginViewView;
const Hearsay = require('hearsay');
const Promise = require('bluebird');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { sandboxParams } = require('app/scripts/data/plugin-iframe-sandbox');
const t = require('app/scripts/views/internal/teacup-with-helpers')();

const template = t.renderable(function ({ content }) {
  t.iframe('.plugin-iframe', {
    allow: 'microphone; camera',
    sandbox: sandboxParams,
    src: content.url,
  });
  t.div('.plugin-iframe-popover-overlay');
});

module.exports = PluginViewView = (function () {
  PluginViewView = class PluginViewView extends PluginView {
    static initClass() {
      this.prototype.className = 'plugin-view js-plugin-iframe-container';
    }
    initialize({ content }) {
      this.content = content;

      this.filterSlot = new Hearsay.Slot(null);

      this.listenTo(this.model.filter, 'change', () => {
        this.filterSlot.set(new Date());
      });

      return this.retain(this.content);
    }

    renderOnce() {
      this.$el.html(template({ content: this.content }));
      this.initIFrames(this.model, undefined, this.filterSlot);
      return this;
    }
  };
  PluginViewView.initClass();
  return PluginViewView;
})();
