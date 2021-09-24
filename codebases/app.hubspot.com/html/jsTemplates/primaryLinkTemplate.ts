import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { escape } from 'unified-navigation-ui/utils/escape';
import { arrow_down_icon } from '../templates/icons/arrow_down_icon';
import { external_link_icon } from '../templates/icons/external_link_icon';
import { lock_icon } from '../templates/icons/lock_icon';
import { secondaryLinkTemplate } from '../jsTemplates/secondaryLinkTemplate';
import { isExternal } from '../../js/utils/isExternal';
export var primaryLinkTemplate = function primaryLinkTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      children = _ref.children,
      currentPage = _ref.currentPage,
      path = _ref.path,
      id = _ref.id,
      label = _ref.label,
      isLocked = _ref.isLocked,
      minHeight = _ref.minHeight;

  return "<li role=\"none\" class=\"\n" + (children ? ' expandable ' : '') + "\n" + (currentPage ? ' currentPage ' : '') + "\">\n  <a\n    href=\"" + (path ? "" + (isExternal(path) ? path : encodeURI(path) ? "" + encodeURI("" + getOrigin() + (path || '')) : '') : '') + (children ? "?isDestination=" + !children : '') + "\"\n    id=\"nav-primary-" + (id ? escape(id) : '') + "\"\n    data-tracking=\"click hover\" \n    role=\"menuitem\"\n    " + (children ? "aria-haspopup=\"true\"\n    aria-expanded=\"false\" " : '') + "\n    class=\"primary-link\"\n    " + (isExternal(path) ? "\n    target=\"_blank\"\n    rel=\"noreferrer noopener\"" : '') + ">\n  " + (label ? escape(label) : '') + "\n  " + (isExternal(path) ? "<span class=\"svgResize\">" + external_link_icon + "</span>" : '') + "\n  " + (children ? arrow_down_icon : isLocked ? lock_icon : '') + "\n  </a>\n  " + (children ? "<div aria-label=\"" + (label ? escape(label) : '') + "\" role=\"menu\" class=\"secondary-nav expansion\" style=\"min-height: " + (minHeight ? escape(minHeight) + "px" : 'initial') + "\">\n        " + children.map(function (secondary) {
    return secondary.children ? "<ul role=\"none\">\n    " + secondary.children.map(secondaryLinkTemplate).join('') + "\n  </ul>\n  " + secondary.children.map(function (__, i) {
      return i === 0 ? '<div role="separator" class="nav-dropdown-separator"></div>' : '';
    }).join('') : "<ul role=\"none\">" + secondaryLinkTemplate(secondary) + "</ul>";
  }).join('') + "\n  </div>" : '') + "\n</li>";
};