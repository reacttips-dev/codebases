'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, OrderedSet } from 'immutable';
import set from 'transmute/set';
import setIn from 'transmute/setIn';
import { transform } from '../../utils/ViewToElasticSearchQuery';
import * as FilterPlaceholderResolver from 'crm_data/filters/FilterPlaceholderResolver';
import * as CRMTypes from 'crm_schema/constants/CRMTypes';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import PortalIdParser from 'PortalIdParser';
import { getAssociatedProperties } from './getAssociatedProperties';
var _excludedProperties = ['hs__multi_checkbox'];
var _includedProperties = {
  CONTACT: ['firstname', 'lastname'],
  DEAL: [],
  COMPANY: []
};

var _getContactsSearch = function _getContactsSearch(view) {
  var columns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var objectType = arguments.length > 2 ? arguments[2] : undefined;
  var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var isForInboundDbIo = arguments.length > 4 ? arguments[4] : undefined;
  var includeAdditionalEmails = arguments.length > 5 ? arguments[5] : undefined;
  var includeAdditionalDomains = arguments.length > 6 ? arguments[6] : undefined;
  var isCrmObject = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
  var hydratedQuery = arguments.length > 8 ? arguments[8] : undefined;

  if (columns) {
    columns = columns.map(function (c) {
      return c.name;
    });
  }

  var searchQuery = hydratedQuery;

  if (!hydratedQuery) {
    searchQuery = transform(view, objectType, fromJS({
      isCrmObject: isCrmObject
    })).toJS();
    searchQuery.filterGroups = searchQuery.filterGroups != null ? searchQuery.filterGroups.map(function (filterGroup) {
      filterGroup.filters = FilterPlaceholderResolver.replaceSpecialTypes(filterGroup.filters);
      return filterGroup;
    }) : undefined;
  }

  if (columns.length === 0) {
    columns = view.get('columns').map(function (column) {
      return column.get('name');
    }).toArray();
  }

  var salesViewProperties = OrderedSet([].concat(_toConsumableArray(_includedProperties[objectType] || []), _toConsumableArray(columns || []))).toArray().filter(function (p) {
    return !_excludedProperties.includes(p);
  });
  var properties = isForInboundDbIo ? [].concat(_toConsumableArray(salesViewProperties), _toConsumableArray(getAssociatedProperties(objectType))) : salesViewProperties;

  if (includeAdditionalEmails) {
    properties = [].concat(_toConsumableArray(properties), ['hs_additional_emails']);
  }

  if (includeAdditionalDomains) {
    properties = [].concat(_toConsumableArray(properties), ['hs_additional_domains']);
  } // NOTE: `inbounddb-io/export` takes a contact search query, NOT a crm search query.
  //       however, `ViewToElasticSearchQuery.transform` returns a crm search query OR
  //       a contact search query, depending on whether the object type is eligible for
  //       crm search (there is no option to force generating a contact search query
  //       explicitly).
  //       See https://hubspot.slack.com/archives/C8Q99MGF4/p1617385015150600


  searchQuery = set('properties', properties, searchQuery); // contacts search query

  if (searchQuery.requestOptions) {
    searchQuery = setIn(['requestOptions', 'properties'], properties, searchQuery);
  }

  searchQuery = set('query', query, searchQuery);
  return searchQuery;
};

var _generateTaskId = function _generateTaskId(options) {
  var exportViewTaskDescriptor = {
    format: options.format,
    objectType: options.objectType,
    viewFilters: options.view.filters.hashCode(),
    viewId: options.view.get('id'),
    viewStatePipelineId: options.view.getIn(['state', 'pipelineId']) || ''
  };

  if (options.includeAllColumns) {
    exportViewTaskDescriptor.properties = options.properties;
  } else {
    exportViewTaskDescriptor.properties = options.columns || options.view.columns.hashCode();
  }

  var viewHash = fromJS(exportViewTaskDescriptor).hashCode(); // As long as isStateDirty is false, round the timestamp to an interval so
  // that viewHash will be the same for every attempt within the time interval.

  var now = new Date();
  var timeboxUnit = 15 * 60 * 1000; // 15 minutes

  var time = options.isStateDirty ? now.getTime() : Math.floor(now / timeboxUnit) * timeboxUnit;
  var exportTaskId = ["portal" + PortalIdParser.get(), "user" + options.userId, "viewHash" + viewHash, "t" + time].join('.');
  return exportTaskId;
};

export default {
  getTaskId: function getTaskId(options) {
    return _generateTaskId(options);
  },
  formatObjectProperties: function formatObjectProperties(_ref, properties) {
    var objectType = _ref.objectType;
    return _defineProperty({}, ObjectTypesToIds[objectType] || objectType, properties);
  },
  getParams: function getParams(options) {
    return {
      portalId: PortalIdParser.get(),
      type: 'crm-view',
      format: options.format,
      email: options.email,
      userId: options.userId,
      viewName: options.view.get('name'),
      collectionType: CRMTypes.lookup[options.objectType],
      objectType: options.objectType,
      contactsSearch: _getContactsSearch(options.view, options.includeAllColumns ? options.properties : undefined, options.objectType, options.query, false)
    };
  },
  getInboundDbIoParams: function getInboundDbIoParams(options) {
    var contactsSearchMap = _getContactsSearch(options.view, options.includeAllColumns ? options.properties : undefined, options.objectType, options.query, true, options.includeAdditionalEmails, options.includeAdditionalDomains, options.isCrmObject, options.hydratedQuery);

    return {
      exportType: 'VIEW',
      exportName: options.view.get('name'),
      objectProperties: this.formatObjectProperties(options, contactsSearchMap.properties),
      contactsSearch: contactsSearchMap,
      portalId: PortalIdParser.get(),
      type: 'CRM_EXPORTS',
      format: options.format,
      email: options.email,
      userId: options.userId,
      language: options.language
    };
  }
};