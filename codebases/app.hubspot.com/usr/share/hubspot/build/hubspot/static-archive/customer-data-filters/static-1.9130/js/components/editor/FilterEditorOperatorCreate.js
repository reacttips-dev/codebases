'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap, OrderedSet, Set as ImmutableSet } from 'immutable';
import { isValidOperator } from '../../filterQueryFormat/operator/Operator';
import { mapOf, setOf } from 'react-immutable-proptypes';
import FilterEditorFieldSelect from './FilterEditorFieldSelect';
import FilterEditorPanel from './FilterEditorPanel';
import FilterFamilySelect from '../FilterFamilySelect';
import FilterEditorEntitySelect from './FilterEditorEntitySelect';
import FilterFieldGroupType from '../../components/propTypes/FilterFieldGroupType';
import FilterFieldType from '../../components/propTypes/FilterFieldType';
import FilterOperatorErrorRecord from '../../filterQueryFormat/FilterOperatorErrorRecord';
import FilterOperatorRefinableInput from '../operator/FilterOperatorRefinableInput';
import FilterOperatorType from '../../components/propTypes/FilterOperatorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { Component } from 'react';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import getIn from 'transmute/getIn';
import isRecord from 'transmute/isRecord';
import NullRelatedState from '../propTypes/NullRelatedState';
import always from 'transmute/always';

