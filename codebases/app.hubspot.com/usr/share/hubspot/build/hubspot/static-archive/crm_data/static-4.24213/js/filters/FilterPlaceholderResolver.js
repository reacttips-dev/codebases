'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import I18n from 'I18n';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import User from 'hub-http-shims/UserDataJS/user';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import DealStageStore from 'crm_data/deals/DealStageStore';
import SettingsStore from 'crm_data/settings/SettingsStore';
import TicketsPipelinesStagesStore from 'crm_data/tickets/TicketsPipelinesStagesStore';
import { CLOSED } from 'customer-data-objects/ticket/TicketStageStatusOptions';
import devLogger from 'react-utils/devLogger';
import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
import { FISCAL_YEAR_START_MONTH } from 'crm_data/constants/PortalSettingsKeys';
import { MONTHS } from '../constants/Months';
import always from 'transmute/always';
import get from 'transmute/get';
import set from 'transmute/set'; // Do not remove! Required to make the pipelines stores function in a code split
// See also https://git.hubteam.com/HubSpot/CRM-Issues/issues/1874

import 'crm_data/tickets/TicketsPipelinesStore';
import 'crm_data/deals/DealPipelineStore';
var currentOwnerId;
var currentOwnerIdWarningInfo = {
  message: 'FilterPlaceholderResolver should not be used with calling setupFilterPlaceholderResolver to initialize the current owner',
  url: 'https://git.hubteam.com/HubSpot/CRM/pull/19205',
  key: 'FilterPlaceholderResolver:Init'
};
export var PLACEHOLDER_ME = '__hs__ME';
export var PLACEHOLDER_ID = '__hs__ID';
export var PLACEHOLDER_NOW = '__hs__NOW';
export var PLACEHOLDER_CLOSED_WON = '__hs__CLOSEDWON';
export var PLACEHOLDER_TICKET_CLOSED = '__hs__TICKET_CLOSED';
export var PLACEHOLDER_FISCAL_YEAR_OFFSET = '__hs__FISCAL_YEAR_OFFSET';

var resolveValues = function resolveValues(filter, valueMap) {
  if (filter.values) {
    filter.values = map(function (value) {
      return valueMap.has(value) ? valueMap.get(value) : value;
    }, filter.values);
  }

  if (valueMap.has(filter.value)) {
    filter.value = valueMap.get(filter.value);
  }

  return filter;
};

var getClosedWonDealStages = function getClosedWonDealStages() {
  var dealstages = DealStageStore.get();

  if (!dealstages) {
    return false;
  }

  return dealstages.filter(function (stage) {
    return stage.get('probability') === 1;
  }).map(function (stage) {
    return stage.get('value');
  });
};

var fiscalYearDefaultMonthOffset = 0;
export var getFiscalYearMonthOffset = function getFiscalYearMonthOffset(month) {
  var offset = MONTHS.indexOf(month);
  return offset > -1 ? offset : fiscalYearDefaultMonthOffset;
};

var getClosedTicketStages = function getClosedTicketStages() {
  var ticketStages = TicketsPipelinesStagesStore.get();
  if (!ticketStages) return false;
  return ticketStages.filter(function (stage) {
    return stage.getIn(['metadata', 'ticketState']) === CLOSED;
  }).map(function (stage) {
    return stage.get('value');
  });
};

var resolveIdentityPlaceholders = function resolveIdentityPlaceholders(filter) {
  var _ImmutableMap;

  if (!currentOwnerId) {
    devLogger.warn(currentOwnerIdWarningInfo);
  }

  return resolveValues(filter, ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, PLACEHOLDER_ME, "" + currentOwnerId), _defineProperty(_ImmutableMap, PLACEHOLDER_ID, "" + User.get().get('user_id')), _defineProperty(_ImmutableMap, PLACEHOLDER_NOW, I18n.moment.userTz().valueOf()), _ImmutableMap)));
};

var resolveClosedWonStages = function resolveClosedWonStages(filter) {
  var values = ImmutableSet(filter.values);
  var stages;

  if (values.contains(PLACEHOLDER_CLOSED_WON)) {
    values = values.remove(PLACEHOLDER_CLOSED_WON);
    stages = getClosedWonDealStages();
  } else if (values.contains(PLACEHOLDER_TICKET_CLOSED)) {
    values = values.remove(PLACEHOLDER_TICKET_CLOSED);
    stages = getClosedTicketStages();
  }

  if (stages) {
    filter.values = values.union(stages.toSet()).toArray();
  }

  return filter;
};

export var replaceFiscalYearPlaceholder = function replaceFiscalYearPlaceholder(filter, monthOffset) {
  // The range of offset begins whit a range of [0, 11]
  // This is for "so far this time unit" filters, the offset needs to only go
  // back to the start of the time unit based on the current date
  // 'TIME_UNIT_TO_DATE' comes from customer-data-filters/converters/contactSearch/FilterContactSearchOperatorTypes
  if (filter.operator === 'TIME_UNIT_TO_DATE') {
    monthOffset = 12 - monthOffset;
  } // When the time unit is Quarter the range much smaller [-1, 1] to reflect the 3 month time frame of the quarter
  // This range [-1, 1] vs [0, 2] is driven by object search
  // QUARTER comes from customer-data-filters/filterQueryFormat/rollingDates/TimeUnits


  if (filter.timeUnit === 'QUARTER') {
    monthOffset = (monthOffset + 1) % 3 - 1;
  } // The offset's sign must match the rolling direction. Forward (+) and backwards (-)


  return set('rollingOffset', get('rollForward', filter) || monthOffset === 0 ? monthOffset : -monthOffset, filter);
};

var resolveFiscalYearOffsets = function resolveFiscalYearOffsets(filter) {
  var settings = SettingsStore.get();
  var month = settings && settings.get(FISCAL_YEAR_START_MONTH);
  return filter.rollingOffset !== PLACEHOLDER_FISCAL_YEAR_OFFSET ? filter : replaceFiscalYearPlaceholder(filter, getFiscalYearMonthOffset(month));
};

var removeLabel = function removeLabel(filter) {
  delete filter.label;
  return filter;
};

var resolveFilters = map(pipe(resolveIdentityPlaceholders, resolveClosedWonStages, resolveFiscalYearOffsets, removeLabel));
export var setupFilterPlaceholderResolver = function setupFilterPlaceholderResolver(ownerId) {
  currentOwnerId = ownerId;
};
export function fixGeoProperties(filter) {
  if (filter.operator === 'DISTANCE_LT' && filter.distanceUnit == null) {
    filter.distanceUnit = 'MILES';
    filter.distanceUnitCount = 25;
  }

  return filter;
}
export var fetchDealStages = connectPromiseSingle({
  stores: [DealStageStore],
  deref: function deref() {
    return DealStageStore.get();
  }
});
export var fetchTicketStages = connectPromiseSingle({
  stores: [TicketsPipelinesStagesStore],
  deref: function deref() {
    return TicketsPipelinesStagesStore.get();
  }
});
export var fetchSettings = connectPromiseSingle({
  stores: [SettingsStore],
  deref: function deref() {
    return SettingsStore.get();
  }
});
export var fetchNoRequiredData = always(Promise.resolve(undefined));
export var getFetchRequiredFilterPlaceholderResolverData = function getFetchRequiredFilterPlaceholderResolverData(objectType) {
  if (objectType === DEAL) {
    return fetchDealStages;
  } else if (objectType === TICKET) {
    return fetchTicketStages;
  }

  return fetchNoRequiredData;
};
export { resolveFilters as replaceSpecialTypes };