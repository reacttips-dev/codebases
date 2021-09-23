'use es6';

var hasScope = function hasScope(scopes, scope) {
  return scopes && scopes.includes(scope);
};

export var hasTeamHierarchies = function hasTeamHierarchies(scopes) {
  return hasScope(scopes, 'teams-advanced-modeling-access');
};

var portalHasContentPartitioning = function portalHasContentPartitioning(scopes) {
  return hasScope(scopes, 'sales-content-partitioning');
};

var userHasContentPartitioning = function userHasContentPartitioning(scopes) {
  return hasScope(scopes, 'sales-content-team-sharing') || hasScope(scopes, 'sales-content-admin-write') || hasScope(scopes, 'super-admin');
};

export var canAssignContent = function canAssignContent(scopes) {
  return userHasContentPartitioning(scopes) && portalHasContentPartitioning(scopes);
};