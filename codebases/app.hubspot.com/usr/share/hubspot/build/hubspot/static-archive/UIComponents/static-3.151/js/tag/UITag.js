'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useRef } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import LIGHT_COLORS from '../core/LightColors';
import MEDIUM_COLORS from '../core/MediumColors';
import NORMAL_COLORS from '../core/NormalColors';
import { uniqueId } from '../utils/underscore';
import passthroughProps from '../utils/propTypes/passthroughProps';
import { toPx } from '../utils/Styles';
import UICloseButton from '../button/UICloseButton';
import UIClickable from '../button/UIClickable';
import UILink from '../link/UILink';
import UITruncateString from '../text/UITruncateString';
import { EERIE, GYPSUM, OLAF } from 'HubStyleTokens/colors';
import { WEB_FONT_DEMI_BOLD_WEIGHT, WEB_FONT_MEDIUM_WEIGHT } from 'HubStyleTokens/misc';
import { BASE_SPACING_X, TAG_ICON_SPACING_X, TAG_FONT_SIZE, TAG_HEIGHT, TAG_PADDING_X, TAG_PADDING_Y } from 'HubStyleTokens/sizes';
import { BASE_FONT_COLOR } from 'HubStyleTokens/theme';
var USE_CLASSES = {
  // These do not come from the sketch file
  default: 'tag-default private-tag--default',
  primary: 'tag-primary',
  info: 'tag-info private-tag--info',
  success: 'tag-success private-tag--success',
  warning: 'tag-warning private-tag--warning',
  danger: 'tag-danger private-tag--danger',
  calypso: '',
  sorbet: '',
  lorax: '',
  marigold: '',
  'candy-apple': '',
  norman: '',
  thunderdome: '',
  oz: '',
  olaf: ''
};
var STATUS_ALIAS_MAP = {
  disabled: 'default',
  paused: 'default',
  draft: 'default',
  active: 'success',
  sent: 'success',
  published: 'success',
  inReview: 'warning',
  scheduled: 'warning',
  removed: 'danger',
  cancelled: 'danger',
  error: 'danger'
};
var USE_COLOR_ALIAS_MAP = {
  // defaults
  disabled: 'default',
  paused: 'default',
  draft: 'default',
  primary: 'default',
  // oz
  success: 'oz',
  active: 'oz',
  sent: 'oz',
  published: 'oz',
  // marigold
  warning: 'marigold',
  inReview: 'marigold',
  scheduled: 'marigold',
  // cand-apple
  danger: 'candy-apple',
  removed: 'candy-apple',
  cancelled: 'candy-apple',
  error: 'candy-apple',
  // calypso
  info: 'calypso'
};
var TAG_BACKGROUND_COLORS = Object.assign({}, LIGHT_COLORS, {
  default: GYPSUM
});
var TAG_IS_BORDERED_BORDER_COLORS = Object.assign({}, MEDIUM_COLORS, {
  default: EERIE
});
var TAG_BORDER_COLORS = Object.assign({}, NORMAL_COLORS, {
  default: EERIE
});

var getBackgroundColor = function getBackgroundColor(use) {
  return TAG_BACKGROUND_COLORS[use] != null ? TAG_BACKGROUND_COLORS[use] : EERIE;
};

var getBorderColor = function getBorderColor(use, bordered) {
  if (bordered && TAG_IS_BORDERED_BORDER_COLORS[use] != null) {
    return TAG_IS_BORDERED_BORDER_COLORS[use];
  } else if (TAG_BORDER_COLORS[use] != null) {
    return TAG_BORDER_COLORS[use];
  }

  return 'transparent';
};

var getInlineStyles = function getInlineStyles(inline) {
  return inline ? "\n        margin: 0 4px;\n        vertical-align: middle;\n      " : null;
};

var getCloseablePadding = function getCloseablePadding(closeable) {
  return closeable ? "\n        padding-right: 28px !important;\n      " : null;
};

