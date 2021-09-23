'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _resolvers;

import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import AutomationPlatformWorkflowReferenceResolver from 'reference-resolvers/resolvers/AutomationPlatformWorkflowReferenceResolver';
import FormReferenceResolver from 'reference-resolvers/resolvers/FormReferenceResolver';
import styled from 'styled-components';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H4 from 'UIComponents/elements/headings/H4';
import UISection from 'UIComponents/section/UISection';
import UnenrollmentTable from './automation/table/UnenrollmentTable';
import AutomationTabContent from './automation/AutomationTabContent';
import { isUngatedForEmbeddedAutomation } from 'SequencesUI/lib/permissions';
var CenteredTabContent = styled.div.withConfig({
  displayName: "EditorAutomationTab__CenteredTabContent",
  componentId: "o7qzd-0"
})(["margin:20px auto 0;max-width:", ";width:70%;"], function (props) {
  return props.largerWidth ? '1000px' : '800px';
});

var EditorAutomationTab = function EditorAutomationTab() {
  return /*#__PURE__*/_jsx(CenteredTabContent, {
    "data-test-id": "editor-automation-tab",
    largerWidth: isUngatedForEmbeddedAutomation(),
    children: isUngatedForEmbeddedAutomation() ? /*#__PURE__*/_jsx(AutomationTabContent, {}) : /*#__PURE__*/_jsxs(UISection, {
      children: [/*#__PURE__*/_jsx(H4, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "edit.automation.sectionHeaders.unenrollment"
        })
      }), /*#__PURE__*/_jsx(UnenrollmentTable, {})]
    })
  });
};

var resolvers = (_resolvers = {}, _defineProperty(_resolvers, ReferenceObjectTypes.AUTOMATION_PLATFORM_WORKFLOWS, AutomationPlatformWorkflowReferenceResolver), _defineProperty(_resolvers, ReferenceObjectTypes.FORM, FormReferenceResolver), _resolvers);
export default ProvideReferenceResolvers(resolvers, EditorAutomationTab, {
  mergeResolvers: true
});