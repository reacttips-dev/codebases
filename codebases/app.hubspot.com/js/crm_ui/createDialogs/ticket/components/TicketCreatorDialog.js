'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import { isValidRequiredProperties } from 'customer-data-properties/validation/PropertyValidations';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import Popoverable from '../../../components/popovers/Popoverable';
import canCreate from '../../../utils/canCreate';
import ObjectCreatorDialog from '../../../modals/dialogs/objectModifiers/ObjectCreatorDialog';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import HR from 'UIComponents/elements/HR';
import * as SimpleDate from 'UIComponents/core/SimpleDate';
import * as SimpleDateTypes from 'UIComponents/types/SimpleDateTypes';
import AssociationSelectSearch from '../../../components/select/AssociationSelectSearch';
import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import { Map as ImmutableMap } from 'immutable';
import { getAssociationName, getObjectsByType } from '../../../creator/ObjectCreatorUtils';
import UISelect from 'UIComponents/input/UISelect';
import UIMicroDateInput from 'UIComponents/dates/UIMicroDateInput';
var REQUIRED_TICKET_PROPERTIES = ['subject', 'hs_pipeline', 'hs_pipeline_stage'];
var ASSOCIATION_SYNC_OPTIONS_MAP = {
  LAST_THIRTY_DAYS: {
    type: 'LAST_THIRTY_DAYS',
    startDate: SimpleDate.startOfPrior(29, 'day')
  },
  LAST_SIXTY_DAYS: {
    type: 'LAST_SIXTY_DAYS',
    startDate: SimpleDate.startOfPrior(60, 'day')
  },
  LAST_NINETY_DAYS: {
    type: 'LAST_NINETY_DAYS',
    startDate: SimpleDate.startOfPrior(90, 'day')
  },
  ALL: {
    type: 'ALL',
    startDate: SimpleDate.beginningOfTime()
  },
  CUSTOM_DATE: {
    type: 'CUSTOM_DATE',
    startDate: SimpleDate.now()
  }
};

