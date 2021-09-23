'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import ImmutablePropTypes from 'react-immutable-proptypes';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { SLINKY } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import { translateObjectName } from 'customer-data-objects/record/translateObjectName';
import UISelect from 'UIComponents/input/UISelect';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import ObjectAssociationSelectorPlaceholderText from './ObjectAssociationSelectorPlaceholderText';
import ObjectAssociationSelectorFooter from './ObjectAssociationSelectorFooter';
import { ENTER } from 'UIComponents/constants/KeyCodes';
import { toString, getId } from 'customer-data-objects/model/ImmutableModel';
var MicrocopyDivWrapper = styled.div.withConfig({
  displayName: "ObjectAssociationSelector__MicrocopyDivWrapper",
  componentId: "u7w0qz-0"
})(["font-size:12px;color:", ";padding-bottom:1px;"], SLINKY);
var propTypes = {
  associationObjectType: ObjectTypesType.isRequired,
  objectType: ObjectTypesType.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdateSearch: PropTypes.func.isRequired,
  onEnterKey: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.number),
  selectedObjects: ImmutablePropTypes.list,
  shouldDisableSaveButton: PropTypes.bool,
  matches: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    objectType: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  helperText: PropTypes.node,
  state: PropTypes.shape({
    searchText: PropTypes.string,
    overrideMinimumSearch: PropTypes.bool
  }).isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    objectType: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  suggestedAssociations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    objectType: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  unsavedChangeCount: PropTypes.number.isRequired
};

var getSelectValue = function getSelectValue(associationObjectType, id) {
  return associationObjectType + " " + id;
};

var getIdsFromValues = memoize(function (values, associationObjectType) {
  return values.reduce(function (acc, id) {
    acc.push(getSelectValue(associationObjectType, id));
    return acc;
  }, []);
});

