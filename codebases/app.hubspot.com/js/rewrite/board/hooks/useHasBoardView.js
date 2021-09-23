'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import withGateOverride from 'crm_data/gates/withGateOverride';
import { PORTAL_SPECIFIC } from 'customer-data-objects/constants/MetaTypes';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
export var useHasBoardView = function useHasBoardView() {
  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      hasPipelines = _useSelectedObjectTyp.hasPipelines,
      metaTypeId = _useSelectedObjectTyp.metaTypeId,
      objectTypeId = _useSelectedObjectTyp.objectTypeId;

  var hasAllGates = useHasAllGates();
  var hasCobjectPipelinesGate = withGateOverride('CRM:Datasets:CobjectPipelines', hasAllGates('CRM:Datasets:CobjectPipelines'));
  var hasLCSBoardsGate = withGateOverride('CRM:Datasets:LCS:Boards', hasAllGates('CRM:Datasets:LCS:Boards'));
  var canShowPipelines = [].concat(_toConsumableArray(hasLCSBoardsGate ? [CONTACT_TYPE_ID, COMPANY_TYPE_ID] : []), [TICKET_TYPE_ID, DEAL_TYPE_ID]).includes(objectTypeId) || metaTypeId === PORTAL_SPECIFIC && hasCobjectPipelinesGate;
  return hasPipelines && canShowPipelines;
};