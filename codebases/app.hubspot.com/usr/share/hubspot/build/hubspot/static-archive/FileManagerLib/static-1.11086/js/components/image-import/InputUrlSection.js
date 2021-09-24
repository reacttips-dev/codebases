'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIButton from 'UIComponents/button/UIButton';
import UITextInput from 'UIComponents/input/UITextInput';
import { startCrawlUriForImages } from '../../actions/BulkImageImport';

var i18nKey = function i18nKey(suffix) {
  return "FileManagerLib.panels.bulkImageImport." + suffix;
};

var FullWidthFlex = styled(UIFlex).withConfig({
  displayName: "InputUrlSection__FullWidthFlex",
  componentId: "sc-1em5hme-0"
})(["&&{width:100%;}"]);

var InputUrlSection = function InputUrlSection() {
  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      tempUrl = _useState2[0],
      setTempUrl = _useState2[1];

  var dispatch = useDispatch();

  var handleUrlChange = function handleUrlChange(evt) {
    setTempUrl(evt.target.value);
  };

  var handlePreviewClick = function handlePreviewClick() {
    dispatch(startCrawlUriForImages(tempUrl));
  };

  return /*#__PURE__*/_jsxs(UIFlex, {
    direction: "column",
    children: [/*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: i18nKey('description')
      })
    }), /*#__PURE__*/_jsx(UIFormControl, {
      className: "from-url-panel__url-field",
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: i18nKey('imageUrlLabel')
      }),
      children: /*#__PURE__*/_jsx(UITextInput, {
        onChange: handleUrlChange,
        placeholder: I18n.text(i18nKey('imageUrlPlaceholder'))
      })
    }), /*#__PURE__*/_jsx(FullWidthFlex, {
      direction: "row",
      justify: "end",
      children: /*#__PURE__*/_jsx(UIButton, {
        className: "m-top-2",
        use: "primary",
        disabled: !tempUrl || tempUrl.length === 0,
        onClick: handlePreviewClick,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "FileManagerLib.actions.preview"
        })
      })
    })]
  });
};

InputUrlSection.defaultProps = {
  hasAcceptedImportCopyrightNotice: false
};
export default InputUrlSection;