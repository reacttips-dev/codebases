'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import Loadable from 'UIComponents/decorators/Loadable';
import UIAbstractProgress from 'UIComponents/progress/UIAbstractProgress';
import UINanoProgress from 'UIComponents/progress/UINanoProgress';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import styled from 'styled-components';
var StyledUIPanel = styled(UIPanel).withConfig({
  displayName: "UniversalPreviewSidebarAsync__StyledUIPanel",
  componentId: "e71ueq-0"
})(["&&&{min-width:316px;width:25vw !important;max-width:477px;@media screen and (min-width:1920px){min-width:477px;}}"]);

var LoadingPanel = function LoadingPanel() {
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(UIPanelHeader, {
      children: /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.loading"
        })
      })
    }), /*#__PURE__*/_jsx("div", {
      style: {
        position: 'relative',
        width: 100
      },
      children: /*#__PURE__*/_jsx(UIAbstractProgress, {
        Component: UINanoProgress
      })
    })]
  });
};

var UniversalPreviewSidebarLoader = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "universal-preview-sidebar" */
    './UniversalPreviewSidebar').then(function (mod) {
      return mod.default;
    });
  },
  LoadingComponent: LoadingPanel
});

function UniversalPreviewSidebarAsync(props) {
  return /*#__PURE__*/_jsx(StyledUIPanel, {
    children: /*#__PURE__*/_jsx(UniversalPreviewSidebarLoader, Object.assign({}, props))
  });
}

export default UniversalPreviewSidebarAsync;