var ObjectAssociationSelector = /*#__PURE__*/function (_PureComponent) {
  _inherits(ObjectAssociationSelector, _PureComponent);

  function ObjectAssociationSelector(props) {
    var _this;

    _classCallCheck(this, ObjectAssociationSelector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObjectAssociationSelector).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleSelection = function (_ref) {
      var value = _ref.target.value;
      var _this$props = _this.props,
          onAdd = _this$props.onAdd,
          onRemove = _this$props.onRemove,
          selected = _this$props.selected,
          associationObjectType = _this$props.associationObjectType;
      var values = value.map(function (val) {
        return +val.split(' ')[1];
      });
      var associationAdded = values.filter(function (val) {
        return !selected.includes(val);
      })[0];
      var associationsRemoved = selected.filter(function (val) {
        return !values.includes(val);
      })[0];

      if (associationAdded) {
        return onAdd(associationAdded, associationObjectType);
      }

      return onRemove(associationsRemoved, associationObjectType);
    };

    _this.handleChange = function (value) {
      _this.props.onUpdateSearch(value);
    };

    _this.handleInputKeyDown = function (_ref2) {
      var keyCode = _ref2.keyCode;

      if (keyCode === ENTER) {
        _this.props.onEnterKey();
      }
    };

    _this.handleCheckBoxClick = function (value) {
      _this.props.onRemove(+value.target.value, _this.props.associationObjectType);
    };

    _this.renderSelectValue = function (_ref3) {
      var children = _ref3.children,
          option = _ref3.option;

      var selectedObject = _this.props.selectedObjects.find(function (record) {
        return getSelectValue(_this.props.associationObjectType, getId(record)) === option.value;
      });

      if (selectedObject) {
        return toString(selectedObject);
      }

      return children;
    };

    _this.renderNoResultsText = function () {
      var _this$props2 = _this.props,
          associationObjectType = _this$props2.associationObjectType,
          _this$props2$state = _this$props2.state,
          searchText = _this$props2$state.searchText,
          overrideMinimumSearch = _this$props2$state.overrideMinimumSearch,
          matches = _this$props2.matches,
          onCreateObject = _this$props2.onCreateObject;
      return /*#__PURE__*/_jsx(ObjectAssociationSelectorPlaceholderText, {
        forcedSearch: overrideMinimumSearch,
        searchText: searchText,
        associationObjectType: associationObjectType,
        matches: matches,
        onCreateObject: onCreateObject
      });
    };

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(ObjectAssociationSelector, [{
    key: "getIsSelectDisabled",
    value: function getIsSelectDisabled() {
      var selectedObjects = this.props.selectedObjects;
      return this.props.associationObjectType === COMPANY && selectedObjects && selectedObjects.size > 0;
    }
  }, {
    key: "getSuggestions",
    value: function getSuggestions() {
      var _this$props3 = this.props,
          suggestions = _this$props3.suggestions,
          selected = _this$props3.selected;

      if (!selected || !selected.length) {
        return suggestions || [];
      }

      return suggestions && suggestions.filter(function (suggestion) {
        return !selected.includes(suggestion.id);
      });
    }
  }, {
    key: "getSuggestedAssociations",
    value: function getSuggestedAssociations() {
      var _this$props4 = this.props,
          suggestedAssociations = _this$props4.suggestedAssociations,
          selected = _this$props4.selected;

      if (!selected || !selected.length) {
        return suggestedAssociations || [];
      }

      return suggestedAssociations && suggestedAssociations.filter(function (suggestion) {
        return !selected.includes(suggestion.id);
      });
    }
  }, {
    key: "getSuggestionsGroupTextKey",
    value: function getSuggestionsGroupTextKey() {
      if (this.props.associationObjectType === CONTACT && this.props.objectType === COMPANY) {
        return 'sidebar.associateObjectDialog.search.optionGroups.suggestions.CONTACTS';
      }

      return 'sidebar.associateObjectDialog.search.optionGroups.suggestions.generic';
    }
  }, {
    key: "getSelectOptions",
    value: function getSelectOptions() {
      var matches = this.props.matches;

      if (!matches) {
        var suggestedOptions = [];
        var suggestions = this.getSuggestions();
        var suggestedAssociations = this.getSuggestedAssociations(); // populated for contact->company suggestions based on domain

        if (suggestions && suggestions.length > 0) {
          suggestedOptions.push({
            text: I18n.text(this.getSuggestionsGroupTextKey()),
            options: suggestions
          });
        } // populated by ml given ungated for suggested associations and contact->deal


        if (suggestedAssociations && suggestedAssociations.length > 0) {
          suggestedOptions.push({
            text: I18n.text('sidebar.associateObjectDialog.search.optionGroups.suggestions.associations'),
            options: suggestedAssociations
          });
        }

        return suggestedOptions;
      }

      return [{
        text: I18n.text('sidebar.associateObjectDialog.search.optionGroups.results'),
        options: matches
      }];
    }
  }, {
    key: "renderDisabledTooltipMessage",
    value: function renderDisabledTooltipMessage() {
      return /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sidebar.associateObjectDialog.searchDisabledTooltip.singleAssociationLimit.COMPANY",
        options: {
          objectName: translateObjectName(this.props.objectType)
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          associationObjectType = _this$props5.associationObjectType,
          helperText = _this$props5.helperText,
          onConfirm = _this$props5.onConfirm,
          onReject = _this$props5.onReject,
          unsavedChangeCount = _this$props5.unsavedChangeCount,
          shouldDisableSaveButton = _this$props5.shouldDisableSaveButton;
      var selectDisabled = this.getIsSelectDisabled();
      return /*#__PURE__*/_jsxs(_Fragment, {
        children: [helperText && /*#__PURE__*/_jsx(MicrocopyDivWrapper, {
          children: this.props.helperText
        }), /*#__PURE__*/_jsx(UITooltip, {
          disabled: !selectDisabled,
          title: this.renderDisabledTooltipMessage(),
          children: /*#__PURE__*/_jsx("div", {
            className: "m-top-2",
            children: /*#__PURE__*/_jsx(UISelect, {
              multi: true,
              anchorType: "button",
              disabled: selectDisabled,
              filterOptions: false,
              valueComponent: this.renderSelectValue,
              minimumSearchCount: 0,
              placeholder: I18n.text("sidebar.associateObjectDialog.search.placeholder." + associationObjectType),
              options: this.getSelectOptions(),
              menuWidth: 520,
              onInputChange: this.handleChange,
              onChange: this.handleSelection,
              onInputKeyDown: this.handleInputKeyDown,
              value: getIdsFromValues(this.props.selected, associationObjectType),
              noResultsText: this.renderNoResultsText,
              "data-selenium-test": "object-association-panel-select",
              dropdownClassName: "object-association-panel-select-dropdown"
            })
          })
        }), /*#__PURE__*/_jsx(ObjectAssociationSelectorFooter, {
          shouldDisableSaveButton: shouldDisableSaveButton,
          onConfirm: onConfirm,
          onReject: onReject,
          unsavedChangeCount: unsavedChangeCount
        })]
      });
    }
  }]);

  return ObjectAssociationSelector;
}(PureComponent);

ObjectAssociationSelector.propTypes = propTypes;
export default ObjectAssociationSelector;