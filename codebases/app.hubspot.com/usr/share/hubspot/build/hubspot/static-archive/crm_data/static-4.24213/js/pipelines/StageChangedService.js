'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _BLOCKLISTED_PROPERTI;

import { connectPromise } from 'crm_data/flux/connectPromise';
import { DEAL_STAGE_CHANGE, TICKET_STAGE_CHANGE } from 'crm_data/actions/ActionTypes';
import PipelineStageChangePrompt from 'customer-data-properties/prompt/PipelineStageChangePrompt';
import DealsStore from 'crm_data/deals/DealsStore';
import DealPipelineStore from 'crm_data/deals/DealPipelineStore';
import DealStageStore from 'crm_data/deals/DealStageStore';
import DealStagePropertiesStore from 'crm_data/deals/DealStagePropertiesStore';
import TicketsStore from 'crm_data/tickets/TicketsStore';
import TicketsPipelinesStore from 'crm_data/tickets/TicketsPipelinesStore';
import TicketsPipelinesStagesStore from 'crm_data/tickets/TicketsPipelinesStagesStore';
import TicketStagePropertiesStore from 'crm_data/tickets/TicketStagePropertiesStore';
import { CLOSED } from 'customer-data-objects/ticket/TicketStageStatusOptions';
import dispatcher from 'dispatcher/dispatcher';
import { List, Map as ImmutableMap } from 'immutable';
import { getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import { isLoading } from 'crm_data/flux/LoadingStatus';
import ObjectsActions from 'crm_data/objects/ObjectsActions';
import get from 'transmute/get';
import registerService from 'crm_data/flux/registerService';
import { CrmLogger } from 'customer-data-tracking/loggers';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import * as DealsActions from 'crm_data/deals/DealsActions';
import * as TicketsActions from 'crm_data/tickets/TicketsActions';
import { canMoveStage } from 'crm_data/BET/permissions/DealPermissions';
import SettingsStore from 'crm_data/settings/SettingsStore';
import bustStoreCacheIfExpired from 'crm_data/flux/bustStoreCacheIfExpired';
import PropertyInput from 'customer-data-properties/input/PropertyInput';
import { userScopes } from 'crm_data/scopes/UserScopes';
import I18n from 'I18n';
import PropertyUpdateErrorHandler from 'customer-data-properties/PropertyUpdateErrorHandler';
import { getPropertyInputResolver } from 'customer-data-properties/resolvers/PropertyInputResolvers';
import { getPropertyPermissionDependency, fetchFLPDependency } from '../properties/FieldLevelPermissionsDependencies';
import { BoardRefreshActions } from 'crm_data/crmSearch/BoardRefreshStore';
var BLOCKLISTED_PROPERTIES = (_BLOCKLISTED_PROPERTI = {}, _defineProperty(_BLOCKLISTED_PROPERTI, DEAL, ['pipeline', 'dealstage']), _defineProperty(_BLOCKLISTED_PROPERTI, TICKET, ['hs_pipeline', 'hs_pipeline_stage']), _BLOCKLISTED_PROPERTI);

var rethrowError = function rethrowError(err) {
  if (err instanceof Error) {
    throw err;
  }

  return err;
};

var trackClosedDeal = function trackClosedDeal(isDealWon, deal) {
  var amount = getProperty(deal, 'amount'); //# ********** PUBLIC EVENT **********
  //# Public Events help teams across HubSpot automate work and customize experiences based on user actions.
  //# Speak with #product-insight and your PM before any shipping any changes to this event

  CrmLogger.log('recordUsage', {
    action: "close deal " + (isDealWon ? 'won' : 'lost'),
    what_value: parseInt(amount, 10),
    type: DEAL
  }); //# ********** PUBLIC EVENT **********
};

var trackTicketStageChange = function trackTicketStageChange(state, label) {
  if (state === CLOSED) {
    CrmLogger.log('changedTicketStatusToClosedInRecord');
    CrmLogger.log('ticketsActivation');
  } else {
    CrmLogger.log('changedTicketStatusToOpenInRecord');
  } // to delete


  CrmLogger.logRecordInteraction(TICKET, {
    action: 'Changed ticket status',
    type: state,
    label: label,
    count: 1
  });
};

var getModalSavedCallback = function getModalSavedCallback(objectType, subject, nextProperties, nextStage) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  return function (modalUpdates) {
    var propertyUpdates = nextProperties.merge(ImmutableMap(modalUpdates));
    ObjectsActions.updateStores(subject, nextProperties.merge(ImmutableMap(modalUpdates)), {
      updatedValues: true,
      onError: function onError(err) {
        PropertyUpdateErrorHandler(err);
        var objectActions = objectType === DEAL ? DealsActions : TicketsActions;
        var objectIdKey = objectType === DEAL ? 'dealId' : 'objectId';
        objectActions.revertMove(subject.get(objectIdKey));
      },
      onSuccess: options.onSuccess
    });
    BoardRefreshActions.resume();

    if (objectType === DEAL && [0, 1].includes(nextStage.get('probability'))) {
      var isDealWon = nextStage.get('probability') === 1;
      return trackClosedDeal(isDealWon, propertyUpdates.reduce(function (record, value, key) {
        return setProperty(record, key, value);
      }, subject));
    }

    if (objectType === TICKET) {
      trackTicketStageChange(nextStage.getIn(['metadata', 'ticketState']), nextStage.get('label'));
    }

    return null;
  };
};

