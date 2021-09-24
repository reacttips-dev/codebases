'use es6';

var HUBSPOT_QA = '.hubspotqa.';
export function isServiceWorker() {
  return typeof window === 'undefined';
}
export function isServiceWorkerScopeQa() {
  return isServiceWorker() && self.registration.scope.indexOf(HUBSPOT_QA) >= 0;
}