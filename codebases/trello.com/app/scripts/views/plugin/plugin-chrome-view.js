/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const pluginChromeTemplate = require('app/scripts/views/templates/plugin_chrome');
const pluginChromeHeaderTemplate = require('app/scripts/views/templates/plugin_chrome_header');
const pluginChromeWrapperTemplate = require('app/scripts/views/templates/plugin_chrome_wrapper');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const xtend = require('xtend');

class PluginChromeHeaderView extends PluginView {
  initialize({ pluginChromeView }) {
    this.pluginChromeView = pluginChromeView;
  }

  events() {
    return { 'click a[data-index].plugin-chrome-header-action': 'clickAction' };
  }

  clickAction(e) {
    const index = parseInt(this.$(e.currentTarget).attr('data-index'), 10);
    const action = this.pluginChromeView.content.actions[index];
    action?.callback?.({ el: e.currentTarget });
  }

  render() {
    this.$el.html(pluginChromeHeaderTemplate(this.pluginChromeView.content));
    return this;
  }
}

module.exports = class PluginChromeView extends PluginView {
  initialize({ content }) {
    this.content = content;
    this.retain(this.content);
    return (this.stopResizing = this.stopResizing.bind(this));
  }

  events() {
    return {
      'click .js-close-plugin-chrome': 'clickClose',
      'mousedown .js-resize-board-bar': 'initResize',
    };
  }

  clickClose(e) {
    return typeof this.options.fxClose === 'function'
      ? this.options.fxClose()
      : undefined;
  }

  renderOnce() {
    this.headerView = this.subview(PluginChromeHeaderView, this.model, {
      pluginChromeView: this,
    });
    this.$el.html(
      pluginChromeWrapperTemplate({
        fullscreen: this.content.fullscreen,
        resizable: this.content.resizable,
      }),
    );
    this.$wrapper = this.$('.js-plugin-chrome-content');
    this.appendSubview(this.headerView, this.$wrapper);
    this.$wrapper.append(
      pluginChromeTemplate(
        xtend(this.content, { popoverIsVisible: PopOver.isVisible }),
      ),
    );
    this.initIFrames(this.model);
    return this;
  }

  update(options) {
    options = _.pick(options, 'actions', 'fullscreen', 'accentColor', 'title');
    _.extend(this.content, options);
    if (options.fullscreen) {
      this.$wrapper.addClass('fullscreen');
    } else if (options.fullscreen === false) {
      this.$wrapper.removeClass('fullscreen');
    }
    if (options.actions != null) {
      this.retain(this.content.actions);
    }
    this.headerView.render();
    return this;
  }

  close() {
    if (typeof this.content.callback === 'function') {
      this.content.callback();
    }
    this.isRemoved = true;
    return this.remove();
  }

  initResize() {
    if (!_.isFunction(this.options.fxResize)) {
      return;
    }

    const resize = (e) => {
      const offset = this.$('.js-resize-board-bar').offset().top;
      const delta = offset - e.clientY;
      return typeof this.options.fxResize === 'function'
        ? this.options.fxResize(delta)
        : undefined;
    };

    const stopResizing = (e) => {
      window.removeEventListener('mousemove', resize);
      return window.removeEventListener('mouseup', stopResizing);
    };

    window.addEventListener('mousemove', resize);
    return window.addEventListener('mouseup', stopResizing);
  }
};
