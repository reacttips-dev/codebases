'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { OZ, OZ_LIGHT } from 'HubStyleTokens/colors';

var DocumentLinkToken = function DocumentLinkToken(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_jsx(UITooltip, {
    title: I18n.text('draftPlugins.documents.mergeTag.tooltip'),
    placement: "top",
    children: /*#__PURE__*/_jsx("span", {
      style: {
        height: '20px',
        width: 'auto',
        padding: '4px 8px',
        margin: '0 4px',
        backgroundColor: OZ_LIGHT,
        borderRadius: '2px',
        color: OZ,
        border: 'solid 1px transparent'
      },
      children: children
    })
  });
};

DocumentLinkToken.propTypes = {
  children: PropTypes.any
};
export default DocumentLinkToken;