var FilterEditorOperatorCreate = /*#__PURE__*/function (_Component) {
  _inherits(FilterEditorOperatorCreate, _Component);

  function FilterEditorOperatorCreate(props) {
    var _this;

    _classCallCheck(this, FilterEditorOperatorCreate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FilterEditorOperatorCreate).call(this, props));

    _this.handleGoBack = function () {
      var _this$props = _this.props,
          fields = _this$props.fields,
          getFilterFamilyOptions = _this$props.getFilterFamilyOptions,
          isXoEnabled = _this$props.isXoEnabled,
          onChangeFilterFamily = _this$props.onChangeFilterFamily,
          onDone = _this$props.onDone,
          onChange = _this$props.onChange;
      var _this$state = _this.state,
          didInitializeWithAFilterFamily = _this$state.didInitializeWithAFilterFamily,
          didSelectFilterFamily = _this$state.didSelectFilterFamily,
          didSelectEntity = _this$state.didSelectEntity,
          entityParentFilterFamily = _this$state.entityParentFilterFamily;

      var value = _this.getValue();

      var filterFamilyOptionCount = getFilterFamilyOptions().size || 0;
      var fieldCount = ImmutableMap.isMap(fields) ? fields.size : 0;
      var nextState = {
        error: FilterOperatorErrorRecord({
          error: false
        })
      };

      if (value && fieldCount !== 1) {
        nextState.draft = null;
        onChange(SyntheticEvent(null));
      } else if (isXoEnabled && filterFamilyOptionCount > 1 && didSelectFilterFamily && didSelectEntity && !didInitializeWithAFilterFamily) {
        nextState.didSelectEntity = false;
        nextState.entity = undefined;
        nextState.searchValue = '';
        onChangeFilterFamily(SyntheticEvent(entityParentFilterFamily));

        if (fieldCount === 1) {
          nextState.draft = null;
          onChange(SyntheticEvent(null));
        }
      } else if (isXoEnabled && filterFamilyOptionCount > 1 && didSelectFilterFamily && !didInitializeWithAFilterFamily) {
        nextState.didSelectFilterFamily = false;
        nextState.searchValue = '';
        onChangeFilterFamily(SyntheticEvent(undefined));

        if (fieldCount === 1) {
          nextState.draft = null;
          onChange(SyntheticEvent(null));
        }
      } else if (isXoEnabled && filterFamilyOptionCount > 1) {
        nextState.searchValue = '';
        onChangeFilterFamily(SyntheticEvent(undefined));
        onDone(SyntheticEvent(null), true);
      } else {
        onDone(SyntheticEvent(null), true);
      }

      _this.setState(nextState);
    };

    _this.handleChange = function (evt) {
      var value = evt.target.value;

      if (!isValidOperator(value)) {
        _this.setState({
          draft: value,
          error: FilterOperatorErrorRecord({
            error: false
          })
        });

        return;
      }

      _this.props.onChange(SyntheticEvent(value));

      _this.setState({
        draft: null,
        error: FilterOperatorErrorRecord({
          error: false
        })
      });
    };

    _this.handleSearchChange = function (evt) {
      var _evt$target$value = evt.target.value,
          value = _evt$target$value === void 0 ? '' : _evt$target$value;
      var _this$props2 = _this.props,
          onFieldSearchChange = _this$props2.onFieldSearchChange,
          filterFamily = _this$props2.filterFamily;

      _this.setState({
        searchValue: value
      });

      onFieldSearchChange(value, filterFamily);
    };

    _this.handleSelectFilterFamily = function (evt) {
      var nextFilterFamily = evt.target.name;
      var _this$props3 = _this.props,
          filterFamily = _this$props3.filterFamily,
          onChangeFilterFamily = _this$props3.onChangeFilterFamily;
      onChangeFilterFamily(SyntheticEvent(nextFilterFamily));

      if (nextFilterFamily !== filterFamily) {
        _this.setState({
          didSelectFilterFamily: true,
          searchScrollTop: 0
        });
      }

      _this.setState({
        didSelectFilterFamily: true
      });
    };

    _this.handleSelectEntity = function (evt) {
      var entity = evt.target.value;
      var _this$props4 = _this.props,
          filterFamily = _this$props4.filterFamily,
          onChangeFilterFamily = _this$props4.onChangeFilterFamily,
          getFilterFamilyForEntity = _this$props4.getFilterFamilyForEntity;
      var entityFilterFamily = getFilterFamilyForEntity(entity.name, entity.type);
      onChangeFilterFamily(SyntheticEvent(entityFilterFamily));

      _this.setState({
        didSelectEntity: true,
        entity: entity.name,
        entityParentFilterFamily: filterFamily
      });
    };

    _this.handleSelectField = function (evt) {
      _this.handleChange(evt); // TODO crabideau: the temp column needs to be removed!


      var onTempColumnAdd = _this.props.onTempColumnAdd;

      if (typeof onTempColumnAdd === 'function') {
        onTempColumnAdd(evt.target.value);
      }
    };

    _this.handleSubmit = function (evt) {
      evt.preventDefault();
      var validateOperator = _this.props.validateOperator;

      var value = _this.getValue();

      var validationError = validateOperator(value);
      var error = isRecord(validationError) ? validationError : FilterOperatorErrorRecord(validationError);
      var isError = error.get('error') || false;

      if (isValidOperator(value) && !isError) {
        _this.props.onDone(SyntheticEvent(value));

        _this.setState({
          error: FilterOperatorErrorRecord({
            errorOpts: error.get('opts') || {}
          })
        });
      } else {
        _this.setState({
          error: error
        });
      }
    };

    _this.state = {
      didInitializeWithAFilterFamily: false,
      didSelectFilterFamily: Boolean(!props.isXoEnabled || props.filterFamily),
      didSelectEntity: false,
      draft: null,
      entity: undefined,
      entityParentFilterFamily: undefined,
      error: FilterOperatorErrorRecord({
        error: false
      }),
      searchScrollTop: 0,
      searchValue: ''
    };
    return _this;
  }

  _createClass(FilterEditorOperatorCreate, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.focusTypeahead();

      if (this.props.filterFamily) {
        this.setState({
          didInitializeWithAFilterFamily: true
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_, prevState) {
      if (!this.state.draft && prevState.draft !== this.state.draft) {
        this.focusTypeahead();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.onFieldSearchChange('', null);
    }
  }, {
    key: "focusTypeahead",
    value: function focusTypeahead() {
      // eslint-disable-next-line react/no-string-refs
      var typeahead = this.refs.typeahead;

      if (typeahead) {
        typeahead.focus();
      }
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.state.draft || this.props.value;
    }
  }, {
    key: "getEditorTitle",
    value: function getEditorTitle() {
      var _this$props5 = this.props,
          filterFamily = _this$props5.filterFamily,
          getFilterFamilyName = _this$props5.getFilterFamilyName,
          getLabelString = _this$props5.getLabelString,
          isXoEnabled = _this$props5.isXoEnabled;
      var didSelectFilterFamily = this.state.didSelectFilterFamily;
      var value = this.getValue();

      if (!didSelectFilterFamily) {
        return /*#__PURE__*/_jsx(FormattedMessage, {
          message: "customerDataFilters.FilterEditorOperatorCreate.filterTypeTitle"
        });
      } else if (didSelectFilterFamily && !value && isXoEnabled) {
        return getFilterFamilyName(filterFamily);
      } else if (didSelectFilterFamily && value) {
        return value && value.field && getLabelString(value.field);
      }

      return '';
    }
  }, {
    key: "isOnFamilySelect",
    value: function isOnFamilySelect() {
      var getFilterFamilyOptions = this.props.getFilterFamilyOptions;
      var didSelectFilterFamily = this.state.didSelectFilterFamily;
      var filterFamilyOptions = getFilterFamilyOptions();
      return !didSelectFilterFamily && filterFamilyOptions.size > 1;
    }
  }, {
    key: "isOnEntitySelect",
    value: function isOnEntitySelect() {
      var _this$props6 = this.props,
          getFilterFamilyHasEntities = _this$props6.getFilterFamilyHasEntities,
          filterFamily = _this$props6.filterFamily;
      var _this$state2 = this.state,
          didSelectEntity = _this$state2.didSelectEntity,
          didSelectFilterFamily = _this$state2.didSelectFilterFamily;
      var entityNeededForFilterFamily = getFilterFamilyHasEntities(filterFamily);
      return didSelectFilterFamily && !didSelectEntity && entityNeededForFilterFamily;
    }
  }, {
    key: "isOnEntityFieldSelect",
    value: function isOnEntityFieldSelect() {
      var value = this.getValue();
      var _this$state3 = this.state,
          didSelectFilterFamily = _this$state3.didSelectFilterFamily,
          didSelectEntity = _this$state3.didSelectEntity;
      return didSelectFilterFamily && didSelectEntity && !value;
    }
  }, {
    key: "isOnFieldSelect",
    value: function isOnFieldSelect() {
      var value = this.getValue();
      var didSelectFilterFamily = this.state.didSelectFilterFamily;
      return didSelectFilterFamily && !value;
    }
  }, {
    key: "isOnOperatorSelect",
    value: function isOnOperatorSelect() {
      var value = this.getValue();
      return !!value;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          FieldSelectItemComponent = _this$props7.FieldSelectItemComponent,
          activeFieldNames = _this$props7.activeFieldNames,
          className = _this$props7.className,
          currencyCode = _this$props7.currencyCode,
          editorSubtitle = _this$props7.editorSubtitle,
          fieldGroups = _this$props7.fieldGroups,
          fields = _this$props7.fields,
          filterFamily = _this$props7.filterFamily,
          getDescriptionString = _this$props7.getDescriptionString,
          getFamilyValueResolver = _this$props7.getFamilyValueResolver,
          getFilterFamilyName = _this$props7.getFilterFamilyName,
          getFilterFamilyOptions = _this$props7.getFilterFamilyOptions,
          getInputComponent = _this$props7.getInputComponent,
          getLabelString = _this$props7.getLabelString,
          getOperatorLabel = _this$props7.getOperatorLabel,
          getOperators = _this$props7.getOperators,
          getPlaceholder = _this$props7.getPlaceholder,
          getReferencedObjectType = _this$props7.getReferencedObjectType,
          getFilterFamilyObjectName = _this$props7.getFilterFamilyObjectName,
          getSpecialOptionsForReferenceType = _this$props7.getSpecialOptionsForReferenceType,
          getObjectPropertyLabel = _this$props7.getObjectPropertyLabel,
          isFieldDescriptionVisible = _this$props7.isFieldDescriptionVisible,
          isFiscalYearEnabled = _this$props7.isFiscalYearEnabled,
          isInitialStepBackButtonDisabled = _this$props7.isInitialStepBackButtonDisabled,
          isRollingDateOffsetInputEnabled = _this$props7.isRollingDateOffsetInputEnabled,
          isTimezoneWarningDisabled = _this$props7.isTimezoneWarningDisabled,
          isXoEnabled = _this$props7.isXoEnabled,
          _this$props7$labelOpe = _this$props7.labelOperatorCreateSave,
          labelOperatorCreateSave = _this$props7$labelOpe === void 0 ? /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataFilters.FilterEditorOperatorCreate.save"
      }) : _this$props7$labelOpe,
          loadMoreFields = _this$props7.loadMoreFields,
          __onChange = _this$props7.onChange,
          __onChangeFilterFamily = _this$props7.onChangeFilterFamily,
          __onDone = _this$props7.onDone,
          renderFieldLink = _this$props7.renderFieldLink,
          searchable = _this$props7.searchable,
          showIncludeUnknownValues = _this$props7.showIncludeUnknownValues,
          style = _this$props7.style,
          nullIssueRelatedState = _this$props7.nullIssueRelatedState,
          updateNullIssueRelatedState = _this$props7.updateNullIssueRelatedState,
          rest = _objectWithoutProperties(_this$props7, ["FieldSelectItemComponent", "activeFieldNames", "className", "currencyCode", "editorSubtitle", "fieldGroups", "fields", "filterFamily", "getDescriptionString", "getFamilyValueResolver", "getFilterFamilyName", "getFilterFamilyOptions", "getInputComponent", "getLabelString", "getOperatorLabel", "getOperators", "getPlaceholder", "getReferencedObjectType", "getFilterFamilyObjectName", "getSpecialOptionsForReferenceType", "getObjectPropertyLabel", "isFieldDescriptionVisible", "isFiscalYearEnabled", "isInitialStepBackButtonDisabled", "isRollingDateOffsetInputEnabled", "isTimezoneWarningDisabled", "isXoEnabled", "labelOperatorCreateSave", "loadMoreFields", "onChange", "onChangeFilterFamily", "onDone", "renderFieldLink", "searchable", "showIncludeUnknownValues", "style", "nullIssueRelatedState", "updateNullIssueRelatedState"]);

      var _this$state4 = this.state,
          didSelectFilterFamily = _this$state4.didSelectFilterFamily,
          error = _this$state4.error,
          searchValue = _this$state4.searchValue;
      var value = this.getValue();
      var isBodyHeightFixed = Boolean(didSelectFilterFamily && !value);
      var filterFamilyOptions = getFilterFamilyOptions();
      var filterFamilyOptionCount = getFilterFamilyOptions().size || 0;
      var isInitialStep = filterFamilyOptionCount > 1 ? !didSelectFilterFamily && !value : !value;
      var conditionsFieldNameDisplayBlacklist = ImmutableSet(['favoriteUserList']);

      var isNameBlacklisted = function isNameBlacklisted(propertyRecord) {
        return !conditionsFieldNameDisplayBlacklist.contains(propertyRecord.get('name'));
      };

      var creatableFieldGroups = fieldGroups ? (filterFamily && fieldGroups.get(filterFamily) || fieldGroups).map(function (fieldGroup) {
        return fieldGroup.update('properties', function (list) {
          return list.filter(isNameBlacklisted);
        });
      }) : undefined;
      var isValueDescriptionShown = isFieldDescriptionVisible && value && value.field;
      var valueDescription = isValueDescriptionShown ? getDescriptionString(value.field) : null;
      var valueUrl = value && getIn(['field', 'url'], value);
      var dataAttributes = Object.keys(rest).filter(function (key) {
        return key.startsWith('data-');
      }).reduce(function (acc, key) {
        acc[key] = rest[key];
        return acc;
      }, {});
      var currentPanel;

      if (this.isOnFamilySelect()) {
        currentPanel = "FilterFamilySelect";
      } else if (this.isOnEntitySelect()) {
        currentPanel = "FilterFamilyEntitySelect";
      } else if (this.isOnFieldSelect()) {
        currentPanel = "FilterEditorFieldSelect";
      } else if (this.isOnOperatorSelect()) {
        currentPanel = "FilterOperatorRefinableInput";
      }

      return /*#__PURE__*/_jsxs(FilterEditorPanel, Object.assign({
        "data-selenium-test": "XOFilterEditor-create-panel"
      }, dataAttributes, {
        className: className,
        description: valueDescription,
        editorSubtitle: editorSubtitle,
        handleGoBack: this.handleGoBack,
        isBackButtonDisabled: isInitialStepBackButtonDisabled && isInitialStep,
        isBodyHeightFixed: isBodyHeightFixed,
        isTimezoneWarningDisabled: isTimezoneWarningDisabled,
        isXoEnabled: isXoEnabled,
        onSubmit: value ? this.handleSubmit : null,
        renderFieldLink: renderFieldLink,
        saveLabel: labelOperatorCreateSave,
        style: style,
        title: this.getEditorTitle(),
        url: valueUrl,
        value: value,
        children: [currentPanel === "FilterFamilySelect" && /*#__PURE__*/_jsx(FilterFamilySelect, {
          getFilterFamilyName: getFilterFamilyName,
          onClick: this.handleSelectFilterFamily,
          options: filterFamilyOptions
        }), currentPanel === "FilterFamilyEntitySelect" && /*#__PURE__*/_jsx(FilterEditorEntitySelect, {
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
          onChange: this.handleSelectEntity,
          onSearchChange: this.handleSearchChange,
          searchable: searchable,
          searchValue: searchValue,
          value: value
        }), currentPanel === "FilterEditorFieldSelect" && /*#__PURE__*/_jsx(FilterEditorFieldSelect, {
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
          value: value
        }), currentPanel === "FilterOperatorRefinableInput" && /*#__PURE__*/_jsx(FilterOperatorRefinableInput, {
          currencyCode: currencyCode,
          error: error,
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
          isFiscalYearEnabled: isFiscalYearEnabled,
          isRollingDateOffsetInputEnabled: isRollingDateOffsetInputEnabled,
          isXoEnabled: isXoEnabled,
          nullIssueRelatedState: nullIssueRelatedState,
          onChange: this.handleChange,
          showIncludeUnknownValues: showIncludeUnknownValues,
          updateNullIssueRelatedState: updateNullIssueRelatedState,
          value: value
        })]
      }));
    }
  }]);

  return FilterEditorOperatorCreate;
}(Component);

