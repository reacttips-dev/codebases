'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PortalIdParser from 'PortalIdParser';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import UIButton from 'UIComponents/button/UIButton';
import UIIconButton from 'UIComponents/button/UIIconButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import { getMeetingsUrl, getSnippetsUrl, getDocumentsUrl, getKnowledgeUrl } from '../../lib/links';
var PLUGIN_TO_MANAGE_URL = {
  documents: getDocumentsUrl,
  knowledgeArticles: getKnowledgeUrl,
  meetings: getMeetingsUrl,
  snippets: getSnippetsUrl
};
var Divider = styled.div.withConfig({
  displayName: "InlineInsertHeader__Divider",
  componentId: "sc-1wjcn5g-0"
})(["background-color:", ";height:24px;margin-right:12px;width:1px;"], BATTLESHIP);
var MediaHeader = styled.div.withConfig({
  displayName: "InlineInsertHeader__MediaHeader",
  componentId: "sc-1wjcn5g-1"
})(["align-items:center;display:flex;justify-content:space-between;width:100%;"]);

var InlineInsertHeader = function InlineInsertHeader(props) {
  var mode = props.mode,
      onBackClick = props.onBackClick;
  var portalId = PortalIdParser.get();
  var getManageUrl = PLUGIN_TO_MANAGE_URL[mode];
  var manageUrl;

  if (getManageUrl) {
    manageUrl = getManageUrl(portalId);
  }

  return /*#__PURE__*/_jsxs("div", {
    className: "display-flex align-center is--heading-7 m-bottom-0 m-x-5 m-top-5",
    children: [/*#__PURE__*/_jsx(UIIconButton, {
      onClick: onBackClick,
      use: "link",
      children: /*#__PURE__*/_jsx(UIIcon, {
        name: "left"
      })
    }), /*#__PURE__*/_jsx(Divider, {}), /*#__PURE__*/_jsxs(MediaHeader, {
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: "draftPlugins.insertGroupPlugin.insertItem." + mode
      }), manageUrl && /*#__PURE__*/_jsx(UIButton, {
        external: true,
        href: manageUrl,
        size: "extra-small",
        use: "tertiary-light",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.insertGroupPlugin.manageContentLink"
        })
      })]
    })]
  });
};

InlineInsertHeader.propTypes = {
  mode: PropTypes.string.isRequired,
  onBackClick: PropTypes.func.isRequired
};
export default InlineInsertHeader;