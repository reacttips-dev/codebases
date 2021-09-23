'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import { List, Map as ImmutableMap, OrderedMap } from 'immutable';
import getIn from 'transmute/getIn';
import get from 'transmute/get';
import { connect } from 'general-store';
import formatName from 'I18n/utils/formatName';
import * as SimpleDate from 'UIComponents/core/SimpleDate';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import { getPropertyMap, setProperty, getProperty } from 'customer-data-objects/model/ImmutableModel';
import ObjectCreatorPropertiesDependency from '../../../flux/dependencies/ObjectCreatorPropertiesDependency';
import RequiredPropsDependency from '../../../dependencies/RequiredPropsDependency';
import CurrentOwnerIdStore from 'crm_data/owners/CurrentOwnerIdStore';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import TicketCreatorDialog from './TicketCreatorDialog';
import { COMPANY, CONTACT, ENGAGEMENT, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import TicketsPipelinesStore from 'crm_data/tickets/TicketsPipelinesStore';
import { isResolved } from 'crm_data/flux/LoadingStatus';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import { markActionComplete } from 'user-context/onboarding';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
import { saveUserSetting } from 'crm_data/settings/UserSettingsActions';
import ErrorBoundary from 'customer-data-objects-ui-components/ErrorBoundary';
import { HIDDEN } from 'crm_data/pipelinePermissions/pipelinePermissionsConstants';
var DEFAULT_TIMELINE_SYNC = {
  type: 'LAST_THIRTY_DAYS',
  startDate: SimpleDate.startOfPrior(29, 'day')
};

function getAssociationName(ids, objectType, objectStore) {
  if (!ids || ids.isEmpty()) {
    return null;
  }

  if (!isResolved(objectStore)) {
    return undefined;
  }

  var object = objectStore.get(ids.first());

  if (objectType === CONTACT) {
    return formatName({
      firstName: getProperty(object, 'firstname'),
      lastName: getProperty(object, 'lastname')
    });
  }

  return getProperty(object, 'name');
}

function getInitialAssociationsWithTimelineSync(associatedContactId, associatedCompanyId, contacts, companies, hasElectedIntoSyncContact, hasElectedIntoSyncCompany) {
  var associatedContactIds = associatedContactId ? List.of(associatedContactId) : List();
  var associatedCompanyIds = associatedCompanyId ? List.of(associatedCompanyId) : List();
  return {
    associatedContactIds: associatedContactIds,
    associatedContactName: getAssociationName(associatedContactIds, CONTACT, contacts),
    associatedContactSyncRange: !associatedContactIds.isEmpty() && hasElectedIntoSyncContact ? DEFAULT_TIMELINE_SYNC : null,
    associatedCompanyIds: associatedCompanyIds,
    associatedCompanyName: getAssociationName(associatedCompanyIds, COMPANY, companies),
    associatedCompanySyncRange: !associatedCompanyIds.isEmpty() && hasElectedIntoSyncCompany ? DEFAULT_TIMELINE_SYNC : null
  };
}

function getInitialAssociationByType(objectType, associationObjectType, associationObjectId, propertyDefaults) {
  var defaultAssociationKey = objectType === CONTACT ? 'associatedcontactid' : 'associatedcompanyid';
  var defaultAssociation = propertyDefaults.get(defaultAssociationKey) || '';
  var associationId = associationObjectType === objectType ? associationObjectId : defaultAssociation;
  return "" + associationId;
}

function getInitialObjectRecord(props) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var currentOwnerId = props.currentOwnerId,
      propertyDefaults = props.propertyDefaults,
      ticketPipelines = props.ticketPipelines;
  var _state$objectRecord = state.objectRecord,
      objectRecord = _state$objectRecord === void 0 ? TicketRecord() : _state$objectRecord;
  var defaultPipelineId = propertyDefaults.get('hs_pipeline');
  var pipeline = defaultPipelineId ? ticketPipelines.get(defaultPipelineId) : ticketPipelines.find(function (pipelineOption) {
    return getIn(['permission', 'accessLevel'], pipelineOption) !== HIDDEN;
  });
  var firstStageId = getIn(['stages', 0, 'stageId'], pipeline);
  var validPropertyDefaults = propertyDefaults.delete('associatedcontactid').delete('associatedcompanyid');
  var initialPropertyValues = ImmutableMap({
    hubspot_owner_id: currentOwnerId
  });
  var initialPipelineValues = ImmutableMap({
    hs_pipeline_stage: firstStageId,
    hs_pipeline: get('pipelineId', pipeline)
  });
  return initialPropertyValues.merge(validPropertyDefaults).merge(initialPipelineValues).reduce(function (acc, value, name) {
    return setProperty(acc, name, value);
  }, objectRecord);
}