var Tag = styled.span.withConfig({
  displayName: "UITag__Tag",
  componentId: "sc-1amm06b-0"
})(["font-size:", ";background-color:", ";border:1px solid ", ";color:", ";line-height:", ";padding:", " ", ";", " position:relative;cursor:inherit;display:inline-flex;font-weight:", ";max-width:100%;overflow:hidden;user-select:none;vertical-align:8px;> * + *{margin-left:", ";}& + .private-tag{margin-left:", ";}a,a:hover,a:active{color:inherit;}", ""], TAG_FONT_SIZE, function (props) {
  return getBackgroundColor(props.computedUse);
}, function (props) {
  return getBorderColor(props.computedUse, props._bordered);
}, function (props) {
  return props.computedUse === 'olaf' ? OLAF : BASE_FONT_COLOR;
}, toPx(parseInt(TAG_HEIGHT, 10) - 2), TAG_PADDING_Y, TAG_PADDING_X, function (props) {
  return getCloseablePadding(props.closeable);
}, WEB_FONT_DEMI_BOLD_WEIGHT, TAG_ICON_SPACING_X, function (_ref) {
  var inline = _ref.inline;
  return inline ? null : BASE_SPACING_X;
}, function (props) {
  return getInlineStyles(props.inline);
});
var FlexWrapper = styled.span.withConfig({
  displayName: "UITag__FlexWrapper",
  componentId: "sc-1amm06b-1"
})(["display:inline-flex;max-width:100%;vertical-align:top;"]);
var ContentWrapper = styled.span.withConfig({
  displayName: "UITag__ContentWrapper",
  componentId: "sc-1amm06b-2"
})(["overflow:hidden;"]);
var StyledCloseButton = styled(UICloseButton).withConfig({
  displayName: "UITag__StyledCloseButton",
  componentId: "sc-1amm06b-3"
})(["bottom:0;color:currentColor;margin-bottom:auto;margin-top:auto;position:absolute;right:6px;top:0;transform:scale(0.5);"]);
var StyledLink = styled(UILink).withConfig({
  displayName: "UITag__StyledLink",
  componentId: "sc-1amm06b-4"
})(["overflow:hidden;"]);
StyledLink.displayName = 'StyledUILink';
var LinkStyledClickable = styled(UIClickable).withConfig({
  displayName: "UITag__LinkStyledClickable",
  componentId: "sc-1amm06b-5"
})(["&&{font-weight:", ";overflow:hidden;text-decoration:underline;}"], WEB_FONT_MEDIUM_WEIGHT);
LinkStyledClickable.displayName = 'StyledUIClickable';

var renderContents = function renderContents(href, target, onClick, truncatedChildren) {
  var buttonClassName = 'private-tag__link';

  if (href) {
    return /*#__PURE__*/_jsx(StyledLink, {
      className: buttonClassName,
      href: href,
      onClick: onClick,
      target: target,
      use: "on-bright",
      children: truncatedChildren
    });
  } else if (onClick) {
    return /*#__PURE__*/_jsx(LinkStyledClickable, {
      className: buttonClassName,
      onClick: onClick,
      children: truncatedChildren
    });
  }

  return /*#__PURE__*/_jsx(ContentWrapper, {
    className: "private-tag__content-wrapper",
    children: truncatedChildren
  });
};

