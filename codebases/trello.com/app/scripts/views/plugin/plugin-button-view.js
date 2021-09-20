/* eslint-disable
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
let PluginButtonView;
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');

module.exports = PluginButtonView = (function () {
  PluginButtonView = class PluginButtonView extends PluginView {
    static initClass() {
      this.prototype.events = {
        click(e) {
          Util.stopPropagation(e);
          if (typeof this.trackClick === 'function') {
            this.trackClick(this.pluginButton);
          }
          if (this.pluginButton.callback != null) {
            // find the correct anchor for potential popup
            const el =
              e.target.closest('.button-link') ||
              e.target.closest('.board-header-btn') ||
              e.target.closest('a') ||
              e.target;
            if (this.isPopOverShowing(el)) {
              return PopOver.hide();
            } else {
              return this.pluginButton
                .callback({
                  el,
                })
                .done();
            }
          }
        },
      };
    }
    tagName() {
      if (this.options.pluginButton.url != null) {
        return 'a';
      } else {
        return 'span';
      }
    }

    attributes() {
      const { url, target } = this.options.pluginButton;
      if (url && pluginValidators.isValidUrlForIframe(url)) {
        return {
          href: url,
          target: target ?? url,
          rel: 'noreferrer nofollow noopener',
        };
      }
    }

    initialize({ pluginButton }) {
      this.pluginButton = pluginButton;
      return this.retain(this.pluginButton);
    }

    template() {
      throw Error('no template specified');
    }

    isPopOverShowing(el) {
      return PopOver.contains(el) || PopOver.toggledBy(el);
    }

    renderOnce() {
      this.$el.html(this.template(this.pluginButton));
      return this;
    }
  };
  PluginButtonView.initClass();
  return PluginButtonView;
})();
