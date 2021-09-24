'use es6';

import PortalIdParser from 'PortalIdParser';
import { COMPANY, CONTACT, DEAL, QUOTE, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
/** TODO: RELIABILITY_CLEANUP: https://git.hubteam.com/HubSpot/CRM-Issues/issues/5708
 *
 * crm-legacy-global-containersis deprecated.
 * Please use the application-specific container likely in /containers or pass in this data instead.
 */
// eslint-disable-next-line no-restricted-imports

import GlobalRouterContainer from 'crm-legacy-global-containers/GlobalRouterContainer';
import { parse, stringify } from 'hub-http/helpers/params';
import once from 'transmute/once';
import { ObjectTypesToIds, isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { getHref, getPathname, getSearch } from './windowLocationGetters';

var getRootPath = function getRootPath() {
  return "/contacts/" + PortalIdParser.get();
};

var getRootPathFromWindow = function getRootPathFromWindow() {
  var hubspotBasePathnameRegex = /^\/[\w-]+\/\d+/;
  var parts = getPathname().match(hubspotBasePathnameRegex);

  if (parts) {
    //manual override for crm-events iframe
    if (parts[0].includes('crm-events')) {
      return parts[0].replace('crm-events', 'contacts');
    }

    return parts[0];
  }

  return null;
};

var getFragmentBy = function getFragmentBy(root, href) {
  if (href === root) {
    return '/';
  }

  return href.split(root)[1];
};

var baseUrl = function baseUrl() {
  var includeBaseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  if (!includeBaseUrl) {
    return '';
  }

  return getRootPathFromWindow() || getRootPath();
};

var baseSettingsUrl = once(function () {
  return "/sales-products-settings/" + PortalIdParser.get();
});
var links = {
  toQueryString: function toQueryString(query) {
    if (query) {
      return "?" + stringify(query);
    }

    return '';
  },
  createNavigateLink: function createNavigateLink(url) {
    if (url.indexOf(baseUrl()) === 0) {
      return url.substr(baseUrl().length);
    }

    return url;
  },
  createSettingsNavigateLink: function createSettingsNavigateLink(url) {
    if (url.indexOf(baseSettingsUrl()) === 0) {
      return url.substr(baseSettingsUrl().length);
    }

    return url;
  },
  // Note - you may want to use NavigationStore instead
  getQueryParams: function getQueryParams() {
    return parse(getSearch().substring(1));
  },
  setQueryParam: function setQueryParam(_ref) {
    var queryString = _ref.queryString,
        _ref$navigationOption = _ref.navigationOptions,
        navigationOptions = _ref$navigationOption === void 0 ? {
      trigger: true
    } : _ref$navigationOption,
        _navigate = _ref._navigate;
    var url = getFragmentBy(getRootPathFromWindow(), getHref().split('?')[0]);

    if (queryString) {
      url = url + queryString;
    }

    var navigate = _navigate;

    if (!navigate) {
      navigate = GlobalRouterContainer.getContainer(true).get().navigate;
    }

    return navigate(url, navigationOptions);
  },
  updateQueryParams: function updateQueryParams(_ref2) {
    var params = _ref2.params,
        navigationOptions = _ref2.navigationOptions,
        _navigate = _ref2._navigate;
    var oldParams = this.getQueryParams();
    var newParams = this.toQueryString(Object.assign({}, oldParams, {}, params));
    var navigate = _navigate;

    if (!navigate) {
      navigate = GlobalRouterContainer.getContainer(true).get().navigate;
    }

    this.setQueryParam({
      queryString: newParams,
      navigationOptions: navigationOptions,
      navigate: navigate
    });
  },
  getRootPath: getRootPath,
  getRootPathFromWindow: getRootPathFromWindow,
  fromObjectTypeAndId: function fromObjectTypeAndId(objectType, subjectId, includeBaseUrl) {
    switch (objectType) {
      case COMPANY:
        return links.company(subjectId, includeBaseUrl);

      case CONTACT:
        return links.contact(subjectId, null, includeBaseUrl);

      case DEAL:
        return links.deal(subjectId, includeBaseUrl);

      case QUOTE:
        return links.quote(subjectId, includeBaseUrl);

      case TICKET:
        return links.ticket(subjectId, includeBaseUrl);

      case VISIT:
        return null;

      default:
        return baseUrl(includeBaseUrl) + "/record/" + objectType + "/" + subjectId + "/";
    }
  },
  visualForceFromObjectTypeAndId: function visualForceFromObjectTypeAndId(objectType, subjectId) {
    switch (objectType) {
      case COMPANY:
        return "/companies/" + PortalIdParser.get() + "/company/" + subjectId + "/";

      case CONTACT:
        return "/contacts/" + PortalIdParser.get() + "/contact/" + subjectId + "/";

      case DEAL:
        return "/contacts/" + PortalIdParser.get() + "/deal/" + subjectId + "/";

      case TICKET:
        return "/contacts/" + PortalIdParser.get() + "/ticket/" + subjectId + "/";

      default:
        return null;
    }
  },
  timelineEngagement: function timelineEngagement(objectType, subjectId, engagementId) {
    var includeBaseUrl = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var query = {
      engagement: engagementId
    };
    var url = links.fromObjectTypeAndId(objectType, subjectId, includeBaseUrl);
    return "" + url + links.toQueryString(query);
  },
  restoreIndexState: function restoreIndexState(objectType, includeBaseUrl) {
    var objectTypeId = ObjectTypesToIds[objectType] || objectType;

    if (!objectTypeId) {
      return null;
    }

    return baseUrl(includeBaseUrl) + "/objects/" + encodeURIComponent(objectTypeId) + "/restore";
  },
  indexFromObjectType: function indexFromObjectType(objectType, includeBaseUrl) {
    if (isObjectTypeId(objectType)) {
      return links.indexFromObjectTypeId({
        objectTypeId: objectType,
        includeBaseUrl: includeBaseUrl
      });
    }

    switch (objectType) {
      case COMPANY:
        return baseUrl(includeBaseUrl) + "/companies/";

      case CONTACT:
        return baseUrl(includeBaseUrl) + "/contacts/";

      case DEAL:
        return baseUrl(includeBaseUrl) + "/deals/";

      case TICKET:
        return baseUrl(includeBaseUrl) + "/tickets/";

      case VISIT:
        return baseUrl(includeBaseUrl) + "/visits/";

      default:
        return null;
    }
  },
  indexFromObjectTypeId: function indexFromObjectTypeId(_ref3) {
    var objectTypeId = _ref3.objectTypeId,
        viewId = _ref3.viewId,
        pageType = _ref3.pageType,
        _ref3$includeBaseUrl = _ref3.includeBaseUrl,
        includeBaseUrl = _ref3$includeBaseUrl === void 0 ? false : _ref3$includeBaseUrl;
    var base = baseUrl(includeBaseUrl);
    var objectTypeIdPath = encodeURIComponent(objectTypeId);
    var viewIdPath = viewId ? "/views/" + encodeURIComponent(viewId) : '';
    var pageTypePath = pageType ? "/" + encodeURIComponent(pageType) : '';
    return base + "/objects/" + objectTypeIdPath + viewIdPath + pageTypePath;
  },
  contact: function contact(contactId, query, includeBaseUrl) {
    var queryString = this.toQueryString(query);
    return baseUrl(includeBaseUrl) + "/contact/" + contactId + "/" + queryString;
  },
  contactEmail: function contactEmail(email) {
    return baseUrl() + "/contact/email/" + encodeURIComponent(email);
  },
  company: function company(companyId, includeBaseUrl) {
    return baseUrl(includeBaseUrl) + "/company/" + companyId + "/";
  },
  deal: function deal(dealId, includeBaseUrl) {
    return baseUrl(includeBaseUrl) + "/deal/" + dealId + "/";
  },
  duplicatesCenter: function duplicatesCenter(objectType) {
    switch (objectType) {
      case COMPANY:
        return "/duplicates/" + PortalIdParser.get() + "/companies";

      case CONTACT:
        return "/duplicates/" + PortalIdParser.get() + "/contacts";

      default:
        return null;
    }
  },
  quote: function quote(quoteId, includeBaseUrl) {
    return baseUrl(includeBaseUrl) + "/quote/" + quoteId + "/";
  },
  ticket: function ticket(ticketId, includeBaseUrl) {
    return baseUrl(includeBaseUrl) + "/ticket/" + ticketId + "/";
  },
  ticketPipeline: function ticketPipeline(pipelineId, addAutomation) {
    return this.settings('tickets', {
      subsection: pipelineId,
      postfix: addAutomation && 'automation'
    });
  },
  dealPipeline: function dealPipeline(pipelineId, addAutomation) {
    return this.settings('deals', {
      subsection: pipelineId,
      postfix: addAutomation && 'automation'
    });
  },
  interactionType: function interactionType(objectType, objectId, _interactionType) {
    var includeBaseUrl = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var query = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var url = links.fromObjectTypeAndId(objectType, objectId, includeBaseUrl);

    if (_interactionType) {
      query.interaction = _interactionType;
    } else {
      // overide interactionType from props
      query.interaction = null;
    }

    return "" + url + links.toQueryString(query);
  },
  callSettings: function callSettings() {
    var portalId = PortalIdParser.get();
    return "/integrations/" + portalId + "/talk";
  },
  contacts: function contacts(viewId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var query = options.query;
    var url = baseUrl() + "/contacts/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    if (query != null) {
      url += links.toQueryString(query);
    }

    return url;
  },
  portalSpecificObjects: function portalSpecificObjects(objectTypeId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var query = options.query;
    var url = baseUrl() + "/objects/" + objectTypeId.replace('-', '/');

    if (query != null) {
      url += links.toQueryString(query);
    }

    return url;
  },
  allProperties: function allProperties(objectType, subjectId) {
    switch (objectType) {
      case COMPANY:
        return baseUrl() + "/company/" + subjectId + "/properties";

      case DEAL:
        return baseUrl() + "/deal/" + subjectId + "/properties";

      case CONTACT:
        return baseUrl() + "/contact/" + subjectId + "/properties";

      case TICKET:
        return baseUrl() + "/ticket/" + subjectId + "/properties";

      default:
        return baseUrl() + "/record/" + encodeURIComponent(objectType) + "/" + subjectId + "/properties";
    }
  },
  listMembership: function listMembership(contactId) {
    return baseUrl() + "/contact/" + contactId + "/list-memberships";
  },
  marketingEmail: function marketingEmail(campaignId) {
    return "/email/" + PortalIdParser.get() + "/campaign/" + campaignId;
  },
  workflows: function workflows(contactId) {
    return baseUrl() + "/contact/" + contactId + "/workflow-memberships";
  },
  workflow: function workflow(workflowId) {
    return "/workflows/" + PortalIdParser.get() + "/flow/" + workflowId;
  },
  flow: function flow(flowId) {
    return "/workflows/" + PortalIdParser.get() + "/platform/flow/" + flowId;
  },
  workflowAutomationPlatform: function workflowAutomationPlatform(workflowId, subjectId) {
    return "/workflows/" + PortalIdParser.get() + "/platform/flow/" + workflowId + "/history?objectId=" + subjectId;
  },
  workflowsPage: function workflowsPage() {
    return "/workflows/" + PortalIdParser.get() + "/";
  },
  cta: function cta(guid) {
    return "/cta/" + PortalIdParser.get() + "/" + guid;
  },
  allPropertiesHistory: function allPropertiesHistory(objectType, subjectId) {
    switch (objectType) {
      case COMPANY:
        return baseUrl() + "/company/" + subjectId + "/history";

      case DEAL:
        return baseUrl() + "/deal/" + subjectId + "/history";

      case CONTACT:
        return baseUrl() + "/contact/" + subjectId + "/history";

      case TICKET:
        return baseUrl() + "/ticket/" + subjectId + "/history";

      default:
        return baseUrl() + "/record/" + encodeURIComponent(objectType) + "/" + subjectId + "/history";
    }
  },
  propertySettings: function propertySettings(objectType) {
    var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var objectTypeId = ObjectTypesToIds[objectType] || objectType;
    return links.propertySettingsRedesign(objectTypeId, property);
  },
  propertySettingsRedesign: function propertySettingsRedesign(objectTypeId) {
    var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var propertyString = property ? "&property=" + encodeURIComponent(property) + "&action=edit" : '';
    return "/property-settings/" + PortalIdParser.get() + "/properties?type=" + encodeURIComponent(objectTypeId) + propertyString;
  },
  recyclingBin: function recyclingBin(objectType) {
    return "/recycling-bin/" + PortalIdParser.get() + "/restore/" + objectType.toLowerCase();
  },
  companies: function companies(viewId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var query = options.query;
    var url = baseUrl() + "/companies/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    if (query != null) {
      url += links.toQueryString(query);
    }

    return url;
  },
  dealsBase: function dealsBase() {
    return baseUrl() + "/deals/";
  },
  deals: function deals(viewId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var query = options.query,
        includeBaseUrl = options.includeBaseUrl;
    var url = baseUrl(includeBaseUrl) + "/deals/list/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    if (query != null) {
      url += links.toQueryString(query);
    }

    return url;
  },
  dealLineItems: function dealLineItems(dealId) {
    return "/contacts/" + PortalIdParser.get() + "/deal/" + dealId + "/line-items";
  },
  dealsBoard: function dealsBoard(viewId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var query = options.query,
        includeBaseUrl = options.includeBaseUrl;
    var url = baseUrl(includeBaseUrl) + "/deals/board/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    if (query != null) {
      url += links.toQueryString(query);
    }

    return url;
  },
  tickets: function tickets(viewId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var query = options.query,
        includeBaseUrl = options.includeBaseUrl;
    var url = baseUrl(includeBaseUrl) + "/tickets/list/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    if (query != null) {
      url += links.toQueryString(query);
    }

    return url;
  },
  subscriptions: function subscriptions() {
    return "/settings/" + PortalIdParser.get() + "/marketing/email/subscriptions";
  },
  ticketsBase: function ticketsBase() {
    return baseUrl() + "/tickets/";
  },
  ticketsBoard: function ticketsBoard(viewId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var query = options.query,
        includeBaseUrl = options.includeBaseUrl;
    var url = baseUrl(includeBaseUrl) + "/tickets/board/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    if (query != null) {
      url += links.toQueryString(query);
    }

    return url;
  },
  tasks: function tasks(viewId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var noBaseUrl = options.noBaseUrl,
        query = options.query;
    var url = '/tasks/list/';

    if (!noBaseUrl) {
      url = baseUrl() + url;
    }

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    if (query != null) {
      url += this.toQueryString(query);
    }

    return url;
  },
  tasksBoard: function tasksBoard(viewId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var noBaseUrl = options.noBaseUrl,
        query = options.query;
    var url = '/tasks/board/';

    if (!noBaseUrl) {
      url = baseUrl() + url;
    }

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    if (query != null) {
      url += this.toQueryString(query);
    }

    return url;
  },
  tasksBase: function tasksBase() {
    return baseUrl() + "/tasks/";
  },
  team: function team() {
    var extra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return "/settings/" + PortalIdParser.get() + "/users" + extra;
  },
  taskQueue: function taskQueue(_ref4) {
    var taskId = _ref4.taskId,
        _ref4$interaction = _ref4.interaction,
        interaction = _ref4$interaction === void 0 ? null : _ref4$interaction,
        _ref4$noBase = _ref4.noBase,
        noBase = _ref4$noBase === void 0 ? true : _ref4$noBase;
    var params = {
      interaction: interaction,
      taskId: taskId
    };
    return baseUrl(!noBase) + "/tasks-queue/" + links.toQueryString(params);
  },
  queueTask: function queueTask(_ref5) {
    var title = _ref5.title,
        queueId = _ref5.queueId,
        taskId = _ref5.taskId,
        nextTaskId = _ref5.nextTaskId,
        taskType = _ref5.taskType,
        noBase = _ref5.noBase,
        nextTaskOffset = _ref5.nextTaskOffset,
        _ref5$redirectUrl = _ref5.redirectUrl,
        redirectUrl = _ref5$redirectUrl === void 0 ? null : _ref5$redirectUrl;
    var params = {
      queueId: queueId,
      taskId: taskId,
      nextTaskId: nextTaskId,
      nextTaskOffset: nextTaskOffset
    };

    if (title) {
      params.title = title;
    }

    if (taskType) {
      params.interaction = taskType.toLowerCase();
    }

    if (redirectUrl) {
      params.redirectUrl = redirectUrl;
    }

    if (noBase) {
      return "/tasks-queue/" + links.toQueryString(params);
    }

    return baseUrl() + "/tasks-queue/" + links.toQueryString(params);
  },
  tasksQueue: function tasksQueue(queueId) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      noBaseUrl: true
    };
    var noBaseUrl = options.noBaseUrl;
    return links.tasks(null, {
      noBaseUrl: noBaseUrl
    }) + links.toQueryString({
      queueId: queueId
    });
  },
  templates: function templates() {
    return "/templates/" + PortalIdParser.get();
  },
  templateReports: function templateReports() {
    return "/templates/" + PortalIdParser.get() + "/reports";
  },
  reportsDasboard: function reportsDasboard() {
    return "/reports-dashboard/" + PortalIdParser.get() + "/";
  },
  listReport: function listReport(listId) {
    return "/report-builder/" + PortalIdParser.get() + "/contacts-list/" + listId;
  },
  sales_content: function sales_content(deckId) {
    var url = "/presentations/" + PortalIdParser.get() + "/";

    if (deckId) {
      url += deckId;
    }

    return url;
  },
  specificSequence: function specificSequence(sequenceId) {
    return "/sequences/" + PortalIdParser.get() + "/sequence/" + sequenceId;
  },
  sequences: function sequences() {
    return "/sequences/" + PortalIdParser.get();
  },
  signature: function signature() {
    return "/settings/" + PortalIdParser.get() + "/signature";
  },
  meetings: function meetings() {
    return "/meetings/" + PortalIdParser.get();
  },
  messages: function messages() {
    return "/live-messages/" + PortalIdParser.get();
  },
  viewChatinMessages: function viewChatinMessages(threadId) {
    return "/live-messages/" + PortalIdParser.get() + "/chat/" + threadId;
  },
  viewConversationInMessages: function viewConversationInMessages(threadId) {
    return "/live-messages/" + PortalIdParser.get() + "/chat/" + threadId;
  },
  prospects: function prospects(viewId) {
    var url = baseUrl() + "/prospects/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    return url;
  },
  visits: function visits(viewId) {
    var url = baseUrl() + "/visits/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    return url;
  },
  prospectsWithNewsEvents: function prospectsWithNewsEvents(viewId) {
    var url = baseUrl() + "/news/";

    if (viewId) {
      url += "view/" + viewId + "/";
    }

    return url;
  },
  dashboard: function dashboard(ownerIds) {
    var url = baseUrl() + "/dashboard/";

    if (ownerIds) {
      if (typeof ownerIds === 'string') {
        url += ownerIds + "/";
      } else {
        url += "?ownerId=" + ownerIds.join('&ownerId=');
      }
    }

    return url;
  },
  import: function _import() {
    return "/import/" + PortalIdParser.get();
  },
  accelerator: function accelerator(source) {
    if (source) {
      return "https://www.hubspot.com/products/sales/sales-teams?pql-source=" + source;
    }

    return 'https://www.hubspot.com/products/sales/sales-teams';
  },
  sidekickStream: function sidekickStream() {
    return "/sales-stream/" + PortalIdParser.get();
  },
  settings: function settings() {
    var section = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var subsection = options.subsection,
        query = options.query,
        postfix = options.postfix;
    var url = baseSettingsUrl();

    if (section) {
      url += "/" + encodeURIComponent(section);

      if (subsection) {
        url += "/" + encodeURIComponent(subsection);
      }
    } else {
      url += '/';
    }

    if (postfix) {
      url += "/" + encodeURIComponent(postfix);
    }

    if (query) {
      url += this.toQueryString(query);
    }

    return url;
  },
  inboxConnectSettingsRedirect: function inboxConnectSettingsRedirect(provider) {
    return links.settings('email', {
      query: {
        inboxconnected: true,
        provider: provider
      }
    });
  },
  inboxConnectContactRedirect: function inboxConnectContactRedirect(contactId) {
    return baseUrl() + "/contact/" + contactId + "/?interaction=email";
  },
  productSettings: function productSettings() {
    return "/settings/" + PortalIdParser.get() + "/products";
  },
  notificationSettings: function notificationSettings() {
    return "/sales-products-settings/" + PortalIdParser.get() + "/notifications";
  },
  accountAndBilling: function accountAndBilling() {
    return "/account-and-billing/" + PortalIdParser.get() + "/";
  },
  salesBillingManage: function salesBillingManage() {
    return links.accountAndBilling();
  },
  partnerCapacityManager: function partnerCapacityManager() {
    return "/partner-capacity/" + PortalIdParser.get() + "/domains/";
  },
  salesAnalytics: function salesAnalytics() {
    return "/analytics/" + PortalIdParser.get() + "/sales-reports/";
  },
  sequencesCrmCannotSend: function sequencesCrmCannotSend() {
    return 'https://knowledge.hubspot.com/articles/kcs_article/sequences/why-cant-i-send-a-sequence-from-the-crm';
  },
  gmailHubSpotSalesOnboarding: function gmailHubSpotSalesOnboarding(email) {
    var ref = 'INAPP_CRM';
    return "https://mail.google.com/?hubspot_sales_onboarding=" + ref + "&author=" + email;
  },
  outlookHubSpotSalesOnboarding: function outlookHubSpotSalesOnboarding(email) {
    var ref = 'INAPP_CRM';
    return "https://outlook.office365.com/?hubspot_sales_onboarding=" + ref + "&author=" + email;
  },
  outlookAddinDownload: function outlookAddinDownload() {
    return 'https://app.getsidekick.com/outlook/download';
  },
  salesNavigator: function salesNavigator(objectType, subjectId) {
    if (objectType === CONTACT) {
      return baseUrl() + "/contact/" + subjectId + "/sales-navigator";
    }

    return baseUrl() + "/company/" + subjectId + "/sales-navigator";
  },
  file: function file(fileId) {
    return "/file-preview/" + PortalIdParser.get() + "/file/" + fileId + "/";
  },
  productsLibrary: function productsLibrary() {
    return "/settings/" + PortalIdParser.get() + "/sales/products";
  },
  productsAndAddons: function productsAndAddons(source) {
    return "/browse/" + PortalIdParser.get() + "?upgradeSource=" + source;
  },
  lists: function lists(id) {
    var includeBaseUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var url = (includeBaseUrl ? baseUrl() : '') + "/lists";

    if (id) {
      url += "/" + id;
    }

    return url;
  },
  listDetails: function listDetails(id) {
    return baseUrl() + "/lists?id=" + id;
  },
  listCleanup: function listCleanup() {
    return baseUrl() + "/lists/cleanup";
  },
  cesFeedback: function cesFeedback(surveyId, submissionId) {
    return "/feedback/" + PortalIdParser.get() + "/support/" + surveyId + "/submissions/all/" + submissionId;
  },
  csatFeedback: function csatFeedback(surveyId, submissionId) {
    return "/feedback/" + PortalIdParser.get() + "/satisfaction/" + surveyId + "/submissions/all/" + submissionId;
  },
  customFeedback: function customFeedback(surveyId, submissionId) {
    return "/feedback/" + PortalIdParser.get() + "/custom/" + surveyId + "/submissions/all/" + submissionId;
  },
  mainFeedback: function mainFeedback() {
    return "/feedback/" + PortalIdParser.get();
  },
  knowledgeFeedback: function knowledgeFeedback(articleId) {
    if (articleId) {
      return "/knowledge/" + PortalIdParser.get() + "/insights/article/" + articleId + "/performance";
    }

    return "/knowledge/" + PortalIdParser.get();
  },
  npsFeedback: function npsFeedback(surveyId, submissionId) {
    return "/feedback/" + PortalIdParser.get() + "/loyalty/" + surveyId + "/submissions/all/" + submissionId;
  },
  oldLists: function oldLists(listId) {
    var url = "/lists/" + PortalIdParser.get();

    if (listId) {
      url += "/list/" + listId;
    }

    return url;
  },
  listPerformance: function listPerformance(listId) {
    return "/list-reports/" + PortalIdParser.get() + "/" + listId;
  },
  stripeIntegration: function stripeIntegration() {
    return "/ecosystem/" + PortalIdParser.get() + "/marketplace/apps/_detail/stripe";
  },
  analyticsTools: function analyticsTools() {
    return "/analytics/" + PortalIdParser.get() + "/tools";
  },
  formEditor: function formEditor(formId, redirectUrl) {
    return "/forms/" + PortalIdParser.get() + "/editor/" + formId + "/edit/form/?redirectUrl=" + redirectUrl + "&isExternalEditor=ticket";
  },
  supportFormSettings: function supportFormSettings() {
    return "/sales-products-settings/" + PortalIdParser.get() + "/supportForm";
  },
  forecast: function forecast() {
    return "/forecasting/" + PortalIdParser.get();
  }
};
export default links;