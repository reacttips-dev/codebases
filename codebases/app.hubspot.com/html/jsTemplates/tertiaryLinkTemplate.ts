import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { escape } from 'unified-navigation-ui/utils/escape';
import { lock_icon } from '../templates/icons/lock_icon';
import { tooltipTemplate } from './tooltipTemplate';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export var tertiaryLinkTemplate = function tertiaryLinkTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      isMoved = _ref.isMoved,
      id = _ref.id,
      path = _ref.path,
      label = _ref.label,
      isComingSoon = _ref.isComingSoon,
      isBeta = _ref.isBeta,
      isNew = _ref.isNew,
      isLocked = _ref.isLocked,
      tooltip = _ref.tooltip;

  return "<li role=\"none\">\n  " + (!isMoved ? "\n  <a\n  role=\"menuitem\"\n  data-tracking=\"click\"\n  id=\"nav-tertiary-" + (id ? escape(id) : '') + "\"\n  href=\"" + (path ? "" + encodeURI("" + getOrigin() + path) : '') + (isBeta ? "?isBeta=" + isBeta : '') + (isNew ? "?isNew=" + isNew : '') + "\"\n  class=\"navTertiaryLink\">\n  " + (label ? escape(label) : '') + "\n  " + (isComingSoon ? "<span class=\"badge beta-badge\">" + escape(text('nav.badges.comingSoon', {
    defaultValue: 'Coming Soon'
  })) + "</span>" : '') + "\n  " + (isBeta ? "<span class=\"badge beta-badge\">" + escape(text('nav.badges.beta', {
    defaultValue: 'Beta'
  })) + "</span>" : '') + "\n  " + (isNew ? "<span class=\"badge new-badge\">" + escape(text('nav.badges.new', {
    defaultValue: 'New'
  })) + "</span>" : '') + "\n  " + (isLocked ? lock_icon : '') + "\n  </a>" : '') + "\n  " + (tooltip ? tooltipTemplate({
    isMoved: isMoved,
    tooltip: tooltip
  }) : '') + "\n  </li>\n\n  ";
};