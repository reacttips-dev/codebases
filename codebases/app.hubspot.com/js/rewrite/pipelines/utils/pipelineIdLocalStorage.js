'use es6';

import { getFrom, setFrom, deleteFrom } from 'crm_data/settings/LocalSettings';
import PortalIdParser from 'PortalIdParser';
var portalId = PortalIdParser.get();
export var getDefaultPipelineIdKey = function getDefaultPipelineIdKey(objectTypeId) {
  return "CRM:defaultPipeline:" + objectTypeId + ":" + portalId;
};
export var getDefaultPipelineIdFromLocalStorage = function getDefaultPipelineIdFromLocalStorage(objectTypeId) {
  return getFrom(localStorage, getDefaultPipelineIdKey(objectTypeId));
};
export var setDefaultPipelineIdInLocalStorage = function setDefaultPipelineIdInLocalStorage(objectTypeId, pipelineId) {
  return setFrom(localStorage, getDefaultPipelineIdKey(objectTypeId), pipelineId);
};
export var clearDefaultPipelineIdInLocalStorage = function clearDefaultPipelineIdInLocalStorage(objectTypeId) {
  return deleteFrom(localStorage, getDefaultPipelineIdKey(objectTypeId));
};