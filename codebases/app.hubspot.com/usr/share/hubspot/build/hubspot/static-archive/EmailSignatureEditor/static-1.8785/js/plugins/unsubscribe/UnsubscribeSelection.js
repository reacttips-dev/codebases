'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import getLangLocale from 'I18n/utils/getLangLocale';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import { LINK_TYPES } from './UnsubscribeConstants';

var UnsubscribeSelection = function UnsubscribeSelection(_ref) {
  var selectedLinkType = _ref.selectedLinkType,
      _ref$selectedLang = _ref.selectedLang,
      selectedLang = _ref$selectedLang === void 0 ? getLangLocale() : _ref$selectedLang,
      _onChange = _ref.onChange,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled;
  var unsubscribeSelection = Object.keys(LINK_TYPES).map(function (linkType) {
    var text = /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "signatureEditorModal.unsubscribeLink." + linkType,
      options: {
        link: /*#__PURE__*/_jsx("a", {
          children: I18n.text('signatureEditorModal.unsubscribeLink.link', {
            locale: selectedLang
          })
        }),
        locale: selectedLang
      }
    });

    return /*#__PURE__*/_jsx(UIRadioInput, {
      "data-selenium-test": "unsubscribe_selection_" + linkType,
      className: "m-bottom-1",
      name: "unsubscribe-link-type",
      checked: linkType === selectedLinkType,
      onChange: function onChange() {
        return _onChange(linkType);
      },
      disabled: disabled,
      children: text
    }, linkType + "_" + selectedLang);
  });
  return /*#__PURE__*/_jsx("div", {
    children: unsubscribeSelection
  });
};

UnsubscribeSelection.propTypes = {
  selectedLinkType: PropTypes.oneOf(Object.keys(LINK_TYPES)).isRequired,
  selectedLang: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
export default UnsubscribeSelection;