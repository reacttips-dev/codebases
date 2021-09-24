'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

var _NAME_LABELS;

import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import getLang from 'I18n/utils/getLang';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIBox from 'UIComponents/layout/UIBox';
import * as CustomRenderer from 'UIComponents/utils/propTypes/customRenderer';
import { DISTANCE_MEASUREMENT_EXTRA_SMALL } from 'HubStyleTokens/sizes';
import { remCalc } from 'UIComponents/core/Style';
import NameTypes from '../constants/NameTypes';
import SingleNameInput from '../internal/components/SingleNameInput';
var FORMATS = {
  default: [NameTypes.GIVEN_NAME, NameTypes.FAMILY_NAME],
  ja: [NameTypes.FAMILY_NAME, NameTypes.GIVEN_NAME]
};
var NAME_LABELS = (_NAME_LABELS = {}, _defineProperty(_NAME_LABELS, NameTypes.GIVEN_NAME, function () {
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "i18nAddon.fullNameInput.givenName"
  });
}), _defineProperty(_NAME_LABELS, NameTypes.FAMILY_NAME, function () {
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "i18nAddon.fullNameInput.familyName"
  });
}), _NAME_LABELS);
var nameMargin = parseInt(DISTANCE_MEASUREMENT_EXTRA_SMALL, 10) / 2;
export default createReactClass({
  displayName: "FullNameInput",
  propTypes: {
    direction: PropTypes.oneOf(['row', 'column']),
    familyNameInput: CustomRenderer.propType.isRequired,
    givenNameInput: CustomRenderer.propType.isRequired,
    wrap: PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      direction: 'column',
      wrap: 'nowrap'
    };
  },
  render: function render() {
    var _this$props = this.props,
        direction = _this$props.direction,
        familyNameInput = _this$props.familyNameInput,
        firstInputProps = _this$props.firstInputProps,
        givenNameInput = _this$props.givenNameInput,
        secondInputProps = _this$props.secondInputProps,
        wrap = _this$props.wrap;
    var lang = getLang();
    var format = FORMATS[lang] ? FORMATS[lang] : FORMATS.default;
    var firstInputType = format[0];
    var secondInputType = format[1];
    var firstLabel = NAME_LABELS[firstInputType];
    var secondLabel = NAME_LABELS[secondInputType];
    var isRow = direction === 'row';
    var wrapBoxStyle = isRow ? {
      margin: remCalc(nameMargin)
    } : null;
    var flexBoxStyle = isRow ? {
      margin: remCalc(nameMargin * -1)
    } : null;
    var containerStyle = isRow ? {
      marginRight: remCalc(nameMargin * -2)
    } : null;
    var firstInput = givenNameInput;
    var secondInput = familyNameInput;

    if (firstInputType === NameTypes.FAMILY_NAME) {
      firstInput = familyNameInput;
      secondInput = givenNameInput;
    }

    return /*#__PURE__*/_jsx("div", {
      style: containerStyle,
      children: /*#__PURE__*/_jsxs(UIFlex, {
        direction: direction,
        wrap: wrap,
        align: "stretch",
        style: flexBoxStyle,
        children: [/*#__PURE__*/_jsx(UIBox, {
          grow: 1,
          style: wrapBoxStyle,
          children: /*#__PURE__*/_jsx(SingleNameInput, Object.assign({}, firstInputProps, {
            input: firstInput,
            label: firstLabel
          }))
        }), /*#__PURE__*/_jsx(UIBox, {
          grow: 1,
          style: wrapBoxStyle,
          children: /*#__PURE__*/_jsx(SingleNameInput, Object.assign({}, secondInputProps, {
            input: secondInput,
            label: secondLabel
          }))
        })]
      })
    });
  }
});