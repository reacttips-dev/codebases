'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as DSAssetFamilies from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import { ENUMERATION } from 'customer-data-filters/converters/listSegClassic/OperationTypes';
import { ESC } from 'UIComponents/constants/KeyCodes';
import { EmailLinkClicked } from 'customer-data-filters/filterQueryFormat/operator/Operators';
import { List } from 'immutable';
import { isValidOperator } from 'customer-data-filters/filterQueryFormat/operator/Operator';
import { mapOf, setOf } from 'react-immutable-proptypes';
import FilterEditorFieldSelect from './FilterEditorFieldSelect';
import FilterEditorPanel from './FilterEditorPanel';
import FilterFieldGroupType from 'customer-data-filters/components/propTypes/FilterFieldGroupType';
import FilterFieldType from 'customer-data-filters/components/propTypes/FilterFieldType';
import FilterOperatorErrorRecord from 'customer-data-filters/filterQueryFormat/FilterOperatorErrorRecord';
import FilterOperatorRefinableInput from '../operator/FilterOperatorRefinableInput';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FilterType from '../propTypes/FilterType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import NullRelatedState from '../propTypes/NullRelatedState';
import PropTypes from 'prop-types';
import { Component } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import getIn from 'transmute/getIn';
import isRecord from 'transmute/isRecord';

