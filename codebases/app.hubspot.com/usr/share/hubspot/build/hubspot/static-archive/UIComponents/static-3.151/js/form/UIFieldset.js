'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { LABEL_DEFAULT_PADDING_BOTTOM, LABEL_DEFAULT_PADDING_TOP } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { FieldsetContextProvider, defaultFieldsetContext } from '../context/FieldsetContext';
import UIHelpIcon from '../icon/UIHelpIcon';
import { INPUT_SIZE_OPTIONS } from '../input/InputConstants';
import UIOverlay from '../overlay/UIOverlay';
import * as CustomRenderer from '../utils/propTypes/customRenderer';
import { hidden } from '../utils/propTypes/decorators';
import UIFormControl from './UIFormControl';
import { Small } from '../elements';
/**
 * Note: This is the standards-recommmended markup pattern, but some AT, like
 * VoiceOver doesn't yet read the legend as the label for the nested controls.
 * Link: https://www.powermapper.com/tests/screen-readers/labelling/fieldset-with-yes-no-radio-buttons/
 **/

var Outer = styled.fieldset.withConfig({
  displayName: "UIFieldset__Outer",
  componentId: "sc-45k5uc-0"
})(["position:relative;min-width:0;margin:0;padding:0;border:0;"]);
var LabelWrapper = styled.div.withConfig({
  displayName: "UIFieldset__LabelWrapper",
  componentId: "sc-45k5uc-1"
})(["display:flex;flex-direction:column;padding-top:", ";padding-bottom:", ";"], function (_ref) {
  var hasLegend = _ref.hasLegend;
  return hasLegend && "" + LABEL_DEFAULT_PADDING_TOP;
}, function (_ref2) {
  var hasHelp = _ref2.hasHelp,
      hasLegend = _ref2.hasLegend;
  return (hasHelp || hasLegend) && LABEL_DEFAULT_PADDING_BOTTOM;
});
var FieldsetLegend = styled(function (props) {
  var children = props.children,
      className = props.className,
      id = props.id;
  return /*#__PURE__*/_jsxs("span", {
    children: [/*#__PURE__*/_jsx("legend", {
      id: id,
      className: "sr-only",
      children: children
    }), /*#__PURE__*/_jsx("span", {
      "aria-hidden": true,
      className: className,
      children: children
    })]
  });
}).withConfig({
  displayName: "UIFieldset__FieldsetLegend",
  componentId: "sc-45k5uc-2"
})(["padding-right:0;padding-bottom:0;", ";"], function (props) {
  return props.required && css(["::after{content:' *';}"]);
});
export default function UIFieldset(props) {
  var children = props.children,
      disabled = props.disabled,
      Legend = props.Legend,
      legend = props.legend,
      legendId = props.legendId,
      overlay = props.overlay,
      _size = props._size,
      _required = props._required,
      help = props.help,
      tooltip = props.tooltip,
      tooltipPlacement = props.tooltipPlacement,
      rest = _objectWithoutProperties(props, ["children", "disabled", "Legend", "legend", "legendId", "overlay", "_size", "_required", "help", "tooltip", "tooltipPlacement"]);

  var hasOverlay = !!overlay;
  var computedDisabled = hasOverlay ? true : disabled;
  var renderedLegend = legend ? /*#__PURE__*/_jsx(Legend, {
    id: legendId,
    required: _required,
    children: legend
  }) : null;
  var renderedLegendWithTooltip = tooltip ? /*#__PURE__*/_jsx(UIHelpIcon, {
    title: tooltip,
    tooltipPlacement: tooltipPlacement,
    children: renderedLegend
  }) : renderedLegend;
  return /*#__PURE__*/_jsxs(Outer, Object.assign({}, rest, {
    "aria-hidden": hasOverlay,
    disabled: computedDisabled,
    children: [/*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsxs(LabelWrapper, {
        hasLegend: renderedLegendWithTooltip != null,
        hasHelp: help != null,
        children: [renderedLegendWithTooltip, help != null ? /*#__PURE__*/_jsx(Small, {
          className: "private-form__inlinehelp",
          use: "help",
          children: help
        }) : null]
      }), /*#__PURE__*/_jsx(FieldsetContextProvider, {
        value: useMemo(function () {
          return {
            disabled: computedDisabled,
            size: _size
          };
        }, [computedDisabled, _size]),
        children: /*#__PURE__*/_jsx("div", {
          children: children
        })
      })]
    }), overlay && CustomRenderer.render(overlay, {
      contextual: true,
      use: overlay.type === UIOverlay ? 'light' : undefined
    }, {
      mergeType: 'aggressive'
    })]
  }));
}
UIFieldset.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  Legend: hidden(PropTypes.elementType.isRequired),
  legend: PropTypes.node,
  legendId: PropTypes.string,
  overlay: CustomRenderer.propType,
  tooltip: UIFormControl.propTypes.tooltip,
  tooltipPlacement: UIFormControl.propTypes.tooltipPlacement,
  help: UIFormControl.propTypes.help,
  _size: PropTypes.oneOf(Object.keys(INPUT_SIZE_OPTIONS)),
  _required: PropTypes.bool
};
UIFieldset.defaultProps = {
  disabled: defaultFieldsetContext.disabled,
  Legend: FieldsetLegend,
  _required: false,
  _size: defaultFieldsetContext.size,
  tooltipPlacement: 'top'
};
UIFieldset.displayName = 'UIFieldset';