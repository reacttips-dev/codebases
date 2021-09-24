'use es6';

import { getFullUrl } from 'hubspot-url-utils';
import PortalIdParser from 'PortalIdParser';
var portalId = PortalIdParser.get();
var baseHubspotUrl = getFullUrl('app');
export var createSequence = function createSequence() {
  return baseHubspotUrl + "/sequences/" + portalId + "/sequence/new/edit";
};
export var createTemplate = function createTemplate() {
  return baseHubspotUrl + "/templates/" + portalId + "/new";
};
export var salesProUpgradePage = function salesProUpgradePage() {
  return baseHubspotUrl + "/browse/" + portalId + "/compare/sales?product=salesProfessional";
};
export var outlook365Account = function outlook365Account() {
  return 'https://products.office.com/en-us/business/office';
};
export var sequences = function sequences() {
  return baseHubspotUrl + "/sequences/" + portalId;
};
export var sequenceEditor = function sequenceEditor(sequenceId) {
  return baseHubspotUrl + "/sequences/" + portalId + "/sequence/" + sequenceId + "/edit";
};
export var documents = function documents() {
  return baseHubspotUrl + "/presentations/" + portalId;
};
export var templates = function templates() {
  return baseHubspotUrl + "/templates/" + portalId;
};
export var emailIntegrationSettings = function emailIntegrationSettings() {
  return baseHubspotUrl + "/settings/" + portalId + "/user-preferences/email";
};
export var contactProfile = function contactProfile(vid) {
  return baseHubspotUrl + "/contacts/" + portalId + "/contact/" + vid;
};
export var sequencesSettings = function sequencesSettings() {
  return baseHubspotUrl + "/settings/" + portalId + "/sales/sequences";
};
export var unsubscribeLearnMore = function unsubscribeLearnMore() {
  return 'https://knowledge.hubspot.com/articles/kcs_article/sequences/how-do-i-add-an-unsubscribe-link-to-my-sequences';
};
export var emailThreadingKB = function emailThreadingKB() {
  return 'https://knowledge.hubspot.com/articles/kcs_article/sequences/how-do-i-create-an-email-thread-with-my-sequence';
};
export var statusPage = function statusPage() {
  return 'https://status.hubspot.com';
};
export var sendLimitLearnMore = function sendLimitLearnMore() {
  return 'https://knowledge.hubspot.com/articles/kcs_article/email/why-was-my-sales-email-not-sent-due-to-a-send-limit';
};
export var cannotEnrollSequenceLearnMore = function cannotEnrollSequenceLearnMore() {
  return 'https://knowledge.hubspot.com/articles/kcs_article/sequences/why-cant-i-enroll-my-contacts-in-a-sequence';
};
export var companyProfile = function companyProfile(vid) {
  return baseHubspotUrl + "/contacts/" + portalId + "/company/" + vid;
};
export var makeUnsubscribeLink = function makeUnsubscribeLink(unsubscribeLink, email) {
  return unsubscribeLink + "&email=" + encodeURIComponent(email);
};
export var task = function task(taskId) {
  return "/contacts/" + portalId + "/tasks/list/view/all/?taskId=" + taskId;
};
export var recommendedSendTimeLearnMore = function recommendedSendTimeLearnMore() {
  return 'https://knowledge.hubspot.com/sequences/create-and-edit-sequences#settings';
};