var getModalCanceledCallback = function getModalCanceledCallback(subject, id, prevProperties, revertMove) {
  return function () {
    ObjectsActions.updateStores(subject, prevProperties, {
      updatedValues: true,
      onError: PropertyUpdateErrorHandler
    });
    BoardRefreshActions.resume();
    return revertMove(id);
  };
};

var fetchDealInfo = connectPromise({
  flpFetched: fetchFLPDependency,
  getPropertyPermission: getPropertyPermissionDependency,
  subject: {
    stores: [DealsStore],
    deref: function deref(_ref) {
      var id = _ref.id;
      return DealsStore.get(id);
    }
  },
  stages: {
    stores: [DealsStore, DealStageStore],
    deref: function deref(_ref2) {
      var prevProperties = _ref2.prevProperties,
          nextProperties = _ref2.nextProperties;
      var stages = DealStageStore.get();

      if (isLoading(stages)) {
        return undefined;
      }

      return {
        prev: get(get('dealstage', prevProperties), stages),
        next: get(get('dealstage', nextProperties), stages)
      };
    }
  },
  stageProperties: {
    stores: [DealPipelineStore, DealStageStore, DealStagePropertiesStore, PropertiesStore],
    deref: function deref(_ref3) {
      var nextProperties = _ref3.nextProperties;
      var requestedPropertiesByStage = DealStagePropertiesStore.get();
      var allStageProperties = PropertiesStore.get(DEAL);
      var stages = DealStageStore.get();
      var pipelines = DealPipelineStore.get();

      if (isLoading(requestedPropertiesByStage, allStageProperties, stages, pipelines)) {
        return undefined;
      }

      var stageId = nextProperties.get('dealstage');
      var customRequestedProperties = requestedPropertiesByStage.get(stageId);

      if (customRequestedProperties) {
        return customRequestedProperties.filter(function (property) {
          var propertyName = property.get('property');
          return allStageProperties.has(propertyName) && !BLOCKLISTED_PROPERTIES[DEAL].includes(propertyName);
        });
      }

      return List();
    }
  },
  subjectProperties: {
    stores: [PropertiesStore],
    deref: function deref() {
      var subjectProperties = PropertiesStore.get(DEAL);

      if (isLoading(subjectProperties)) {
        return List();
      }

      return subjectProperties;
    }
  },
  settings: {
    stores: [SettingsStore],
    deref: bustStoreCacheIfExpired()
  }
});
var fetchTicketInfo = connectPromise({
  flpFetched: fetchFLPDependency,
  getPropertyPermission: getPropertyPermissionDependency,
  subject: {
    stores: [TicketsStore],
    deref: function deref(_ref4) {
      var id = _ref4.id;
      return TicketsStore.get(id);
    }
  },
  stages: {
    stores: [TicketsPipelinesStagesStore],
    deref: function deref(_ref5) {
      var prevProperties = _ref5.prevProperties,
          nextProperties = _ref5.nextProperties;
      var stages = TicketsPipelinesStagesStore.get();

      if (isLoading(stages)) {
        return ImmutableMap();
      }

      return {
        prev: get(get('hs_pipeline_stage', prevProperties), stages),
        next: get(get('hs_pipeline_stage', nextProperties), stages)
      };
    }
  },
  stageProperties: {
    stores: [PropertiesStore, TicketsPipelinesStore, TicketsPipelinesStagesStore, TicketStagePropertiesStore],
    deref: function deref(_ref6) {
      var nextProperties = _ref6.nextProperties;
      var requestedPropertiesByStage = TicketStagePropertiesStore.get();
      var allStageProperties = PropertiesStore.get(TICKET);
      var stages = TicketsPipelinesStagesStore.get();
      var pipelines = TicketsPipelinesStore.get();

      if (isLoading(requestedPropertiesByStage, allStageProperties, stages, pipelines)) {
        return undefined;
      }

      var stageId = nextProperties.get('hs_pipeline_stage');
      var customRequestedProperties = requestedPropertiesByStage.get(stageId);

      if (customRequestedProperties) {
        return customRequestedProperties.filter(function (property) {
          var propertyName = property.get('property');
          return allStageProperties.has(propertyName) && !BLOCKLISTED_PROPERTIES[TICKET].includes(propertyName);
        });
      }

      return List();
    }
  },
  subjectProperties: {
    stores: [PropertiesStore],
    deref: function deref() {
      var subjectProperties = PropertiesStore.get(TICKET);

      if (isLoading(subjectProperties)) {
        return List();
      }

      return subjectProperties;
    }
  },
  settings: {
    stores: [SettingsStore],
    deref: bustStoreCacheIfExpired()
  }
});

