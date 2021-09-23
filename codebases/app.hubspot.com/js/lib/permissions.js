'use es6';

import GateContainer from 'SequencesUI/data/GateContainer';
import UserContainer from 'SequencesUI/data/UserContainer';

function getLocalStorage(key) {
  var item;

  try {
    item = JSON.parse(localStorage[key]);
  } catch (_unused) {// localStorage is disabled or full
  }

  return item;
}

export var isUngated = function isUngated(gate) {
  return GateContainer.get()[gate];
};
export var hasScope = function hasScope(scope) {
  return UserContainer.get().scopes.indexOf(scope) > -1;
};
export var getUserId = function getUserId() {
  return UserContainer.get().user_id;
};
export var getScopes = function getScopes() {
  return UserContainer.get().scopes;
};
export var getGates = function getGates() {
  return GateContainer.get();
};
export var hasSalesProSeat = function hasSalesProSeat() {
  return hasScope('sequences-bulk-enroll');
}; // Controlled by settings toggle

export var canUseBulkEnroll = function canUseBulkEnroll() {
  return hasScope('sequences-bulk-enroll-write');
};
export var hasSequencesAccess = function hasSequencesAccess() {
  return hasScope('sequences-read-access');
};
export var canUseEnrollments = function canUseEnrollments() {
  return hasScope('sequences-enrollments-write-access');
};
export var canWrite = function canWrite() {
  return hasScope('sequences-write-access');
};
export var canWriteTemplates = function canWriteTemplates() {
  return hasScope('templates-limited-write-access');
};

var isSuperAdmin = function isSuperAdmin() {
  return hasScope('super-admin');
};

export var canEditObjectPermissions = function canEditObjectPermissions(ownerId) {
  return isSuperAdmin() || getUserId() === ownerId;
};
export var canViewWorkflows = function canViewWorkflows() {
  return hasScope('workflows-access');
};
export var canEditWorkflows = function canEditWorkflows() {
  return hasScope('workflows-edit-team-owned');
};
export var canDeleteWorkflows = function canDeleteWorkflows() {
  return hasScope('workflows-delete-team-owned');
};
export var canEditSequencesContextualWorkflows = function canEditSequencesContextualWorkflows() {
  return canWrite() && canEditWorkflows();
};
export var canDeleteSequencesContextualWorkflows = function canDeleteSequencesContextualWorkflows() {
  return canWrite() && canDeleteWorkflows();
};
export var isUngatedForReadOnlyView = function isUngatedForReadOnlyView() {
  return isUngated('Sequences:EnrollmentsReadOnlyView') || getLocalStorage('sequencesui.isUngatedForReadOnlyView');
};
export var isUngatedForWootricSurvey = function isUngatedForWootricSurvey() {
  return isUngated('Sequences:WootricSurveyEnabled');
};
export var isUngatedForEmbeddedAutomation = function isUngatedForEmbeddedAutomation() {
  return isUngated('Sequences:EmbeddedAutomation') || getLocalStorage('sequencesui.isUngatedForEmbeddedAutomation');
};
export var isUngatedForWorkflowEnroll = function isUngatedForWorkflowEnroll() {
  return isUngated('Sequences:WorkflowEnroll');
};
export var isUngatedForSettingsTab = function isUngatedForSettingsTab() {
  return isUngated('sequences-settings-tab');
};
export var isUngatedForNewEmailPerformance = function isUngatedForNewEmailPerformance() {
  return isUngated('Sequences:NewEmailPerformance') || getLocalStorage('sequencesui.isUngatedForNewEmailPerformance');
};