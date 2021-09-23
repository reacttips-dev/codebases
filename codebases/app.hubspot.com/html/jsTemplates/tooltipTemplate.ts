import { escape } from 'unified-navigation-ui/utils/escape';
import { marketplace_icon } from '../templates/icons/marketplace_icon';
import { text } from 'unified-navigation-ui/utils/NavI18n';
export function tooltipTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      isMoved = _ref.isMoved,
      _ref$tooltip = _ref.tooltip,
      tooltip = _ref$tooltip === void 0 ? '' : _ref$tooltip;

  return "<div class=\"name-change-tooltip\">\n  <div class=\"name-change-tooltip-inner\">\n  " + (isMoved ? '' : '<div class="name-change-tooltip-arrow"></div>') + "\n  <div>\n      <div class=\"name-change-tooltip-text\" role=\"tooltip\">\n          " + (tooltip === 'isSpecialMarketplaceTooltip' ? text('nav.tooltips.templateMarketplace', {
    marketplaceIcon: "<span class=\"svg\">" + marketplace_icon + "</span>",
    defaultValue: "Looking for the Asset Marketplace? It's moved to the main navigation. Look for the <span class=\"svg\">" + marketplace_icon + "</span> Marketplace icon."
  }) : escape(tooltip)) + "\n      </div>\n    </div>\n  </div>\n</div> \n  ";
}