export default function UITag(props) {
  var _avatar = props._avatar,
      _bordered = props._bordered,
      children = props.children,
      className = props.className,
      closeable = props.closeable,
      href = props.href,
      id = props.id,
      inline = props.inline,
      multiline = props.multiline,
      onClick = props.onClick,
      onCloseClick = props.onCloseClick,
      _onCloseMouseDown = props._onCloseMouseDown,
      target = props.target,
      truncateStringProps = props.truncateStringProps,
      use = props.use,
      _flexWrapperProps = props._flexWrapperProps,
      rest = _objectWithoutProperties(props, ["_avatar", "_bordered", "children", "className", "closeable", "href", "id", "inline", "multiline", "onClick", "onCloseClick", "_onCloseMouseDown", "target", "truncateStringProps", "use", "_flexWrapperProps"]);

  var idRef = useRef(uniqueId('tag-'));
  var computedId = id || idRef.current;
  var truncatedChildren = multiline ? children : /*#__PURE__*/_jsx(UITruncateString, Object.assign({
    useFlex: true
  }, truncateStringProps, {
    children: children
  }));
  return /*#__PURE__*/_jsxs(Tag, Object.assign({
    className: classNames("tag private-tag", className, USE_CLASSES[STATUS_ALIAS_MAP[use] || use], _bordered && 'private-tag--bordered', closeable && 'private-tag--has-close', inline && 'private-tag--inline'),
    "data-component-name": "UITag",
    id: computedId,
    computedUse: USE_COLOR_ALIAS_MAP[use] || use,
    _bordered: _bordered,
    closeable: closeable,
    inline: inline
  }, rest, {
    children: [/*#__PURE__*/_jsxs(FlexWrapper, Object.assign({
      className: "private-tag__flex-wrapper"
    }, _flexWrapperProps, {
      children: [_avatar, renderContents(href, target, onClick, truncatedChildren)]
    })), closeable && /*#__PURE__*/_jsx(StyledCloseButton, {
      "aria-describedby": computedId,
      className: "private-tag__close",
      onClick: onCloseClick,
      onMouseDown: _onCloseMouseDown
    })]
  }));
}
UITag.propTypes = {
  /**
   * The content for the tag
   */
  children: PropTypes.any,

  /**
   * Renders a close button inside the tag. Use `onCloseClick` to provide close behavior.
   */
  closeable: PropTypes.bool.isRequired,

  /**
   * A URL that the tag will link to
   */
  href: PropTypes.string,

  /**
   * Set where you want the linked URL to display. This works as it would on an anchor element.
   */
  target: PropTypes.string,

  /**
   * Adds styles to ensure `UITag` aligns correctly within text.
   */
  inline: PropTypes.bool.isRequired,

  /**
   * When enabled, allows the content to wrap to a newline instead of being truncated
   */
  multiline: PropTypes.bool.isRequired,

  /**
   * Add click behavior directly to the `UITag`. Automatically maps to `onKeyDown` to provide keyboard support.
   */
  onClick: PropTypes.func,

  /**
   * Function that is called when the close button is clicked. Requires `closeable={true}`.
   */
  onCloseClick: PropTypes.func,

  /**
   * Props that are passed down to the rendered `UITruncateString`. Does not work with `multiline={true}` since truncation is disabled.
   */
  truncateStringProps: passthroughProps(UITruncateString),

  /**
   * Sets the color theme to be used for the tag's border and background color.
   */
  use: PropTypes.oneOf(Object.keys(USE_CLASSES).concat(Object.keys(STATUS_ALIAS_MAP))).isRequired,

  /**
   * Slot to render an avatar next to the content. Used internally by `UIAvatarTag`.
   */
  _avatar: PropTypes.node,
  // for UIAvatarTag

  /**
   * Use a lighter border color, if supported by the `use` prop. If not supported the standard border color is used. Used by MultiSelects to avoid clashing borders.
   */
  _bordered: PropTypes.bool,
  // for MultiSelect

  /**
   * Set `onMouseDown` behavior to the close button rendered by `closeable`. Used internally by `UISelect` with `multi={true}` to prevent input focus.
   */
  _onCloseMouseDown: PropTypes.func,
  // for MultiSelectValue

  /**
   * Props passed down to the flex wrapper around `UIStatusTag`
   */
  _flexWrapperProps: PropTypes.object // for UIStatusTag

};
UITag.defaultProps = {
  _bordered: false,
  closeable: false,
  inline: false,
  multiline: false,
  use: 'default'
};
UITag.displayName = 'UITag';
UITag.STATUS_ALIAS_MAP = STATUS_ALIAS_MAP;