'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { usePipelines } from '../hooks/usePipelines';
import unescapedText from 'I18n/utils/unescapedText';
import { ALL_PIPELINES_VALUE } from '../constants/AllPipelinesValue';
import { useCurrentPipelineId } from '../hooks/useCurrentPipelineId';
import { useCurrentPipelineIdActions } from '../hooks/useCurrentPipelineIdActions';
import TooltipSelect from '../../../components/TooltipSelect';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { BOARD } from '../../views/constants/PageType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { HIDDEN } from 'crm_data/pipelinePermissions/pipelinePermissionsConstants';
import getIn from 'transmute/getIn';
import get from 'transmute/get';

var getCanAccessPipeline = function getCanAccessPipeline(pipeline) {
  return getIn(['permission', 'accessLevel'], pipeline) !== HIDDEN;
};

export var getAllPipelinesTooltipMessage = function getAllPipelinesTooltipMessage(objectTypeId) {
  switch (objectTypeId) {
    case DEAL_TYPE_ID:
      {
        return 'filterSidebar.allPipelinesDisabled.DEAL';
      }

    case TICKET_TYPE_ID:
      {
        return 'filterSidebar.allPipelinesDisabled.TICKET';
      }

    default:
      {
        return 'filterSidebar.allPipelinesDisabled.object';
      }
  }
};

var PipelineSwitcher = function PipelineSwitcher() {
  var pipelines = usePipelines();
  var currentPipelineId = useCurrentPipelineId() || ALL_PIPELINES_VALUE;
  var objectTypeId = useSelectedObjectTypeId();
  var pageType = useCurrentPageType();
  var allPipelinesOption = useMemo(function () {
    var disabled = pageType === BOARD;
    return {
      text: unescapedText('contentTopbar.allPipelinesVerbose'),
      value: ALL_PIPELINES_VALUE,
      disabled: disabled,
      tooltip: disabled && /*#__PURE__*/_jsx(FormattedMessage, {
        message: getAllPipelinesTooltipMessage(objectTypeId)
      })
    };
  }, [objectTypeId, pageType]);
  var options = useMemo(function () {
    // a non-frozen copy of the array of pipelines is required for sort
    var pipelinesCopy = _toConsumableArray(pipelines);

    return [allPipelinesOption].concat(_toConsumableArray(pipelinesCopy.sort(function (pipeline1, pipeline2) {
      var canAccessPipeline1 = getCanAccessPipeline(pipeline1);
      var canAccessPipeline2 = getCanAccessPipeline(pipeline2);

      if (!canAccessPipeline1 && canAccessPipeline2) {
        return 1;
      } else if (!canAccessPipeline2 && canAccessPipeline1) {
        return -1;
      }

      return get('displayOrder', pipeline1) - get('displayOrder', pipeline2);
    }).map(function (pipeline) {
      var canAccessPipeline = getCanAccessPipeline(pipeline);
      return {
        text: pipeline.label,
        value: pipeline.pipelineId,
        disabled: !canAccessPipeline,
        tooltip: !canAccessPipeline && /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.forbiddenPipeline"
        })
      };
    })));
  }, [allPipelinesOption, pipelines]);

  var _useCurrentPipelineId = useCurrentPipelineIdActions(),
      changePipeline = _useCurrentPipelineId.changePipeline;

  var handleChange = useCallback(function (_ref) {
    var value = _ref.target.value;
    return changePipeline(value);
  }, [changePipeline]);
  return /*#__PURE__*/_jsx(TooltipSelect, {
    "data-selenium-test": "pipelineSelector",
    className: "p-left-2",
    buttonUse: "tertiary-light",
    buttonSize: "small",
    onChange: handleChange,
    value: currentPipelineId,
    options: options
  });
};

export default PipelineSwitcher;