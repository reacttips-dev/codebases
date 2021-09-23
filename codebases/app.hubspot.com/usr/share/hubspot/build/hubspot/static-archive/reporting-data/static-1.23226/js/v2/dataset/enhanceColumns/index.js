'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { stringify } from 'hub-http/helpers/params';
import I18n from 'I18n';
import { List, Map as ImmutableMap } from 'immutable';
import PortalIdParser from 'PortalIdParser';
import { CONVERSATION_INBOX, CTA, FORM } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { getFilterByProperty } from '../../../config/filters/functions';
import * as ConfigTypes from '../../../constants/configTypes';
import { CRM_OBJECT_META_TYPE } from '../../../constants/crmObjectMetaTypes';
import * as DataTypes from '../../../constants/dataTypes';
import { CONVERSATIONS } from '../../../constants/dataTypes';
import { GLOBAL_NULL } from '../../../constants/defaultNullValues';
import { COUNT } from '../../../constants/metricTypes';
import { HUBSPOT_OBJECT_COORDINATES_TO_DATA_TYPE } from '../../../constants/objectCoordinates';
import { getProductLink, getProductLinkFromDataType } from '../../../lib/ProductLinkHelper';
import { generateTicketLabel } from '../../../references/ticket';
import { getIdColumnFromDataType, getIsAttributionType, LINKS_FIELD } from '../constants';
import { fromMetricKey } from '../datasetMetrics';

var prependHttp = function prependHttp(url) {
  return /^(http|\/)/.test(url) ? url : "http://" + url;
};

var getDrilldownLevel = function getDrilldownLevel(config) {
  return config.getIn(['filters', 'custom'], List()).count(function (filter) {
    return ['d1', 'd2', 'd3'].includes(filter.get('property'));
  });
};

var codeToPageType = {
  0: 'site-page',
  1: 'landing-page',
  2: 'listing-page',
  3: 'blog-post',
  4: 'knowledge-article'
};
var TICKET_LABEL_CHECK = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, DataTypes.CROSS_OBJECT, 'hs_ticket_object_id'), _defineProperty(_ImmutableMap, DataTypes.TICKETS, 'hs_ticket_id'), _ImmutableMap)); // stolen from PatternValidation https://git.hubteam.com/HubSpot/PatternValidation/blob/master/PatternValidationJS/static/js/regex/factories/UrlRegexFactory.js#L27
// eslint-disable-next-line no-useless-escape

