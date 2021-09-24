'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import UISelect from 'UIComponents/input/UISelect';
import UIFormControl from 'UIComponents/form/UIFormControl';
import { LawfulBasis } from '../Constants';

var getOptions = function getOptions(_ref) {
  var _ref$hideConsent = _ref.hideConsent,
      hideConsent = _ref$hideConsent === void 0 ? false : _ref$hideConsent,
      _ref$hideContract = _ref.hideContract,
      hideContract = _ref$hideContract === void 0 ? false : _ref$hideContract,
      _ref$showHelpText = _ref.showHelpText,
      showHelpText = _ref$showHelpText === void 0 ? false : _ref$showHelpText,
      _ref$hideNonGdpr = _ref.hideNonGdpr,
      hideNonGdpr = _ref$hideNonGdpr === void 0 ? false : _ref$hideNonGdpr;
  var options = [Object.assign({
    text: I18n.text("options.lawfulBasis." + LawfulBasis.LEGITIMATE_INTEREST_PQL),
    value: LawfulBasis.LEGITIMATE_INTEREST_PQL
  }, showHelpText && {
    help: I18n.text("options.lawfulBasis.help." + LawfulBasis.LEGITIMATE_INTEREST_PQL)
  }), Object.assign({
    text: I18n.text("options.lawfulBasis." + LawfulBasis.LEGITIMATE_INTEREST_CLIENT),
    value: LawfulBasis.LEGITIMATE_INTEREST_CLIENT
  }, showHelpText && {
    help: I18n.text("options.lawfulBasis.help." + LawfulBasis.LEGITIMATE_INTEREST_CLIENT)
  })];

  if (!hideContract) {
    options.push(Object.assign({
      text: I18n.text("options.lawfulBasis." + LawfulBasis.PERFORMANCE_OF_CONTRACT),
      value: LawfulBasis.PERFORMANCE_OF_CONTRACT
    }, showHelpText && {
      help: I18n.text("options.lawfulBasis.help." + LawfulBasis.PERFORMANCE_OF_CONTRACT)
    }));
  }

  if (!hideConsent) {
    options.push(Object.assign({
      text: I18n.text("options.lawfulBasis." + LawfulBasis.CONSENT_WITH_NOTICE),
      value: LawfulBasis.CONSENT_WITH_NOTICE
    }, showHelpText && {
      help: I18n.text("options.lawfulBasis.help." + LawfulBasis.CONSENT_WITH_NOTICE)
    }));
  }

  if (!hideNonGdpr) {
    options.push(Object.assign({
      text: I18n.text("options.lawfulBasis." + LawfulBasis.NON_GDPR),
      value: LawfulBasis.NON_GDPR
    }, showHelpText && {
      help: I18n.text("options.lawfulBasis.help." + LawfulBasis.NON_GDPR)
    }));
  }

  return options;
};

var LawfulBasisSelect = function LawfulBasisSelect(props) {
  return /*#__PURE__*/_jsx(UIFormControl, Object.assign({
    label: I18n.text('labels.lawfulBasis')
  }, props.formControlProps, {
    children: /*#__PURE__*/_jsx(UISelect, Object.assign({
      placeholder: I18n.text('placeholders.lawfulBasis')
    }, props, {
      options: getOptions(props),
      dropdownClassName: "untruncate",
      "data-selenium-test": "gdpr-legal-basis-select"
    }))
  }));
};

export default LawfulBasisSelect;