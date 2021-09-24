'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { TRANSPARENT } from 'HubStyleTokens/colors';
import { CARD_SHADOW_ALPHA, CARD_SHADOW_BLUR_RADIUS, CARD_SHADOW_OFFSET_Y } from 'HubStyleTokens/sizes';
import { CARD_SHADOW_COLOR, SELECTABLE_BOX_BORDER_COLOR, SELECTABLE_BOX_SHADOW_COLOR } from 'HubStyleTokens/theme';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import styled, { css } from 'styled-components';
import UIClickable from '../button/UIClickable';
import { rgba } from '../core/Color';
import FocusProvider from '../providers/FocusProvider';
import HoverProvider from '../providers/HoverProvider';
import { hidden } from '../utils/propTypes/decorators';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import { BUILDER_CARD_BACKGROUND_COLOR, BUILDER_CARD_BACKGROUND_COLOR_HOVERED, BUILDER_CARD_BORDER_COLOR_DEFAULT, BUILDER_CARD_BORDER_COLOR_ERROR, BUILDER_CARD_BORDER_COLOR_HOVERED, BUILDER_CARD_BORDER_COLOR_INFO, BUILDER_CARD_BORDER_COLOR_WARNING, BUILDER_CARD_BOX_SHADOW_HOVERED, BUILDER_CARD_TITLE_BAR_USES } from './BuilderCardConstants';
import BuilderCardTitleBar from './BuilderCardTitleBar';
import UIBuilderCardStatusIndicator from './UIBuilderCardStatusIndicator';
var CANVAS_CARD_USES = {
  default: BUILDER_CARD_BORDER_COLOR_DEFAULT,
  error: BUILDER_CARD_BORDER_COLOR_ERROR,
  info: BUILDER_CARD_BORDER_COLOR_INFO,
  warning: BUILDER_CARD_BORDER_COLOR_WARNING
};

var getBoxShadow = function getBoxShadow(hovered, selected, use) {
  var boxShadowColor = use === 'default' || use === 'info' ? TRANSPARENT : CANVAS_CARD_USES[use];

  if (hovered) {
    return css(["background-color:", ";box-shadow:0 0 0 1px ", ";"], BUILDER_CARD_BACKGROUND_COLOR_HOVERED, BUILDER_CARD_BOX_SHADOW_HOVERED);
  } else if (selected) {
    return css(["box-shadow:0 0 0 1px ", ",0 0 12px 0 ", ";"], SELECTABLE_BOX_BORDER_COLOR, SELECTABLE_BOX_SHADOW_COLOR);
  }

  return css(["box-shadow:0 0 0 1px ", ";"], boxShadowColor);
};

var getBorderColor = function getBorderColor(hovered, selected, use) {
  if (hovered) {
    return BUILDER_CARD_BORDER_COLOR_HOVERED;
  } else if (selected) {
    return SELECTABLE_BOX_BORDER_COLOR;
  }

  return CANVAS_CARD_USES[use];
};

var wrapperStyles = "\n  background-color: " + BUILDER_CARD_BACKGROUND_COLOR + ";\n  border-radius: 7px;\n  box-shadow: 0 " + CARD_SHADOW_OFFSET_Y + " " + CARD_SHADOW_BLUR_RADIUS + " 0\n    " + rgba(CARD_SHADOW_COLOR, parseFloat(CARD_SHADOW_ALPHA, 10)) + ";\n  position: relative;\n";
var OuterWrapper = styled.div.withConfig({
  displayName: "UIBuilderCard__OuterWrapper",
  componentId: "sc-1y7g3s3-0"
})(["", ";"], wrapperStyles);
var ClickableOuterWrapper = styled(UIClickable).withConfig({
  displayName: "UIBuilderCard__ClickableOuterWrapper",
  componentId: "sc-1y7g3s3-1"
})(["", ";"], wrapperStyles);
var Wrapper = styled.div.withConfig({
  displayName: "UIBuilderCard__Wrapper",
  componentId: "sc-1y7g3s3-2"
})(["overflow:hidden;", ";border:1px solid ", ";border-radius:inherit;"], function (props) {
  return getBoxShadow(props.hovered, props.selected, props.use);
}, function (props) {
  return getBorderColor(props.hovered, props.selected, props.use);
});
var DefaultBody = styled.div.withConfig({
  displayName: "UIBuilderCard__DefaultBody",
  componentId: "sc-1y7g3s3-3"
})(["border-color:inherit;border-top-width:", ";padding:24px;"], function (props) {
  return props.hasCardTitleBar ? '1px' : null;
});

