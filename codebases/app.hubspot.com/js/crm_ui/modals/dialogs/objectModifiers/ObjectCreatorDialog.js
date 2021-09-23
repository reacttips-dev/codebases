'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import { connect } from 'general-store';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import RequiredPropsDependency from '../../../dependencies/RequiredPropsDependency';
import ComponentWithPartials from 'UIComponents/mixins/ComponentWithPartials';
import I18n from 'I18n';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { Map as ImmutableMap } from 'immutable';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { CrmLogger } from 'customer-data-tracking/loggers';
import ScopesContainer from '../../../../setup-object-embed/containers/ScopesContainer';
import links from 'crm-legacy-links/links';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import { getPropertyLabel } from 'customer-data-property-utils/PropertyDisplay';
import PropertyInput from 'crm-ui-legacy-property-input';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import * as PropertyValueDisplay from 'customer-data-property-utils/PropertyValueDisplay';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import UIFieldset from 'UIComponents/form/UIFieldset';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIOverlay from 'UIComponents/overlay/UIOverlay';
import Big from 'UIComponents/elements/Big';
import UISection from 'UIComponents/section/UISection';
import PermissionsAlert from '../../../permissions/PermissionsAlert';
import { CREATE } from '../../../permissions/permissionsConstants';
import { isKnownGuid, getGuidLabel } from 'reporting-data/lib/guids';
import FullNameInput from 'ui-addon-i18n/components/FullNameInput';
import UIButton from 'UIComponents/button/UIButton';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import emptyFunction from 'react-utils/emptyFunction';
import ImmutablePropTypes from 'react-immutable-proptypes';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import { isScoped } from '../../../../setup-object-embed/containers/ScopeOperators';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import CrmContentError from '../../../error/CrmContentError';
import Pipeline, { allPipelineStores } from '../../../filter/pipelineTypes/all';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { DEAL_AMOUNT_PREFERENCES } from 'products-ui-components/constants/DealAmountOptions';
import { GYPSUM, BATTLESHIP } from 'HubStyleTokens/colors';
import { UpgradeModalWrapper } from '../../../upgrades/UpgradeModalWrapper';
var readOnlySourceData = {
  isKnownGuid: isKnownGuid,
  getGuidLabel: getGuidLabel
};
var WIDTH = 600;
var ObjectCreatorFooter = styled(UIDialogFooter).withConfig({
  displayName: "ObjectCreatorDialog__ObjectCreatorFooter",
  componentId: "sc-1jjevkq-0"
})(["background-color:", " !important;border-top:1px solid ", ";bottom:0;width:100%;left:0;position:fixed;z-index:1;"], GYPSUM, BATTLESHIP);
var StyledObjectCreatorDialog = styled.div.withConfig({
  displayName: "ObjectCreatorDialog__StyledObjectCreatorDialog",
  componentId: "sc-1jjevkq-1"
})([".tile-width{width:350px;}"]);

var objectTypeSupportsPipelines = function objectTypeSupportsPipelines(type) {
  return type === DEAL || type === TICKET;
};

