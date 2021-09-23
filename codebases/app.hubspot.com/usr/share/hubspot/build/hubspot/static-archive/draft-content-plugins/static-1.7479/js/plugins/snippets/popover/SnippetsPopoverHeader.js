'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { getNewSnippetsUrl, getSnippetsUrl } from 'draft-plugins/lib/links';
import UIButton from 'UIComponents/button/UIButton';
import UIBox from 'UIComponents/layout/UIBox';
import UIFlex from 'UIComponents/layout/UIFlex';

var SnippetsPopoverHeader = function SnippetsPopoverHeader(_ref) {
  var portalId = _ref.portalId;
  return /*#__PURE__*/_jsxs(UIFlex, {
    justify: "between",
    align: "center",
    className: "m-bottom-3",
    children: [/*#__PURE__*/_jsx("h5", {
      className: "m-bottom-0",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "draftPlugins.snippetsPlugin.popover.header.insertSnippet"
      })
    }), /*#__PURE__*/_jsxs(UIBox, {
      grow: 0,
      children: [/*#__PURE__*/_jsx(UIButton, {
        external: true,
        href: getSnippetsUrl(portalId),
        size: "extra-small",
        use: "tertiary-light",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.snippetsPlugin.popover.header.manage"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        external: true,
        href: getNewSnippetsUrl(portalId),
        size: "extra-small",
        use: "tertiary",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.snippetsPlugin.popover.header.createNew"
        })
      })]
    })]
  });
};

SnippetsPopoverHeader.propTypes = {
  portalId: PropTypes.number.isRequired
};
export default SnippetsPopoverHeader;