var EmptyComponent = function EmptyComponent() {
  return null;
};

var UIBuilderCard = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIBuilderCard, _PureComponent);

  function UIBuilderCard() {
    _classCallCheck(this, UIBuilderCard);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIBuilderCard).apply(this, arguments));
  }

  _createClass(UIBuilderCard, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          Body = _this$props.Body,
          _children = _this$props.children,
          clickable = _this$props.clickable,
          __focused = _this$props.focused,
          __hovered = _this$props.hovered,
          selected = _this$props.selected,
          title = _this$props.title,
          TitleAction = _this$props.TitleAction,
          titleIcon = _this$props.titleIcon,
          titleUse = _this$props.titleUse,
          use = _this$props.use,
          rest = _objectWithoutProperties(_this$props, ["Body", "children", "clickable", "focused", "hovered", "selected", "title", "TitleAction", "titleIcon", "titleUse", "use"]);

      return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, this.props, {
        children: function children(hoverProviderProps) {
          return /*#__PURE__*/_jsx(FocusProvider, Object.assign({}, _this.props, {
            children: function children(focusProviderProps) {
              var focused = focusProviderProps.focused,
                  focusProviderRestProps = _objectWithoutProperties(focusProviderProps, ["focused"]);

              var hovered = hoverProviderProps.hovered,
                  hoverProviderRestProps = _objectWithoutProperties(hoverProviderProps, ["hovered"]);

              var hasCardTitleBar = !!(title || titleIcon);
              var renderedTitleBar = hasCardTitleBar ? /*#__PURE__*/_jsx(BuilderCardTitleBar, {
                icon: ['info', 'warning', 'error'].includes(use) ? /*#__PURE__*/_jsx(UIBuilderCardStatusIndicator, {
                  use: use
                }) : titleIcon,
                use: titleUse,
                action: /*#__PURE__*/_jsx(TitleAction, {
                  focused: focused,
                  hovered: hovered,
                  titleUse: titleUse,
                  use: use
                }),
                children: title
              }) : null;
              var OuterComponent = clickable ? ClickableOuterWrapper : OuterWrapper;
              return /*#__PURE__*/_jsx(OuterComponent, Object.assign({}, rest, {}, focusProviderRestProps, {}, hoverProviderRestProps, {
                tabIndex: 0,
                children: /*#__PURE__*/_jsxs(Wrapper, {
                  focused: focused,
                  hovered: hovered,
                  selected: selected,
                  use: use,
                  children: [renderedTitleBar, /*#__PURE__*/_jsx(Body, {
                    focused: focused,
                    hasCardTitleBar: hasCardTitleBar,
                    hovered: hovered,
                    selected: selected,
                    use: use,
                    children: _children
                  })]
                })
              }));
            }
          }));
        }
      }));
    }
  }]);

  return UIBuilderCard;
}(PureComponent);

UIBuilderCard.propTypes = {
  Body: PropTypes.elementType.isRequired,
  children: PropTypes.node,
  clickable: PropTypes.bool,
  focused: hidden(PropTypes.bool),
  hovered: hidden(PropTypes.bool),
  titleIcon: PropTypes.node,
  title: PropTypes.node,
  TitleAction: getComponentPropType(UIBuilderCardStatusIndicator),
  titleUse: PropTypes.oneOf(BUILDER_CARD_TITLE_BAR_USES),
  use: PropTypes.oneOf(Object.keys(CANVAS_CARD_USES)).isRequired,
  selected: PropTypes.bool
};
UIBuilderCard.defaultProps = {
  Body: DefaultBody,
  clickable: true,
  TitleAction: EmptyComponent,
  use: 'default'
};
UIBuilderCard.displayName = 'UIBuilderCard';
export default UIBuilderCard;