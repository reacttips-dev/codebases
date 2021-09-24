'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import memoizeOne from 'react-utils/memoizeOne';
import { useRecordCard } from '../../recordCards/hooks/useRecordCard';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import { OBJECT_BOARD } from '../../recordCards/constants/RecordCardLocations';
import { BOARD } from '../../views/constants/PageType';
import { getPropertyNamesFromCustomRecordView } from 'crm_data/cards/CrmRecordCardViewsUtils';
import { getPropertiesFromView } from '../utils/getPropertiesFromView';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { REQUIRED_PROPERTIES_BY_OBJECT_TYPE_ID } from '../../../lib/internal/properties/required';
import { unique } from '../../../utils/unique';
export var getRequiredPropertiesForTypeDef = function getRequiredPropertiesForTypeDef(_ref) {
  var objectTypeId = _ref.objectTypeId,
      pipelinePropertyName = _ref.pipelinePropertyName,
      pipelineStagePropertyName = _ref.pipelineStagePropertyName,
      primaryDisplayLabelPropertyName = _ref.primaryDisplayLabelPropertyName;
  return [].concat(_toConsumableArray(REQUIRED_PROPERTIES_BY_OBJECT_TYPE_ID[objectTypeId] || []), [pipelinePropertyName, pipelineStagePropertyName, primaryDisplayLabelPropertyName]).filter(Boolean);
};
export var generateBoardProperties = memoizeOne(function (typeDef, card) {
  return unique([].concat(_toConsumableArray(getRequiredPropertiesForTypeDef(typeDef)), _toConsumableArray(getPropertyNamesFromCustomRecordView(card)), ['createdate', 'hs_lastactivitydate', 'notes_last_created'])).sort();
});
export var generateListProperties = memoizeOne(function (typeDef, view) {
  return unique([].concat(_toConsumableArray(getRequiredPropertiesForTypeDef(typeDef)), _toConsumableArray(getPropertiesFromView(view)))).sort();
});
export var useQueryProperties = function useQueryProperties() {
  var pageType = useCurrentPageType();
  var view = useCurrentView();
  var typeDef = useSelectedObjectTypeDef();
  var card = useRecordCard(OBJECT_BOARD);
  return pageType === BOARD ? generateBoardProperties(typeDef, card) : generateListProperties(typeDef, view);
};