var maybeShowModal = function maybeShowModal(objectType, _ref7) {
  var id = _ref7.id,
      pipeline = _ref7.pipeline,
      prevProperties = _ref7.prevProperties,
      nextProperties = _ref7.nextProperties;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var fetchInfo = objectType === TICKET ? fetchTicketInfo : fetchDealInfo;
  var actions = objectType === TICKET ? TicketsActions : DealsActions;
  userScopes().then(function (scopes) {
    if (objectType === DEAL && !canMoveStage(pipeline, prevProperties.get('dealstage'), nextProperties.get('dealstage'), scopes)) {
      return false;
    }

    return fetchInfo({
      id: id,
      prevProperties: prevProperties,
      nextProperties: nextProperties,
      scopes: scopes,
      objectType: objectType
    }).then(function (_ref8) {
      var subject = _ref8.subject,
          stages = _ref8.stages,
          stageProperties = _ref8.stageProperties,
          subjectProperties = _ref8.subjectProperties,
          settings = _ref8.settings,
          getPropertyPermission = _ref8.getPropertyPermission;

      if (!stageProperties.isEmpty()) {
        // Pauses background board refresh while stage change modal is open
        BoardRefreshActions.pause();
        return PipelineStageChangePrompt({
          getPropertyInputResolver: getPropertyInputResolver,
          objectType: objectType,
          subject: subject,
          prevStage: stages.prev,
          nextStage: stages.next,
          prevProperties: prevProperties,
          PropertyInput: PropertyInput,
          nextProperties: nextProperties,
          stageProperties: stageProperties,
          subjectProperties: subjectProperties,
          settings: settings,
          getPropertyPermission: getPropertyPermission,
          saveCallback: getModalSavedCallback(objectType, subject, nextProperties, stages.next, options),
          cancelCallback: getModalCanceledCallback(subject, id, prevProperties, actions.revertMove),
          scopes: scopes
        });
      } // Otherwise no modal is shown so just update


      if (objectType === DEAL) {
        var userIsChangingCloseDate = nextProperties.has('closedate');
        var probability = stages.next.get('probability') && +stages.next.get('probability');
        var dealIsWonOrLost = [0, 1].includes(probability);
        var previousStageProbability = get('probability', stages.prev) && +get('probability', stages.prev);

        if (!userIsChangingCloseDate && dealIsWonOrLost && previousStageProbability !== probability) {
          nextProperties = nextProperties.set('closedate', I18n.moment.userTz().valueOf());
        }
      }

      return ObjectsActions.updateStores(subject, nextProperties, {
        updatedValues: true,
        onError: function onError(err) {
          PropertyUpdateErrorHandler(err);
          actions.revertMove(id);
        },
        onSuccess: options.onSuccess
      });
    });
  }).catch(rethrowError).done();
};

var handlers = {};

handlers[DEAL_STAGE_CHANGE] = function (_, _ref9) {
  var id = _ref9.id,
      pipeline = _ref9.pipeline,
      nextProperties = _ref9.nextProperties,
      prevProperties = _ref9.prevProperties,
      options = _ref9.options;
  maybeShowModal(DEAL, {
    id: id,
    pipeline: pipeline,
    prevProperties: prevProperties,
    nextProperties: nextProperties
  }, options);
};

handlers[TICKET_STAGE_CHANGE] = function (_, _ref10) {
  var id = _ref10.id,
      nextProperties = _ref10.nextProperties,
      properties = _ref10.properties,
      options = _ref10.options;
  maybeShowModal(TICKET, {
    id: id,
    prevProperties: properties,
    nextProperties: nextProperties
  }, options);
};

export default registerService(undefined, handlers, dispatcher);