'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { PANEL_FOOTER_BACKGROUND_COLOR, PANEL_FOOTER_BORDER_COLOR } from 'HubStyleTokens/theme';
import styled from 'styled-components';
import UIAbstractPageSection from '../page/UIAbstractPageSection';
import { setTemplateMaxWidth } from '../utils/Styles';
import UIStickyFooter from './UIStickyFooter';
var StickyFooter = styled(UIStickyFooter).withConfig({
  displayName: "UIFixedSaveBar__StickyFooter",
  componentId: "sc-1sg6grs-0"
})(["&&{background-color:", ";border-top:1px solid ", ";box-shadow:none;padding-bottom:20px;padding-top:20px;}"], PANEL_FOOTER_BACKGROUND_COLOR, PANEL_FOOTER_BORDER_COLOR);
var PageSection = styled(UIAbstractPageSection).withConfig({
  displayName: "UIFixedSaveBar__PageSection",
  componentId: "sc-1sg6grs-1"
})([".space-sword--max-width &{", "}"], setTemplateMaxWidth());
export default function UIFixedSaveBar(props) {
  var children = props.children,
      rest = _objectWithoutProperties(props, ["children"]);

  return /*#__PURE__*/_jsx(StickyFooter, Object.assign({}, rest, {
    children: /*#__PURE__*/_jsx(PageSection, {
      children: children
    })
  }));
}
UIFixedSaveBar.propTypes = UIStickyFooter.propTypes;
UIFixedSaveBar.defaultProps = UIStickyFooter.defaultProps;
UIFixedSaveBar.displayName = 'UIFixedSaveBar';