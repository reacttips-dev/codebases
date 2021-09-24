'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import { COMPANY } from 'customer-data-objects/constants/ObjectTypes';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { isValidDomain, isValidRequiredProperties, domainContainsPath } from 'customer-data-properties/validation/PropertyValidations';
import { Map as ImmutableMap, List } from 'immutable';
import MatchingCompanies from './MatchingCompanies';
import ObjectCreatorDialog from '../../../modals/dialogs/objectModifiers/ObjectCreatorDialog';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UILink from 'UIComponents/link/UILink';
import PortalIdParser from 'PortalIdParser';
import canCreate from '../../../utils/canCreate';
import ImmutablePropTypes from 'react-immutable-proptypes';
var INITIAL_COMPANY_PROPERTIES = ['domain', 'name'];

var CompanyCreatorDialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(CompanyCreatorDialog, _PureComponent);

  function CompanyCreatorDialog() {
    var _this;

    _classCallCheck(this, CompanyCreatorDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CompanyCreatorDialog).call(this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(CompanyCreatorDialog, [{
    key: "getDisabledTooltip",
    value: function getDisabledTooltip() {
      if (!this.isValidRequiredProps()) {
        return I18n.text('createCompanyModal.disabledTooltip.missingRequired');
      }

      return null;
    }
  }, {
    key: "hasSuggestions",
    value: function hasSuggestions() {
      var suggestions = this.props.suggestions;
      return suggestions && suggestions.has('results') && suggestions.get('results').size;
    }
  }, {
    key: "isSaveable",
    value: function isSaveable() {
      var domain = this.props.propertyValues.get('domain');
      var name = this.props.propertyValues.get('name');
      var isValidRequiredProps = this.isValidRequiredProps();

      if (domain && domain.length > 0) {
        return isValidDomain(domain) && isValidRequiredProps && !domainContainsPath(domain);
      }

      return name && name.length > 0 && isValidRequiredProps;
    }
  }, {
    key: "isValidRequiredProps",
    value: function isValidRequiredProps() {
      return this.props.properties === LOADING ? false : isValidRequiredProperties(this.props.requiredProps, this.props.propertyValues, this.props.properties);
    }
  }, {
    key: "isConfirmDisabled",
    value: function isConfirmDisabled() {
      var _this$props = this.props,
          isCreatingCompany = _this$props.isCreatingCompany,
          showAllProperties = _this$props.showAllProperties;

      if (!canCreate(COMPANY)) {
        return true;
      }

      if (this.hasSuggestions() && !isCreatingCompany) {
        return false;
      }

      if (isCreatingCompany || showAllProperties) {
        return !this.isSaveable();
      }

      return true;
    }
  }, {
    key: "renderConfirmAndAddButton",
    value: function renderConfirmAndAddButton(isConfirmDisabled) {
      if (!this.props.shouldRenderConfirmAndAddButton) {
        return null;
      }

      var via = this.props.via;

      if (this.hasSuggestions()) {
        return null;
      }

      if (via === 'Company Association Dialog') {
        return null;
      }

      var handleClick = this.partial(this.props.onConfirm, {
        addNew: true
      });
      var disabledTooltip = this.getDisabledTooltip();
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !isConfirmDisabled || !disabledTooltip,
        title: disabledTooltip,
        children: /*#__PURE__*/_jsx(UILoadingButton, {
          onClick: handleClick,
          className: "pull-right",
          use: "secondary",
          disabled: isConfirmDisabled,
          duration: 1000,
          "data-selenium-test": "create-add-another-company-button",
          children: I18n.text('createCompanyModal.addButtonLabel.createAndNewUnique')
        })
      });
    }
  }, {
    key: "renderLoadingAnimation",
    value: function renderLoadingAnimation() {
      if (!this.props.showLoadingAnimation) {
        return null;
      }

      return /*#__PURE__*/_jsx(UILoadingSpinner, {
        className: "create-modal-loading m-top-4",
        grow: true
      });
    }
  }, {
    key: "renderConfirmLabel",
    value: function renderConfirmLabel() {
      var isCreatingCompany = this.props.isCreatingCompany;

      if (this.hasSuggestions() && !isCreatingCompany) {
        return I18n.text('createCompanyModal.addButtonLabel.createAdditional');
      }

      return I18n.text('createCompanyModal.addButtonLabel.createUnique');
    }
  }, {
    key: "renderTitle",
    value: function renderTitle() {
      return I18n.text('createCompanyModal.modalHeader');
    }
  }, {
    key: "renderViewAllLink",
    value: function renderViewAllLink() {
      var _this$props2 = this.props,
          suggestions = _this$props2.suggestions,
          propertyValues = _this$props2.propertyValues;

      if (!suggestions || !suggestions.get('hasMore')) {
        return null;
      }

      var domain = propertyValues.get('domain');
      return /*#__PURE__*/_jsx(UILink, {
        href: "/contacts/" + PortalIdParser.get() + "/companies/view/all/?query=" + domain,
        external: true,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "createCompanyModal.viewAllCompanies"
        })
      });
    }
  }, {
    key: "renderSuggestions",
    value: function renderSuggestions() {
      return /*#__PURE__*/_jsxs("div", {
        children: [this.renderLoadingAnimation(), /*#__PURE__*/_jsx(MatchingCompanies, {
          suggestions: this.props.suggestions,
          onReject: this.props.onReject
        }), this.renderViewAllLink()]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var isConfirmDisabled = this.isConfirmDisabled();
      return /*#__PURE__*/_jsx(ObjectCreatorDialog, {
        confirmDisabled: isConfirmDisabled,
        confirmDisabledTooltip: this.getDisabledTooltip(),
        confirmLabel: this.renderConfirmLabel(),
        embedded: this.props.embedded,
        onChange: this.props.handleChange,
        hiddenFieldsLabel: this.props.suggestions ? '' : I18n.text('createCompanyModal.hiddenFieldsLabel'),
        ignoreDefaultCreatorProperties: this.props.ignoreDefaultCreatorProperties,
        initialProperties: INITIAL_COMPANY_PROPERTIES,
        moreButtons: this.renderConfirmAndAddButton(isConfirmDisabled),
        objectType: COMPANY,
        onConfirm: this.props.onConfirm,
        onReject: this.props.onReject,
        properties: this.props.properties,
        propertyValues: this.props.propertyValues,
        additionalRequiredProperties: this.props.additionalRequiredProperties,
        shouldRenderContentOnly: this.props.shouldRenderContentOnly,
        showAllProperties: this.props.showAllProperties,
        suggestions: this.renderSuggestions(),
        title: this.renderTitle()
      });
    }
  }]);

  return CompanyCreatorDialog;
}(PureComponent);

CompanyCreatorDialog.defaultProps = {
  shouldRenderConfirmAndAddButton: true
};
CompanyCreatorDialog.propTypes = {
  embedded: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  ignoreDefaultCreatorProperties: PropTypes.bool,
  isCreatingCompany: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  properties: PropTypes.instanceOf(ImmutableMap),
  propertyValues: ImmutablePropTypes.mapOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]), PropTypes.string),
  requiredProps: PropTypes.instanceOf(List),
  additionalRequiredProperties: PropTypes.instanceOf(List),
  showAllProperties: PropTypes.bool.isRequired,
  shouldRenderConfirmAndAddButton: PropTypes.bool,
  shouldRenderContentOnly: PropTypes.bool,
  showLoadingAnimation: PropTypes.bool.isRequired,
  suggestions: PropTypes.instanceOf(ImmutableMap),
  via: PropTypes.string
};
export default CompanyCreatorDialog;