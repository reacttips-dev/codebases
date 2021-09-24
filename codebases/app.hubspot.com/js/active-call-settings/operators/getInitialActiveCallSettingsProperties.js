'use es6';

import { LOADING, READY } from 'calling-internal-common/widget-status/constants/CallWidgetStates';
import { CALL_FROM_PHONE } from 'calling-lifecycle-internal/constants/CallMethods';
import { getPersistedCallMethod } from 'calling-lifecycle-internal/utils/getLocalCallSettings';
import { parseQueryFromLocation } from '../../utils/parseQueryFromLocation';
/**
 * Sets up the activeCallSettings store from url properties.
 * if shouldAutoStartCall is 'true' PRE_CALL state will be skipped.
 */

export var getInitialActiveCallSettingsProperties = function getInitialActiveCallSettingsProperties() {
  var _parseQueryFromLocati = parseQueryFromLocation(window.location),
      _parseQueryFromLocati2 = _parseQueryFromLocati.objectTypeId,
      objectTypeId = _parseQueryFromLocati2 === void 0 ? null : _parseQueryFromLocati2,
      _parseQueryFromLocati3 = _parseQueryFromLocati.subjectId,
      subjectId = _parseQueryFromLocati3 === void 0 ? null : _parseQueryFromLocati3,
      _parseQueryFromLocati4 = _parseQueryFromLocati.ownerId,
      ownerId = _parseQueryFromLocati4 === void 0 ? null : _parseQueryFromLocati4,
      _parseQueryFromLocati5 = _parseQueryFromLocati.isQueueTask,
      isQueueTask = _parseQueryFromLocati5 === void 0 ? false : _parseQueryFromLocati5,
      _parseQueryFromLocati6 = _parseQueryFromLocati.appIdentifier,
      appIdentifier = _parseQueryFromLocati6 === void 0 ? 'unknown' : _parseQueryFromLocati6;

  var selectedCallMethod = getPersistedCallMethod();
  var clientStatus = LOADING;

  if (selectedCallMethod === CALL_FROM_PHONE) {
    clientStatus = READY;
  }

  var subject = {
    subjectId: subjectId,
    objectTypeId: objectTypeId
  };
  return {
    ownerId: ownerId,
    clientStatus: clientStatus,
    selectedCallMethod: selectedCallMethod,
    subject: subject,
    shouldAutoStartCall: false,
    isQueueTask: isQueueTask === 'true',
    appIdentifier: appIdentifier
  };
};