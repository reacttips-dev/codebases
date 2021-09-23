'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
import { MAX_VIEW_NAME_LENGTH } from '../../../crm_ui/views/ViewNameLengthLimit';
import { useValidateViewName } from '../hooks/useValidateViewName';
import ViewNameEditorLoader from './ViewNameEditorLoader';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIBox from 'UIComponents/layout/UIBox';

var ViewNameEditor = function ViewNameEditor(_ref) {
  var _ref$shouldShowError = _ref.shouldShowError,
      shouldShowError = _ref$shouldShowError === void 0 ? true : _ref$shouldShowError,
      name = _ref.name,
      onChange = _ref.onChange,
      onValidChange = _ref.onValidChange;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isChanged = _useState2[0],
      setIsChanged = _useState2[1];

  var handleBlur = useCallback(function () {
    return setIsChanged(true);
  }, []);

  var _useValidateViewName = useValidateViewName(name),
      isEmpty = _useValidateViewName.isEmpty,
      isDuplicate = _useValidateViewName.isDuplicate,
      isLoading = _useValidateViewName.isLoading;

  var hasError = isEmpty || isDuplicate;
  useEffect(function () {
    onValidChange(!isLoading && !hasError);
  }, [hasError, isLoading, onValidChange]);
  var shouldShowErrorMessage = hasError && isChanged && !isLoading && shouldShowError;
  var errorMessage = isEmpty ? /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "index.views.nameInput.empty"
  }) : /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "index.views.nameInput.duplicate",
    options: {
      name: name
    }
  });
  var handleChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setIsChanged(true);
    onChange(value);
  }, [onChange]);
  return /*#__PURE__*/_jsxs(UIFlex, {
    children: [/*#__PURE__*/_jsx(UIBox, {
      grow: 1,
      children: /*#__PURE__*/_jsx(UIFormControl, {
        "data-test-id": "view-name-input-form-control",
        error: shouldShowErrorMessage,
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "index.views.nameInput.label"
        }),
        onBlur: handleBlur,
        required: true,
        validationMessage: shouldShowErrorMessage && errorMessage,
        children: /*#__PURE__*/_jsx(UITextInput, {
          "data-selenium-test": "view-name-input",
          autoComplete: "off",
          maxLength: MAX_VIEW_NAME_LENGTH,
          autoFocus: true,
          value: name,
          onChange: handleChange
        })
      })
    }), /*#__PURE__*/_jsx(ViewNameEditorLoader, {
      loading: isLoading,
      hasError: hasError
    })]
  });
};

ViewNameEditor.propTypes = {
  name: PropTypes.string.isRequired,
  shouldShowError: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onValidChange: PropTypes.func.isRequired
};
export default ViewNameEditor;