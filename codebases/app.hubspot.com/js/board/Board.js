'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
import { BoardItemRhumbContext } from '../crm_ui/board/BoardItemRhumbContext';
import { isLoading } from 'crm_data/flux/LoadingStatus';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { NavMarker } from 'react-rhumb';
import { stageLabelTranslator } from 'property-translator/propertyTranslator';
import { useBoardSortSettings } from '../crm_ui/board/hooks/useBoardSortSettings';
import { useStoreDependency } from 'general-store';
import DealAutomationStore from 'crm_data/dealAutomation/DealAutomationStore';
import DealBoardSearchStore from './deals/stores/DealBoardSearchStore';
import DealPipelineStore from 'crm_data/deals/DealPipelineStore';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import PipelineSearchBoardContainer from '../crm_ui/board/PipelineSearchBoardContainer';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import TicketAutomationStore from 'crm_data/ticketAutomation/TicketAutomationStore';
import TicketBoardSearchStore from './tickets/stores/TicketBoardSearchStore';
import TicketsPipelineStore from 'crm_data/tickets/TicketsPipelinesStore';
import ViewType from 'customer-data-objects-ui-components/propTypes/ViewType';
import withGateOverride from 'crm_data/gates/withGateOverride';
export var isUngatedForCSATSurveyDependency = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return withGateOverride('CRM:Board:WootricSurveyEnabled', IsUngatedStore.get('CRM:Board:WootricSurveyEnabled'));
  }
};
export var pipelineDataDependency = {
  stores: [DealPipelineStore, TicketsPipelineStore],
  deref: function deref(_ref) {
    var pipelineId = _ref.pipelineId,
        objectType = _ref.objectType;
    var PipelineStore = objectType === ObjectTypes.DEAL ? DealPipelineStore : TicketsPipelineStore;
    var pipelines = PipelineStore.get();

    if (isLoading(pipelines)) {
      return LOADING;
    }

    return pipelines.get(pipelineId);
  }
};

var Board = function Board(props) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      boardItemMounted = _useState2[0],
      setBoardItemMounted = _useState2[1];

  var isSearching = props.isSearching,
      objectType = props.objectType,
      pipelineId = props.pipelineId,
      setSearching = props.setSearching,
      view = props.view,
      onTogglePreviewSidebar = props.onTogglePreviewSidebar;
  var isUngatedForCSATSurvey = useStoreDependency(isUngatedForCSATSurveyDependency);
  var pipelineData = useStoreDependency(pipelineDataDependency, {
    pipelineId: pipelineId,
    objectType: objectType
  });
  var sortSettings = useBoardSortSettings(objectType);
  var handleBoardItemMounted = useCallback(function () {
    return setBoardItemMounted(true);
  }, []);
  var columns = useMemo(function () {
    return pipelineData && pipelineData.get('stages').sortBy(function (stage) {
      return stage.get('displayOrder');
    }).map(function (stage) {
      return stage.set('label', stageLabelTranslator({
        label: stage.get('label'),
        objectType: objectType,
        pipelineId: pipelineData.get('pipelineId'),
        stageId: stage.get('stageId')
      }));
    });
  }, [objectType, pipelineData]);
  var objectAndFilterProperty = objectType === ObjectTypes.DEAL ? 'dealstage' : 'hs_pipeline_stage';
  var SearchStore = objectType === ObjectTypes.DEAL ? DealBoardSearchStore : TicketBoardSearchStore;
  var AutomationStore = objectType === ObjectTypes.DEAL ? DealAutomationStore : TicketAutomationStore;
  var BoardContainer = useMemo(function () {
    return PipelineSearchBoardContainer(SearchStore, AutomationStore);
  }, [AutomationStore, SearchStore]);
  return /*#__PURE__*/_jsxs(BoardItemRhumbContext.Provider, {
    value: {
      onBoardItemMounted: handleBoardItemMounted
    },
    children: [boardItemMounted ? /*#__PURE__*/_jsx(NavMarker, {
      name: "BOARD_ITEM_LOADED"
    }) : null, /*#__PURE__*/_jsx(BoardContainer, {
      columns: columns,
      filterProperty: objectAndFilterProperty,
      isUngatedForCSATSurvey: isUngatedForCSATSurvey,
      isLoading: isSearching || isLoading(pipelineData),
      lookupKey: pipelineId,
      objectProperty: objectAndFilterProperty,
      objectType: objectType,
      pipelineId: pipelineId,
      RhumbMarkerColumnSuccess: /*#__PURE__*/_jsx(NavMarker, {
        name: "BOARD_COLUMN_LOADED"
      }),
      RhumbMarkerError: /*#__PURE__*/_jsx(NavMarker, {
        name: "BOARD_ERROR"
      }),
      RhumbMarkerEmpty: /*#__PURE__*/_jsx(NavMarker, {
        name: "BOARD_EMPTY_STATE"
      }),
      setSearching: setSearching,
      sortSettings: sortSettings,
      viewId: "" + view.id,
      onTogglePreviewSidebar: onTogglePreviewSidebar
    })]
  });
};

Board.propTypes = {
  isSearching: PropTypes.bool,
  objectType: ObjectTypesType.isRequired,
  onTogglePreviewSidebar: PropTypes.func.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSearching: PropTypes.func,
  view: ViewType.isRequired
};
export default Board;