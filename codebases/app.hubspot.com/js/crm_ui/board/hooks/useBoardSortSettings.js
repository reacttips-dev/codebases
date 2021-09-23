'use es6';

import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
import { Map as ImmutableMap } from 'immutable';
import { useStoreDependency } from 'general-store';
import LocalSettingsStore from 'crm_data/settings/LocalSettingsStore';

var objectTypeSupportsPipelines = function objectTypeSupportsPipelines(type) {
  return type === ObjectTypes.DEAL || type === ObjectTypes.TICKET;
};

export var boardSortSettingsDep = {
  stores: [LocalSettingsStore],
  deref: function deref(props) {
    var objectType = props.objectType;

    if (!objectTypeSupportsPipelines(objectType)) {
      return ImmutableMap();
    }

    var objectTypeKey = objectType === ObjectTypes.DEAL ? 'deals' : 'tickets';
    var order = LocalSettingsStore.get(objectTypeKey + ".boardSort.direction");
    var sortKey = LocalSettingsStore.get(objectTypeKey + ".boardSort.sortKey");

    if (!order || !sortKey) {
      return ImmutableMap();
    }

    return ImmutableMap({
      order: order,
      sortKey: sortKey
    });
  }
};
export var useBoardSortSettings = function useBoardSortSettings(objectType) {
  return useStoreDependency(boardSortSettingsDep, {
    objectType: objectType
  });
};