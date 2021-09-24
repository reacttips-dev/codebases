'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { List, Map as ImmutableMap } from 'immutable';
import { useCallback, useState, useEffect, useMemo } from 'react';
import debounce from 'transmute/debounce';
import getUniqueOptions from 'SequencesUI/lib/hubspot-user-options/getUniqueOptions';
import * as CRMSearchApi from 'SequencesUI/api/CRMSearchApi';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils';
import { SEQUENCE } from 'SequencesUI/constants/CRMSearchConstants';
import { SequenceSearchFilter, SequenceSearchQuery, SequenceSearchSort } from 'SequencesUI/records/SequenceSearchQuery';
import FilterWithClearButton from './FilterWithClearButton';
import UISelect from 'UIComponents/input/UISelect';

var makeOption = function makeOption(sequence) {
  return {
    value: getPropertyValue(sequence, 'hs_sequence_id'),
    text: getPropertyValue(sequence, 'hs_sequence_name')
  };
};

var SequenceFilter = function SequenceFilter(_ref) {
  var onChange = _ref.onChange,
      location = _ref.location,
      router = _ref.router,
      filterGroups = _ref.filterGroups;

  var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      fetchedOptions = _useState2[0],
      setFetchedOptions = _useState2[1];

  var _useState3 = useState(location.query.sequenceId && "" + location.query.sequenceId),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedValue = _useState4[0],
      setSelectedValue = _useState4[1];

  var _useState5 = useState(null),
      _useState6 = _slicedToArray(_useState5, 2),
      selectedOption = _useState6[0],
      setSelectedOption = _useState6[1];

  var _useState7 = useState(''),
      _useState8 = _slicedToArray(_useState7, 2),
      searchText = _useState8[0],
      setSearchText = _useState8[1];

  useEffect(function () {
    CRMSearchApi.fetchCRMObjects(SEQUENCE, new SequenceSearchQuery({
      count: 30,
      query: searchText || '',
      sorts: List([new SequenceSearchSort({
        property: 'hs_sequence_name',
        order: 'ASC'
      })])
    })).then(function (results) {
      return setFetchedOptions(results.results.map(makeOption));
    });
  }, [searchText]);
  useEffect(function () {
    if (selectedValue) {
      CRMSearchApi.fetchCRMObjects(SEQUENCE, new SequenceSearchQuery({
        count: 1,
        filterGroups: List([ImmutableMap({
          filters: List([new SequenceSearchFilter({
            property: 'hs_sequence_id',
            operator: 'EQ',
            value: selectedValue
          })])
        })])
      })).then(function (_ref2) {
        var results = _ref2.results;
        return setSelectedOption(makeOption(results[0]));
      });
    }
  }, [selectedValue]);
  var handleChange = useCallback(function (value) {
    if (value === selectedValue) {
      return;
    }

    router.push(Object.assign({}, location, {
      query: Object.assign({}, location.query, {
        sequenceId: value || undefined
      })
    }));
    var updatedFilterGroups = filterGroups.map(function (filterGroup) {
      return filterGroup.update('filters', function (filters) {
        var otherFilters = filters.filterNot(function (filter) {
          return filter.property === 'hs_sequence_id';
        });

        if (!value) {
          return otherFilters;
        }

        return otherFilters.push(new SequenceSearchFilter({
          property: 'hs_sequence_id',
          operator: 'EQ',
          value: value
        }));
      });
    });
    setSelectedValue(value);
    onChange(updatedFilterGroups);
  }, [location, onChange, router, selectedValue, filterGroups]);
  var options = useMemo(function () {
    return selectedOption ? getUniqueOptions([selectedOption].concat(_toConsumableArray(fetchedOptions))) : fetchedOptions;
  }, [fetchedOptions, selectedOption]);
  var debouncedHandleInputChange = useCallback(debounce(200, function (text) {
    if (!text) {
      setFetchedOptions([]);
    }

    setSearchText(text);
  }), []);

  var renderButtonContent = function renderButtonContent() {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesui.analyze.filters.sequence"
    });
  };

  return /*#__PURE__*/_jsx(FilterWithClearButton, {
    isActive: !!selectedValue,
    onRemoveClick: function onRemoveClick() {
      handleChange(null);
      setSelectedOption(null);
    },
    children: /*#__PURE__*/_jsx(UISelect, {
      className: "p-left-0",
      menuWidth: 250,
      buttonUse: "transparent",
      onChange: function onChange(_ref3) {
        var value = _ref3.target.value;
        handleChange(value);
      },
      options: options,
      value: selectedValue,
      ButtonContent: renderButtonContent,
      onInputChange: debouncedHandleInputChange,
      minimumSearchCount: 0
    })
  });
};

SequenceFilter.propTypes = {
  filterGroups: PropTypes.instanceOf(List).isRequired,
  onChange: PropTypes.func.isRequired,
  location: PropTypes.object,
  router: PropTypes.object
};
export default withRouter(SequenceFilter);