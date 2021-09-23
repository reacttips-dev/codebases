'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { connect } from 'general-store';
import { Map as ImmutableMap, List } from 'immutable';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import { getPropertyMap, getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import CompanyCreatorDialog from './CompanyCreatorDialog';
import { CompanyCreatorDependencies } from '../dependencies/CompanyCreatorDependencies';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';

var CompanyCreatorContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(CompanyCreatorContainer, _PureComponent);

  function CompanyCreatorContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CompanyCreatorContainer);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CompanyCreatorContainer)).call.apply(_getPrototypeOf2, [this].concat(_args)));

    _this.handleChange = function (_ref) {
      var name = _ref.property.name,
          value = _ref.value;
      var updatedCompanyRecord = setProperty(_this.props.companyRecord, name, value);

      _this.props.setCompanyRecord(updatedCompanyRecord);
    };

    _this.handleConfirm = function (e) {
      if (!_this.props.isCreatingCompany && _this.props.suggestions && _this.props.suggestions.has('results') && _this.props.suggestions.get('results').size) {
        _this.props.setIsCreatingCompany(true);

        return;
      }

      _this.props.onConfirm({
        properties: _this.props.properties,
        propertyValues: getPropertyMap(_this.props.companyRecord),
        addNew: e.addNew,
        bidenCompany: _this.props.bidenCompany
      });

      _this.props.setCompanyRecord(CompanyRecord());
    };

    _this.handleReject = function () {
      var _this$props;

      _this.props.setCompanyRecord(CompanyRecord());

      (_this$props = _this.props).onReject.apply(_this$props, arguments);
    };

    return _this;
  }

  _createClass(CompanyCreatorContainer, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var isCreatingCompany = this.props.via === 'Company Association Dialog';
      var updatedCompanyRecord = this.props.propertyDefaults.reduce(function (acc, value, name) {
        return setProperty(acc, name, value);
      }, this.props.companyRecord);
      this.props.setCompanyRecord(updatedCompanyRecord);
      this.props.setIsCreatingCompany(isCreatingCompany);
    }
  }, {
    key: "UNSAFE_componentWillUpdate",
    value: function UNSAFE_componentWillUpdate(nextProps) {
      var prevSuggestions = this.props.suggestions;
      var nextSuggestions = nextProps.suggestions;
      var nextBidenCompany = nextProps.bidenCompany;
      var prevBidenCompany = this.props.bidenCompany;
      var nextBidenDomain;
      var prevBidenDomain;

      if (nextBidenCompany) {
        nextBidenDomain = getProperty(nextBidenCompany, 'domain');
      }

      if (prevBidenCompany) {
        prevBidenDomain = getProperty(prevBidenCompany, 'domain');
      }

      if (this.props.isCreatingCompany) {
        if (nextSuggestions && nextSuggestions.has('results') && nextSuggestions.get('results').size && !nextSuggestions.equals(prevSuggestions)) {
          this.props.setIsCreatingCompany(false);
        }
      }

      if (nextBidenDomain && nextBidenDomain.length && nextBidenDomain !== prevBidenDomain) {
        this.updateCompanyPropertiesWithBiden(nextBidenCompany);
      }
    }
  }, {
    key: "updateCompanyPropertiesWithBiden",
    value: function updateCompanyPropertiesWithBiden(bidenCompany) {
      var _this$props2 = this.props,
          allCompanyProperties = _this$props2.allCompanyProperties,
          companyRecord = _this$props2.companyRecord;
      var bidenProperties = getPropertyMap(bidenCompany);

      if (allCompanyProperties) {
        bidenProperties = bidenProperties.filter(function (value, key) {
          var property = allCompanyProperties.get(key);
          return property && !property.get('readOnlyValue');
        });
      }

      var updatedCompanyRecord = bidenProperties.reduce(function (acc, value, name) {
        return setProperty(acc, name, value);
      }, companyRecord);
      this.props.setCompanyRecord(updatedCompanyRecord);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(ErrorBoundary, {
        boundaryName: "CompanyCreatorContainer",
        children: /*#__PURE__*/_jsx(CompanyCreatorDialog, {
          allCompanyProperties: this.props.allCompanyProperties,
          bidenCompany: this.props.bidenCompany,
          embedded: this.props.embedded,
          handleChange: this.handleChange,
          ignoreDefaultCreatorProperties: this.props.ignoreDefaultCreatorProperties,
          isCreatingCompany: this.props.isCreatingCompany,
          onConfirm: this.handleConfirm,
          onReject: this.handleReject,
          properties: this.props.properties,
          propertyValues: getPropertyMap(this.props.companyRecord),
          additionalRequiredProperties: this.props.additionalRequiredProperties,
          requiredProps: this.props.requiredProps,
          showAllProperties: this.props.showAllProperties,
          showLoadingAnimation: this.props.showLoadingAnimation,
          shouldRenderConfirmAndAddButton: this.props.shouldRenderConfirmAndAddButton,
          shouldRenderContentOnly: this.props.shouldRenderContentOnly,
          suggestions: this.props.suggestions,
          via: this.props.via
        })
      });
    }
  }]);

  return CompanyCreatorContainer;
}(PureComponent);

CompanyCreatorContainer.propTypes = Object.assign({
  allCompanyProperties: PropTypes.instanceOf(ImmutableMap),
  bidenCompany: PropTypes.instanceOf(CompanyRecord),
  companyRecord: PropTypes.instanceOf(CompanyRecord).isRequired,
  embedded: PropTypes.bool,
  ignoreDefaultCreatorProperties: PropTypes.bool,
  isCreatingCompany: PropTypes.bool.isRequired,
  properties: PropTypes.instanceOf(ImmutableMap),
  propertyDefaults: PropTypes.instanceOf(ImmutableMap).isRequired,
  requiredProps: PropTypes.instanceOf(List),
  additionalRequiredProperties: PropTypes.instanceOf(List),
  setCompanyRecord: PropTypes.func.isRequired,
  setIsCreatingCompany: PropTypes.func.isRequired,
  shouldRenderConfirmAndAddButton: PropTypes.bool,
  shouldRenderContentOnly: PropTypes.bool,
  showAllProperties: PropTypes.bool.isRequired,
  showLoadingAnimation: PropTypes.bool.isRequired,
  suggestions: PropTypes.instanceOf(ImmutableMap),
  via: PropTypes.string
}, PromptablePropInterface);
export default connect(CompanyCreatorDependencies)(CompanyCreatorContainer);