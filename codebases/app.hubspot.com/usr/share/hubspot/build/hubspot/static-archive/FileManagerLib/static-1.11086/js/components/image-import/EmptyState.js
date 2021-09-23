'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { useDispatch } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIEmptyState from 'UIComponents/empty/UIEmptyState';
import UIButton from 'UIComponents/button/UIButton';
import { tryAgain } from '../../actions/BulkImageImport';

var i18nKey = function i18nKey(suffix) {
  return "FileManagerLib.panels.bulkImageImport.noImages." + suffix;
};

var EmptyState = function EmptyState() {
  var dispatch = useDispatch();
  return /*#__PURE__*/_jsx(UIEmptyState, {
    layout: "vertical",
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: i18nKey('title')
    }),
    primaryContent: /*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: i18nKey('message')
        })
      })
    }),
    secondaryContent: /*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx(UIButton, {
        onClick: function onClick() {
          return dispatch(tryAgain());
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: i18nKey('tryAgainButton')
        })
      })
    }),
    secondaryContentWidth: 200
  });
};

export default EmptyState;