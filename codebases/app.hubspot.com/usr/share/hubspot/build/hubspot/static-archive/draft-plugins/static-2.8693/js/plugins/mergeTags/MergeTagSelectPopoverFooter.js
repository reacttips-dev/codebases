'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import partial from 'transmute/partial';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIPopoverFooter from 'UIComponents/tooltip/UIPopoverFooter';

var MergeTagSelectPopoverFooter = function MergeTagSelectPopoverFooter(_ref) {
  var placeholderToken = _ref.placeholderToken,
      onInsert = _ref.onInsert,
      onCancel = _ref.onCancel;
  return /*#__PURE__*/_jsx(UIPopoverFooter, {
    children: /*#__PURE__*/_jsxs("div", {
      className: "merge-tag-popover-footer",
      children: [/*#__PURE__*/_jsx(UIButton, {
        use: "tertiary",
        size: "small",
        onClick: partial(onInsert, placeholderToken),
        disabled: placeholderToken.length === 0,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.mergeTagGroupPlugin.footer.buttons.insert"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        use: "tertiary-light",
        size: "small",
        onClick: onCancel,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.mergeTagGroupPlugin.footer.buttons.cancel"
        })
      })]
    })
  });
};

MergeTagSelectPopoverFooter.propTypes = {
  placeholderToken: PropTypes.string.isRequired,
  onInsert: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
export default MergeTagSelectPopoverFooter;