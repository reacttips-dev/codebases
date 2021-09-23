'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import PortalIdParser from 'PortalIdParser';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import isEmpty from 'transmute/isEmpty';
import get from 'transmute/get';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as PropertyValueDisplay from 'customer-data-property-utils/PropertyValueDisplay';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { IMPORT, INTEGRATION } from 'customer-data-objects/property/PropertySourceTypes';
import { getId } from 'customer-data-objects/model/ImmutableModel';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import { isKnownGuid, getGuidLabel } from 'reporting-data/lib/guids';
import { propertyLabelTranslator, propertyDescriptionTranslator } from 'property-translator/propertyTranslator';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import UITruncateString from 'UIComponents/text/UITruncateString';
import UIAccordionItem from 'UIComponents/accordion/UIAccordionItem';
import UIBadge from 'UIComponents/badge/UIBadge';
import UISection from 'UIComponents/section/UISection';
import UIFormControl from 'UIComponents/form/UIFormControl';
import RevenueStageChangeHeader from 'customer-data-properties/revenue/RevenueStageChangeHeader';
import { isInClosedWonStage } from 'customer-data-properties/revenue/utils/pipelineUtils';
import { shouldHideProperty } from 'customer-data-properties/revenue/utils/hiddenPropertyUtils';
import { shouldIncludeNewBadge } from 'customer-data-properties/revenue/utils/newPropertyUtils';
import { adjustRelativeOptionsIfNeeded, shouldDisableProperty } from 'customer-data-properties/revenue/utils/propertyOptionUtils';
import RevenuePropertyInput from 'customer-data-properties/revenue/RevenuePropertyInput';
import { APPLICABLE_ONBOARDING_GOALS_PROPERTY, BUSINESS_GOALS_PROPERTY } from 'customer-data-properties/revenue/RevenueConstants';

var isPropertyEmpty = function isPropertyEmpty(val) {
  return val == null || ("" + val).trim().length === 0;
};

var LIFECYLCLE_CONTACT_SYNC = 'deals::sync_company_lifecyclestage';

var isTrue = function isTrue(val) {
  return val === true || val === 'true';
};

var DATA_1 = 'hs_analytics_source_data_1';
var DATA_2 = 'hs_analytics_source_data_2';
var propertiesToValidate = ["primary_point_of_contact_email"];

var isIntegration = function isIntegration(subject) {
  return getProperty(subject, DATA_1) === INTEGRATION;
};

var isImport = function isImport(subject) {
  return getProperty(subject, DATA_1) === IMPORT && !isNaN(getProperty(subject, DATA_2));
};

