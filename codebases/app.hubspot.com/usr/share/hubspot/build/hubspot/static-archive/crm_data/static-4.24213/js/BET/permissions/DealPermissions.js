'use es6';

import { canMoveStage as canMoveBET, closedLostStage } from 'crm_data/BET/permissions/BETDealPermissions';

var BETMoveStageCheck = function BETMoveStageCheck(pipeline, prevStage, nextStage, scopes) {
  var includeWarning = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  return canMoveBET(pipeline, prevStage, nextStage, scopes, includeWarning);
};

export var isBETPortal = function isBETPortal(scopes) {
  return scopes.has('bet-enforce-deal-stage-restrictions');
};
export var bulkClosedLostEnabled = function bulkClosedLostEnabled(scopes) {
  return isBETPortal(scopes);
};
export var getClosedLostStage = function getClosedLostStage(pipeline) {
  return closedLostStage(pipeline);
};
export var canMoveStage = function canMoveStage(pipeline, prevStage, nextStage, scopes) {
  var includeWarning = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

  if (isBETPortal(scopes)) {
    return BETMoveStageCheck(pipeline, prevStage, nextStage, scopes, includeWarning);
  }

  return true;
};