'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import PropertyType from 'customer-data-objects-ui-components/propTypes/PropertyType';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useReducer, memo, useMemo } from 'react';
import UIBox from 'UIComponents/layout/UIBox';
import UIButton from 'UIComponents/button/UIButton';
import UIDropdownCaret from 'UIComponents/dropdown/UIDropdownCaret';
import UIFlex from 'UIComponents/layout/UIFlex';
import UINumberInput from 'UIComponents/input/UINumberInput';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UISelect from 'UIComponents/input/UISelect';
import get from 'transmute/get';
import invariant from 'react-utils/invariant';
import isNumber from 'transmute/isNumber';
import { initialState, reducer, actions, checkIfOperatorSupported, optionValueToOperator, orderedOptions, getDurationOptions } from '../utils/numberDurationUtil';

var DurationQuickFilter = function DurationQuickFilter(_ref) {
  var unsafeFilter = _ref.filter,
      onValueChange = _ref.onValueChange,
      property = _ref.property;
  var currentFilterOperator = get('operator', unsafeFilter); // If the operator type is not supported in the quick filter then we don't
  // want to use the quick filter, it will show up in the advanced panel

  var filter = checkIfOperatorSupported(currentFilterOperator) ? unsafeFilter : undefined;

  var _useReducer = useReducer(reducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  useEffect(function () {
    if (!filter) {
      dispatch({
        type: actions.reset
      });
    }
  }, [dispatch, filter]);
  var onApplyChanges = useCallback(function () {
    var operator = optionValueToOperator[state.operatorValue];
    invariant(operator, "Unable to find a operator for operator type \"" + state.operatorValue + "\"");
    var isValidNumbers = isNumber(state.rightValue) && isNumber(state.leftValue);

    if (isValidNumbers) {
      var leftValue = I18n.moment.duration(state.leftValue, state.durationValue).valueOf();
      var rightValue = I18n.moment.duration(state.rightValue, state.durationValue).valueOf();
      var args = state.leftInputEnabled ? [property, Math.min(leftValue, rightValue), Math.max(leftValue, rightValue)] : [property, rightValue];
      onValueChange(property.name, operator.of.apply(operator, args));
    } else {
      onValueChange(property.name, null);
    }

    dispatch({
      type: actions.openedStateChanged
    });
  }, [state, onValueChange, property, dispatch]);
  var onClearChanges = useCallback(function () {
    dispatch({
      type: actions.reset
    });
    onValueChange(property.name, null);
  }, [property, onValueChange]);
  var operatorOptions = useMemo(function () {
    return orderedOptions.map(function (_ref2) {
      var langToken = _ref2.langToken,
          symbol = _ref2.symbol,
          value = _ref2.value;
      return {
        text: I18n.text(langToken),
        dropdownText: symbol + " " + I18n.text(langToken),
        value: value
      };
    });
  }, []);
  var buttonDisplayText = property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;
  return /*#__PURE__*/_jsx("label", {
    children: /*#__PURE__*/_jsx(UIPopover, {
      autoPlacement: false,
      closeOnOutsideClick: true,
      content: {
        body: /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(UIFlex, {
            className: "p-bottom-2",
            children: /*#__PURE__*/_jsx(UIBox, {
              children: /*#__PURE__*/_jsx(UISelect, {
                "data-selenium-test": "quickfilters-" + property.name + "-cmp",
                onChange: function onChange(evt) {
                  dispatch({
                    type: actions.operatorChanged,
                    payload: evt.target.value
                  });
                },
                options: operatorOptions,
                value: state.operatorValue
              })
            })
          }), /*#__PURE__*/_jsxs(UIFlex, {
            align: "center",
            children: [state.leftInputEnabled && /*#__PURE__*/_jsx(UIBox, {
              grow: 1,
              className: "p-right-1",
              children: /*#__PURE__*/_jsx(UINumberInput, {
                "data-selenium-test": "quickfilters-" + property.name + "-lhs",
                disabled: !state.leftInputEnabled,
                onChange: function onChange(evt) {
                  return dispatch({
                    type: actions.leftValueChanged,
                    payload: evt.target.value
                  });
                },
                value: state.leftValue
              })
            }), state.leftInputEnabled && /*#__PURE__*/_jsx(UIBox, {
              grow: 1,
              className: "p-right-1",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "indexPage.quickFilters.duration.conjunction.and"
              })
            }), /*#__PURE__*/_jsx(UIBox, {
              grow: 1,
              className: "p-right-3",
              children: /*#__PURE__*/_jsx(UINumberInput, {
                "data-selenium-test": "quickfilters-" + property.name + "-rhs",
                onChange: function onChange(evt) {
                  return dispatch({
                    type: actions.rightValueChanged,
                    payload: evt.target.value
                  });
                },
                value: state.rightValue
              })
            }), /*#__PURE__*/_jsx(UIBox, {
              grow: 2,
              children: /*#__PURE__*/_jsx(UISelect, {
                "data-selenium-test": "quickfilters-" + property.name + "-duration",
                onChange: function onChange(evt) {
                  dispatch({
                    type: actions.durationValueChanged,
                    payload: evt.target.value
                  });
                },
                options: getDurationOptions(),
                value: state.durationValue
              })
            })]
          })]
        }),
        footer: /*#__PURE__*/_jsxs(UIFlex, {
          align: "center",
          direction: "row",
          justify: "between",
          wrap: "nowrap",
          children: [/*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "quickfilters-" + property.name + "-apply-btn",
            size: "small",
            use: "tertiary",
            onClick: onApplyChanges,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.quickFilters.number.actions.apply"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "quickfilters-" + property.name + "-clear-btn",
            size: "small",
            use: "tertiary-light",
            onClick: onClearChanges,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "indexPage.quickFilters.number.actions.clear"
            })
          })]
        })
      },
      onOpenChange: function onOpenChange() {
        return dispatch({
          type: actions.openedStateChanged
        });
      },
      open: state.isOpen,
      placement: "bottom",
      width: 350,
      children: /*#__PURE__*/_jsxs(UIButton, {
        "aria-pressed": state.isOpen,
        "data-selenium-test": "quickfilters-" + property.name,
        onClick: function onClick() {
          return dispatch({
            type: actions.openedStateChanged
          });
        },
        use: "transparent",
        truncate: true,
        children: [buttonDisplayText, /*#__PURE__*/_jsx(UIDropdownCaret, {
          className: "m-left-1"
        })]
      })
    })
  });
};

DurationQuickFilter.propTypes = {
  filter: PropTypes.object,
  onValueChange: PropTypes.func.isRequired,
  property: PropertyType.isRequired
};
export default /*#__PURE__*/memo(DurationQuickFilter);