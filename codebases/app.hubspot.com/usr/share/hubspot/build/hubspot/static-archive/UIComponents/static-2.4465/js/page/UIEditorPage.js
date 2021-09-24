'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { CARD_BACKGROUND } from './PageConstants';
import UIAbstractPageTemplate from './UIAbstractPageTemplate';
import UIMain from '../layout/UIMain';
import UIScrollingColumn from '../layout/UIScrollingColumn';
import * as CustomRenderer from '../utils/propTypes/customRenderer';
import refObject from '../utils/propTypes/refObject';
import { LAYOUT_EDITOR_PADDING } from 'HubStyleTokens/sizes';
import ShareScrollElement from '../decorators/ShareScrollElement';
var MainInnerWrapper = styled.div.withConfig({
  displayName: "UIEditorPage__MainInnerWrapper",
  componentId: "sc-19v77c6-0"
})(["height:100%;padding:", ";"], function (props) {
  return !props.mainSectionFlush && props.hasScrolling && LAYOUT_EDITOR_PADDING;
});

function renderEditorSidebar(sidebarComponent, sidebarBackgroundColor, sidebarScrollElementRef, hasScrolling) {
  if (!sidebarComponent) return null;
  var RenderedSidebar = hasScrolling ? UIScrollingColumn : 'div';
  var scrollableProps = hasScrolling ? {
    scrollElementRef: sidebarScrollElementRef
  } : null;
  return /*#__PURE__*/_jsx(RenderedSidebar, Object.assign({}, scrollableProps, {
    className: "private-editor__sidebar",
    style: {
      backgroundColor: sidebarBackgroundColor
    },
    children: CustomRenderer.render(sidebarComponent)
  }));
}

var UIEditorPage = /*#__PURE__*/function (_Component) {
  _inherits(UIEditorPage, _Component);

  function UIEditorPage() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIEditorPage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIEditorPage)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.MainSection = function (props) {
      var _this$props = _this.props,
          mainSectionFlush = _this$props.mainSectionFlush,
          hasScrolling = _this$props.hasScrolling,
          Overhang = _this$props.Overhang,
          scrollDirection = _this$props.scrollDirection,
          scrollElementRef = _this$props.scrollElementRef,
          sidebarBackgroundColor = _this$props.sidebarBackgroundColor,
          sidebarScrollElementRef = _this$props.sidebarScrollElementRef;
      var children = props.children,
          mainSectionBackgroundColor = props.mainSectionBackgroundColor,
          mainSectionStyle = props.mainSectionStyle,
          sidebarComponent = props.sidebarComponent;
      var RenderedMain = hasScrolling ? UIScrollingColumn : UIMain;
      var computedFlush = hasScrolling ? true : mainSectionFlush;
      var scrollableProps = hasScrolling ? {
        Overhang: Overhang,
        role: 'main',
        scrollDirection: scrollDirection,
        scrollElementRef: scrollElementRef
      } : null;
      return /*#__PURE__*/_jsxs("div", {
        className: "private-editor__inner",
        children: [renderEditorSidebar(sidebarComponent, sidebarBackgroundColor, sidebarScrollElementRef, hasScrolling), /*#__PURE__*/_jsx("div", {
          className: 'private-editor__canvas' + (computedFlush ? " private-editor__canvas--flush" : ""),
          style: Object.assign({}, {
            backgroundColor: mainSectionBackgroundColor
          }, {}, mainSectionStyle),
          children: /*#__PURE__*/_jsx(RenderedMain, Object.assign({
            className: "private-editor__main",
            flush: true
          }, scrollableProps, {
            children: /*#__PURE__*/_jsx(MainInnerWrapper, {
              hasScrolling: hasScrolling,
              mainSectionFlush: mainSectionFlush,
              children: children
            })
          }))
        })]
      });
    };

    return _this;
  }

  _createClass(UIEditorPage, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          className = _this$props2.className,
          __hasScrolling = _this$props2.hasScrolling,
          headerComponent = _this$props2.headerComponent,
          mainBackgroundColor = _this$props2.mainBackgroundColor,
          __mainSectionFlush = _this$props2.mainSectionFlush,
          mainSectionStyle = _this$props2.mainSectionStyle,
          __Overhang = _this$props2.Overhang,
          __scrollDirection = _this$props2.scrollDirection,
          __scrollElementRef = _this$props2.scrollElementRef,
          __sidebarBackgroundColor = _this$props2.sidebarBackgroundColor,
          sidebarComponent = _this$props2.sidebarComponent,
          __sidebarScrollElementRef = _this$props2.sidebarScrollElementRef,
          tabs = _this$props2.tabs,
          title = _this$props2.title,
          use = _this$props2.use,
          rest = _objectWithoutProperties(_this$props2, ["children", "className", "hasScrolling", "headerComponent", "mainBackgroundColor", "mainSectionFlush", "mainSectionStyle", "Overhang", "scrollDirection", "scrollElementRef", "sidebarBackgroundColor", "sidebarComponent", "sidebarScrollElementRef", "tabs", "title", "use"]);

      var mainPanelBackgroundColor = use === 'dark' ? CARD_BACKGROUND : mainBackgroundColor;
      return /*#__PURE__*/_jsx(UIAbstractPageTemplate, Object.assign({}, rest, {
        bodyClassName: "space-sword--editor",
        className: classNames('private-editor', className),
        contentAreaFlush: true,
        headerComponent: headerComponent,
        horizontalDivider: true,
        MainSection: this.MainSection,
        mainSectionBackgroundColor: mainPanelBackgroundColor,
        mainSectionStyle: mainSectionStyle,
        pageLayout: "full-width",
        sidebarComponent: sidebarComponent,
        tabs: tabs,
        title: title,
        children: children
      }));
    }
  }]);

  return UIEditorPage;
}(Component);

UIEditorPage.displayName = 'UIEditorPage';
UIEditorPage.propTypes = {
  children: PropTypes.node,
  hasScrolling: PropTypes.bool.isRequired,
  headerComponent: CustomRenderer.propType,
  mainBackgroundColor: PropTypes.string,
  mainSectionFlush: PropTypes.bool,
  mainSectionStyle: PropTypes.object,
  Overhang: UIScrollingColumn.propTypes.Overhang,
  scrollDirection: UIScrollingColumn.propTypes.scrollDirection,
  scrollElementRef: refObject.isRequired,
  sidebarScrollElementRef: refObject,
  sidebarBackgroundColor: PropTypes.string,
  sidebarComponent: CustomRenderer.propType,
  tabs: PropTypes.node,
  title: PropTypes.node,
  use: PropTypes.oneOf(['default', 'dark'])
};
UIEditorPage.defaultProps = {
  hasScrolling: true,
  mainSectionFlush: false,
  sidebarBackgroundColor: CARD_BACKGROUND,
  scrollDirection: UIScrollingColumn.defaultProps.scrollDirection
};
export default ShareScrollElement(UIEditorPage);