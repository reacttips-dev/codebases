'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import styled from 'styled-components';
import I18n from 'I18n';
import SimplePrompt from 'customer-data-ui-utilities/prompt/SimplePrompt';
import enviro from 'enviro';
var EmbeddedIframe = styled.iframe.withConfig({
  displayName: "BizOpsCreateContactContainer__EmbeddedIframe",
  componentId: "q9imbn-0"
})(["height:600px;margin-bottom:-8px;margin-left:-40px;margin-top:-25px;width:1000px;"]);

var BizOpsCreateContactContainer = function BizOpsCreateContactContainer(props) {
  var environment = enviro.getShort() === 'qa' ? 'qa' : '';
  var coldSourceUrl = "https://tools.hubteam" + environment + ".com/TerritoriesUI/embed/leads/new?source=crm";
  return /*#__PURE__*/_jsx(BaseDialog, {
    showConfirmButton: false,
    showCancelButton: false,
    onReject: props.onReject,
    title: I18n.text('bizOpsCreateContactContainer.title'),
    width: 1000,
    children: /*#__PURE__*/_jsx(EmbeddedIframe, {
      src: coldSourceUrl,
      frameBorder: "0",
      "data-selenium-test-bizops": "bizops-contact-cta-iframe"
    })
  });
};

BizOpsCreateContactContainer.propTypes = PromptablePropInterface;
export default SimplePrompt(BizOpsCreateContactContainer);