'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import getTokenOptions from 'draft-plugins/utils/getTokenOptions';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
import UIPopoverHeader from 'UIComponents/tooltip/UIPopoverHeader';
import H4 from 'UIComponents/elements/headings/H4';

var MergeTagSelectPopoverHeader = function MergeTagSelectPopoverHeader(_ref) {
  var selectedType = _ref.selectedType,
      mergeTags = _ref.mergeTags,
      onChange = _ref.onChange;
  return /*#__PURE__*/_jsx(UIPopoverHeader, {
    children: /*#__PURE__*/_jsxs("div", {
      style: {
        width: '100%'
      },
      children: [/*#__PURE__*/_jsx(H4, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.mergeTagGroupPlugin.form.header"
        })
      }), /*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.mergeTagGroupPlugin.form.label"
        }),
        children: /*#__PURE__*/_jsx(UISelect, {
          defaultOpen: false,
          defaultValue: selectedType,
          options: getTokenOptions(mergeTags),
          onChange: onChange
        })
      })]
    })
  });
};

MergeTagSelectPopoverHeader.propTypes = {
  selectedType: PropTypes.string.isRequired,
  mergeTags: PropTypes.array,
  onChange: PropTypes.func.isRequired
};
export default MergeTagSelectPopoverHeader;