var TicketCreatorContainer = /*#__PURE__*/function (_PureComponent) {
  _inherits(TicketCreatorContainer, _PureComponent);

  _createClass(TicketCreatorContainer, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var associationObjectId = props.associationObjectId,
          associationObjectType = props.associationObjectType,
          companies = props.companies,
          contacts = props.contacts,
          currentOwnerId = props.currentOwnerId,
          hasElectedIntoSyncContact = props.hasElectedIntoSyncContact,
          hasElectedIntoSyncCompany = props.hasElectedIntoSyncCompany,
          properties = props.properties,
          propertyDefaults = props.propertyDefaults,
          ticketPipelines = props.ticketPipelines;
      var didInitializePropertyValues = state.didInitializePropertyValues;

      if ((currentOwnerId || associationObjectId) && isResolved(ticketPipelines) && isResolved(properties) && !didInitializePropertyValues) {
        var _associations;

        var newState = state;
        var associatedContactId = getInitialAssociationByType(CONTACT, associationObjectType, associationObjectId, propertyDefaults);
        var associatedCompanyId = getInitialAssociationByType(COMPANY, associationObjectType, associationObjectId, propertyDefaults);
        newState = Object.assign({}, newState, {
          didInitializePropertyValues: true,
          objectRecord: getInitialObjectRecord(props, state),
          associations: (_associations = {}, _defineProperty(_associations, CONTACT, associatedContactId), _defineProperty(_associations, COMPANY, associatedCompanyId), _associations)
        }, getInitialAssociationsWithTimelineSync(associatedContactId, associatedCompanyId, contacts, companies, hasElectedIntoSyncContact, hasElectedIntoSyncCompany));
        return newState;
      }

      return state;
    }
  }]);

  function TicketCreatorContainer() {
    var _associations2;

    var _this;

    _classCallCheck(this, TicketCreatorContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TicketCreatorContainer).call(this));

    _this.getAssociationsByObjectType = function (objectType) {
      var emptyAssociationData = {
        ids: List(),
        sync: null,
        name: undefined
      };

      if (!_this.state.didInitializePropertyValues) {
        return emptyAssociationData;
      }

      var _this$state = _this.state,
          associatedCompanyIds = _this$state.associatedCompanyIds,
          associatedCompanySyncRange = _this$state.associatedCompanySyncRange,
          associatedCompanyName = _this$state.associatedCompanyName,
          associatedContactIds = _this$state.associatedContactIds,
          associatedContactSyncRange = _this$state.associatedContactSyncRange,
          associatedContactName = _this$state.associatedContactName;

      if (objectType === CONTACT) {
        return {
          ids: associatedContactIds,
          sync: associatedContactSyncRange,
          name: associatedContactName
        };
      } else if (objectType === COMPANY) {
        return {
          ids: associatedCompanyIds,
          sync: associatedCompanySyncRange,
          name: associatedCompanyName
        };
      }

      return emptyAssociationData;
    };

    _this.getHasElectedIntoSyncObjectType = function (objectType) {
      var _this$props = _this.props,
          hasElectedIntoSyncContact = _this$props.hasElectedIntoSyncContact,
          hasElectedIntoSyncCompany = _this$props.hasElectedIntoSyncCompany;

      if (objectType === CONTACT) {
        return {
          hasElectedIntoSync: hasElectedIntoSyncContact
        };
      } else if (objectType === COMPANY) {
        return {
          hasElectedIntoSync: hasElectedIntoSyncCompany
        };
      }

      return {
        hasElectedIntoSync: false
      };
    };

    _this.getSaveUserSettingElectedToSyncByType = function (objectType, hasElectedIntoSync) {
      saveUserSetting(UserSettingsKeys["HAS_CHECKED_ASSOCIATION_TICKET_BOX_" + objectType], !hasElectedIntoSync);
    };

    _this.handleAssociationIdsChange = function (objectType, ids) {
      var _this$props2 = _this.props,
          contacts = _this$props2.contacts,
          companies = _this$props2.companies;
      var hasAssociations = Boolean(ids);

      var _this$getHasElectedIn = _this.getHasElectedIntoSyncObjectType(objectType),
          hasElectedIntoSync = _this$getHasElectedIn.hasElectedIntoSync;

      var syncRange = hasAssociations && hasElectedIntoSync ? DEFAULT_TIMELINE_SYNC : undefined;

      _this.setState(function (prevState) {
        if (objectType === CONTACT) {
          var hadAssociations = !prevState.associatedContactIds.isEmpty();
          var associatedContactIds = List(ids);
          var associatedContactName = getAssociationName(associatedContactIds, objectType, contacts);

          if (hadAssociations !== hasAssociations) {
            return {
              associatedContactIds: associatedContactIds,
              associatedContactName: associatedContactName,
              associatedContactSyncRange: syncRange
            };
          }

          return {
            associatedContactIds: associatedContactIds,
            associatedContactName: associatedContactName
          };
        } else if (objectType === COMPANY) {
          var associatedCompanyIds = List.of(ids);
          return {
            associatedCompanyIds: associatedCompanyIds,
            associatedCompanySyncRange: syncRange,
            associatedCompanyName: getAssociationName(associatedCompanyIds, objectType, companies)
          };
        }

        return prevState;
      });
    };

    _this.handleAssociationSyncChange = function (objectType, sync) {
      _this.setState(function (prevState) {
        if (objectType === CONTACT) {
          return {
            associatedContactSyncRange: sync
          };
        } else if (objectType === COMPANY) {
          return {
            associatedCompanySyncRange: sync
          };
        }

        return prevState;
      });
    };

    _this.handleChange = function (evt) {
      var name = evt.property.name,
          value = evt.value;
      var ticketPipelines = _this.props.ticketPipelines;
      var objectRecord = _this.state.objectRecord;
      var updates = {
        objectRecord: setProperty(objectRecord, name, value)
      };

      if (name === 'hs_pipeline' && value !== getProperty(objectRecord, 'hs_pipeline')) {
        var firstStageId = ticketPipelines.getIn([value, 'stages', 0, 'stageId']);
        updates.objectRecord = setProperty(updates.objectRecord, 'hs_pipeline_stage', firstStageId);
      }

      _this.setState(updates);
    };

    _this.handleClearTicketProperties = function () {
      _this.setState({
        objectRecord: getInitialObjectRecord(_this.props)
      });
    };

    _this.handleConfirmWithTimelineSync = function (_ref) {
      var addNew = _ref.addNew;
      var _this$props3 = _this.props,
          properties = _this$props3.properties,
          suggestions = _this$props3.suggestions;
      var objectRecord = _this.state.objectRecord;
      var propertyValues = getPropertyMap(objectRecord);

      if (!getIn(['results', 'size'], suggestions)) {
        markActionComplete('create-ticket');
        var requestedAssociatedObjects = [].concat(_toConsumableArray(_this.getRequestedAssociatedObjectsOfType(CONTACT)), _toConsumableArray(_this.getRequestedAssociatedObjectsOfType(COMPANY)));

        _this.props.onConfirm({
          addNew: addNew,
          properties: properties,
          propertyValues: propertyValues,
          requestedAssociatedObjects: requestedAssociatedObjects
        });

        if (addNew) _this.handleClearTicketProperties();
      }
    };

    _this.state = {
      didInitializePropertyValues: false,
      objectRecord: TicketRecord(),
      associations: (_associations2 = {}, _defineProperty(_associations2, CONTACT, ''), _defineProperty(_associations2, COMPANY, ''), _associations2)
    };
    return _this;
  } // for more convenient access to long state keys


  _createClass(TicketCreatorContainer, [{
    key: "getSyncTimestamp",
    value: function getSyncTimestamp(syncRange) {
      if (!syncRange || syncRange.type === 'ALL') return null;
      return SimpleDate.toMoment(syncRange.startDate).valueOf();
    } // todo rename

  }, {
    key: "getRequestedAssociatedObjectsOfType",
    value: function getRequestedAssociatedObjectsOfType(objectType) {
      var _this$getAssociations = this.getAssociationsByObjectType(objectType),
          ids = _this$getAssociations.ids,
          sync = _this$getAssociations.sync;

      var associateAllSinceTimestamp = this.getSyncTimestamp(sync);
      var objectTypeToBulkAssociate = sync ? ENGAGEMENT : null;
      return ids.map(function (objectId) {
        return {
          associateAllSinceTimestamp: associateAllSinceTimestamp,
          objectId: objectId,
          objectType: objectType,
          objectTypeToBulkAssociate: objectTypeToBulkAssociate
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var rest = Object.assign({}, this.props);
      var _this$state2 = this.state,
          associations = _this$state2.associations,
          objectRecord = _this$state2.objectRecord;
      return /*#__PURE__*/_jsx(ErrorBoundary, {
        boundaryName: "TicketCreatorContainer",
        children: /*#__PURE__*/_jsx(TicketCreatorDialog, Object.assign({}, rest, {
          associations: associations,
          defaultTimelineSyncValue: DEFAULT_TIMELINE_SYNC,
          getAssociationsByObjectType: this.getAssociationsByObjectType,
          getHasElectedIntoSyncObjectType: this.getHasElectedIntoSyncObjectType,
          getSaveUserSettingElectedToSyncByType: this.getSaveUserSettingElectedToSyncByType,
          handleAssociationIdsChange: this.handleAssociationIdsChange,
          handleAssociationSyncChange: this.handleAssociationSyncChange,
          handleChange: this.handleChange,
          isModeCreation: true,
          onConfirm: this.handleConfirmWithTimelineSync,
          propertyValues: getPropertyMap(objectRecord),
          shouldRenderContentOnly: this.props.shouldRenderContentOnly
        }))
      });
    }
  }]);

  return TicketCreatorContainer;
}(PureComponent);

TicketCreatorContainer.propTypes = Object.assign({}, PromptablePropInterface, {
  associationObjectId: PropTypes.string,
  associationObjectType: PropTypes.string,
  ticketPipelines: PropTypes.instanceOf(OrderedMap),
  properties: PropTypes.instanceOf(OrderedMap)
});
TicketCreatorContainer.defaultProps = {
  objectType: TICKET
};
var deps = {
  contacts: ContactsStore,
  companies: CompaniesStore,
  currentOwnerId: CurrentOwnerIdStore,
  hasElectedIntoSyncCompany: {
    stores: [UserSettingsStore],
    deref: function deref() {
      return UserSettingsStore.get(UserSettingsKeys.HAS_CHECKED_ASSOCIATION_TICKET_BOX_COMPANY);
    }
  },
  hasElectedIntoSyncContact: {
    stores: [UserSettingsStore],
    deref: function deref() {
      return UserSettingsStore.get(UserSettingsKeys.HAS_CHECKED_ASSOCIATION_TICKET_BOX_CONTACT);
    }
  },
  properties: ObjectCreatorPropertiesDependency,
  requiredProps: RequiredPropsDependency,
  ticketPipelines: TicketsPipelinesStore
};
export default connect(deps)(TicketCreatorContainer);