export { FilterEditorOperatorCreate as default };
FilterEditorOperatorCreate.propTypes = {
  FieldSelectItemComponent: PropTypes.func,
  activeFieldNames: setOf(PropTypes.string.isRequired).isRequired,
  className: PropTypes.string,
  currencyCode: PropTypes.string.isRequired,
  editorSubtitle: PropTypes.node,
  fieldGroups: mapOf(FilterFieldGroupType),
  fields: mapOf(FilterFieldType),
  filterFamily: PropTypes.string,
  getDescriptionString: PropTypes.func.isRequired,
  getFamilyValueResolver: PropTypes.func.isRequired,
  getFilterFamilyForEntity: PropTypes.func.isRequired,
  getFilterFamilyHasEntities: PropTypes.func.isRequired,
  getFilterFamilyName: PropTypes.func.isRequired,
  getFilterFamilyObjectName: PropTypes.func.isRequired,
  getFilterFamilyOptions: PropTypes.func.isRequired,
  getInputComponent: PropTypes.func.isRequired,
  getLabelString: PropTypes.func.isRequired,
  getObjectPropertyLabel: PropTypes.func.isRequired,
  getOperatorLabel: PropTypes.func.isRequired,
  getOperators: PropTypes.func.isRequired,
  getPlaceholder: PropTypes.func.isRequired,
  getReferencedObjectType: PropTypes.func.isRequired,
  getSpecialOptionsForReferenceType: PropTypes.func.isRequired,
  isFieldDescriptionVisible: PropTypes.bool.isRequired,
  isFiscalYearEnabled: PropTypes.bool.isRequired,
  isInitialStepBackButtonDisabled: PropTypes.bool,
  isRollingDateOffsetInputEnabled: PropTypes.bool.isRequired,
  isTimezoneWarningDisabled: PropTypes.bool,
  isXoEnabled: PropTypes.bool,
  labelOperatorCreateSave: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  loadMoreFields: PropTypes.func,
  nullIssueRelatedState: NullRelatedState,
  onChange: PropTypes.func.isRequired,
  onChangeFilterFamily: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  onFieldSearchChange: PropTypes.func.isRequired,
  onTempColumnAdd: PropTypes.func,
  renderFieldLink: PropTypes.func.isRequired,
  searchable: PropTypes.bool,
  showIncludeUnknownValues: PropTypes.bool.isRequired,
  style: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  updateNullIssueRelatedState: PropTypes.func,
  validateOperator: PropTypes.func.isRequired,
  value: FilterOperatorType
};
FilterEditorOperatorCreate.defaultProps = {
  activeFieldNames: ImmutableSet(),
  getFilterFamilyHasEntities: always(false),
  getFilterFamilyOptions: function getFilterFamilyOptions() {
    return OrderedSet();
  },
  onChangeFilterFamily: function onChangeFilterFamily(_) {
    return _;
  }
};