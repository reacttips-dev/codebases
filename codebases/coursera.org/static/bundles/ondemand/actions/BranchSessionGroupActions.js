export const selectBranch = (actionContext, branchId) => {
  actionContext.dispatch('RECEIVE_BRANCH_SELECTION', branchId);
};

export const selectSession = (actionContext, sessionId) => {
  actionContext.dispatch('RECEIVE_SESSION_SELECTION', sessionId);
};

export const selectGroup = (actionContext, groupId) => {
  actionContext.dispatch('RECEIVE_GROUP_SELECTION', groupId);
};

export const preselectedSettings = (actionContext, { branchId, sessionId, groupId }) => {
  actionContext.dispatch('RECEIVE_BRANCH_SELECTION', branchId);
  actionContext.dispatch('RECEIVE_SESSION_SELECTION', sessionId);
  actionContext.dispatch('RECEIVE_GROUP_SELECTION', groupId);
};
