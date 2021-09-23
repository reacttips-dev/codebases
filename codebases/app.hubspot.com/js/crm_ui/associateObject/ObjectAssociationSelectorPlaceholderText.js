'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import count from 'transmute/count';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
var NO_RESULTS_MIN_LENGTH = 3;
var propTypes = {
  associationObjectType: AnyCrmObjectTypePropType.isRequired,
  searchText: PropTypes.string,
  matches: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    objectType: AnyCrmObjectTypePropType.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  onCreateObject: PropTypes.func.isRequired,
  forcedSearch: PropTypes.bool
};

var ObjectAssociationSelectorPlaceholderText = function ObjectAssociationSelectorPlaceholderText(_ref) {
  var associationObjectType = _ref.associationObjectType,
      searchText = _ref.searchText,
      matches = _ref.matches,
      onCreateObject = _ref.onCreateObject,
      forcedSearch = _ref.forcedSearch;
  var matchesLength = matches && count(matches);

  var handleCreateObject = function handleCreateObject() {
    onCreateObject();
  };

  if (matchesLength) {
    return null;
  }

  if (searchText.length === 0) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sidebar.associateObjectDialog.search.typeToSearch",
      "data-unit-test": "objectAssociationSelectorPlaceholderTextSearch",
      useGap: true
    });
  } // Started typing, haven't reached the minimum, and no matches
  // Tell them to type more or hit enter


  if (searchText.length < NO_RESULTS_MIN_LENGTH && !matchesLength && !forcedSearch) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sidebar.associateObjectDialog.search.noResultsTypeMore",
      "data-unit-test": "objectAssociationSelectorPlaceholderTextNoResultsTypeMore",
      useGap: true
    });
  }

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(FormattedMessage, {
      message: "sidebar.associateObjectDialog.search.noResults",
      "data-unit-test": "objectAssociationSelectorPlaceholderFinalRender",
      useGap: true
    }), /*#__PURE__*/_jsx(UIButton, {
      onClick: handleCreateObject,
      use: "link",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.search.createLabel." + associationObjectType
      })
    })]
  });
};

ObjectAssociationSelectorPlaceholderText.propTypes = propTypes;
export default ObjectAssociationSelectorPlaceholderText;