var FilterEditorOperatorEdit = /*#__PURE__*/function (_Component) {
  _inherits(FilterEditorOperatorEdit, _Component);

  function FilterEditorOperatorEdit(props) {
    var _this;

    _classCallCheck(this, FilterEditorOperatorEdit);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorOperatorEdit).call(this, props));

    _this.handleGoBack = function () {
      var fieldSelected = _this.state.fieldSelected;

      if (!fieldSelected) {
        _this.setState({
          fieldSelected: true
        });
      } else {
        _this.props.onDone(SyntheticEvent(_this.state.initialValue), true);
      }
    };

    _this.handleEditField = function () {
      _this.setState({
        error: FilterOperatorErrorRecord({
          error: false
        }),
        fieldSelected: false
      });
    };

    _this.handleChange = function (evt) {
      var value = evt.target.value;

      if (isValidOperator(value)) {
        _this.props.onChange(SyntheticEvent(value));
      }

      _this.setState({
        draft: value,
        error: FilterOperatorErrorRecord({
          error: false
        })
      });
    };

    _this.handleSelectField = function (_ref) {
      var newValue = _ref.target.value;
      var value = _this.props.value;
      var draft = _this.state.draft;

      _this.setState({
        fieldSelected: true
      });

      var workingValue = draft || value;
      var newDraft = _this.getIsValuePreservable(workingValue, newValue) ? workingValue.set('field', newValue.get('field')) : newValue;

      _this.handleChange(SyntheticEvent(newDraft));
    };

    _this.handleKeyUp = function (evt) {
      if (evt.keyCode === ESC) {
        evt.stopPropagation();

        _this.handleGoBack();
      }
    };

    _this.handleSearchChange = function (evt) {
      var _evt$target$value = evt.target.value,
          value = _evt$target$value === void 0 ? '' : _evt$target$value;
      var _this$props = _this.props,
          onFieldSearchChange = _this$props.onFieldSearchChange,
          filterFamily = _this$props.filterFamily;

      _this.setState({
        searchValue: value
      });

      onFieldSearchChange(value, filterFamily);
    };

    _this.handleSubmit = function (evt) {
      evt.preventDefault();
      var _this$props2 = _this.props,
          onDone = _this$props2.onDone,
          validateOperator = _this$props2.validateOperator,
          value = _this$props2.value;
      var draft = _this.state.draft;
      var workingValue = draft || value;
      var validationError = validateOperator(workingValue);
      var error = isRecord(validationError) ? validationError : FilterOperatorErrorRecord(validationError);
      var isError = error.get('error') || false;

      if (isValidOperator(workingValue) && !isError) {
        onDone(SyntheticEvent(workingValue));

        _this.setState({
          error: FilterOperatorErrorRecord({
            opts: error.get('opts') || {}
          })
        });
      } else {
        _this.setState({
          error: error
        });
      }
    };

    _this.state = {
      draft: null,
      error: FilterOperatorErrorRecord({
        error: false
      }),
      fieldSelected: true,
      initialValue: props.value,
      searchValue: ''
    };
    return _this;
  }

  _createClass(FilterEditorOperatorEdit, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        initialValue: this.props.value
      });
    }
  }, {
    key: "getIsValuePreservable",
    value: function getIsValuePreservable(oldValue, newValue) {
      var _this$props3 = this.props,
          getFamilyValueResolver = _this$props3.getFamilyValueResolver,
          getOperators = _this$props3.getOperators,
          filterFamily = _this$props3.filterFamily;
      var oldValueType = getIn(['field', 'type'], oldValue);
      var newValueType = getIn(['field', 'type'], newValue);
      var validOperators = getOperators(newValue.field); // HACK: CTA's are special because they use a custom input that fetches
      // different options for each CTA. This means they can never be preserved.

      if (filterFamily === DSAssetFamilies.CTA) {
        return false;
      } // HACK: Similar to CTAs Email Links use a custom input that does a different
      // fetch per email selected so they can't be persisted.


      if (oldValue.constructor === EmailLinkClicked) {
        return false;
      }

      if (!validOperators.includes(oldValue.constructor)) {
        return false;
      }

      if (!oldValue.value) {
        return true;
      } // Enumeration properties that are not fetched externally will have options
      // on the object to compare to.


      if (!getFamilyValueResolver(oldValue) && !getFamilyValueResolver(newValue) && oldValueType === ENUMERATION && newValueType === ENUMERATION) {
        var newOptions = getIn(['field', 'options'], newValue) || List();

        if (oldValue.constructor.isIterableField('value')) {
          return oldValue.value.every(function (value) {
            return newOptions.findIndex(function (option) {
              return option.value === value;
            }) !== -1;
          });
        }

        return newOptions.findIndex(function (option) {
          return option.value === oldValue.value;
        }) !== -1;
      }

      return getFamilyValueResolver(oldValue) === getFamilyValueResolver(newValue);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          FieldSelectItemComponent = _this$props4.FieldSelectItemComponent,
          activeFieldNames = _this$props4.activeFieldNames,
          className = _this$props4.className,
          currencyCode = _this$props4.currencyCode,
          editorSubtitle = _this$props4.editorSubtitle,
          fieldGroups = _this$props4.fieldGroups,
          fields = _this$props4.fields,
          filterFamily = _this$props4.filterFamily,
          getDescriptionString = _this$props4.getDescriptionString,
          getFamilyValueResolver = _this$props4.getFamilyValueResolver,
          getFilterFamilyName = _this$props4.getFilterFamilyName,
          getFilterFamilyObjectName = _this$props4.getFilterFamilyObjectName,
          getInputComponent = _this$props4.getInputComponent,
          getLabelString = _this$props4.getLabelString,
          getOperatorLabel = _this$props4.getOperatorLabel,
          getOperators = _this$props4.getOperators,
          getPlaceholder = _this$props4.getPlaceholder,
          getReferencedObjectType = _this$props4.getReferencedObjectType,
          getSpecialOptionsForReferenceType = _this$props4.getSpecialOptionsForReferenceType,
          getObjectPropertyLabel = _this$props4.getObjectPropertyLabel,
          isFieldDescriptionVisible = _this$props4.isFieldDescriptionVisible,
          isFiscalYearEnabled = _this$props4.isFiscalYearEnabled,
          isRollingDateOffsetInputEnabled = _this$props4.isRollingDateOffsetInputEnabled,
          isTimezoneWarningDisabled = _this$props4.isTimezoneWarningDisabled,
          isXoEnabled = _this$props4.isXoEnabled,
          _this$props4$labelOpe = _this$props4.labelOperatorEditSave,
          labelOperatorEditSave = _this$props4$labelOpe === void 0 ? /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterEditorOperatorEdit.save"
      }) : _this$props4$labelOpe,
          loadMoreFields = _this$props4.loadMoreFields,
          renderFieldLink = _this$props4.renderFieldLink,
          searchable = _this$props4.searchable,
          showIncludeUnknownValues = _this$props4.showIncludeUnknownValues,
          style = _this$props4.style,
          value = _this$props4.value,
          filterBranch = _this$props4.filterBranch,
          handleIncludeObjectsWithNoAssociatedObjectsChange = _this$props4.handleIncludeObjectsWithNoAssociatedObjectsChange,
          nullIssueRelatedState = _this$props4.nullIssueRelatedState,
          updateNullIssueRelatedState = _this$props4.updateNullIssueRelatedState,
          rest = _objectWithoutProperties(_this$props4, ["FieldSelectItemComponent", "activeFieldNames", "className", "currencyCode", "editorSubtitle", "fieldGroups", "fields", "filterFamily", "getDescriptionString", "getFamilyValueResolver", "getFilterFamilyName", "getFilterFamilyObjectName", "getInputComponent", "getLabelString", "getOperatorLabel", "getOperators", "getPlaceholder", "getReferencedObjectType", "getSpecialOptionsForReferenceType", "getObjectPropertyLabel", "isFieldDescriptionVisible", "isFiscalYearEnabled", "isRollingDateOffsetInputEnabled", "isTimezoneWarningDisabled", "isXoEnabled", "labelOperatorEditSave", "loadMoreFields", "renderFieldLink", "searchable", "showIncludeUnknownValues", "style", "value", "filterBranch", "handleIncludeObjectsWithNoAssociatedObjectsChange", "nullIssueRelatedState", "updateNullIssueRelatedState"]);

      var _this$state = this.state,
          draft = _this$state.draft,
          error = _this$state.error,
          fieldSelected = _this$state.fieldSelected,
          initialValue = _this$state.initialValue,
          searchValue = _this$state.searchValue;
      var workingValue = draft || value;
      var valueTitle = workingValue && workingValue.field && getLabelString(workingValue.field);
      var isValueDescriptionShown = isFieldDescriptionVisible && workingValue && workingValue.field;
      var valueDescription = isValueDescriptionShown ? getDescriptionString(workingValue.field) : null;
      var showEditField = !getIn(['field', 'metadata', 'hasNoFieldOptions'], workingValue) && fieldSelected;
      var valueUrl = workingValue && getIn(['field', 'url'], workingValue);

      var isNameBlacklisted = function isNameBlacklisted(propertyRecord) {
        return !['favoriteUserList'].includes(propertyRecord.get('name'));
      };

      var creatableFieldGroups = fieldGroups ? (filterFamily && fieldGroups.get(filterFamily) || fieldGroups).map(function (fieldGroup) {
        return fieldGroup.update('properties', function (list) {
          return list.filter(isNameBlacklisted);
        });
      }) : undefined;
      var dataAttributes = Object.keys(rest).filter(function (key) {
        return key.startsWith('data-');
      }).reduce(function (acc, key) {
        acc[key] = rest[key];
        return acc;
      }, {});
      return /*#__PURE__*/_jsx(FilterEditorPanel, Object.assign({
        "data-selenium-test": "XOFilterEditor-edit-panel"
      }, dataAttributes, {
        className: className,
        description: valueDescription,
        editorSubtitle: editorSubtitle,
        handleGoBack: this.handleGoBack,
        isBodyHeightFixed: !fieldSelected,
        isTimezoneWarningDisabled: isTimezoneWarningDisabled,
        isXoEnabled: isXoEnabled,
        onEditFieldClick: this.handleEditField,
        onSubmit: this.handleSubmit,
        renderFieldLink: renderFieldLink,
        saveLabel: labelOperatorEditSave,
        showEditField: showEditField,
        style: style,
        title: valueTitle,
        url: valueUrl,
        value: fieldSelected ? workingValue : undefined,
        children: fieldSelected ? /*#__PURE__*/_jsx(FilterOperatorRefinableInput, {
          currencyCode: currencyCode,
          error: error,
          filterBranch: filterBranch,
          filterFamily: filterFamily,
          getFamilyValueResolver: getFamilyValueResolver,
          getFilterFamilyObjectName: getFilterFamilyObjectName,
          getInputComponent: getInputComponent,
          getObjectPropertyLabel: getObjectPropertyLabel,
          getOperatorLabel: getOperatorLabel,
          getOperators: getOperators,
          getPlaceholder: getPlaceholder,
          getReferencedObjectType: getReferencedObjectType,
          getSpecialOptionsForReferenceType: getSpecialOptionsForReferenceType,
          handleIncludeObjectsWithNoAssociatedObjectsChange: handleIncludeObjectsWithNoAssociatedObjectsChange,
          initialValue: initialValue,
          isFiscalYearEnabled: isFiscalYearEnabled,
          isRollingDateOffsetInputEnabled: isRollingDateOffsetInputEnabled,
          isXoEnabled: isXoEnabled,
          nullIssueRelatedState: nullIssueRelatedState,
          onChange: this.handleChange,
          showIncludeUnknownValues: showIncludeUnknownValues,
          updateNullIssueRelatedState: updateNullIssueRelatedState,
          value: workingValue
        }) : /*#__PURE__*/_jsx(FilterEditorFieldSelect, {
          activeFieldNames: activeFieldNames,
          fieldGroups: creatableFieldGroups,
          fields: fields,
          FieldSelectItemComponent: FieldSelectItemComponent,
          filterFamily: filterFamily,
          getFilterFamilyName: getFilterFamilyName,
          getLabelString: getLabelString,
          getOperators: getOperators,
          isXoEnabled: isXoEnabled,
          loadMoreFields: loadMoreFields,
          onChange: this.handleSelectField,
          onSearchChange: this.handleSearchChange,
          searchable: searchable,
          searchValue: searchValue,
          value: workingValue
        })
      }));
    }
  }]);

  return FilterEditorOperatorEdit;
}(Component);