var TicketCreatorDialog = /*#__PURE__*/function (_PureComponent) {
  _inherits(TicketCreatorDialog, _PureComponent);

  function TicketCreatorDialog() {
    var _this;

    _classCallCheck(this, TicketCreatorDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TicketCreatorDialog).call(this));
    _this.getDisabledTooltip = _this.getDisabledTooltip.bind(_assertThisInitialized(_this));
    _this.getIsValid = _this.getIsValid.bind(_assertThisInitialized(_this)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(TicketCreatorDialog, [{
    key: "getDisabledTooltip",
    value: function getDisabledTooltip() {
      return !this.getIsValid() ? I18n.text('createTicketModal.disabledTooltip.missingRequired') : null;
    }
  }, {
    key: "getIsValid",
    value: function getIsValid() {
      var _this$props = this.props,
          propertyValues = _this$props.propertyValues,
          properties = _this$props.properties,
          requiredProps = _this$props.requiredProps;
      return properties !== LOADING && isValidRequiredProperties(requiredProps, propertyValues, properties) && REQUIRED_TICKET_PROPERTIES.every(function (name) {
        return propertyValues.get(name);
      });
    }
  }, {
    key: "renderConfirmAndAddButton",
    value: function renderConfirmAndAddButton(isConfirmDisabled) {
      if (!this.props.shouldRenderConfirmAndAddButton) {
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
          "data-selenium-test": "create-add-another-ticket-button",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "objectCreator.createContactModal.addButtonLabel.createAndNewUnique"
          })
        })
      });
    }
  }, {
    key: "renderAssociator",
    value: function renderAssociator(objectType) {
      var _this$props2 = this.props,
          associations = _this$props2.associations,
          getAssociationsByObjectType = _this$props2.getAssociationsByObjectType,
          handleAssociationIdsChange = _this$props2.handleAssociationIdsChange;
      var value = associations[objectType];

      var _getAssociationsByObj = getAssociationsByObjectType(objectType),
          ids = _getAssociationsByObj.ids;

      value = ids.isEmpty() ? undefined : objectType === CONTACT ? ids.toArray() : ids.first();
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "crm_components.GenericModal.categoryType." + objectType.toLowerCase()
        }),
        children: /*#__PURE__*/_jsx(AssociationSelectSearch, {
          autofocus: false,
          multi: objectType === CONTACT,
          objectType: objectType,
          onChange: this.partial(handleAssociationIdsChange, objectType),
          value: value,
          className: "association-select-value",
          seleniumSelector: "association-select-" + objectType
        })
      });
    }
  }, {
    key: "renderAssociatorCheckbox",
    value: function renderAssociatorCheckbox(objectType) {
      var _this$props3 = this.props,
          defaultTimelineSyncValue = _this$props3.defaultTimelineSyncValue,
          getAssociationsByObjectType = _this$props3.getAssociationsByObjectType,
          getSaveUserSettingElectedToSyncByType = _this$props3.getSaveUserSettingElectedToSyncByType,
          handleAssociationSyncChange = _this$props3.handleAssociationSyncChange,
          companies = _this$props3.companies,
          contacts = _this$props3.contacts;

      var _getAssociationsByObj2 = getAssociationsByObjectType(objectType),
          ids = _getAssociationsByObj2.ids,
          sync = _getAssociationsByObj2.sync;

      var objects = getObjectsByType(objectType, contacts, companies);
      var associationName = getAssociationName(ids, objectType, objects);

      if (ids.size === 0) {
        return null;
      }

      var isSync = Boolean(sync);
      return /*#__PURE__*/_jsx(UIFormControl, {
        children: /*#__PURE__*/_jsxs("div", {
          className: "display-flex align-center",
          children: [/*#__PURE__*/_jsxs(UICheckbox, {
            checked: isSync,
            onChange: function onChange() {
              getSaveUserSettingElectedToSyncByType(objectType, isSync);
              handleAssociationSyncChange(objectType, isSync ? undefined : defaultTimelineSyncValue);
            },
            size: 'small',
            "data-selenium-test": "association-checkbox-" + objectType,
            children: [/*#__PURE__*/_jsx(FormattedReactMessage, {
              message: "createModal.associatedProperties.useTimeline.ticket." + objectType.toLowerCase() + ".unchecked",
              options: {
                name: associationName,
                count: ids.size
              }
            }), ' ', !isSync && /*#__PURE__*/_jsx(UIHelpIcon, {
              title: I18n.text('createModal.associatedProperties.useTimeline.tooltip')
            })]
          }), isSync && this.renderAssociatorDate(objectType)]
        })
      });
    }
  }, {
    key: "renderAssociatorDate",
    value: function renderAssociatorDate(objectType) {
      var _this$props4 = this.props,
          getAssociationsByObjectType = _this$props4.getAssociationsByObjectType,
          handleAssociationSyncChange = _this$props4.handleAssociationSyncChange;

      var _getAssociationsByObj3 = getAssociationsByObjectType(objectType),
          sync = _getAssociationsByObj3.sync;

      var currentValue = sync.type;
      return /*#__PURE__*/_jsxs("span", {
        className: "association__date-picker",
        children: [/*#__PURE__*/_jsx(UISelect, {
          className: "m-left-2",
          options: [{
            text: I18n.text('createModal.associatedProperties.useTimeline.lastThirtyDays'),
            value: 'LAST_THIRTY_DAYS'
          }, {
            text: I18n.text('createModal.associatedProperties.useTimeline.lastSixtyDays'),
            value: 'LAST_SIXTY_DAYS'
          }, {
            text: I18n.text('createModal.associatedProperties.useTimeline.lastNinetyDays'),
            value: 'LAST_NINETY_DAYS'
          }, {
            text: I18n.text('createModal.associatedProperties.useTimeline.allTime'),
            value: 'ALL'
          }, {
            text: I18n.text('createModal.associatedProperties.useTimeline.customDate'),
            value: 'CUSTOM_DATE'
          }],
          placeholder: I18n.text('createModal.associatedProperties.useTimeline.lastThirtyDays'),
          onChange: function onChange(_ref) {
            var value = _ref.target.value;
            handleAssociationSyncChange(objectType, ASSOCIATION_SYNC_OPTIONS_MAP[value]);
          },
          buttonUse: "link",
          value: currentValue
        }), sync.type === 'CUSTOM_DATE' && /*#__PURE__*/_jsx(UIMicroDateInput, {
          className: "m-left-2",
          maxValue: SimpleDate.now(),
          value: sync.startDate,
          onChange: function onChange(_ref2) {
            var value = _ref2.target.value;
            handleAssociationSyncChange(objectType, {
              type: 'CUSTOM_DATE',
              startDate: value,
              endDate: SimpleDate.now()
            });
          }
        })]
      });
    }
  }, {
    key: "renderAssociationFields",
    value: function renderAssociationFields() {
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(HR, {}), /*#__PURE__*/_jsx("h5", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "createModal.associatedProperties.title.ticket"
          })
        }), this.renderAssociator(COMPANY), this.renderAssociatorCheckbox(COMPANY), this.renderAssociator(CONTACT), this.renderAssociatorCheckbox(CONTACT)]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          embedded = _this$props5.embedded,
          handleChange = _this$props5.handleChange,
          isModeCreation = _this$props5.isModeCreation,
          objectType = _this$props5.objectType,
          onReject = _this$props5.onReject,
          properties = _this$props5.properties,
          propertyValues = _this$props5.propertyValues,
          setPopoverTargetAsRef = _this$props5.setPopoverTargetAsRef;
      var isConfirmDisabled = Boolean(!canCreate(objectType) || !this.getIsValid());
      return /*#__PURE__*/_jsx(ObjectCreatorDialog, {
        additionalRequiredProperties: this.props.additionalRequiredProperties,
        confirmDisabled: isConfirmDisabled,
        confirmDisabledTooltip: this.getDisabledTooltip(),
        embedded: embedded,
        extraFields: this.renderAssociationFields(),
        onChange: handleChange,
        initialProperties: REQUIRED_TICKET_PROPERTIES,
        moreButtons: this.renderConfirmAndAddButton(isConfirmDisabled),
        objectType: objectType,
        onConfirm: this.props.onConfirm,
        onReject: onReject,
        properties: properties,
        propertyValues: propertyValues,
        setPopoverTargetAsRef: setPopoverTargetAsRef,
        shouldRenderContentOnly: this.props.shouldRenderContentOnly,
        showAllProperties: isModeCreation,
        title: I18n.text('createTicketModal.modalHeader'),
        subject: propertyValues
      });
    }
  }]);

  return TicketCreatorDialog;
}(PureComponent);

