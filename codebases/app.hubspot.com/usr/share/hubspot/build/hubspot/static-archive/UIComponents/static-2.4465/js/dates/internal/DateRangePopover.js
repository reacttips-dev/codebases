'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { BATTLESHIP } from 'HubStyleTokens/colors';
import { DROPDOWN_SELECTED_BACKGROUND_COLOR } from 'HubStyleTokens/theme';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import UIButton from '../../button/UIButton';
import SyntheticEvent from '../../core/SyntheticEvent';
import UIFlex from '../../layout/UIFlex';
import UIScrollContainer from '../../scroll/UIScrollContainer';
import UIControlledPopover from '../../tooltip/UIControlledPopover';
import { SimpleDateType } from '../../types/SimpleDateTypes';
import lazyEval from '../../utils/lazyEval';
import createLazyPropType from '../../utils/propTypes/createLazyPropType';
import CalendarFooterButton from './CalendarFooterButton';
import CalendarPageWithRange from './CalendarPageWithRange';
var FooterButtonWrapper = styled.div.withConfig({
  displayName: "DateRangePopover__FooterButtonWrapper",
  componentId: "sc-1pgqbl0-0"
})(["display:flex;justify-content:space-between;margin:16px 0 12px;"]);
var FooterButton = styled(CalendarFooterButton).withConfig({
  displayName: "DateRangePopover__FooterButton",
  componentId: "sc-1pgqbl0-1"
})(["flex-basis:100%;"]);
var highlightMixin = css(["background-color:", ";"], DROPDOWN_SELECTED_BACKGROUND_COLOR);
var PresetButton = styled(function (_ref) {
  var __selected = _ref.selected,
      rest = _objectWithoutProperties(_ref, ["selected"]);

  return /*#__PURE__*/_jsx(UIButton, Object.assign({}, rest));
}).attrs({
  truncate: true,
  use: 'unstyled'
}).withConfig({
  displayName: "DateRangePopover__PresetButton",
  componentId: "sc-1pgqbl0-2"
})(["&&&{width:100%;margin:0;padding:8px 20px;&:hover{", ";}", ";}"], highlightMixin, function (_ref2) {
  var selected = _ref2.selected;
  return selected && highlightMixin;
});
var CalendarPageContainer = styled.div.withConfig({
  displayName: "DateRangePopover__CalendarPageContainer",
  componentId: "sc-1pgqbl0-3"
})(["padding:20px 24px 9px;border-left:1px solid ", ";"], BATTLESHIP);

var DateRangePopover = function DateRangePopover(props) {
  var calendarId = props.calendarId,
      children = props.children,
      clearLabel = props.clearLabel,
      id = props.id,
      onActiveBoundChange = props.onActiveBoundChange,
      onChange = props.onChange,
      onFocusLeave = props.onFocusLeave,
      onOpenChange = props.onOpenChange,
      open = props.open,
      presets = props.presets,
      showPresets = props.showPresets,
      tz = props.tz,
      value = props.value,
      rest = _objectWithoutProperties(props, ["calendarId", "children", "clearLabel", "id", "onActiveBoundChange", "onChange", "onFocusLeave", "onOpenChange", "open", "presets", "showPresets", "tz", "value"]);

  return /*#__PURE__*/_jsx(UIControlledPopover, {
    arrowSize: "none",
    autoPlacement: "vert",
    content: /*#__PURE__*/_jsxs(UIFlex, {
      style: {
        height: 342
      },
      children: [showPresets && /*#__PURE__*/_jsx(UIScrollContainer, {
        scrollDirection: "vertical",
        style: {
          width: 200,
          height: '100%'
        },
        children: presets.map(function (preset) {
          var presetId = preset.presetId;
          return /*#__PURE__*/_jsx(PresetButton, {
            use: "secondary",
            className: "private-typeahead-result",
            onClick: function onClick() {
              onChange(SyntheticEvent(Object.assign({}, preset.getValue(tz), {
                presetId: presetId
              })));
            },
            selected: value.presetId === presetId,
            "data-preset-id": presetId,
            children: preset.getText()
          }, presetId);
        })
      }), /*#__PURE__*/_jsxs(CalendarPageContainer, {
        showPresets: showPresets,
        children: [/*#__PURE__*/_jsx(CalendarPageWithRange, Object.assign({}, rest, {
          id: calendarId,
          onActiveBoundChange: onActiveBoundChange,
          onChange: onChange,
          tabIndex: -1,
          value: value
        })), /*#__PURE__*/_jsx(FooterButtonWrapper, {
          children: /*#__PURE__*/_jsx(FooterButton, {
            "data-action": "clear",
            onClick: function onClick() {
              onChange(SyntheticEvent({
                startDate: null,
                endDate: null
              }));
              onActiveBoundChange(SyntheticEvent(null));
            },
            children: lazyEval(clearLabel)
          })
        })]
      })]
    }),
    onOpenChange: onOpenChange,
    pinToConstraint: ['left', 'right'],
    placement: "bottom right",
    id: id,
    onFocusLeave: onFocusLeave,
    open: open,
    children: children
  });
};

if (process.env.NODE_ENV !== 'production') {
  DateRangePopover.propTypes = {
    activeBound: PropTypes.oneOf(['start', 'end']),
    calendarId: PropTypes.string.isRequired,
    calendarPage: PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired
    }),
    children: PropTypes.node.isRequired,
    clearLabel: createLazyPropType(PropTypes.string),
    max: SimpleDateType,
    maxValidationMessage: createLazyPropType(PropTypes.string),
    min: SimpleDateType,
    minValidationMessage: createLazyPropType(PropTypes.string),
    onActiveBoundChange: PropTypes.func.isRequired,
    onCalendarPageChange: PropTypes.func.isRequired,
    onChange: CalendarPageWithRange.propTypes.onChange,
    onFocusLeave: UIControlledPopover.propTypes.onFocusLeave,
    onOpenChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    presets: PropTypes.arrayOf(PropTypes.shape({
      presetId: PropTypes.string.isRequired,
      getValue: PropTypes.func.isRequired,
      getText: PropTypes.func.isRequired
    }).isRequired).isRequired,
    showPresets: PropTypes.bool,
    today: SimpleDateType.isRequired,
    todayLabel: createLazyPropType(PropTypes.string),
    tz: PropTypes.string.isRequired,
    value: CalendarPageWithRange.propTypes.value
  };
}

export default DateRangePopover;