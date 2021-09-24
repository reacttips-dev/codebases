'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import connect from 'SalesContentIndexUI/data/redux/connect';
import { getIsCustomTeamOptionDisabled, getAdditionalOptions } from 'SalesContentIndexUI/data/redux/selectors/viewFiltersSelectors';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
import UsersAndTeamsSelect from 'ui-asset-management-lib/components/tableFilters/UsersAndTeamsSelect';
import UIInlineLabel from 'UIComponents/form/UIInlineLabel';
import { fetchOwnersAndTeams } from 'SalesContentIndexUI/api/OwnersApi';

var useDebounce = function useDebounce(value) {
  var delayMs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;

  var _useState = useState(value),
      _useState2 = _slicedToArray(_useState, 2),
      debouncedValue = _useState2[0],
      setDebouncedValue = _useState2[1];

  useEffect(function () {
    var handler = setTimeout(function () {
      return setDebouncedValue(value);
    }, delayMs);
    return function () {
      return clearTimeout(handler);
    };
  }, [delayMs, value]);
  return debouncedValue;
};

var parseTypeAndId = function parseTypeAndId(selectedViewFilterId) {
  var userAndTeamRegExp = /(USER|TEAM)-(\d+)/;

  if (userAndTeamRegExp.test(selectedViewFilterId)) {
    return {
      selectedType: userAndTeamRegExp.exec(selectedViewFilterId)[1],
      selectedId: Number(userAndTeamRegExp.exec(selectedViewFilterId)[2])
    };
  }

  return {
    selectedId: selectedViewFilterId
  };
};

var normalizeSelectValue = function normalizeSelectValue(value) {
  switch (value) {
    case DefaultFilterNames.CREATED_BY_ME:
    case DefaultFilterNames.OWNED_BY_ME:
      return DefaultFilterNames.ASSIGNED_TO_USER;

    case DefaultFilterNames.CREATED_BY_MY_TEAM:
    case DefaultFilterNames.OWNED_BY_MY_TEAM:
      return DefaultFilterNames.ASSIGNED_TO_USERS_TEAM;

    default:
      return value;
  }
};

var normalizeSelection = function normalizeSelection(selection, useOwnerViewFilters) {
  switch (selection.id) {
    case DefaultFilterNames.ASSIGNED_TO_USER:
      return Object.assign({}, selection, {
        id: useOwnerViewFilters ? DefaultFilterNames.OWNED_BY_ME : DefaultFilterNames.CREATED_BY_ME
      });

    case DefaultFilterNames.ASSIGNED_TO_USERS_TEAM:
      return Object.assign({}, selection, {
        id: useOwnerViewFilters ? DefaultFilterNames.OWNED_BY_MY_TEAM : DefaultFilterNames.CREATED_BY_MY_TEAM
      });

    default:
      return selection;
  }
};

var IndexTableViewFilters = function IndexTableViewFilters(_ref) {
  var setViewFilter = _ref.setViewFilter,
      looseItemContentType = _ref.looseItemContentType,
      selectedViewFilterId = _ref.selectedViewFilterId,
      isCustomTeamOptionDisabled = _ref.isCustomTeamOptionDisabled,
      additionalOptions = _ref.additionalOptions,
      useOwnerViewFilters = _ref.useOwnerViewFilters;

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      ownersAndTeams = _useState4[0],
      setOwnersAndTeams = _useState4[1];

  var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      searchQuery = _useState6[0],
      setSearchQuery = _useState6[1];

  var selectionRef = useRef();
  selectionRef.current = parseTypeAndId(selectedViewFilterId);
  var debouncedQuery = useDebounce(searchQuery);
  useEffect(function () {
    var _selectionRef$current = selectionRef.current,
        selectedId = _selectionRef$current.selectedId,
        selectedType = _selectionRef$current.selectedType;
    fetchOwnersAndTeams(looseItemContentType, debouncedQuery, selectedId, selectedType).then(function (response) {
      setOwnersAndTeams(response);
    });
  }, [looseItemContentType, debouncedQuery]);
  if (!ownersAndTeams) return null;
  return /*#__PURE__*/_jsx(UIInlineLabel, {
    label: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "salesContentIndexUI.filter.owner"
    }),
    children: /*#__PURE__*/_jsx(UsersAndTeamsSelect, {
      "data-selenium-test": "sales-content-index-table-view-filter",
      className: "p-left-0",
      assetTypeDisplayName: I18n.text("salesContentIndexUI.filter.displayName." + looseItemContentType),
      teams: ownersAndTeams.teams,
      users: ownersAndTeams.owners,
      onChange: function onChange(selectedFilter) {
        return setViewFilter(normalizeSelection(selectedFilter, useOwnerViewFilters));
      },
      showUnassigned: false,
      searchPlaceholder: I18n.text('salesContentIndexUI.filter.searchPlaceholder'),
      value: normalizeSelectValue(selectionRef.current.selectedId),
      customTeamOptionDisabled: isCustomTeamOptionDisabled,
      additionalOptions: additionalOptions,
      onInputChange: function onInputChange(query) {
        return setSearchQuery(query);
      },
      onOpenChange: function onOpenChange(_ref2) {
        var value = _ref2.target.value;
        if (!value) setSearchQuery('');
      }
    })
  });
};

IndexTableViewFilters.propTypes = {
  setViewFilter: PropTypes.func.isRequired,
  looseItemContentType: PropTypes.string.isRequired,
  isCustomTeamOptionDisabled: PropTypes.bool,
  selectedViewFilterId: PropTypes.string.isRequired,
  additionalOptions: PropTypes.array,
  useOwnerViewFilters: PropTypes.bool
};
export default connect(function (state) {
  return {
    isCustomTeamOptionDisabled: getIsCustomTeamOptionDisabled(state),
    viewFilters: state.viewFilters,
    additionalOptions: getAdditionalOptions(state)
  };
}, {})(IndexTableViewFilters);