export { FilterEditorOperatorEdit as default };
FilterEditorOperatorEdit.propTypes = {
  FieldSelectItemComponent: PropTypes.func,
  activeFieldNames: setOf(PropTypes.string.isRequired).isRequired,
  className: PropTypes.string,
  currencyCode: PropTypes.string.isRequired,
  editorSubtitle: PropTypes.node,
  fieldGroups: mapOf(FilterFieldGroupType.isRequired),
  fields: mapOf(FilterFieldType),
  filterBranch: FilterType,
  filterFamily: PropTypes.string,
  getDescriptionString: PropTypes.func.isRequired,
  getFamilyValueResolver: PropTypes.func.isRequired,
  getFilterFamilyName: PropTypes.func.isRequired,
  getFilterFamilyObjectName: PropTypes.func.isRequired,
  getInputComponent: PropTypes.func.isRequired,
  getLabelString: PropTypes.func.isRequired,
  getObjectPropertyLabel: PropTypes.func.isRequired,
  getOperatorLabel: PropTypes.func.isRequired,
  getOperators: PropTypes.func.isRequired,
  getPlaceholder: PropTypes.func.isRequired,
  getReferencedObjectType: PropTypes.func.isRequired,
  getSpecialOptionsForReferenceType: PropTypes.func.isRequired,
  handleIncludeObjectsWithNoAssociatedObjectsChange: PropTypes.func,
  isFieldDescriptionVisible: PropTypes.bool.isRequired,
  isFiscalYearEnabled: PropTypes.bool.isRequired,
  isRollingDateOffsetInputEnabled: PropTypes.bool,
  isTimezoneWarningDisabled: PropTypes.bool,
  isXoEnabled: PropTypes.bool,
  labelOperatorEditSave: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  loadMoreFields: PropTypes.func,
  nullIssueRelatedState: NullRelatedState,
  onChange: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  onFieldSearchChange: PropTypes.func.isRequired,
  renderFieldLink: PropTypes.func.isRequired,
  searchable: PropTypes.bool,
  showIncludeUnknownValues: PropTypes.bool.isRequired,
  style: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  updateNullIssueRelatedState: PropTypes.func,
  validateOperator: PropTypes.func.isRequired,
  value: FilterOperatorType.isRequired
};