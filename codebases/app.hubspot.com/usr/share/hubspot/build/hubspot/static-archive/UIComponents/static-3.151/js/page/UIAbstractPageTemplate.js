'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import { OLAF } from 'HubStyleTokens/colors';
import { DEVICE_CLASSES, LAYOUT_CLASSES } from './PageConstants';
import UIAbstractPageGridContent from './UIAbstractPageGridContent';
import UIAbstractPageSection from './UIAbstractPageSection';
import UIPage from './UIPage';
import UIHeader from '../layout/UIHeader';
import * as CustomRenderer from '../utils/propTypes/customRenderer';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import { getDefaultNavHeight } from '../utils/NavHeight';
import { toPx } from '../utils/Styles';

function mainWrapperBackgroundColor(color) {
  return {
    backgroundColor: color
  };
}

function getBodyClassNames(bodyClassName, pageLayout) {
  return classNames('space-sword', bodyClassName, pageLayout === 'max-width' && 'space-sword--max-width');
}

var StyledPage = styled(function (props) {
  var __navHeight = props.navHeight,
      rest = _objectWithoutProperties(props, ["navHeight"]);

  return /*#__PURE__*/_jsx(UIPage, Object.assign({}, rest));
}).withConfig({
  displayName: "UIAbstractPageTemplate__StyledPage",
  componentId: "ji44cu-0"
})(["display:flex;flex-direction:column;flex-grow:1;background-color:", ";min-height:calc(100vh - ", ");"], OLAF, function (_ref) {
  var navHeight = _ref.navHeight;
  return toPx(navHeight);
});

function UIAbstractPageTemplate(_ref2) {
  var asDevice = _ref2.asDevice,
      bodyClassName = _ref2.bodyClassName,
      children = _ref2.children,
      className = _ref2.className,
      contentAreaFlush = _ref2.contentAreaFlush,
      headerComponent = _ref2.headerComponent,
      horizontalDivider = _ref2.horizontalDivider,
      narrowLayout = _ref2.narrowLayout,
      MainSection = _ref2.MainSection,
      mainSectionBackgroundColor = _ref2.mainSectionBackgroundColor,
      mainSectionStyle = _ref2.mainSectionStyle,
      navHeight = _ref2.navHeight,
      pageBackgroundColor = _ref2.pageBackgroundColor,
      pageLayout = _ref2.pageLayout,
      pageMaxWidth = _ref2.pageMaxWidth,
      pageStyle = _ref2.pageStyle,
      sidebarAreaFlush = _ref2.sidebarAreaFlush,
      sidebarComponent = _ref2.sidebarComponent,
      sidebarStyle = _ref2.sidebarStyle,
      stickySidebar = _ref2.stickySidebar,
      tabs = _ref2.tabs,
      title = _ref2.title,
      rest = _objectWithoutProperties(_ref2, ["asDevice", "bodyClassName", "children", "className", "contentAreaFlush", "headerComponent", "horizontalDivider", "narrowLayout", "MainSection", "mainSectionBackgroundColor", "mainSectionStyle", "navHeight", "pageBackgroundColor", "pageLayout", "pageMaxWidth", "pageStyle", "sidebarAreaFlush", "sidebarComponent", "sidebarStyle", "stickySidebar", "tabs", "title"]);

  var headerUse = tabs ? 'condensed' : undefined;
  var headerWrapperClassNames = 'private-template__section--header';
  var mainWrapperClassNames = classNames('private-template__section--stretch', horizontalDivider && 'private-template__section--divided', narrowLayout && 'private-template--narrow');
  var pageClassName = classNames('private-template', DEVICE_CLASSES[asDevice], LAYOUT_CLASSES[pageLayout], className);
  var sectionClassNames = contentAreaFlush ? 'private-template__section--flush' : 'private-template__section--spaced-vertical';

  var templateBackgroundColor = function templateBackgroundColor(color) {
    return {
      backgroundColor: color
    };
  };

  var templateMaxWidth = function templateMaxWidth(width) {
    if (!width) return null;
    return {
      maxWidth: width
    };
  };

  var sidebarProps = {
    sidebarAreaFlush: sidebarAreaFlush,
    sidebarComponent: sidebarComponent,
    stickySidebar: stickySidebar
  };

  if (MainSection === UIAbstractPageTemplate.defaultProps.MainSection) {
    sidebarProps.sidebarStyle = sidebarStyle;
  }

  return /*#__PURE__*/_jsx("div", {
    className: "private-ie11-flex-wrapper",
    children: /*#__PURE__*/_jsxs(StyledPage, Object.assign({}, rest, {
      bodyClassName: getBodyClassNames(bodyClassName, pageLayout),
      className: pageClassName,
      navHeight: lazyEval(navHeight),
      style: Object.assign({}, templateBackgroundColor(pageBackgroundColor), {}, pageStyle),
      children: [/*#__PURE__*/_jsxs(UIAbstractPageSection, {
        className: headerWrapperClassNames,
        style: Object.assign({}, templateMaxWidth(pageMaxWidth)),
        children: [CustomRenderer.render(headerComponent, {
          title: title,
          use: headerUse
        }), tabs]
      }), /*#__PURE__*/_jsx("div", {
        className: mainWrapperClassNames,
        style: Object.assign({}, mainWrapperBackgroundColor(mainSectionBackgroundColor), {}, mainSectionStyle),
        children: /*#__PURE__*/_jsx(UIAbstractPageSection, {
          className: sectionClassNames,
          style: Object.assign({}, templateMaxWidth(pageMaxWidth)),
          children: /*#__PURE__*/_jsx(MainSection, Object.assign({}, sidebarProps, {
            style: Object.assign({}, mainWrapperBackgroundColor(mainSectionBackgroundColor), {}, mainSectionStyle),
            children: children
          }))
        })
      })]
    }))
  });
}

UIAbstractPageTemplate.propTypes = {
  asDevice: PropTypes.oneOf(['mobile', 'tablet', 'desktop']),
  bodyClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  contentAreaFlush: PropTypes.bool.isRequired,
  horizontalDivider: PropTypes.bool.isRequired,
  headerComponent: CustomRenderer.propType,
  MainSection: PropTypes.elementType,
  mainSectionBackgroundColor: PropTypes.string,
  mainSectionComponent: CustomRenderer.propType,
  mainSectionStyle: PropTypes.object,
  narrowLayout: PropTypes.bool.isRequired,
  navHeight: createLazyPropType(PropTypes.number).isRequired,
  pageBackgroundColor: PropTypes.string,
  pageLayout: PropTypes.oneOf(Object.keys(LAYOUT_CLASSES)),
  pageMaxWidth: PropTypes.number,
  pageStyle: PropTypes.object,
  sidebarComponent: CustomRenderer.propType,
  sidebarAreaFlush: PropTypes.bool,
  sidebarStyle: PropTypes.object,
  stickySidebar: PropTypes.bool,
  tabs: PropTypes.node,
  title: PropTypes.node
};
UIAbstractPageTemplate.defaultProps = {
  contentAreaFlush: false,
  headerComponent: UIHeader,
  horizontalDivider: false,
  MainSection: UIAbstractPageGridContent,
  narrowLayout: false,
  navHeight: getDefaultNavHeight,
  pageLayout: 'max-width',
  sidebarAreaFlush: false,
  stickySidebar: false
};
UIAbstractPageTemplate.displayName = 'UIAbstractPageTemplate';
export default UIAbstractPageTemplate;