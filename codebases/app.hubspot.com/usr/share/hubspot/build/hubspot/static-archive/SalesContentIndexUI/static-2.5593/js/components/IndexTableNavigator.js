'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import classNames from 'classnames';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UIFilterBar from 'UIComponents/nav/UIFilterBar';
import UIFormControl from 'UIComponents/form/UIFormControl';
import IndexTableViewFilters from './IndexTableViewFilters';
import IndexTableBreadcrumbs from './IndexTableBreadcrumbs';
import NewFolderButton from './header/newFolder/NewFolderButton';

var getSearchPlaceholder = function getSearchPlaceholder(_ref) {
  var selectedFolder = _ref.selectedFolder,
      looseItemContentType = _ref.looseItemContentType;
  return selectedFolder ? I18n.text('salesContentIndexUI.search.folder') : I18n.text("salesContentIndexUI.search.contentTypes." + looseItemContentType);
};

var IndexTableNavigator = function IndexTableNavigator(_ref2) {
  var searchQuery = _ref2.searchQuery,
      selectedViewFilterId = _ref2.selectedViewFilterId,
      setViewFilter = _ref2.setViewFilter,
      setSearchQuery = _ref2.setSearchQuery,
      isModal = _ref2.isModal,
      selectedFolder = _ref2.selectedFolder,
      setSelectedFolder = _ref2.setSelectedFolder,
      looseItemContentType = _ref2.looseItemContentType,
      useOwnerViewFilters = _ref2.useOwnerViewFilters,
      location = _ref2.location,
      saveFolder = _ref2.saveFolder,
      showNewFolderButton = _ref2.showNewFolderButton;
  var breadcrumbs = null;

  if (searchQuery.query === '') {
    breadcrumbs = /*#__PURE__*/_jsx(IndexTableBreadcrumbs, {
      selectedFolder: selectedFolder,
      setSelectedFolder: setSelectedFolder
    });
  }

  return /*#__PURE__*/_jsxs("div", {
    className: classNames('table-navigation', isModal && 'table-navigation-modal' + (!selectedFolder ? " table-navigation-breadcrumbs" : "")),
    children: [breadcrumbs, /*#__PURE__*/_jsx(UIFilterBar, {
      className: "m-top-0",
      startSlot: /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          "aria-label": I18n.text('salesContentIndexUI.search.form'),
          children: /*#__PURE__*/_jsx(UISearchInput, {
            value: searchQuery.query,
            placeholder: getSearchPlaceholder({
              selectedFolder: selectedFolder,
              looseItemContentType: looseItemContentType
            }),
            onChange: function onChange(_ref3) {
              var value = _ref3.target.value;
              return setSearchQuery(value);
            }
          })
        }), /*#__PURE__*/_jsx(IndexTableViewFilters, {
          selectedViewFilterId: selectedViewFilterId,
          setViewFilter: setViewFilter,
          looseItemContentType: looseItemContentType,
          useOwnerViewFilters: useOwnerViewFilters
        })]
      }),
      endSlot: showNewFolderButton && /*#__PURE__*/_jsx(NewFolderButton, {
        saveFolder: saveFolder,
        location: location,
        use: "tertiary-light"
      })
    })]
  });
};

IndexTableNavigator.propTypes = {
  searchQuery: PropTypes.instanceOf(SearchQueryRecord).isRequired,
  selectedViewFilterId: PropTypes.string.isRequired,
  selectedFolder: PropTypes.instanceOf(SearchResultRecord),
  setSearchQuery: PropTypes.func.isRequired,
  setSelectedFolder: PropTypes.func.isRequired,
  setViewFilter: PropTypes.func.isRequired,
  isModal: PropTypes.bool.isRequired,
  looseItemContentType: PropTypes.string.isRequired,
  useOwnerViewFilters: PropTypes.bool,
  location: PropTypes.object,
  saveFolder: PropTypes.func,
  showNewFolderButton: PropTypes.bool
};
export default IndexTableNavigator;