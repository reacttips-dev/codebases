'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
import { isOfMinSearchLength } from 'crm_data/elasticSearch/ElasticSearchValidation';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import debounce from 'transmute/debounce';
import getIn from 'transmute/getIn';
import { useSearchBarPlaceholder } from '../hooks/useSearchBarPlaceholder';
import { InputComponent } from './InputComponent';
import { isTooLong } from '../../../crm_ui/flux/grid/GridUIActions';
export var SearchBar = function SearchBar(props) {
  var objectType = props.objectType,
      onUpdateQuery = props.onUpdateQuery,
      query = props.query;

  var _useState = useState(query),
      _useState2 = _slicedToArray(_useState, 2),
      searchQuery = _useState2[0],
      setSearchQuery = _useState2[1];

  var onUpdateQueryDebounced = useMemo(function () {
    return debounce(500, function (newQuery) {
      onUpdateQuery(newQuery);
      CrmLogger.log('useLocalSearch', {
        type: objectType
      });
    });
  }, [objectType, onUpdateQuery]);
  var placeholder = useSearchBarPlaceholder();

  var onSearchChange = function onSearchChange(e) {
    var newQuery = getIn(['target', 'value'], e);
    setSearchQuery(newQuery); // update when search is cleared or search query is 3 characters minimum && <= maximum

    if (isOfMinSearchLength(newQuery) && !isTooLong(newQuery) || newQuery === '') {
      onUpdateQueryDebounced(newQuery);
    }
  };

  return /*#__PURE__*/_jsx(InputComponent, {
    placeholder: placeholder,
    "data-selenium-test": "list-search-input",
    defaultValue: query,
    getValidationMessage: function getValidationMessage(value) {
      if (!value) {
        return null;
      }

      if (!isOfMinSearchLength(value)) {
        return I18n.text('salesUI.UISearchInput.minimumSearchMessage', {
          count: MIN_SEARCH_LENGTH - value.length
        });
      }

      var _ref = isTooLong(value) || {},
          limit = _ref.limit,
          type = _ref.type;

      if (type && limit) {
        return I18n.text('index.searchBar.limitExceeded', {
          limit: limit,
          type: type
        });
      }

      return null;
    },
    onChange: onSearchChange,
    value: searchQuery
  });
};
SearchBar.propTypes = {
  objectType: AnyCrmObjectTypePropType.isRequired,
  onUpdateQuery: PropTypes.func.isRequired,
  query: PropTypes.string
};