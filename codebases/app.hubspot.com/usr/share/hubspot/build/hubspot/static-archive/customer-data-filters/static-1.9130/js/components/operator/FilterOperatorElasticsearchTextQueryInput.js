'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import FilterOperatorErrorType from 'customer-data-filters/components/propTypes/FilterOperatorErrorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
var ElasticsearchTextQueryClauseDelimiterRegex = /\s+OR\s+/gi;

var FilterOperatorElasticsearchTextQueryInput = function FilterOperatorElasticsearchTextQueryInput(props) {
  var className = props.className,
      error = props.error,
      _onChange = props.onChange,
      _props$value = props.value,
      value = _props$value === void 0 ? List() : _props$value;
  var isError = error.get('error');
  var errorMessage = error.get('message');
  var optionDelimiter = ' OR '; // must be all caps
  // config via HubSpot/ElasticSearchUtils#281

  var queryClauseCountLimit = 500;
  var queryLengthLimit = 3000;
  return /*#__PURE__*/_jsx(UIFormControl, {
    error: isError,
    validationMessage: isError ? errorMessage : null,
    children: /*#__PURE__*/_jsx(UISelect, {
      allowCreate: value.size < queryClauseCountLimit,
      className: className,
      delimiter: optionDelimiter,
      maxLength: "" + queryLengthLimit,
      menuWidth: "auto",
      multi: true,
      noResultsText: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterOperatorMultiStringInput.resultsText"
      }),
      onChange: function onChange(evt) {
        var nextValue = evt.target.value;
        return _onChange({
          target: {
            value: List(nextValue)
          }
        });
      },
      placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterOperatorMultiStringInput.placeholder"
      }),
      splitRegex: ElasticsearchTextQueryClauseDelimiterRegex,
      value: value.toArray()
    })
  });
};

FilterOperatorElasticsearchTextQueryInput.propTypes = {
  className: PropTypes.string,
  error: FilterOperatorErrorType.isRequired,
  onChange: PropTypes.func.isRequired,
  value: ImmutablePropTypes.listOf(PropTypes.string).isRequired
};
export default FilterOperatorElasticsearchTextQueryInput;