var RevenueStageChangeDialog = /*#__PURE__*/function (_Component) {
  _inherits(RevenueStageChangeDialog, _Component);

  function RevenueStageChangeDialog(props) {
    var _this;

    _classCallCheck(this, RevenueStageChangeDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RevenueStageChangeDialog).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.getIsSaveDisabled = function () {
      var properties = _this.props.properties;
      var _this$state = _this.state,
          draft = _this$state.draft,
          failedValidation = _this$state.failedValidation,
          hasOnboardingGoals = _this$state.hasOnboardingGoals;
      var result = properties.some(function (stageProperty) {
        if (!stageProperty.get('required')) return false;

        if (stageProperty.get('property') === BUSINESS_GOALS_PROPERTY && !hasOnboardingGoals) {
          return false;
        }

        var value = draft.get(stageProperty.get('property'));
        return isPropertyEmpty(value);
      });
      return result || failedValidation;
    };

    _this.handleConfirm = function () {
      var currentDraft = _this.state.draft.toJS();

      var newPropertiesWithoutUnchaged = Object.keys(currentDraft).reduce(function (acc, key) {
        if (!_this.state.changedInSession.has(key)) {
          return acc;
        }

        return Object.assign({}, acc, _defineProperty({}, key, currentDraft[key]));
      }, {});
      var newFinalProperties = _this.shouldUpdateDealCloseDateOnSave(_this.state.changedInSession.has('closedate')) ? Object.assign({}, newPropertiesWithoutUnchaged, {
        closedate: I18n.moment.userTz().valueOf()
      }) : newPropertiesWithoutUnchaged;
      return _this.props.onConfirm(newFinalProperties);
    };

    _this.handleChange = function (property, event) {
      var value = event.target != null ? event.target.value : undefined;
      value = PropertyValueDisplay.sanitizeValue(property, value);

      _this.setState(function (prevState) {
        return {
          draft: prevState.draft.set(property.name, value),
          changedInSession: prevState.changedInSession.add(property.name),
          failedValidation: propertiesToValidate.includes(property.name)
        };
      });
    };

    _this.setPropertyValidState = function (propertyName, key, value) {
      if (key === 'invalidEmail' && propertiesToValidate.includes(propertyName)) {
        _this.setState(function () {
          return {
            failedValidation: value
          };
        });
      }
    };

    _this.renderProperty = function (stageProperty) {
      var _this$props = _this.props,
          nextProperties = _this$props.nextProperties,
          objectType = _this$props.objectType,
          resolvers = _this$props.resolvers,
          subject = _this$props.subject,
          subjectProperties = _this$props.subjectProperties,
          getPropertyInputResolver = _this$props.getPropertyInputResolver;
      var _this$state2 = _this.state,
          changedInSession = _this$state2.changedInSession,
          draft = _this$state2.draft,
          propertiesByType = _this$state2.propertiesByType;
      var property = subjectProperties.get(stageProperty.get('property'));
      var name = property.name;

      if (!property || shouldHideProperty(name, propertiesByType, changedInSession)) {
        return null;
      }

      var optionalProps = name === 'dealstage' ? {
        nextPipeline: nextProperties.get('pipeline')
      } : undefined;
      var resolver = getPropertyInputResolver(resolvers, property, objectType, {
        isIntegration: isIntegration(subject),
        isImport: isImport(subject)
      });
      var propertyWithTrimmedOptions = adjustRelativeOptionsIfNeeded(property, draft);
      var propertyRequired = shouldDisableProperty(property, draft) ? false : stageProperty.get('required');
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: _this.renderLabel(property, draft),
        help: _this.renderDescription(property, draft),
        required: propertyRequired,
        children: /*#__PURE__*/_jsx(RevenuePropertyInput, Object.assign({
          baseUrl: "/contacts/" + PortalIdParser.get() + "/contact/email/",
          readOnlySourceData: {
            isKnownGuid: isKnownGuid,
            getGuidLabel: getGuidLabel
          },
          objectType: objectType,
          property: propertyWithTrimmedOptions,
          resolver: resolver,
          value: draft.get(name),
          onChange: _this.partial(_this.handleChange, property),
          subjectId: "" + getId(subject),
          subject: subject,
          onInvalidProperty: _this.partial(_this.setPropertyValidState, property.name),
          showError: true,
          hasBlurred: true,
          disabled: shouldDisableProperty(property, draft)
        }, optionalProps))
      }, name);
    };

    _this.partial = memoize(partial);

    if (!props.subject) {
      return _possibleConstructorReturn(_this);
    }

    var _draft = props.properties.reduce(function (result, property) {
      var propertyName = property.get('property');

      if (result.has(propertyName)) {
        return result;
      }

      var value = props.nextProperties.get(propertyName) || getProperty(props.subject, propertyName);
      var prevStageProbability = props.prevStage && props.prevStage.get('probability') && +props.prevStage.get('probability');
      var probability = props.nextStage.get('probability') && +props.nextStage.get('probability');

      if (propertyName === 'closedate' && [0, 1].includes(probability) && prevStageProbability !== probability) {
        value = I18n.moment.userTz().valueOf();
      }

      return result.set(propertyName, value);
    }, ImmutableMap());

    var prefilledProperties = List();
    var emptyProperties = List();
    props.properties.forEach(function (p) {
      var val = _draft.get(p.get('property'));

      if (isPropertyEmpty(val)) {
        emptyProperties = emptyProperties.push(p);
      } else {
        prefilledProperties = prefilledProperties.push(p);
      }
    });

    var _hasOnboardingGoals = _draft.get(APPLICABLE_ONBOARDING_GOALS_PROPERTY);

    _this.state = {
      changedInSession: ImmutableSet(),
      draft: _draft,
      hasOnboardingGoals: _hasOnboardingGoals,
      failedValidation: false,
      propertiesByType: {
        completed: prefilledProperties,
        empty: emptyProperties
      }
    };
    return _this;
  }

  _createClass(RevenueStageChangeDialog, [{
    key: "shouldUpdateDealCloseDateOnSave",
    value: function shouldUpdateDealCloseDateOnSave(isChangingCloseDate) {
      if (isChangingCloseDate) {
        return false;
      }

      var probability = this.props.nextStage.get('probability') && Number(this.props.nextStage.get('probability'));
      var isWonOrLost = [0, 1].includes(probability);
      var prevStageProbability = Number(get('probability', this.props.prevStage));

      if (isWonOrLost && prevStageProbability !== probability) {
        return true;
      }

      return false;
    }
  }, {
    key: "renderIsSyncedMessage",
    value: function renderIsSyncedMessage() {
      var _this$props2 = this.props,
          settings = _this$props2.settings,
          nextProperties = _this$props2.nextProperties;

      if (nextProperties.get('probability') !== 1 || !settings || !isTrue(settings.get(LIFECYLCLE_CONTACT_SYNC))) {
        return null;
      }

      return /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "revenue.dealClosedModal.syncMessage"
        })
      });
    }
  }, {
    key: "renderLabel",
    value: function renderLabel(property) {
      var label = property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;
      return /*#__PURE__*/_jsxs("span", {
        children: [label, shouldIncludeNewBadge(property.name) && /*#__PURE__*/_jsx(UIBadge, {
          use: "new",
          className: "m-left-1",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "revenue.StageChangeDialog.newBadgeLabel"
          })
        })]
      });
    }
  }, {
    key: "renderDescription",
    value: function renderDescription(property, draft) {
      if (shouldDisableProperty(property, draft)) {
        return I18n.text('dingSidebar.form.noGoalsExist');
      }

      if (property.description) {
        return /*#__PURE__*/_jsx(UITruncateString, {
          children: property.hubspotDefined ? propertyDescriptionTranslator(property.label, property.description) : property.description
        });
      }

      return '';
    }
  }, {
    key: "renderEmptyProperties",
    value: function renderEmptyProperties(emptyProperties) {
      if (isEmpty(emptyProperties)) {
        return null;
      }

      return /*#__PURE__*/_jsx(UISection, {
        children: emptyProperties.map(this.renderProperty)
      });
    }
  }, {
    key: "renderCompletedProperties",
    value: function renderCompletedProperties(completedProperties, emptyProperties, targetStageId) {
      if (isEmpty(completedProperties)) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIAccordionItem, {
        className: "p-y-3",
        defaultOpen: isEmpty(emptyProperties) || isInClosedWonStage(targetStageId),
        size: "small",
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "revenue.StageChangeDialog.completedProperties"
        }),
        children: completedProperties.map(this.renderProperty)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          nextStage = _this$props3.nextStage,
          onReject = _this$props3.onReject,
          subject = _this$props3.subject;
      var _this$state$propertie = this.state.propertiesByType,
          completed = _this$state$propertie.completed,
          empty = _this$state$propertie.empty;
      var nextStageId = nextStage.get('stageId');
      return /*#__PURE__*/_jsxs(BaseDialog, {
        confirmDisabled: this.getIsSaveDisabled(),
        onConfirm: this.handleConfirm,
        onReject: onReject,
        title: /*#__PURE__*/_jsx("h3", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: isInClosedWonStage(nextStageId) ? "revenue.dealStageChangeModal.closedWon.title" : "revenue.dealStageChangeModal.title"
          })
        }),
        children: [/*#__PURE__*/_jsx(RevenueStageChangeHeader, {
          nextStageId: nextStageId,
          nextStageLabel: nextStage.get('label'),
          subject: subject
        }), this.renderIsSyncedMessage(), this.renderEmptyProperties(empty), this.renderCompletedProperties(completed, empty, nextStageId)]
      });
    }
  }]);

  return RevenueStageChangeDialog;
}(Component);

RevenueStageChangeDialog.propTypes = Object.assign({
  getPropertyInputResolver: PropTypes.func.isRequired,
  prevStage: ImmutablePropTypes.map,
  nextStage: ImmutablePropTypes.map.isRequired,
  objectType: PropTypes.string.isRequired,
  prevProperties: ImmutablePropTypes.map.isRequired,
  nextProperties: ImmutablePropTypes.map.isRequired,
  properties: ImmutablePropTypes.list.isRequired,
  PropertyInput: PropTypes.elementType.isRequired,
  subject: ImmutablePropTypes.record.isRequired,
  subjectProperties: ImmutablePropTypes.map.isRequired,
  settings: ImmutablePropTypes.map.isRequired,
  getPropertyPermission: PropTypes.func.isRequired
}, PromptablePropInterface);
export default ConnectReferenceResolvers(function (resolvers) {
  return {
    resolvers: resolvers
  };
}, RevenueStageChangeDialog);