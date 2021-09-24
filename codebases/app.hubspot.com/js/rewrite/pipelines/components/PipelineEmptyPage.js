'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PortalIdParser from 'PortalIdParser';
import H4 from 'UIComponents/elements/headings/H4';
import UISection from 'UIComponents/section/UISection';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIIllustration from 'UIComponents/image/UIIllustration';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import UIMediaObject from 'UIComponents/layout/UIMediaObject';
import styled from 'styled-components';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
var StyledPage = styled.div.withConfig({
  displayName: "PipelineEmptyPage__StyledPage",
  componentId: "sc-1rtu26h-0"
})(["display:flex;align-items:center;justify-content:center;width:100%;"]);
var StyledSection = styled(UISection).withConfig({
  displayName: "PipelineEmptyPage__StyledSection",
  componentId: "sc-1rtu26h-1"
})(["width:600px;"]);
var portalId = PortalIdParser.get();
export var PipelineEmptyPage = function PipelineEmptyPage() {
  var objectTypeId = useSelectedObjectTypeId();
  var settingsUrl = "/pipelines-settings/" + portalId + "/object/" + objectTypeId;
  return /*#__PURE__*/_jsx(StyledPage, {
    children: /*#__PURE__*/_jsx(StyledSection, {
      use: "island",
      children: /*#__PURE__*/_jsx(UIMediaObject, {
        itemRight: /*#__PURE__*/_jsx(UIIllustration, {
          name: "custom-objects",
          width: 200
        }),
        children: /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(H4, {
            role: "presentation",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.emptyBoardPage.title"
            })
          }), /*#__PURE__*/_jsx("p", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.emptyBoardPage.body"
            })
          }), /*#__PURE__*/_jsx("p", {
            children: /*#__PURE__*/_jsx(KnowledgeBaseButton, {
              url: "https://knowledge.hubspot.com/crm-setup/use-custom-objects",
              useZorse: true,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "indexPage.emptyBoardPage.kbLink"
              })
            })
          }), /*#__PURE__*/_jsx(UISection, {
            children: /*#__PURE__*/_jsx(UIButton, {
              href: settingsUrl,
              external: true,
              use: "tertiary",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "indexPage.emptyBoardPage.button"
              })
            })
          })]
        })
      })
    })
  });
};