'use es6';

var selectFlowsReducer = function selectFlowsReducer(state) {
  return state.flows;
};

export var selectFlowIds = function selectFlowIds(state) {
  return selectFlowsReducer(state).flowIds;
};
export var selectFlows = function selectFlows(state) {
  return selectFlowsReducer(state).flows;
};
export var selectFlowById = function selectFlowById(flowId) {
  return function (state) {
    var flows = selectFlows(state);
    return flows && flows[flowId];
  };
};