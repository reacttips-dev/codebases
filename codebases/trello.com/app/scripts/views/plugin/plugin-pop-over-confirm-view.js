// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginPopOverConfirmView;
const _ = require('underscore');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_popover',
);

const template = t.renderable(function ({
  message,
  confirmText,
  confirmStyle,
  cancelText,
}) {
  t.p(() => t.text(message));

  t.input('.js-confirm.full', {
    type: 'submit',
    class:
      confirmStyle === 'danger'
        ? 'nch-button nch-button--danger'
        : 'nch-button nch-button--primary',
    value: confirmText,
  });

  if (cancelText) {
    return t.input('.js-cancel.full', {
      type: 'submit',
      value: cancelText,
    });
  }
});

module.exports = PluginPopOverConfirmView = (function () {
  PluginPopOverConfirmView = class PluginPopOverConfirmView extends PluginView {
    static initClass() {
      this.prototype.keepInDOM = true;
    }
    initialize({ title, content }) {
      this.title = title;
      this.content = content;
      return this.retain(this.content);
    }

    getViewTitle() {
      return this.title;
    }

    events() {
      return {
        'click a[href]'(e) {
          return PopOver.hide();
        },
        'click .js-confirm': (e) => {
          if (_.isFunction(this.content.onConfirm)) {
            return this.content
              .onConfirm({ el: e.currentTarget })
              .catch((err) =>
                typeof console !== 'undefined' && console !== null
                  ? console.warn(
                      `Error running Power-Up onConfirm function: ${err.message}`,
                    )
                  : undefined,
              );
          } else {
            return PopOver.popView();
          }
        },
        'click .js-cancel'(e) {
          if (_.isFunction(this.content.onCancel)) {
            return this.content
              .onCancel({ el: e.currentTarget })
              .catch((err) =>
                typeof console !== 'undefined' && console !== null
                  ? console.warn(
                      `Error running Power-Up onCancel function: ${err.message}`,
                    )
                  : undefined,
              );
          } else {
            return PopOver.popView();
          }
        },
      };
    }

    renderOnce() {
      this.$el.html(template(this.content));

      return this;
    }
  };
  PluginPopOverConfirmView.initClass();
  return PluginPopOverConfirmView;
})();
