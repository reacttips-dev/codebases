'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UILink from 'UIComponents/link/UILink';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var FilterOperatorIncludeObjectsWithNoAssociatedObjectsInput = function FilterOperatorIncludeObjectsWithNoAssociatedObjectsInput(props) {
  var onChange = props.onChange,
      value = props.value,
      filterFamily = props.filterFamily,
      getFilterFamilyObjectName = props.getFilterFamilyObjectName,
      rest = _objectWithoutProperties(props, ["onChange", "value", "filterFamily", "getFilterFamilyObjectName"]);

  var onCheckboxChange = useCallback(function (evt) {
    onChange(evt.target.checked);
  }, [onChange]);
  var associatedObjectName = getFilterFamilyObjectName(filterFamily, true).toLowerCase();
  return /*#__PURE__*/_jsxs(UICheckbox, Object.assign({
    checked: value,
    onChange: onCheckboxChange,
    size: "small",
    style: {
      minHeight: 'auto'
    }
  }, rest, {
    children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "customerDataFilters.FilterOperatorInput.includeObjectsWithNoAssociatedObjects",
      options: {
        associatedObjectName: associatedObjectName
      }
    }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx(UITooltip, {
      headingText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterOperatorInput.includeObjectsWithNoAssociatedObjectsTooltipHeading"
      }),
      placement: "left",
      title: /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterOperatorInput.includeObjectsWithNoAssociatedObjectsTooltipBody1",
            options: {
              associatedObjectName: associatedObjectName
            }
          })
        }), /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterOperatorInput.includeObjectsWithNoAssociatedObjectsTooltipBody2"
          })
        }), /*#__PURE__*/_jsx("p", {
          className: "m-bottom-0",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterOperatorInput.includeObjectsWithNoAssociatedObjectsTooltipBody3"
          })
        })]
      }),
      use: "longform",
      children: /*#__PURE__*/_jsx(UILink, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "customerDataFilters.FilterOperatorInput.includeObjectsWithNoAssociatedObjectsTooltipButtonLabel"
        })
      })
    })]
  }));
};

FilterOperatorIncludeObjectsWithNoAssociatedObjectsInput.propTypes = {
  filterFamily: PropTypes.string.isRequired,
  getFilterFamilyObjectName: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool
};
export default FilterOperatorIncludeObjectsWithNoAssociatedObjectsInput;