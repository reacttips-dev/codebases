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
const PluginView = require('app/scripts/views/plugin/plugin-view');
const _ = require('underscore');
const t = require('app/scripts/views/internal/teacup-with-helpers')();
const xtend = require('xtend');
const { IconQuietColor } = require('@trello/nachos/tokens');

const template = t.renderable(function ({
  icon,
  text,
  iconColor,
  iconColorClass,
}) {
  if (icon != null) {
    t.span(`.badge-icon.icon-sm.plugin-icon${iconColorClass}`, {
      style: t.stylify({
        'background-image': t.urlify(
          t.addRecolorParam(icon, `?color=${iconColor}`),
        ),
      }),
    });
  }
  if (text) {
    return t.span('.badge-text', () => t.text(text));
  }
});

const colorClasses = {
  blue: 'plugin-color-blue',
  green: 'plugin-color-green',
  orange: 'plugin-color-orange',
  red: 'plugin-color-red',
  yellow: 'plugin-color-yellow',
  purple: 'plugin-color-purple',
  pink: 'plugin-color-pink',
  sky: 'plugin-color-sky',
  lime: 'plugin-color-lime',
  'light-gray': 'plugin-color-light-gray',
};

const allColorClasses = _.values(colorClasses).join(' ');

const getColorClass = (color) => colorClasses[color];

class PluginBadgeView extends PluginView {
  static initClass() {
    this.prototype.tagName = 'div';
    this.prototype.className = 'badge';
  }

  initialize({ pluginBadge }) {
    this.pluginBadge = pluginBadge;
  }

  renderBadge(badge) {
    this.$el.html(template(badge));
    return this.$el;
  }

  render() {
    const badge = this.pluginBadge;
    const colorClass = getColorClass(badge.color);
    const useWhite = colorClass != null && badge.color !== 'light-gray';
    const iconColor = useWhite ? 'fff' : IconQuietColor.substr(1).toLowerCase();
    let iconColorClass = useWhite ? '.mod-invert' : '.mod-quiet';
    if (badge.monochrome === false) {
      iconColorClass = '.mod-reset';
    }

    const $badge = this.renderBadge(
      xtend(badge, { iconColor, iconColorClass }),
    );
    // Remove any old colors
    $badge.removeClass(allColorClasses);
    if (colorClass != null) {
      $badge.addClass(colorClass);
    }

    return this;
  }

  // to avoid needing to remove and create brand new views
  // when updating a badge from cache, we allow it to be updated
  // in place and re-rendered
  updateBadge(badge) {
    if (!_.isEqual(this.pluginBadge, badge)) {
      this.pluginBadge = badge;
      return this.render(badge);
    }
  }
}
PluginBadgeView.initClass();

module.exports = PluginBadgeView;
