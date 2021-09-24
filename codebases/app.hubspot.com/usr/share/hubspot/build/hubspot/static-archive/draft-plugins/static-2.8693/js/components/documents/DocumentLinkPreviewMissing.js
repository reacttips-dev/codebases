'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { CANDY_APPLE, OBSIDIAN } from 'HubStyleTokens/colors';

var DocumentLinkPreviewMissing = function DocumentLinkPreviewMissing(_ref) {
  var block = _ref.block;
  var name = block.getData().get('name');
  return /*#__PURE__*/_jsx("table", {
    className: "document-link-preview-table",
    style: {
      cursor: 'pointer',
      width: '400px',
      border: "solid 1px " + CANDY_APPLE,
      padding: '8px',
      borderRadius: '2px'
    },
    children: /*#__PURE__*/_jsx("tbody", {
      children: /*#__PURE__*/_jsx("tr", {
        children: /*#__PURE__*/_jsx("td", {
          style: {
            paddingLeft: '8px',
            textAlign: 'left'
          },
          children: /*#__PURE__*/_jsx("h2", {
            className: "document-link-preview-name",
            style: {
              color: OBSIDIAN,
              marginTop: 0,
              marginBottom: '8px'
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "draftPlugins.documentLinkPreviewPlugin.missing.name",
              options: {
                name: name
              }
            })
          })
        })
      })
    })
  });
};

DocumentLinkPreviewMissing.propTypes = {
  block: PropTypes.object.isRequired
};
export default DocumentLinkPreviewMissing;