/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PluginHeaderButtonView;
const _ = require('underscore');
const PluginButtonView = require('app/scripts/views/plugin/plugin-button-view');
const t = require('app/scripts/views/internal/teacup-with-helpers')();
const {
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');

const template = t.renderable(function ({ icon, text, monochrome }) {
  const lightBrightness =
    this.model.get('prefs').backgroundBrightness === 'light';
  const coloredIcon = (() => {
    if (_.isString(icon)) {
      const iconColor = lightBrightness ? '000' : 'fff';
      return t.addRecolorParam(icon, `?color=${iconColor}`);
    } else if (lightBrightness && _.isString(icon?.light)) {
      return icon.light;
    } else if (!lightBrightness && _.isString(icon?.dark)) {
      return icon.dark;
    }
  })();
  const recolorable = _.isString(icon) || monochrome !== false;
  if (coloredIcon != null) {
    t.span('.board-header-btn-icon.icon-sm.plugin-icon', {
      class: t.classify({
        recolorable,
        'mod-reset': monochrome === false,
        'mod-invert': recolorable && !lightBrightness,
      }),
      style: t.stylify({
        'background-image': t.urlify(coloredIcon),
      }),
    });
  }
  t.span('.board-header-btn-text', () => t.text(text));
});

module.exports = PluginHeaderButtonView = (function () {
  PluginHeaderButtonView = class PluginHeaderButtonView extends (
    PluginButtonView
  ) {
    static initClass() {
      this.prototype.template = template;
    }
    className() {
      if (this.options.pluginButton?.icon != null) {
        return 'board-header-btn';
      } else {
        return 'board-header-btn board-header-btn-without-icon';
      }
    }

    trackClick(pluginButton) {
      return sendPluginUIEvent({
        idPlugin: pluginButton.idPlugin,
        idBoard: this.model.id,
        event: {
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'powerUpBoardButton',
          source: 'boardScreen',
        },
      });
    }
  };
  PluginHeaderButtonView.initClass();
  return PluginHeaderButtonView;
})();
