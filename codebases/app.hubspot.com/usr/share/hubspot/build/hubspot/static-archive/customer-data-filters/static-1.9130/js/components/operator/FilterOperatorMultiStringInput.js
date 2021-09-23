'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import { listOf } from 'react-immutable-proptypes';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
import classNames from 'classnames';
import I18n from 'I18n';

var FilterOperatorMultiStringInput = function FilterOperatorMultiStringInput(_ref) {
  var className = _ref.className,
      seleniumSelector = _ref['data-selenium-test'],
      error = _ref.error,
      _onChange = _ref.onChange,
      value = _ref.value;
  return /*#__PURE__*/_jsx(UIFormControl, {
    "aria-label": I18n.text('customerDataFilters.FilterOperatorInput.ariaLabel'),
    error: error.get('error'),
    validationMessage: error.get('error') ? error.get('message') : null,
    children: /*#__PURE__*/_jsx(UISelect, {
      allowCreate: true //arrowRender is an 'undocumented' property for UISelect.
      // This is being hacked as a Select-arrow with 0 opacity to satisfy hiding the arrow,
      // but allowing Acceptance Test utilities which depend on it to continue to work.
      // visibilty:hidden, display:none are all not options because ATs will not interect with hidden elements.
      ,
      arrowRenderer: function arrowRenderer() {
        return /*#__PURE__*/_jsx("div", {
          className: "Select-arrow",
          style: {
            opacity: 0
          }
        });
      } // UISelects without an anchor type must use className selenium selectors
      ,
      className: classNames(className, seleniumSelector),
      multi: true,
      noResultsText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterOperatorMultiStringInput.resultsText"
      }),
      onChange: function onChange(evt) {
        _onChange(SyntheticEvent(List(evt.target.value)));
      },
      placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterOperatorMultiStringInput.placeholder"
      }),
      promptTextCreator: function promptTextCreator(userInput) {
        return I18n.text('customerDataFilters.FilterOperatorMultiStringInput.promptText', {
          value: userInput
        });
      },
      value: value && value.toArray() || []
    })
  });
};

FilterOperatorMultiStringInput.propTypes = {
  className: PropTypes.string,
  'data-selenium-test': PropTypes.string.isRequired,
  error: FilterOperatorErrorType.isRequired,
  onChange: PropTypes.func.isRequired,
  value: listOf(PropTypes.string)
};
export default FilterOperatorMultiStringInput;