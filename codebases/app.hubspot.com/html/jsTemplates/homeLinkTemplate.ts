import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { sprocket_icon } from '../templates/icons/sprocket_icon';
import { escape } from 'unified-navigation-ui/utils/escape';
import { text } from 'unified-navigation-ui/js/utils/NavI18n';
export var homeLinkTemplate = function homeLinkTemplate() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$isDevPortal = _ref.isDevPortal,
      isDevPortal = _ref$isDevPortal === void 0 ? false : _ref$isDevPortal,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? '' : _ref$id,
      _ref$path = _ref.path,
      path = _ref$path === void 0 ? '' : _ref$path;

  return isDevPortal ? sprocket_icon(escape(text('nav.icons.home', {
    defaultValue: 'home'
  })) || undefined) : "<a\n    href=\"" + encodeURI("" + getOrigin() + (path || '')) + "\"\n    id=\"nav-primary-" + (escape(id) || '') + "\"\n    class=\"primary-link\"\n    data-tracking=\"click hover\"\n    role=\"menuitem\"\n  >" + sprocket_icon(escape(text('nav.icons.home', {
    defaultValue: 'home'
  })) || undefined) + "\n  </a>";
};