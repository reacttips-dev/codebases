'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { useMemo } from 'react';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
import { usePipelines } from './usePipelines';
import { HIDDEN } from 'crm_data/pipelinePermissions/pipelinePermissionsConstants';
import getIn from 'transmute/getIn';
import update from 'transmute/update';
export var useDecorateQueryWithPipelinePermissions = function useDecorateQueryWithPipelinePermissions(originalQuery) {
  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      pipelinePropertyName = _useSelectedObjectTyp.pipelinePropertyName,
      hasPipelines = _useSelectedObjectTyp.hasPipelines;

  var pipelines = usePipelines();
  var hiddenPipelineFilters = useMemo(function () {
    if (!hasPipelines) {
      return [];
    }

    var hiddenPipelineIds = pipelines.filter(function (pipeline) {
      return getIn(['permission', 'accessLevel'], pipeline) === HIDDEN;
    }).map(function (_ref) {
      var pipelineId = _ref.pipelineId;
      return pipelineId;
    });

    if (hiddenPipelineIds.length > 0) {
      return [{
        operator: 'NOT_IN',
        property: pipelinePropertyName,
        values: hiddenPipelineIds
      }];
    }

    return [];
  }, [hasPipelines, pipelinePropertyName, pipelines]);
  return useMemo(function () {
    if (!hasPipelines) {
      return originalQuery;
    }

    var nextQuery = update('filterGroups', function (filterGroups) {
      return filterGroups.map(function (_ref2) {
        var filters = _ref2.filters;
        return {
          filters: [].concat(_toConsumableArray(filters), _toConsumableArray(hiddenPipelineFilters))
        };
      });
    }, originalQuery);
    return nextQuery;
  }, [hasPipelines, hiddenPipelineFilters, originalQuery]);
};