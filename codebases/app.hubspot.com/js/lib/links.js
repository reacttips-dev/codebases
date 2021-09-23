'use es6';

import PortalIdParser from 'PortalIdParser';
import * as SequenceSummaryTabNames from 'SequencesUI/constants/SequenceSummaryTabNames';
var portalId = PortalIdParser.get();
export var crmContactProfile = function crmContactProfile(vid) {
  return "/contacts/" + portalId + "/contact/" + vid;
};
export var crmContactEmail = function crmContactEmail(vid) {
  return "/contacts/" + portalId + "/contact/" + vid + "/?interaction=email";
};
export var crmContactCall = function crmContactCall(vid) {
  return "/contacts/" + portalId + "/contact/" + vid + "/?interaction=call";
};
export var crmContactTask = function crmContactTask(vid) {
  return "/contacts/" + portalId + "/contact/" + vid + "/?interaction=task";
};
export var crmCompany = function crmCompany(id) {
  return id ? "/contacts/" + portalId + "/company/" + id : null;
};
export var getWorkflowUrl = function getWorkflowUrl(workflowId) {
  return "/workflows/" + portalId + "/platform/flow/" + workflowId + "/edit";
};
export var getTemplateUrl = function getTemplateUrl(templateId) {
  return "/templates/" + portalId + "/edit/" + templateId;
};
export var index = function index() {
  return '/';
};
export var edit = function edit(id) {
  return "/sequence/" + id + "/edit";
};
export var summary = function summary(id) {
  return "/sequence/" + id;
};
export var enrollments = function enrollments(id) {
  return "/sequence/" + id + "/enrollments";
};
export var settings = function settings(id) {
  return "/sequence/" + id + "/settings";
};
export var overview = function overview() {
  return '/overview';
};
export var reenroll = function reenroll() {
  return '/reenroll';
};
export var summaryTab = function summaryTab(_ref) {
  var id = _ref.id,
      tabName = _ref.tabName;
  var originBase = "/" + tabName;

  if (tabName === SequenceSummaryTabNames.PERFORMANCE) {
    // Performance tab is hosted at root
    originBase = '';
  }

  return "/sequence/" + id + originBase;
};
export var enroll = function enroll(_ref2) {
  var id = _ref2.id,
      contactSelection = _ref2.contactSelection,
      _ref2$originTab = _ref2.originTab,
      originTab = _ref2$originTab === void 0 ? SequenceSummaryTabNames.PERFORMANCE : _ref2$originTab;
  var base = summaryTab({
    id: id,
    tabName: originTab
  });

  if (!contactSelection) {
    return base + "/enroll";
  }

  return base + "/enroll?contactSelection=" + contactSelection;
};
export var leaveEnroll = function leaveEnroll(pathname) {
  return pathname.replace(/\/enroll\/?$/, '');
};
export var create = function create() {
  var fromOnboarding = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var query = fromOnboarding ? '?onboarding=true' : '';
  return "/create" + query;
};
export var connectInbox = function connectInbox() {
  return "/settings/" + portalId + "/user-preferences/email";
};
export var sequenceSummary = function sequenceSummary(id) {
  return "/sequences/" + portalId + "/sequence/" + id;
};
export var emailThreadingKB = function emailThreadingKB() {
  return 'https://knowledge.hubspot.com/articles/kcs_article/sequences/how-do-i-create-an-email-thread-with-my-sequence';
};
export var unenrollContactKB = function unenrollContactKB() {
  return 'https://knowledge.hubspot.com/articles/kcs_article/sequences/unenroll-from-sequence';
};
export var proTipGmail = function proTipGmail() {
  return 'https://chrome.google.com/webstore/detail/hubspot-email-tracking-sa/oiiaigjnkhngdbnoookogelabohpglmd?hl=en';
};
export var proTipOutlook = function proTipOutlook() {
  return 'https://knowledge.hubspot.com/settings/how-to-install-hubspot-sales#install-the-hubspot-sales-outlook-desktop-add-in';
};
export var proTipOffice365 = function proTipOffice365() {
  return 'https://appsource.microsoft.com/en-us/product/office/WA104381257?__hssc=20629287.2.1571936994719&__hstc=20629287.e0e5294c93c95cdbae6a80f85ae6020f.1543937791599.1571934288389.1571936994719.124&__hsfp=293093330&hsCtaTracking=2fd2a899-a0c4-4629-a3ad-4dc6fce65e86%7Cd8a97e04-cb5b-4c38-87ad-6dd056511393';
};
export var proTipLearnMore = function proTipLearnMore() {
  return 'https://knowledge.hubspot.com/settings/how-to-install-hubspot-sales';
};
export var sequencesLearnMore = function sequencesLearnMore() {
  return 'https://knowledge.hubspot.com/articles/kcs_article/sequences/use-sequences';
};
export var statusPage = function statusPage() {
  return 'https://status.hubspot.com';
};
export var task = function task(taskId, ownerId) {
  var query = "?taskId=" + taskId + "&ownerId=" + ownerId;
  return "/contacts/" + portalId + "/tasks/list/view/all/" + query;
};
export var microsoftDateTimeSettings = function microsoftDateTimeSettings() {
  return 'https://support.microsoft.com/en-us/help/4026213/windows-how-to-set-your-time-and-time-zone';
};
export var appleDateTimeSettings = function appleDateTimeSettings() {
  return 'https://support.apple.com/en-us/HT203413';
};
export var sendTimeLearnMoreKBLink = function sendTimeLearnMoreKBLink() {
  return 'https://knowledge.hubspot.com/sequences/create-and-edit-sequences#settings';
};