'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import * as SalesModalTabs from 'sales-modal/constants/SalesModalTabs';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UITruncateString from 'UIComponents/text/UITruncateString';

var SalesModalFooter = function SalesModalFooter(props) {
  var contentPayload = props.contentPayload,
      currentTab = props.currentTab,
      docSkipForm = props.docSkipForm,
      onChangeDocSkipForm = props.onChangeDocSkipForm;
  var email = contentPayload.get('email');
  var shouldShowDocumentsOption = currentTab === SalesModalTabs.DOCUMENTS;
  var documentsOption = shouldShowDocumentsOption ? /*#__PURE__*/_jsx(UICheckbox, {
    className: "m-left-2 m-right-2",
    alignment: "center",
    checked: !docSkipForm,
    onChange: onChangeDocSkipForm,
    children: /*#__PURE__*/_jsx("small", {
      children: /*#__PURE__*/_jsx(UITruncateString, {
        matchContentWidth: true,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "modalFooter.docSkipForm"
        })
      })
    })
  }) : null;
  return /*#__PURE__*/_jsxs(UIFlex, {
    className: "sales-modal-footer p-x-6 p-top-2 p-bottom-2",
    align: "center",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "sales-modal-footer-email m-right-auto align-center",
      children: [/*#__PURE__*/_jsx(UIFormLabel, {
        htmlFor: "email",
        className: "p-all-0 m-right-2",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.footer.to"
        })
      }), /*#__PURE__*/_jsx("span", {
        id: "email",
        className: "is--text--help",
        children: email
      })]
    }), documentsOption]
  });
};

SalesModalFooter.propTypes = {
  currentTab: PropTypes.oneOf(Object.values(SalesModalTabs || {})).isRequired,
  contentPayload: PropTypes.instanceOf(ImmutableMap).isRequired,
  docSkipForm: PropTypes.bool.isRequired,
  onChangeDocSkipForm: PropTypes.func.isRequired
};
export default SalesModalFooter;