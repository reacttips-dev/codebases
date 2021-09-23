'use es6';

import ScopesContainer from 'SalesTemplateEditor/data/ScopesContainer';
import GateContainer from 'SalesTemplateEditor/data/GateContainer';

var hasScope = function hasScope(scope) {
  var scopes = ScopesContainer.get();
  return scopes && !!scopes[scope];
}; // eslint-disable-next-line no-unused-vars


var isUngated = function isUngated(gate) {
  var gates = GateContainer.get();
  return gates && !!gates[gate];
};

export var hasSalesPro = function hasSalesPro() {
  return hasScope('salesaccelerator-access') || hasScope('super-user');
};
export var hasTicketAccess = function hasTicketAccess() {
  return hasScope('tickets-access');
};
export var isSuperAdmin = function isSuperAdmin() {
  return hasScope('super-admin');
};
export var hasHigherTemplateLimit = function hasHigherTemplateLimit() {
  return hasScope('templates-read-access');
};
export var canWrite = function canWrite() {
  return hasScope('templates-limited-write-access');
};