var URL_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:(?:[^\s\?\#\/\(\)\=\:\;\@\\"\.]+)\.)+(?:[^\s\?\#\/\(\)\=\:\;\@\\"\.]+)(?:(?:(?:\/[^\s\/\#\&\?]*)+\/?)(?:(?:[%a-zA-Z0-9_-]+)(?:(?:\.[%a-zA-Z0-9-]+)[^\.\s]))?)?(?:([\?&#][^\s\?\#\&]*?=?([^\s\?\#\&]*))+)?$/i;

var isExternalPage = function isExternalPage(pageId) {
  return isNaN(pageId) && URL_REGEX.test(encodeURI(pageId));
};

export var getUrlFromDataRow = function getUrlFromDataRow(dataRow, pageId) {
  var contentType = dataRow.get(dataRow.findKey(function (val, key) {
    return key.includes('CONTENT_TYPE_CODE');
  }));
  var htmlTitle = dataRow.get(dataRow.findKey(function (val, key) {
    return key.includes('HTML_TITLE');
  }));
  var url = dataRow.get(dataRow.findKey(function (val, key) {
    return key.includes('URL');
  })) || pageId;

  if (isExternalPage(pageId)) {
    var params = stringify({
      title: htmlTitle,
      url: prependHttp(url)
    }); // TODO: remove `/-1` once pageId isn't needed in path anymore (https://git.hubteam.com/HubSpot/content-detail-ui/pull/807)

    return "/content-detail/" + PortalIdParser.get() + "/external-page/-1?" + params;
  }

  var pageType = codeToPageType[contentType];

  if (!pageType) {
    return null;
  }

  switch (pageType) {
    case 'blog-post':
    case 'site-page':
    case 'landing-page':
      return "/content-detail/" + PortalIdParser.get() + "/" + pageType + "/" + pageId;

    case 'knowledge-article':
      return "/knowledge/" + PortalIdParser.get() + "/insights/article/" + pageId;

    default:
      break;
  }

  return null;
};

var getContentTypeFromProperty = function getContentTypeFromProperty(property) {
  if (!property) {
    return null;
  }

  switch (property.get('value', property.getIn(['values', 0]))) {
    case 'BLOG_POST':
      return 'blog-post';

    case 'LANDING_PAGE':
      return 'landing-page';

    case 'STANDARD_PAGE':
      return 'site-page';

    default:
      return null;
  }
};

var getConversionEnhancementLink = function getConversionEnhancementLink(conversionType, config, id) {
  var filters = config.getIn(['filters', 'custom'], List());
  var contentTypeProperty = filters.find(function (filter) {
    return filter.get('property') === conversionType + ".referrerContentType";
  });
  var contentType = getContentTypeFromProperty(contentTypeProperty);

  if (!contentType) {
    return null;
  }

  return "/content-detail/" + PortalIdParser.get() + "/" + contentType + "/" + id + "/performance";
};

var getIsAssociationColumn = function getIsAssociationColumn(dataType, propertyName) {
  return propertyName.includes('association') || getIsAttributionType(dataType) && ['hs_contact_id', 'hs_deal_id'].includes(propertyName);
};

var addEngagementQueryParam = function addEngagementQueryParam(url, dataRow) {
  var engagementId = dataRow.get(getIdColumnFromDataType(DataTypes.ENGAGEMENT));

  if (!engagementId) {
    return url;
  }

  return url + "?engagement=" + engagementId;
};

var getDataRowId = function getDataRowId(_ref) {
  var dataType = _ref.dataType,
      propertyName = _ref.propertyName,
      referenceKey = _ref.referenceKey,
      dataRow = _ref.dataRow;

  if (['people', 'deals-influenced'].includes(propertyName)) {
    // Properties that happen in drilldowns
    return dataRow.get(propertyName);
  }

  var fallbackId = isNaN(Number(referenceKey)) && !isExternalPage(referenceKey) ? getIsAttributionType(dataType) ? referenceKey : null : referenceKey;
  return getIsAssociationColumn(dataType, propertyName) || !dataRow.get(getIdColumnFromDataType(dataType)) ? fallbackId : dataRow.get(getIdColumnFromDataType(dataType));
};

var getURL = function getURL(_ref2) {
  var dataType = _ref2.dataType,
      objectTypeId = _ref2.objectTypeId,
      property = _ref2.property,
      id = _ref2.id,
      dataRow = _ref2.dataRow,
      config = _ref2.config,
      properties = _ref2.properties,
      skipEmailURL = _ref2.skipEmailURL;

  if (property === 'people') {
    // Property that happens in drilldowns across multiple data types
    var isContact = dataRow.find(function (_, key) {
      return fromMetricKey(key).property === 'isContact';
    }, null, true);
    return isContact ? getProductLinkFromDataType(DataTypes.CONTACTS, id) : null;
  }

  if (id === GLOBAL_NULL) {
    return null;
  }

  switch (dataType) {
    case DataTypes.CROSS_OBJECT:
      switch (property) {
        case 'hs_company_object_id':
          return getProductLinkFromDataType(DataTypes.COMPANIES, dataRow.get(property));

        case 'hs_contact_object_id':
          return getProductLinkFromDataType(DataTypes.CONTACTS, dataRow.get(property));

        case 'hs_deal_object_id':
          return getProductLinkFromDataType(DataTypes.DEALS, dataRow.get(property));

        case 'hs_ticket_object_id':
          return getProductLinkFromDataType(DataTypes.TICKETS, dataRow.get(property));

        default:
          return null;
      }

    case DataTypes.CONTACTS:
      switch (property) {
        case 'vid':
        case 'hs_object_id':
          return getProductLinkFromDataType(dataType, id);

        case 'email':
          return skipEmailURL ? null : getProductLinkFromDataType(dataType, id);

        case 'company_info_domain':
          return "https://" + dataRow.get('company_info_domain');

        case 'hs_marketable_reason_id':
          return properties.getIn([property, 'references', String(dataRow.get(property)), 'link']);

        case 'hs_first_engagement_object_id':
          return dataRow.get(property) ? getProductLinkFromDataType(dataType, id) + "?engagement=" + dataRow.get(property) : null;

        default:
          return null;
      }

    case DataTypes.CONVERSATIONS:
      {
        switch (property) {
          case 'hs_object_id':
            return getProductLink(CONVERSATIONS, id);

          case 'hs_thread_id':
            return getProductLink(CONVERSATION_INBOX, id);

          default:
            return null;
        }
      }

    case DataTypes.COMPANIES:
      switch (property) {
        case 'name':
        case 'companyId':
        case 'company-id':
        case 'hs_object_id':
          return getProductLinkFromDataType(dataType, id);

        case 'cleaned_domain':
          return "https://" + dataRow.get('cleaned_domain');

        default:
          return null;
      }

    case DataTypes.CRM_OBJECT:
      switch (property) {
        case 'hs_object_id':
          return "/contacts/" + PortalIdParser.get() + "/record/" + objectTypeId + "/" + id + "/";

        default:
          return null;
      }

    case DataTypes.DEALS:
      switch (property) {
        case 'dealId':
        case 'dealname':
        case 'hs_object_id':
          return getProductLinkFromDataType(dataType, id);

        case 'associations.contact':
          return getProductLinkFromDataType(DataTypes.CONTACTS, id);

        case 'associations.company':
          return getProductLinkFromDataType(DataTypes.COMPANIES, id);

        default:
          return null;
      }

    case DataTypes.ENGAGEMENT:
      switch (property) {
        case 'associations.contact':
          return addEngagementQueryParam(getProductLinkFromDataType(DataTypes.CONTACTS, id), dataRow);

        case 'associations.deal':
          return addEngagementQueryParam(getProductLinkFromDataType(DataTypes.DEALS, id), dataRow);

        case 'associations.company':
          return addEngagementQueryParam(getProductLinkFromDataType(DataTypes.COMPANIES, id), dataRow);

        default:
          return null;
      }

    case DataTypes.TICKETS:
      switch (property) {
        case 'hs_ticket_id':
        case 'subject':
          return getProductLinkFromDataType(dataType, id);

        default:
          return null;
      }

    case DataTypes.SOCIAL_POSTS:
      switch (property) {
        case 'publishedAt':
          return getProductLinkFromDataType(dataType, dataRow.get('broadcastGuid'));

        case 'url':
          return dataRow.get('url');

        default:
          return null;
      }

    case DataTypes.ATTRIBUTION_TOUCH_POINTS:
    case DataTypes.CONTACT_CREATE_ATTRIBUTION:
    case DataTypes.DEAL_CREATE_ATTRIBUTION:
      switch (property) {
        case 'hs_cta_id':
          return getProductLink(CTA, id);

        case 'hs_form_id':
          return getProductLink(FORM, id);

        case 'hs_contact_id':
          return getProductLinkFromDataType(DataTypes.CONTACTS, id);

        case 'hs_deal_id':
          return getProductLinkFromDataType(DataTypes.DEALS, id);

        case 'hs_asset_url':
        case 'hs_asset_title':
          return dataRow.get('hs_asset_url');

        case 'hs_campaign_name':
          return getProductLink(DataTypes.ATTRIBUTION_TOUCH_POINTS, dataRow.get('hs_campaign_name'));

        case 'hs_campaign_guid':
          return getProductLink(DataTypes.CONTACT_CREATE_ATTRIBUTION, dataRow.get('hs_campaign_guid'));

        default:
          return null;
      }

    case DataTypes.ANALYTICS_BLOG_POSTS:
      switch (property) {
        case 'breakdown':
          return "/content-detail/" + PortalIdParser.get() + "/blog-post/" + id + "/performance";

        default:
          return null;
      }

    case DataTypes.ANALYTICS_CAMPAIGNS:
      switch (property) {
        case 'breakdown':
        case 'campaignId':
          if (getDrilldownLevel(config) > 0) {
            return null;
          }

          return "/campaigns/" + PortalIdParser.get() + "/" + id + "?back=" + encodeURIComponent(window.location.href);

        case 'deals-influenced':
          return "/contacts/" + PortalIdParser.get() + "/deals/" + id;

        default:
          return null;
      }

    case DataTypes.ANALYTICS_FORMS:
      switch (property) {
        case 'breakdown':
          return "/forms/" + PortalIdParser.get() + "/" + id + "/performance?";

        default:
          return null;
      }

    case DataTypes.ANALYTICS_SOURCES:
    case DataTypes.ANALYTICS_ALL_PAGES_SOURCES:
    case DataTypes.ANALYTICS_FORMS_SOURCES:
      switch (property) {
        case 'breakdown':
          if (getDrilldownLevel(config) === 2) {
            var filterProperty = getFilterByProperty(config, 'd1', ImmutableMap()).get('value');

            if (filterProperty === 'email' && id !== '2' && !isNaN(parseFloat(id)) && isFinite(id)) {
              return "/email/" + PortalIdParser.get() + "/campaign/" + id;
            }

            if (['referrals', 'direct'].includes(filterProperty)) {
              return /^https?:\/\//.test(id) ? id : "http://" + id;
            }
          }

          return null;

        default:
          return null;
      }

    case DataTypes.ANALYTICS_KNOWLEDGE_ARTICLES:
      switch (property) {
        case 'breakdown':
          return "/knowledge/" + PortalIdParser.get() + "/insights/article/" + id + "/performance";

        default:
          return null;
      }

    case DataTypes.ANALYTICS_LANDING_PAGES:
      switch (property) {
        case 'breakdown':
          return "/content-detail/" + PortalIdParser.get() + "/landing-page/" + id + "/performance";

        default:
          return null;
      }

    case DataTypes.ANALYTICS_PATHS:
      switch (property) {
        case 'pageUrl':
          return prependHttp(id);

        default:
          return null;
      }

    case DataTypes.ANALYTICS_SALES_DOCUMENTS:
      switch (property) {
        case 'breakdown':
        case 'deckId':
          return "/documents/" + PortalIdParser.get() + "/summary/" + id;

        default:
          return null;
      }

    case DataTypes.ANALYTICS_SALES_TEMPLATES:
      switch (property) {
        case 'breakdown':
        case 'templateId':
          return "/templates/" + PortalIdParser.get() + "/edit/" + id;

        default:
          return null;
      }

    case DataTypes.ANALYTICS_SEQUENCE_ENROLLMENT_ACTIVITIES:
      switch (property) {
        case 'breakdown':
        case 'sequenceId':
          return "/sequences/" + PortalIdParser.get() + "/sequence/" + id;

        default:
          return null;
      }

    case DataTypes.ANALYTICS_STANDARD_PAGES:
      switch (property) {
        case 'breakdown':
          return "/content-detail/" + PortalIdParser.get() + "/site-page/" + id + "/performance";

        default:
          return null;
      }

    case DataTypes.CONVERSION:
      switch (property) {
        case 'lastVisitInCloseSession.referrerAnalyticsPageId':
          return getConversionEnhancementLink('lastVisitInCloseSession', config, id);

        case 'lastVisitInCreateSession.referrerAnalyticsPageId':
          return getConversionEnhancementLink('lastVisitInCreateSession', config, id);

        default:
          return null;
      }

    case DataTypes.EMAIL:
      switch (property) {
        case 'id':
          return "/email/" + PortalIdParser.get() + "/details/" + id;

        case 'emailCampaign':
          return "/campaigns/" + PortalIdParser.get() + "/" + dataRow.get('emailCampaign');

        default:
          return null;
      }

    case DataTypes.ANALYTICS_ALL_PAGES_BY_COMPANY:
    case DataTypes.ANALYTICS_ALL_PAGES:
      switch (property) {
        case 'breakdown':
          if (dataType === DataTypes.ANALYTICS_ALL_PAGES_BY_COMPANY && getDrilldownLevel(config) === 0) {
            return "/contacts/" + PortalIdParser.get() + "/company/" + Number(id);
          }

          return getUrlFromDataRow(dataRow, id);

        default:
          return null;
      }

    case DataTypes.ANALYTICS_BEHAVIORAL_EVENTS:
      switch (property) {
        case 'breakdown':
          return "/events/" + PortalIdParser.get() + "/manage/" + id.replace(new RegExp("^" + CRM_OBJECT_META_TYPE.PORTAL_SPECIFIC_EVENT + "-"), '');

        default:
          return null;
      }

    case DataTypes.SEQUENCE_SENDER_SCORE:
      switch (property) {
        case 'breakdown':
          if (getDrilldownLevel(config) === 1) {
            return "/sequences/" + PortalIdParser.get() + "/sequence/" + id;
          }

          return null;

        default:
          return null;
      }

    case DataTypes.KNOWLEDGE_ARTICLES:
      switch (property) {
        case 'id':
          return "/knowledge/" + PortalIdParser.get() + "/insights/article/" + id;

        default:
          return null;
      }

    default:
      return null;
  }
};

export var enhanceColumnsV2 = function enhanceColumnsV2(config, data, properties) {
  var dataType = config.get('dataType'); // Only data types that get updated labels

  if (!TICKET_LABEL_CHECK.has(dataType) && dataType !== DataTypes.SOCIAL_POSTS) {
    return properties;
  }

  return properties.map(function (property, propertyKey) {
    return property.update('references', function (references) {
      if (!references) {
        return references;
      }

      return references.map(function (reference, referenceKey) {
        var dataRow = data.find(function (dataObj) {
          return String(dataObj.get(propertyKey)) === referenceKey || // This is for associations since it is an array, and the ids are not the same as the id of the row
          List.isList(dataObj.get(propertyKey)) && dataObj.get(propertyKey).includes(Number(referenceKey)) || String(dataObj.get(propertyKey)).includes(Number(referenceKey));
        });

        if (!dataRow) {
          return reference;
        }

        var _fromMetricKey = fromMetricKey(propertyKey),
            _fromMetricKey$proper = _fromMetricKey.property,
            propertyName = _fromMetricKey$proper === void 0 ? propertyKey : _fromMetricKey$proper,
            type = _fromMetricKey.type;

        return reference.update('label', function (label) {
          if (TICKET_LABEL_CHECK.has(dataType) && TICKET_LABEL_CHECK.get(dataType) === propertyName && type !== COUNT) {
            var id = getDataRowId({
              dataType: dataType,
              propertyName: propertyName,
              referenceKey: referenceKey,
              dataRow: dataRow
            });
            return generateTicketLabel(ImmutableMap({
              subject: label
            }), id);
          }

          if (dataType === DataTypes.SOCIAL_POSTS && propertyName === 'publishedAt') {
            var publishedAtMoment = I18n.moment(dataRow.get('publishedAt')).portalTz();
            return publishedAtMoment.format('l LT');
          }

          return label;
        });
      });
    });
  });
}; // Sets links for columns in V2 tables

export var enhanceDataV2 = function enhanceDataV2(config, data, properties) {
  var objectTypeId = config.get('objectTypeId');
  var dataType = config.get('dataType') === DataTypes.CRM_OBJECT ? HUBSPOT_OBJECT_COORDINATES_TO_DATA_TYPE.get(objectTypeId, DataTypes.CRM_OBJECT) : config.get('dataType');
  var skipEmailURL = config.get('configType') === ConfigTypes.SEARCH && config.get('metrics', List()).filter(function (metric) {
    return ['email', 'vid'].includes(metric.get('property'));
  }).size === 2;
  return data.map(function (dataRow) {
    var links = dataRow.reduce(function (acc, value, key) {
      var propertyName = fromMetricKey(key).property || key;
      var id = getDataRowId({
        dataType: dataType,
        propertyName: propertyName,
        referenceKey: value,
        dataRow: dataRow
      });
      var urlProps = {
        dataType: dataType,
        objectTypeId: objectTypeId,
        property: key,
        dataRow: dataRow,
        config: config,
        properties: properties,
        id: id,
        skipEmailURL: skipEmailURL
      };

      if (List.isList(value)) {
        // Associations
        return value.reduce(function (linkAcc, val) {
          var url = getURL(Object.assign({}, urlProps, {
            id: val
          }));
          return url && url !== GLOBAL_NULL ? linkAcc.setIn([propertyName, String(val)], url) : linkAcc;
        }, acc);
      } else if (value) {
        var url = getURL(urlProps);
        return url && url !== GLOBAL_NULL ? acc.setIn([propertyName, String(value)], url) : acc;
      }

      return acc;
    }, dataRow.has(LINKS_FIELD) ? dataRow.get(LINKS_FIELD) : ImmutableMap());
    return links.isEmpty() ? dataRow : dataRow.set(LINKS_FIELD, links);
  });
}; //{ dataType, objectTypeId, property, id, dataRow, config }

export var enhanceColumnDataset = function enhanceColumnDataset(dataset, config) {
  var updatedProperties = enhanceColumnsV2(config, dataset.get('data'), dataset.get('properties'));
  return dataset.set('properties', updatedProperties).update('data', function (data) {
    return enhanceDataV2(config, data, updatedProperties);
  });
};