TicketCreatorDialog.defaultProps = {
  shouldRenderConfirmAndAddButton: true
};
TicketCreatorDialog.propTypes = {
  additionalRequiredProperties: ImmutablePropTypes.list,
  associations: PropTypes.object.isRequired,
  companies: PropTypes.instanceOf(ImmutableMap).isRequired,
  contacts: PropTypes.instanceOf(ImmutableMap).isRequired,
  defaultTimelineSyncValue: PropTypes.shape({
    startDate: SimpleDateTypes.SimpleDateType.isRequired,
    type: PropTypes.oneOf(['LAST_THIRTY_DAYS', 'LAST_SIXTY_DAYS', 'LAST_NINETY_DAYS', 'ALL', 'CUSTOM_DATE'])
  }).isRequired,
  embedded: PropTypes.bool,
  getAssociationsByObjectType: PropTypes.func.isRequired,
  getSaveUserSettingElectedToSyncByType: PropTypes.func.isRequired,
  handleAssociationIdsChange: PropTypes.func.isRequired,
  handleAssociationSyncChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  isModeCreation: PropTypes.bool.isRequired,
  objectType: ObjectTypesType,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  properties: ImmutablePropTypes.orderedMap,
  propertyValues: ImmutablePropTypes.map.isRequired,
  requiredProps: ImmutablePropTypes.listOf(PropTypes.string),
  setPopoverTargetAsRef: PropTypes.func.isRequired,
  shouldRenderContentOnly: PropTypes.bool,
  shouldRenderConfirmAndAddButton: PropTypes.bool
};
export default Popoverable(TicketCreatorDialog, TicketCreatorDialog.propTypes);