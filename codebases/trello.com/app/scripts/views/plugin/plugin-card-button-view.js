// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginCardButtonView;
const PluginButtonView = require('app/scripts/views/plugin/plugin-button-view');
const t = require('app/scripts/views/internal/teacup-with-helpers')();
const { IconDefaultColor } = require('@trello/nachos/tokens');
const {
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');

const template = t.renderable(({ icon, text, monochrome }) =>
  t.span(
    '.button-link',
    {
      title: text,
    },
    function () {
      if (icon) {
        t.span({
          class: t.classify({
            'icon-sm': true,
            'plugin-icon': true,
            'mod-reset': monochrome === false,
          }),
          style: t.stylify({
            'background-image': t.urlify(
              t.addRecolorParam(
                icon,
                `?color=${IconDefaultColor.substr(1).toLowerCase()}`,
              ),
            ),
          }),
        });
      }
      return t.span(text);
    },
  ),
);

module.exports = PluginCardButtonView = (function () {
  PluginCardButtonView = class PluginCardButtonView extends PluginButtonView {
    static initClass() {
      this.prototype.className = 'card-plugin-btn';
    }

    render() {
      this.$el.html(template(this.pluginButton));
      return this;
    }

    trackClick(pluginButton) {
      sendPluginUIEvent({
        idPlugin: pluginButton.idPlugin,
        idBoard: this.model.getBoard().id,
        idCard: this.model.id,
        event: {
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'powerUpCardButton',
          source: 'cardDetailScreen',
        },
      });
    }
  };
  PluginCardButtonView.initClass();
  return PluginCardButtonView;
})();
