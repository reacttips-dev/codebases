'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import isEmpty from 'transmute/isEmpty';
import get from 'transmute/get';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import { toString } from 'customer-data-objects/model/ImmutableModel';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import * as PropertyValueDisplay from 'customer-data-property-utils/PropertyValueDisplay';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIAccordionItem from 'UIComponents/accordion/UIAccordionItem';
import UISection from 'UIComponents/section/UISection';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import UIFormControl from 'UIComponents/form/UIFormControl';
import { isKnownGuid, getGuidLabel } from 'reporting-data/lib/guids';
import PropTypes from 'prop-types';
import { propertyLabelTranslator, propertyDescriptionTranslator } from 'property-translator/propertyTranslator';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import PortalIdParser from 'PortalIdParser';
import { IMPORT, INTEGRATION } from 'customer-data-objects/property/PropertySourceTypes';
import { getId } from 'customer-data-objects/model/ImmutableModel';
import { NOT_SPECIFIED } from '../constants/FieldLevelPermissionTypes';

var isPropertyEmpty = function isPropertyEmpty(val) {
  return val == null || ("" + val).trim().length === 0;
};

var LIFECYLCLE_CONTACT_SYNC = 'deals::sync_company_lifecyclestage';

var isTrue = function isTrue(val) {
  return val === true || val === 'true';
};

var DATA_1 = 'hs_analytics_source_data_1';
var DATA_2 = 'hs_analytics_source_data_2';

var isIntegration = function isIntegration(subject) {
  return getProperty(subject, DATA_1) === INTEGRATION;
};

var isImport = function isImport(subject) {
  return getProperty(subject, DATA_1) === IMPORT && !isNaN(getProperty(subject, DATA_2));
};

var StageChangeDialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(StageChangeDialog, _PureComponent);

  function StageChangeDialog(props) {
    var _this;

    _classCallCheck(this, StageChangeDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StageChangeDialog).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.getIsSaveDisabled = function () {
      var properties = _this.props.properties;
      var draft = _this.state.draft;
      var result = properties.some(function (stageProperty) {
        if (!stageProperty.get('required')) return false;
        var value = draft.get(stageProperty.get('property'));
        return isPropertyEmpty(value);
      });
      return result;
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
          changedInSession: prevState.changedInSession.add(property.name)
        };
      });
    };

    _this.renderProperty = function (stageProperty, index) {
      var _this$props = _this.props,
          nextProperties = _this$props.nextProperties,
          objectType = _this$props.objectType,
          resolvers = _this$props.resolvers,
          subject = _this$props.subject,
          subjectProperties = _this$props.subjectProperties,
          getPropertyInputResolver = _this$props.getPropertyInputResolver,
          PropertyInput = _this$props.PropertyInput,
          getPropertyPermission = _this$props.getPropertyPermission;
      var draft = _this.state.draft;
      var property = subjectProperties.get(stageProperty.get('property'));

      if (!property) {
        return null;
      }

      var name = property.name;
      var canEditProperty = getPropertyPermission(name) === NOT_SPECIFIED;
      var optionalProps = name === 'dealstage' ? {
        nextPipeline: nextProperties.get('pipeline')
      } : undefined;
      var resolver = getPropertyInputResolver(resolvers, property, objectType, {
        isIntegration: isIntegration(subject),
        isImport: isImport(subject)
      });
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: _this.renderPropertyLabel(property),
        labelTooltip: !canEditProperty && /*#__PURE__*/_jsx(FormattedMessage, {
          message: "fieldLevelPermissions.READ_ONLY"
        }),
        required: stageProperty.get('required'),
        children: /*#__PURE__*/_jsx(PropertyInput, Object.assign({
          autoFocus: index === 0,
          baseUrl: "/contacts/" + PortalIdParser.get() + "/contact/email/",
          readOnlySourceData: {
            isKnownGuid: isKnownGuid,
            getGuidLabel: getGuidLabel
          },
          objectType: objectType,
          property: property,
          resolver: resolver,
          value: draft.get(name),
          onChange: _this.partial(_this.handleChange, property),
          subjectId: "" + getId(subject),
          subject: subject,
          readOnly: !canEditProperty
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
    _this.state = {
      changedInSession: ImmutableSet(),
      draft: _draft,
      propertiesByType: {
        completed: prefilledProperties,
        empty: emptyProperties
      }
    };
    return _this;
  }

  _createClass(StageChangeDialog, [{
    key: "shouldUpdateDealCloseDateOnSave",
    value: function shouldUpdateDealCloseDateOnSave(isChangingCloseDate) {
      if (DEAL !== this.props.objectType) {
        return false;
      }

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
          objectType = _this$props2.objectType,
          settings = _this$props2.settings,
          nextProperties = _this$props2.nextProperties;

      if (objectType !== DEAL || nextProperties.get('probability') !== 1 || !settings || !isTrue(settings.get(LIFECYLCLE_CONTACT_SYNC))) {
        return null;
      }

      return /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.dealClosedModal.syncMessage"
        })
      });
    }
  }, {
    key: "renderPropertyLabel",
    value: function renderPropertyLabel(property) {
      var label = property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;

      if (property.description) {
        var description = property.hubspotDefined ? propertyDescriptionTranslator(property.label, property.description) : property.description;
        return /*#__PURE__*/_jsx(UITooltip, {
          title: description,
          children: /*#__PURE__*/_jsx("span", {
            children: label
          })
        });
      }

      return /*#__PURE__*/_jsx("span", {
        children: label
      });
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
    value: function renderCompletedProperties(completedProperties, emptyProperties) {
      if (isEmpty(completedProperties)) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIAccordionItem, {
        className: "p-y-3",
        defaultOpen: isEmpty(emptyProperties),
        size: "small",
        title: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "customerDataProperties.StageChangeDialog.completedProperties"
        }),
        children: completedProperties.map(this.renderProperty)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          nextStage = _this$props3.nextStage,
          objectType = _this$props3.objectType,
          onReject = _this$props3.onReject,
          properties = _this$props3.properties,
          subject = _this$props3.subject;
      var _this$state$propertie = this.state.propertiesByType,
          completed = _this$state$propertie.completed,
          empty = _this$state$propertie.empty;
      var i18nKey = objectType === TICKET ? 'ticket' : 'deal';
      return /*#__PURE__*/_jsxs(BaseDialog, {
        confirmDisabled: this.getIsSaveDisabled(),
        onConfirm: this.handleConfirm,
        onReject: onReject,
        title: /*#__PURE__*/_jsx("h3", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataProperties." + i18nKey + "StageChangeModal.title"
          })
        }),
        children: [/*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataProperties." + i18nKey + "StageChangeModal.message",
            options: {
              count: properties.size,
              name: toString(subject),
              stage: nextStage.get('label')
            }
          })
        }), this.renderIsSyncedMessage(), this.renderEmptyProperties(empty), this.renderCompletedProperties(completed, empty)]
      });
    }
  }]);

  return StageChangeDialog;
}(PureComponent);

StageChangeDialog.propTypes = Object.assign({
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
}, StageChangeDialog);