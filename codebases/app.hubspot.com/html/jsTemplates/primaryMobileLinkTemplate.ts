import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { escape } from 'unified-navigation-ui/utils/escape';
import { lock_icon } from '../templates/icons/lock_icon';
import { secondaryLinkTemplate } from '../jsTemplates/secondaryLinkTemplate';
import { arrow_right_icon } from '../templates/icons/arrow_right_icon';
import { isExternal } from '../../js/utils/isExternal';
export var primaryMobileLinkTemplate = function primaryMobileLinkTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      children = _ref.children,
      path = _ref.path,
      id = _ref.id,
      label = _ref.label,
      isLocked = _ref.isLocked;

  return "\n  <li role=\"none\" " + (children ? 'class="expandable"' : '') + ">\n  <a href=\"" + (path ? "" + (isExternal(path) ? path : encodeURI(path) ? "" + encodeURI("" + getOrigin() + (path || '')) : '') : '') + "\" \n  data-tracking=\"click\" id=\"nav-primary-" + (id ? escape(id) : '') + "\" role=\"menuitem\"\n  " + (children ? 'aria-haspopup="true" aria-expanded="false"' : '') + " class=\"primary-link\">\n    " + (label ? escape(label) + " " + (children ? arrow_right_icon : '') : isLocked ? lock_icon : '') + "\n  </a>\n\n\n  " + (children ? "\n    <div aria-label=\"" + (label ? escape(label) : '') + "\" role=\"menu\" class=\"secondary-nav expansion\">\n    \n      " + children.map(function (secondary, i) {
    var entry = '';

    if (secondary.children && i !== 0) {
      entry += '<div role="separator" class="nav-dropdown-separator"></div>';
    }

    entry += '<ul role="none">';

    if (secondary.children) {
      entry += secondary.children.map(secondaryLinkTemplate).join('');
    } else {
      entry += secondaryLinkTemplate(secondary);
    }

    return entry += '</ul>';
  }).join('') + "\n    </div>\n    </li>\n    " : '') + "</li>";
};