import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { escape } from 'unified-navigation-ui/utils/escape';
import { external_link_icon } from '../templates/icons/external_link_icon';
import { sales_icon } from '../templates/icons/sales_icon';
import { service_icon } from '../templates/icons/service_icon';
import { marketing_icon } from '../templates/icons/marketing_icon';
import { lock_icon } from '../templates/icons/lock_icon';
import { arrow_right_icon } from '../templates/icons/arrow_right_icon';
import { tooltipTemplate } from './tooltipTemplate';
import { tertiaryLinkTemplate } from './tertiaryLinkTemplate';
import { isExternal } from '../../js/utils/isExternal';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export var secondaryLinkTemplate = function secondaryLinkTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      isMoved = _ref.isMoved,
      path = _ref.path,
      id = _ref.id,
      label = _ref.label,
      lockedTooltip = _ref.lockedTooltip,
      tooltip = _ref.tooltip,
      isComingSoon = _ref.isComingSoon,
      isBeta = _ref.isBeta,
      isNew = _ref.isNew,
      isSales = _ref.isSales,
      isMarketing = _ref.isMarketing,
      isService = _ref.isService,
      isLocked = _ref.isLocked,
      children = _ref.children;

  return children ? "<li role=\"none\" class=\"expandable\">\n" + (!isMoved ? "<a href=\"" + (path ? "" + (isExternal(path) ? encodeURI(path) || '' : "" + encodeURI("" + getOrigin() + (path || ''))) : '#') + (children ? "?isDestination=" + !children : '') + "\"\n            data-tracking=\"click\" data-tracking=\"hover\" id=\"nav-secondary-" + (id ? escape(id) : '') + "\" role=\"menuitem\"\naria-haspopup=\"true\" aria-expanded=\"false\" class=\"navSecondaryLink\">\n" + (label ? escape(label) : '') + " " + arrow_right_icon + "\n</a>\n<div aria-label=\"" + (label ? escape(label) : '') + "\" role=\"menu\" class=\"tertiary-nav expansion\">\n<ul role=\"none\">\n" + children.map(tertiaryLinkTemplate).join('') + "\n</ul>\n</div>" : '') + "\n" + (tooltip ? tooltipTemplate({
    isMoved: isMoved,
    tooltip: tooltip
  }) : '') + "\n</li>" : "\n\n<li role=\"none\" style=\"position: relative\"\n" + (lockedTooltip ? 'class="locked-item"' : '') + "\n" + (isLocked ? 'class="locked-item-control"' : '') + "\n>\n" + (!isMoved ? "\n<a href=\"" + (isExternal(path) ? path ? encodeURI(path) : '' : path ? "" + encodeURI("" + getOrigin() + (path || '')) : '') + (children ? "?isDestinationSecondary=" + !children : '') + (isBeta ? "?isBeta=" + isBeta : '') + (isNew ? "?isNew=" + isNew : '') + "\"\n\ndata-tracking=\"click\"\nid=\"nav-secondary-" + (id ? escape(id) : '') + "\"\nrole=\"menuitem\"\nclass=\"navSecondaryLink\"\n" + (isExternal(path) ? "target=\"_blank\"\nrel=\"noreferrer noopener\"" : '') + "\n>\n<div style=\"color:inherit\">\n  " + (label ? escape(label) : '') + "\n" + (isExternal(path) ? external_link_icon : '') + "\n</div>\n<div class=\"nav-no-margin-children\">\n  " + (isSales ? sales_icon : '') + "\n  " + (isService ? service_icon : '') + "\n  " + (isMarketing ? marketing_icon : '') + "\n  " + (isLocked ? lock_icon : '') + "\n  " + (isComingSoon && !isSales ? "<span class=\"badge beta-badge\">" + text('nav.badges.comingSoon', {
    defaultValue: 'Coming soon'
  }) + "</span>" : '') + "\n  " + (isBeta && !isSales ? "<span class=\"badge beta-badge\">" + text('nav.badges.beta', {
    defaultValue: 'beta'
  }) + "</span>" : '') + "\n  " + (isNew && !isSales ? "<span class=\"badge new-badge\">" + text('nav.badges.new', {
    defaultValue: 'New'
  }) + "</span>" : '') + "\n</div></a>\n" : '') + "\n" + (tooltip ? tooltipTemplate({
    isMoved: isMoved,
    tooltip: tooltip
  }) : '') + "\n" + (lockedTooltip ? "<div class=\"locked-tooltip\">\n<div class=\"locked-tooltip-inner\">\n  <div class=\"locked-tooltip-arrow\"></div>\n  <div>\n    <div class=\"locked-tooltip-text\" role=\"tooltip\">\n      " + escape(lockedTooltip) + "\n    </div>\n  </div>\n</div>\n</div>" : '') + "\n</li>\n";
};