var ObjectCreatorDialog = createReactClass({
  displayName: 'ObjectCreatorDialog',
  mixins: [ComponentWithPartials],
  propTypes: {
    // A react component that can be optionally added above the form
    additionalContent: PropTypes.element,
    confirmHref: PropTypes.string,
    confirmLabel: PropTypes.string,
    confirmDisabled: PropTypes.bool,
    confirmDisabledTooltip: PropTypes.node,
    embedded: PropTypes.bool.isRequired,
    extraFields: PropTypes.node,
    hiddenFieldsLabel: PropTypes.node,
    ignoreDefaultCreatorProperties: PropTypes.bool,
    initialProperties: PropTypes.array,
    isDealAmountDisabled: PropTypes.bool,
    moreButtons: PropTypes.node,
    objectType: ObjectTypesType.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onConfirm: PromptablePropInterface.onConfirm,
    onOpenComplete: PropTypes.func,
    onReject: PromptablePropInterface.onReject,
    properties: ImmutablePropTypes.orderedMap,
    propertyValues: ImmutablePropTypes.map,
    requiredProps: ImmutablePropTypes.listOf(PropTypes.string.isRequired),
    shouldRenderContentOnly: PropTypes.bool,
    showAllProperties: PropTypes.bool.isRequired,
    subject: ImmutablePropTypes.map,
    // needed by PropertyInputDealStage only
    suggestions: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    validationErrors: ImmutablePropTypes.mapOf(PropTypes.node),
    pipelines: ImmutablePropTypes.orderedMapOf(ImmutablePropTypes.mapContains({
      label: PropTypes.string.isRequired,
      pipelineId: PropTypes.string.isRequired
    }, PropTypes.string)),
    dealAmountPreference: PropTypes.string,
    allDealProperties: PropTypes.instanceOf(ImmutableMap)
  },
  getDefaultProps: function getDefaultProps() {
    return {
      embedded: false,
      initialProperties: [],
      isDealAmountDisabled: false,
      onChange: emptyFunction,
      onBlur: emptyFunction,
      validationErrors: ImmutableMap(),
      shouldRenderContentOnly: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      hasEdited: false,
      isDialogOpen: false
    };
  },
  componentDidMount: function componentDidMount() {
    var objectType = this.props.objectType;
    CrmLogger.log('recordInteractions', {
      action: 'open record creator modal',
      objectType: objectType
    });
  },
  onPipelineOpenChange: function onPipelineOpenChange(evt) {
    var objectType = this.props.objectType;

    if (evt.target.value) {
      CrmLogger.log('record-interaction', {
        action: "property-input-" + objectType.toLowerCase() + "-pipeline-dropdown-open"
      });
    }
  },
  handleCustomizePropertiesClick: function handleCustomizePropertiesClick() {
    var objectType = this.props.objectType;
    CrmLogger.logIndexInteraction(objectType, {
      action: 'creator click customize properties'
    });
  },
  getWindowListeners: function getWindowListeners() {
    return {
      resize: this.handleResize
    };
  },
  userIsAdmin: function userIsAdmin() {
    return isScoped(ScopesContainer.get(), ['crm-set-default-properties']);
  },
  handleBlur: function handleBlur(property, e) {
    var value = e.target && e.target.value;
    var propertyName = property.get('name');
    var propertyValue = PropertyValueDisplay.sanitizeValue(property, value);
    this.props.onBlur({
      propertyName: propertyName,
      propertyValue: propertyValue
    });
    return;
  },
  handleChange: function handleChange(property, e) {
    var value = e.target && e.target.value;
    value = PropertyValueDisplay.sanitizeValue(property, value);
    this.props.onChange({
      property: property,
      value: value
    });
    return this.setState({
      hasEdited: true
    });
  },
  handleOpen: function handleOpen() {
    if (this.props.onOpenComplete) {
      this.props.onOpenComplete();
    }

    return this.setState({
      isDialogOpen: true
    });
  },
  isRequired: function isRequired(propertyName) {
    var _this$props = this.props,
        initialProperties = _this$props.initialProperties,
        requiredProps = _this$props.requiredProps,
        objectType = _this$props.objectType;
    var isUnskippableInitialProperty = ![CONTACT, COMPANY].includes(objectType) && initialProperties && initialProperties.includes(propertyName);
    var isRequiredProperty = requiredProps && requiredProps.includes(propertyName);
    return !!isUnskippableInitialProperty || !!isRequiredProperty;
  },
  getCustomizePropertiesUrl: function getCustomizePropertiesUrl(objectType) {
    var _settingsUrlByObjectT;

    var settingsUrlByObjectType = (_settingsUrlByObjectT = {}, _defineProperty(_settingsUrlByObjectT, COMPANY, 'companies'), _defineProperty(_settingsUrlByObjectT, CONTACT, 'contacts'), _defineProperty(_settingsUrlByObjectT, DEAL, 'deals'), _defineProperty(_settingsUrlByObjectT, TICKET, 'tickets'), _settingsUrlByObjectT);
    var linkSection = settingsUrlByObjectType[objectType];

    if (linkSection) {
      return links.settings(linkSection);
    }

    return '';
  },
  getInitialProperties: function getInitialProperties() {
    var _this$props2 = this.props,
        initialProperties = _this$props2.initialProperties,
        properties = _this$props2.properties;
    return properties.filter(function (property) {
      var needle = property.get('name');
      return initialProperties.includes(needle);
    }).toArray();
  },
  getSecondaryProperties: function getSecondaryProperties() {
    var _this$props3 = this.props,
        initialProperties = _this$props3.initialProperties,
        properties = _this$props3.properties,
        objectType = _this$props3.objectType;
    var secondaryPropertiesBlacklist = objectType === CONTACT ? ['email', 'firstname', 'lastname'] : initialProperties;
    return properties.filterNot(function (property) {
      var needle = property.get('name');
      return secondaryPropertiesBlacklist.includes(needle);
    }).toArray();
  },
  getShouldShowMultiplePipelinesPql: function getShouldShowMultiplePipelinesPql(name) {
    var _this$props4 = this.props,
        objectType = _this$props4.objectType,
        pipelines = _this$props4.pipelines; // We only want to show the PQL if the portal has only one pipeline and doesn't have access to multiple pipelines
    // This check is needed since there are some portals that have more than one pipelines but not access to multiple pipelines
    // See https://git.hubteam.com/HubSpot/crm-settings/pull/558 and https://git.hubteam.com/HubSpot/crm-settings/pull/598 for more details

    return (objectType === DEAL && name === 'pipeline' || objectType === TICKET && name === 'hs_pipeline') && !isScoped(ScopesContainer.get(), 'crm-multiple-pipelines-deals') && pipelines && pipelines.size === 1;
  },
  getUpgradeModalKey: function getUpgradeModalKey(name) {
    if (this.getShouldShowMultiplePipelinesPql(name)) {
      return 'crm-sales-pro-multiple-pipelines';
    }

    return null;
  },
  getTranslationForProperty: function getTranslationForProperty(propertyName) {
    if (!this.props.allDealProperties) {
      return null;
    }

    return propertyLabelTranslator(this.props.allDealProperties.getIn([propertyName, 'label']));
  },
  renderContactNameProperties: function renderContactNameProperties() {
    var _this$props5 = this.props,
        objectType = _this$props5.objectType,
        properties = _this$props5.properties,
        subject = _this$props5.subject,
        propertyValues = _this$props5.propertyValues;

    if (objectType !== CONTACT) {
      return null;
    }

    var firstNamePropertyName = 'firstname';
    var lastNamePropertyName = 'lastname';
    var firstNameProperty = properties.get(firstNamePropertyName);
    var lastNameProperty = properties.get(lastNamePropertyName);
    return /*#__PURE__*/_jsx(FullNameInput, {
      givenNameInput: /*#__PURE__*/_jsx(UIFormControl, {
        label: getPropertyLabel(firstNameProperty),
        required: this.isRequired(firstNamePropertyName),
        children: /*#__PURE__*/_jsx(PropertyInput, {
          baseUrl: links.contactEmail(''),
          readOnlySourceData: readOnlySourceData,
          objectType: objectType,
          onChange: this.partial(this.handleChange, firstNameProperty),
          property: PropertyRecord(firstNameProperty),
          showError: true,
          showPlaceholder: false,
          subjectId: null,
          subject: subject,
          value: propertyValues.get(firstNamePropertyName)
        })
      }, firstNamePropertyName),
      familyNameInput: /*#__PURE__*/_jsx(UIFormControl, {
        label: getPropertyLabel(lastNameProperty),
        required: this.isRequired(lastNamePropertyName),
        children: /*#__PURE__*/_jsx(PropertyInput, {
          baseUrl: links.contactEmail(''),
          readOnlySourceData: readOnlySourceData,
          objectType: objectType,
          onChange: this.partial(this.handleChange, lastNameProperty),
          property: PropertyRecord(lastNameProperty),
          showError: true,
          showPlaceholder: false,
          subjectId: null,
          subject: subject,
          value: propertyValues.get(lastNamePropertyName)
        })
      }, lastNamePropertyName)
    });
  },
  renderProperty: function renderProperty(shouldAutoFocus, property, index) {
    var _this = this;

    var _this$props6 = this.props,
        initialProperties = _this$props6.initialProperties,
        objectType = _this$props6.objectType,
        subject = _this$props6.subject,
        propertyValues = _this$props6.propertyValues,
        showAllProperties = _this$props6.showAllProperties,
        isDealAmountDisabled = _this$props6.isDealAmountDisabled,
        validationErrors = _this$props6.validationErrors,
        dealAmountPreference = _this$props6.dealAmountPreference;

    if (property == null) {
      return null;
    }

    if (property.get('readOnlyValue') || property.get('calculated')) {
      return null;
    }

    var isPreferenceCustom = dealAmountPreference === DEAL_AMOUNT_PREFERENCES['disabled'];
    var name = property.get('name');
    var disabled = !showAllProperties && !initialProperties.includes(name);

    if (name === 'amount') {
      disabled = disabled || isDealAmountDisabled && !isPreferenceCustom;
    }

    var showDealAmountPreferenceTooltip = name === 'amount' && isDealAmountDisabled;
    var upgradeKey = this.getUpgradeModalKey(name);

    var propertyInput = function propertyInput(openPipelineUpgradeModal) {
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: getPropertyLabel(property),
        required: _this.isRequired(name),
        error: validationErrors.has(name),
        validationMessage: validationErrors.get(name),
        labelTooltip: showDealAmountPreferenceTooltip && /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "createModal.dealAmount.dealAmountPreference",
          options: {
            dealAmountPreference: isPreferenceCustom ? /*#__PURE__*/_jsx(FormattedMessage, {
              message: "createModal.dealAmount." + dealAmountPreference
            }) : _this.getTranslationForProperty(dealAmountPreference)
          }
        }),
        children: /*#__PURE__*/_jsx(PropertyInput, {
          autoFocus: shouldAutoFocus && index === 0,
          baseUrl: links.contactEmail(''),
          disabled: disabled,
          readOnlySourceData: readOnlySourceData,
          objectType: objectType,
          onChange: _this.partial(_this.handleChange, property),
          onBlur: _this.partial(_this.handleBlur, property),
          property: PropertyRecord(property),
          showError: true,
          showPlaceholder: false,
          subjectId: null,
          subject: subject,
          value: propertyValues.get(name),
          isRequired: _this.isRequired(name),
          locked: !!upgradeKey,
          onPipelineOpenChange: _this.onPipelineOpenChange,
          openPipelineUpgradeModal: openPipelineUpgradeModal
        })
      }, name);
    };

    if (typeof upgradeKey !== 'string') {
      return propertyInput();
    } else {
      return /*#__PURE__*/_jsx(UpgradeModalWrapper, {
        upgradeKey: upgradeKey,
        children: function children(openUpgradeModal) {
          return propertyInput(openUpgradeModal);
        }
      }, name);
    }
  },
  renderAdditionalContent: function renderAdditionalContent() {
    if (this.props.additionalContent == null) {
      return undefined;
    }

    return /*#__PURE__*/_jsx(UISection, {
      children: this.props.additionalContent
    });
  },
  renderPermissionsAlert: function renderPermissionsAlert() {
    return /*#__PURE__*/_jsx(PermissionsAlert, {
      objectType: this.props.objectType,
      actionType: CREATE,
      className: "m-bottom-4"
    });
  },
  renderCustomizePropertiesLink: function renderCustomizePropertiesLink() {
    return /*#__PURE__*/_jsx(UIButton, {
      use: "link",
      href: this.getCustomizePropertiesUrl(this.props.objectType),
      external: true,
      onClick: this.handleCustomizePropertiesClick,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "createModal.customizeProperties.linkText"
      })
    });
  },
  renderModalContents: function renderModalContents() {
    var _this$props7 = this.props,
        extraFields = _this$props7.extraFields,
        hiddenFieldsLabel = _this$props7.hiddenFieldsLabel,
        ignoreDefaultCreatorProperties = _this$props7.ignoreDefaultCreatorProperties,
        objectType = _this$props7.objectType,
        showAllProperties = _this$props7.showAllProperties,
        suggestions = _this$props7.suggestions;
    var isAdmin = this.userIsAdmin();
    var initialPropertiesToRender = this.getInitialProperties();
    var secondaryPropertiesToRender = this.getSecondaryProperties();
    return /*#__PURE__*/_jsxs(ErrorBoundary, {
      boundaryName: "ObjectCreatorDialog",
      ErrorComponent: CrmContentError,
      showRefreshAlert: false,
      children: [this.renderPermissionsAlert(), this.renderAdditionalContent(), /*#__PURE__*/_jsxs(StyledObjectCreatorDialog, {
        className: "form-stacked m-bottom-10",
        "data-test-id": "object-creator-dialog-contents",
        children: [/*#__PURE__*/_jsxs(UISection, {
          "data-onboarding": "object-creator-form-fields",
          children: [/*#__PURE__*/_jsxs(UIFieldset, {
            children: [initialPropertiesToRender.map(this.partial(this.renderProperty, true)), this.renderContactNameProperties()]
          }), suggestions, /*#__PURE__*/_jsxs(UIFieldset, {
            "data-selenium-overlay": !showAllProperties,
            overlay: !showAllProperties ? /*#__PURE__*/_jsx(UIOverlay, {
              width: 250,
              children: /*#__PURE__*/_jsx(Big, {
                use: "help",
                children: hiddenFieldsLabel
              })
            }) : null,
            children: [secondaryPropertiesToRender.map(this.partial(this.renderProperty, false)), extraFields]
          })]
        }), isAdmin && showAllProperties && !ignoreDefaultCreatorProperties && this.getCustomizePropertiesUrl(objectType) !== '' && /*#__PURE__*/_jsx(UISection, {
          children: /*#__PURE__*/_jsx(FormattedReactMessage, {
            message: "createModal.customizeProperties.message",
            options: {
              customizeLink: this.renderCustomizePropertiesLink()
            }
          })
        })]
      })]
    });
  },
  render: function render() {
    if (!this.props.properties) {
      return null;
    }

    var _this$props8 = this.props,
        embedded = _this$props8.embedded,
        objectType = _this$props8.objectType,
        shouldRenderContentOnly = _this$props8.shouldRenderContentOnly;
    var confirmLabel = this.props.confirmLabel;
    confirmLabel = confirmLabel || I18n.text('crm_components.GenericModal.addButtonLabel');
    var use = embedded ? 'embedded' : 'sidebar';

    if (shouldRenderContentOnly) {
      return /*#__PURE__*/_jsxs(Fragment, {
        children: [this.renderModalContents(), /*#__PURE__*/_jsxs(ObjectCreatorFooter, {
          children: [/*#__PURE__*/_jsx(UILoadingButton, {
            "data-onboarding": "dialog-create-" + objectType.toLowerCase() + "-button",
            use: "primary",
            onClick: this.props.onConfirm,
            disabled: this.props.confirmDisabled,
            duration: 1000,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sidebar.associateObjectDialog.confirmButton.create"
            })
          }), this.props.moreButtons, /*#__PURE__*/_jsx(UIButton, {
            use: "secondary",
            onClick: this.props.onReject,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "sidebar.associateObjectDialog.cancelButton"
            })
          })]
        })]
      });
    }

    return /*#__PURE__*/_jsx(BaseDialog, {
      confirmDisabled: this.props.confirmDisabled,
      confirmDisabledTooltip: this.props.confirmDisabledTooltip,
      confirmHref: this.props.confirmHref,
      confirmLabel: confirmLabel,
      isConfirmButtonLoading: true,
      confirmProps: {
        duration: 1000
      },
      moreButtons: this.props.moreButtons,
      objectType: objectType,
      onConfirm: this.props.onConfirm,
      onOpenComplete: this.handleOpen,
      onReject: this.props.onReject,
      onScroll: this.handleScroll,
      title: this.props.title,
      use: use,
      width: WIDTH,
      children: this.renderModalContents()
    });
  }
});
var deps = {
  requiredProps: RequiredPropsDependency,
  pipelines: {
    stores: allPipelineStores,
    deref: function deref(_ref) {
      var objectType = _ref.objectType;

      if (!objectTypeSupportsPipelines(objectType)) {
        return null;
      }

      return Pipeline.getPipelines(objectType);
    }
  }
};
export default connect(deps)(ObjectCreatorDialog);
export { ObjectCreatorDialog as WrappedComponent };