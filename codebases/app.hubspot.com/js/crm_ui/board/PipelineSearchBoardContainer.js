'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'general-store';
import { Map as ImmutableMap, List } from 'immutable';
import identity from 'transmute/identity';
import ViewsStore from '../flux/views/ViewsStore';
import GridUIStore from '../flux/grid/GridUIStore';
import { transform } from '../utils/ViewToElasticSearchQuery';
import BoardContainerAsync from './BoardContainerAsync';
import { getFlowUuids } from '../utils/boardUtils';
import { isBoardRefreshPausedDep } from 'crm_data/crmSearch/BoardRefreshStore';
import { usePollInterval } from '../hooks/usePollInterval';
import { getCardPropertiesDep } from 'crm_data/cards/getCardPropertiesDep';
import { useVisibilityChange } from '../hooks/useVisibilityChange';
var POLLING_DURATION = 2 * 60 * 1000; // 2 minutes

var getSearchQuery = function getSearchQuery(objectType, viewId) {
  var sortSettings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ImmutableMap();
  var boardCardProperties = arguments.length > 3 ? arguments[3] : undefined;
  var pageSize = 25;
  var currentPage = 0;
  var query = GridUIStore.get('query');
  var viewKey = ViewsStore.getViewKey({
    viewId: viewId,
    objectType: objectType
  });
  var prevView = ViewsStore.get(viewKey);
  var view = prevView && prevView.mergeIn(['state'], sortSettings);
  var options = ImmutableMap({
    currentPage: currentPage,
    pageSize: pageSize,
    query: query,
    boardCardProperties: boardCardProperties
  });
  return view ? transform(view, objectType, options) : null;
};

export default (function (SearchStore, AutomationStore) {
  function PipelineSearchBoardContainer(props) {
    var isRefreshPaused = props.isRefreshPaused,
        lookupKey = props.lookupKey,
        objectType = props.objectType,
        sortSettings = props.sortSettings,
        viewId = props.viewId,
        boardCardProperties = props.boardCardProperties;

    var handleRefreshData = function handleRefreshData() {
      var searchQuery = getSearchQuery(objectType, viewId, sortSettings, boardCardProperties);
      var options = {
        forceFetchIfExists: true
      };
      SearchStore.get({
        lookupKey: lookupKey,
        searchQuery: searchQuery,
        viewId: viewId,
        options: options
      });
    };

    var _usePollInterval = usePollInterval(handleRefreshData, isRefreshPaused ? 0 : POLLING_DURATION),
        startPolling = _usePollInterval.startPolling,
        stopPolling = _usePollInterval.stopPolling;

    var handlePageVisible = useCallback(function () {
      startPolling(isRefreshPaused ? 0 : POLLING_DURATION);
    }, [startPolling, isRefreshPaused]);
    useVisibilityChange({
      enabled: !isRefreshPaused,
      onVisible: handlePageVisible,
      onHidden: stopPolling
    });
    return /*#__PURE__*/_jsx(BoardContainerAsync, Object.assign({}, props));
  }

  PipelineSearchBoardContainer.propTypes = {
    columns: ImmutablePropTypes.list,
    lookupKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    objectType: PropTypes.string.isRequired,
    pipelineData: ImmutablePropTypes.map,
    sortSettings: ImmutablePropTypes.map,
    viewId: PropTypes.string.isRequired,
    pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    flows: ImmutablePropTypes.map,
    isRefreshPaused: PropTypes.bool.isRequired,
    boardCardProperties: PropTypes.array.isRequired
  };
  var deps = {
    isRefreshPaused: isBoardRefreshPausedDep,
    boardCardProperties: getCardPropertiesDep,
    pipelineData: {
      stores: [GridUIStore, SearchStore, ViewsStore].concat(_toConsumableArray(getCardPropertiesDep.stores)),
      deref: function deref(props) {
        var lookupKey = props.lookupKey,
            objectType = props.objectType,
            sortSettings = props.sortSettings,
            viewId = props.viewId;
        var boardCardProperties = getCardPropertiesDep.deref({
          objectType: objectType
        });
        var searchQuery = getSearchQuery(objectType, viewId, sortSettings, boardCardProperties);
        var data = SearchStore.get({
          lookupKey: lookupKey,
          searchQuery: searchQuery,
          viewId: viewId
        });
        return data || ImmutableMap();
      }
    },
    flows: {
      stores: AutomationStore ? [GridUIStore, SearchStore, ViewsStore, AutomationStore].concat(_toConsumableArray(getCardPropertiesDep.stores)) : [],
      deref: function deref(props) {
        if (!AutomationStore) {
          return null;
        }

        var objectType = props.objectType,
            lookupKey = props.lookupKey,
            viewId = props.viewId,
            pipelineId = props.pipelineId,
            sortSettings = props.sortSettings;
        var boardCardProperties = getCardPropertiesDep.deref({
          objectType: objectType
        });
        var searchQuery = getSearchQuery(objectType, viewId, sortSettings, boardCardProperties);
        var data = SearchStore.get({
          lookupKey: lookupKey,
          searchQuery: searchQuery,
          viewId: viewId
        });
        var pipelineData = data || ImmutableMap();
        var columns = pipelineData.get('columns') && !pipelineData.has('error') ? pipelineData.get('columns') : List();
        var stageIds = columns.map(function (column) {
          return column.get('stageId');
        });
        var flowUuids = getFlowUuids(objectType, pipelineId, stageIds);
        var flows = AutomationStore.get(flowUuids);
        return flows.filter(identity).reduce(function (_flows, flow) {
          return _flows.set(flow.get('uuid'), flow);
        }, ImmutableMap());
      }
    }
  };
  return connect(deps)(PipelineSearchBoardContainer);
});