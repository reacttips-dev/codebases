'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _fromJS;

import { Map as ImmutableMap, fromJS } from 'immutable';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { createRef, memo, forwardRef } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { mapOf } from 'react-immutable-proptypes';
import emptyFunction from 'react-utils/emptyFunction';
import get from 'transmute/get';
import omit from 'transmute/omit';
import memoize from 'transmute/memoize';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import { isKnownGuid } from 'reporting-data/lib/guids';
import { COMPANY, CONTACT, DEAL, TICKET, VISIT, TASK } from 'customer-data-objects/constants/ObjectTypes';
import { OWNER } from 'customer-data-objects/property/ExternalOptionTypes';
import { UNFORMATTED } from 'customer-data-objects/property/NumberDisplayHint';
import { isDate, isMultiple, isReadOnly, isCurrency, isDuration, isDurationEquation, isMultiCurrencyPrice, isUser, isCallDisposition, isBusinessUnit, isHtml } from 'customer-data-objects/property/PropertyIdentifier';
import { DATA_1, DATA_2, VISIT_DATA_1, VISIT_DATA_2, isFromImport, isFromIntegration, isFromEmailMarketing } from 'customer-data-objects/record/AnalyticsSourceIdentifier';
import { getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { mapDefaultResolverToPropertyInput, getPropertyInputResolverType, getPropertyInputResolverCreators } from 'customer-data-properties/resolvers/PropertyInputResolvers';
import * as Inputs from 'customer-data-properties/input/PropertyInputs';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import { AnyCrmObjectPropType, AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
var autocompletes = {
  associatedcompanyid: true,
  'associations.company': true,
  hs_parent_company_id: true,
  salesforcecampaignids: true,
  'listMemberships.listId': true,
  hs_analytics_first_touch_converting_campaign: true,
  hs_analytics_last_touch_converting_campaign: true
};
var KNOWN_GUID_FIELDS = fromJS((_fromJS = {}, _defineProperty(_fromJS, VISIT, [VISIT_DATA_1, VISIT_DATA_2]), _defineProperty(_fromJS, CONTACT, [DATA_1, DATA_2]), _fromJS));

var selectResolver = function selectResolver(resolvers, props) {
  return mapDefaultResolverToPropertyInput(props.resolverType, resolvers, props);
};

var isAssociatedCompany = function isAssociatedCompany(property, objectType) {
  return property.name === 'associatedcompanyid' && objectType === CONTACT || property.name === 'hs_parent_company_id' && objectType === COMPANY;
};

var isDealPipeline = function isDealPipeline(property, objectType) {
  return objectType === DEAL && property.name === 'pipeline';
};

var isDealStage = function isDealStage(property, objectType) {
  return objectType === DEAL && property.name === 'dealstage';
};

var isMultiCurrencyCurrencyCode = function isMultiCurrencyCurrencyCode(property) {
  return property.name === 'deal_currency_code';
};

var isTicketPipeline = function isTicketPipeline(property, objectType) {
  return objectType === TICKET && property.name === 'hs_pipeline';
};

var isTicketStage = function isTicketStage(property, objectType) {
  return objectType === TICKET && property.name === 'hs_pipeline_stage';
};

var isPriority = function isPriority(property) {
  return property.hubspotDefined && (property.name === 'hs_ticket_priority' || property.name === 'hs_task_priority' || property.name === 'hs_priority');
};

var isContactEmail = function isContactEmail(property, objectType) {
  return objectType === CONTACT && property.name === 'email';
};

var isPrimaryContactEmail = function isPrimaryContactEmail(property) {
  return property.name === 'primary_point_of_contact_email';
};

var isPersona = function isPersona(property, objectType) {
  return objectType === CONTACT && property.name === 'hs_persona';
};

var isOwner = function isOwner(property) {
  return ['hubspot_owner_id', 'engagement.ownerId'].includes(property.name) || property.referencedObjectType === OWNER;
};

var isTaskDueDate = function isTaskDueDate(property, objectType) {
  return objectType === TASK && property.name === 'hs_timestamp';
};

var isTaskReminder = function isTaskReminder(property, objectType) {
  return objectType === TASK && property.name === 'hs_task_reminders';
};

var isTaskQueue = function isTaskQueue(property, objectType) {
  return objectType === TASK && property.name === 'hs_queue_membership_ids';
};

var isCreateCloseDate = function isCreateCloseDate(property, objectType) {
  return objectType === DEAL && (property.name === 'createdate' || property.name === 'closedate') || objectType === TICKET && (property.name === 'createdate' || property.name === 'closed_date');
};

var isDomain = function isDomain(property) {
  return property.name === 'domain';
};

var isGuidFieldWithKnownGuid = memoize(function (property, value, objectType) {
  var guidFieldsForType = KNOWN_GUID_FIELDS.get(objectType);

  if (!guidFieldsForType) {
    return false;
  }

  return guidFieldsForType.includes(property.name) && !!value && isKnownGuid(value);
});

var isMarketableReason = function isMarketableReason(property, objectType) {
  return objectType === CONTACT && property.name === 'hs_marketable_reason_id';
};

var isEnum = function isEnum(property) {
  if (['enumeration', 'bool'].includes(property.type)) {
    return true;
  }

  if (autocompletes[property.name]) {
    return true;
  }

  return false;
};

var isName = function isName(property, objectType) {
  return objectType === CONTACT && ['firstname', 'lastname'].includes(property.name);
};

var isFileUpload = function isFileUpload(property) {
  return property.name === 'file_upload_';
};

var isNumber = function isNumber(property) {
  return property.get('type') === 'number';
};

export var getPropertyDependencies = function getPropertyDependencies(property, objectType, subjectId, subject, readOnly, getSecondaryPropertyValue) {
  if (isDealPipeline(property, objectType)) {
    // PropertyInputDealPipeline
    return {
      pipelineId: getProperty(subject, 'pipeline'),
      stageId: getProperty(subject, 'dealstage'),
      subject: subject
    };
  }

  if (isDealStage(property, objectType)) {
    // PropertyInputPipelineStage
    return {
      pipeline: getProperty(subject, 'pipeline') || get('pipeline', subject)
    };
  }

  if (isTicketPipeline(property, objectType)) {
    // PropertyInputTicketPipeline
    return {
      pipelineId: getProperty(subject, 'hs_pipeline'),
      stageId: getProperty(subject, 'hs_pipeline_stage'),
      subject: subject
    };
  }

  if (isTicketStage(property, objectType)) {
    // PropertyInputPipelineStage
    return {
      pipeline: getProperty(subject, 'hs_pipeline') || get('hs_pipeline', subject)
    };
  }

  if (subjectId && isContactEmail(property, objectType)) {
    // PropertyInputMultipleEmail
    return {
      additionalEmails: getProperty(subject, 'hs_additional_emails') || '',
      subject: subject
    };
  }

  if (isCurrency(property)) {
    // PropertyInputHomeCurrency
    return {
      subjectCurrencyCode: getProperty(subject, property.currencyPropertyName) || get(property.currencyPropertyName, subject)
    };
  }

  if (subjectId && isDomain(property) && objectType === COMPANY) {
    // PropertyInputMultipleDomain
    return {
      additionalDomains: getSecondaryPropertyValue('hs_additional_domains'),
      subject: subject
    };
  }

  return null;
};
var propTypes = {
  actions: mapOf(PropTypes.object, PropTypes.string),
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  componentResolver: PropTypes.func,
  id: PropTypes.string,
  isInline: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onInvalidProperty: PropTypes.func,
  onKeyUp: PropTypes.func,
  onTracking: PropTypes.func,
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  propertyIndex: PropTypes.number,
  readOnly: PropTypes.bool,
  resolver: PropTypes.oneOfType([ReferenceResolverType, mapOf(ReferenceResolverType)]),
  resolverType: PropTypes.string,
  showError: PropTypes.bool,
  showPlaceholder: PropTypes.bool,
  subject: PropTypes.oneOfType([AnyCrmObjectPropType, PropTypes.instanceOf(ImmutableMap)]),
  subjectId: PropTypes.string,
  value: PropTypes.node,
  wrappers: mapOf(PropTypes.node, PropTypes.string),
  componentConfig: PropTypes.object
};
var defaultProps = {
  actions: ImmutableMap(),
  isInline: false,
  wrappers: ImmutableMap()
};
var propertiesToOmit = ['componentResolver', 'wrappers', 'onTracking', 'resolverType'];

var RevenuePropertyInput = /*#__PURE__*/function (_React$Component) {
  _inherits(RevenuePropertyInput, _React$Component);

  function RevenuePropertyInput() {
    var _this;

    _classCallCheck(this, RevenuePropertyInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RevenuePropertyInput).call(this));
    _this.inputRef = /*#__PURE__*/createRef();
    return _this;
  }

  _createClass(RevenuePropertyInput, [{
    key: "focus",
    value: function focus() {
      if (this.inputRef.current && typeof this.inputRef.current.focus === 'function') {
        this.inputRef.current.focus();
      }
    }
  }, {
    key: "getComponent",
    value: function getComponent() {
      var _this$props = this.props,
          objectType = _this$props.objectType,
          property = _this$props.property,
          subjectId = _this$props.subjectId;

      if (isPrimaryContactEmail(property)) {
        return Inputs.PropertyInputEmail;
      }

      if (typeof this.props.componentResolver === 'function') {
        var component = this.props.componentResolver.call(this);

        if (component) {
          return component;
        }
      } // Time between calculated properties should always be read-only


      if (isDurationEquation(property)) {
        return Inputs.PropertyInputReadOnlyDuration;
      } // Duration properties are number properties so need to preempt it


      if (isDuration(property)) {
        return Inputs.PropertyInputDuration;
      }

      if (isMultiCurrencyPrice(property)) {
        return Inputs.PropertyInputPrice;
      } // The call disposition property is an enum but needs reference resolving,
      // so we return early to preempt the enum property input.


      if (isCallDisposition(property, objectType)) {
        return Inputs.PropertyInputReferenceEnum;
      } // The business unit property is a multi enum but needs reference resolving,
      // so we return early to preempt the multi enum property input.


      if (isBusinessUnit(property, objectType)) {
        return Inputs.PropertyInputReferenceEnum;
      } // User properties are number properties so need to preempt it


      if (isUser(property)) {
        return Inputs.PropertyInputUser;
      }

      if (isCurrency(property)) {
        return Inputs.PropertyInputHomeCurrency;
      } // Html properties render their own readonlys (for previewing in the RTE)


      if (isHtml(property)) {
        return Inputs.PropertyInputHtml;
      } // numbers can render their own readonlys


      if (isNumber(property)) {
        return Inputs.PropertyInputNumber;
      } // enums


      if (isMarketableReason(property, objectType)) {
        return Inputs.PropertyInputMarketingReason;
      }

      if (isDealPipeline(property, objectType)) {
        return Inputs.PropertyInputDealPipeline;
      }

      if (isDealStage(property, objectType)) {
        return Inputs.PropertyInputPipelineStage;
      }

      if (isMultiCurrencyCurrencyCode(property)) {
        return Inputs.PropertyInputMultiCurrencyCurrencyCode;
      }

      if (isTicketPipeline(property, objectType)) {
        return Inputs.PropertyInputTicketPipeline;
      }

      if (isTicketStage(property, objectType)) {
        return Inputs.PropertyInputPipelineStage;
      }

      if (isPriority(property)) {
        return Inputs.PropertyInputPriority;
      }

      if (isOwner(property)) {
        return Inputs.PropertyInputOwner;
      }

      if (isPersona(property, objectType)) {
        return Inputs.PropertyInputPersona;
      }

      if (isTaskDueDate(property, objectType)) {
        return Inputs.PropertyInputRelativeDate;
      }

      if (isTaskReminder(property, objectType)) {
        return Inputs.PropertyInputTaskReminder;
      }

      if (isTaskQueue(property, objectType)) {
        return Inputs.PropertyInputTaskQueues;
      }

      if (isGuidFieldWithKnownGuid(property, this.getValue(), objectType)) {
        return Inputs.PropertyInputKnownGuid;
      }

      if (subjectId && isContactEmail(property, objectType)) {
        return Inputs.PropertyInputMultipleEmail;
      }

      if (this.getIsReadOnly()) {
        if (isFileUpload(property)) {
          return Inputs.PropertyInputFiles;
        }

        return Inputs.PropertyInputReadOnly;
      }

      if (isEnum(property) && isMultiple(property)) {
        return Inputs.PropertyInputEnumMulti;
      }

      if (isEnum(property)) {
        return Inputs.PropertyInputEnum;
      }

      if (isContactEmail(property, objectType)) {
        return Inputs.PropertyInputEmailWrapper;
      }

      if (isAssociatedCompany(property, objectType)) {
        return Inputs.PropertyInputAssociatedCompany;
      }

      if (subjectId && isDomain(property) && objectType === COMPANY) {
        return Inputs.PropertyInputMultipleDomain;
      }

      if (isDomain(property)) {
        return Inputs.PropertyInputDomain;
      }

      if (isCreateCloseDate(property, objectType)) {
        return Inputs.PropertyInputCloseCreateDate;
      }

      if (isDate(property)) {
        return Inputs.PropertyInputDate;
      }

      if (isName(property, objectType)) {
        return Inputs.PropertyInputName;
      } // anything else defaults to `text` through the expandable text input


      return Inputs.PropertyInputExpandableText;
    }
  }, {
    key: "getIsReadOnly",
    value: function getIsReadOnly() {
      return this.props.readOnly || isReadOnly(this.props.property);
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var property = this.props.property;
      var value = this.props.value; // If a value can be read in standard format, do so;
      // otherwise, try local format

      if (property.type === 'number' && !isCurrency(property) && value && property.numberDisplayHint !== UNFORMATTED) {
        value = isNaN(Number(value)) ? I18n.parseNumber(value, {
          precision: 5
        }) : Number(value);
      }

      return value;
    }
  }, {
    key: "render",
    value: function render() {
      var Wrapper = this.props.wrappers.get(this.props.property.name);
      var Component = this.getComponent();

      if (Wrapper) {
        Component = Wrapper(Component);
      }

      var transferrableProps = omit(propertiesToOmit, this.props);
      return /*#__PURE__*/_jsx(Component, Object.assign({}, transferrableProps, {
        actions: this.props.actions.get(this.props.property.name),
        autoFocus: this.props.autoFocus,
        className: classNames(this.props.className, this.props.isInline && "isInline"),
        id: this.props.id,
        "data-field": this.props.property.name,
        objectType: this.props.objectType,
        onBlur: this.props.onBlur,
        onChange: this.props.onChange,
        onInvalidProperty: this.props.onInvalidProperty,
        onFocus: this.props.onFocus,
        onKeyUp: this.props.onKeyUp,
        propertyIndex: this.props.propertyIndex,
        showError: this.props.showError,
        value: this.getValue(),
        readOnly: this.getIsReadOnly(),
        ref: this.inputRef,
        "data-selenium-test": "property-input-" + this.props.property.name,
        onTracking: this.props.onTracking
      }));
    }
  }]);

  return RevenuePropertyInput;
}(React.Component);

RevenuePropertyInput.propTypes = propTypes;
RevenuePropertyInput.defaultProps = defaultProps;
export var BasePropertyInput = /*#__PURE__*/memo(RevenuePropertyInput);
var ConnectedPropertyInput = ConnectReferenceResolvers(selectResolver, BasePropertyInput, {
  forwardRef: true
});
var ProvidedConnectedPropertyInput = ProvideReferenceResolvers(getPropertyInputResolverCreators(), ConnectedPropertyInput, {
  forwardRef: true,
  mergeResolvers: true
});
/**
 * Extract the known subset of properties from `subject` that this input
 * depends on, if any. Don't forward the `subject` prop to wrapped inputs
 * as it changes frequently, and will force inputs to re-render even if
 * their property value (or values they depend on) haven't changed.
 */

var wrapperPropTypes = {
  property: PropTypes.instanceOf(PropertyRecord).isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  subjectId: PropTypes.string,
  subject: PropTypes.oneOfType([AnyCrmObjectPropType, PropTypes.instanceOf(ImmutableMap)]),
  readOnly: PropTypes.bool,
  propertyDependencies: PropTypes.object,
  getSecondaryPropertyValue: PropTypes.func
};
var PropertyInputDependenciesWrapper = /*#__PURE__*/forwardRef(function (props, ref) {
  var property = props.property,
      objectType = props.objectType,
      subjectId = props.subjectId,
      subject = props.subject,
      readOnly = props.readOnly,
      _propertyDependencies = props.propertyDependencies,
      _props$getSecondaryPr = props.getSecondaryPropertyValue,
      getSecondaryPropertyValue = _props$getSecondaryPr === void 0 ? emptyFunction : _props$getSecondaryPr,
      rest = _objectWithoutProperties(props, ["property", "objectType", "subjectId", "subject", "readOnly", "propertyDependencies", "getSecondaryPropertyValue"]);

  var resolverType = getPropertyInputResolverType(property, objectType, {
    isFromImport: isFromImport(subject),
    isFromIntegration: isFromIntegration(subject),
    isFromEmailMarketing: isFromEmailMarketing(subject)
  });
  var propertyDependencies = _propertyDependencies;

  if (propertyDependencies === undefined) {
    propertyDependencies = getPropertyDependencies(property, objectType, subjectId, subject, readOnly, getSecondaryPropertyValue);
  }

  return /*#__PURE__*/_jsx(ProvidedConnectedPropertyInput // intentionally omit `subject`
  , Object.assign({
    ref: ref,
    resolverType: resolverType,
    property: property,
    objectType: objectType,
    subjectId: subjectId,
    readOnly: readOnly
  }, rest, {}, propertyDependencies));
});
PropertyInputDependenciesWrapper.propTypes = wrapperPropTypes;
export default /*#__PURE__*/memo(PropertyInputDependenciesWrapper);