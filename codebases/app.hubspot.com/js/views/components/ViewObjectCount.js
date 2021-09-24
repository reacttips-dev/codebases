'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { Set as ImmutableSet } from 'immutable';
import { useStoreDependency } from 'general-store';
import ElasticSearchStore from 'crm_data/elasticSearch/ElasticSearchStore';
import FormattedMessage from 'I18n/components/FormattedMessage';
import getIn from 'transmute/getIn';
import GridUIStore from '../../crm_ui/flux/grid/GridUIStore';
import isNumber from 'transmute/isNumber';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
import PropTypes from 'prop-types';
import SearchAPIQuery from 'crm_data/elasticSearch/api/SearchAPIQuery';
import ViewType from 'customer-data-objects-ui-components/propTypes/ViewType';
import { useSelectedObjectTypeDef } from '../../crmObjects/hooks/useSelectedObjectTypeDef';
import { getSingularForm } from '../../crmObjects/methods/getSingularForm';
import { getPluralForm } from '../../crmObjects/methods/getPluralForm';
import { getIsPortalSpecific } from '../../crmObjects/methods/getIsPortalSpecific';

var getSearchQuery = function getSearchQuery(isPipelineable, objectType, pipelineId, isCrmObject) {
  var pipelineFilter = isPipelineable && pipelineId ? [{
    property: objectType === DEAL ? 'pipeline' : 'hs_pipeline',
    operator: 'EQ',
    value: pipelineId
  }] : [];
  var queryOptions = pipelineFilter.length > 0 ? {
    filterGroups: [{
      filters: pipelineFilter
    }]
  } : {};
  return SearchAPIQuery.default(queryOptions, objectType, isCrmObject);
};

var ELASTIC_SEARCH_OPTIONS = {
  cacheTimeout: 30000
};
export var allObjectCountDep = {
  stores: [ElasticSearchStore, GridUIStore],
  deref: function deref(props) {
    var isCrmObject = props.isCrmObject,
        isPipelineable = props.isPipelineable,
        objectType = props.objectType,
        pipelineId = props.pipelineId,
        _props$shouldFetch = props.shouldFetch,
        shouldFetch = _props$shouldFetch === void 0 ? true : _props$shouldFetch;

    if (!shouldFetch) {
      return undefined;
    }

    var searchQuery = getSearchQuery(isPipelineable, objectType, pipelineId, isCrmObject);
    var searchResults = ElasticSearchStore.get({
      objectType: objectType,
      searchQuery: searchQuery,
      options: ELASTIC_SEARCH_OPTIONS
    });

    if (!searchResults) {
      return undefined;
    }

    var searchResultsCount = getIn(['total'], searchResults) || 0;
    var temporaryIds = GridUIStore.get('temporaryIds');
    var includedIds = getIn(['include'], temporaryIds) || ImmutableSet();
    var excludedIds = getIn(['exclude'], temporaryIds) || ImmutableSet();
    return searchResultsCount + includedIds.subtract(excludedIds).size;
  }
};
export var viewObjectCountDependency = {
  stores: [ElasticSearchStore, GridUIStore],
  deref: function deref(props) {
    var objectType = props.objectType,
        view = props.view;
    var searchResults = ElasticSearchStore.get({
      objectType: objectType,
      viewId: "" + view.id
    });

    if (!searchResults) {
      return undefined;
    }

    var searchResultsCount = getIn(['total'], searchResults) || 0;
    var temporaryIds = GridUIStore.get('temporaryIds');
    var includedIds = getIn(['include'], temporaryIds) || ImmutableSet();
    var excludedIds = getIn(['exclude'], temporaryIds) || ImmutableSet();
    return searchResultsCount + includedIds.subtract(excludedIds).size;
  }
};

var ViewObjectCount = function ViewObjectCount(props) {
  var compact = props.compact,
      isCrmObject = props.isCrmObject,
      isPipelineable = props.isPipelineable,
      objectType = props.objectType,
      pipelineId = props.pipelineId,
      view = props.view;
  var totalObjectCount = useStoreDependency(allObjectCountDep, {
    isCrmObject: isCrmObject,
    isPipelineable: isPipelineable,
    objectType: objectType,
    pipelineId: pipelineId,
    shouldFetch: !compact
  });
  var viewObjectCount = useStoreDependency(viewObjectCountDependency, {
    objectType: objectType,
    view: view
  });
  var readableViewObjectCount = isNumber(viewObjectCount) ? viewObjectCount : '--';
  var readableTotalObjectCount = isNumber(totalObjectCount) ? totalObjectCount : '--';
  var typeDef = useSelectedObjectTypeDef();
  var isPortalSpecific = typeDef ? getIsPortalSpecific(typeDef) : false;
  var pluralObjectName = getPluralForm(typeDef);
  var singularObjectName = getSingularForm(typeDef);
  var langToken;

  if (compact) {
    if (isPortalSpecific) {
      langToken = 'indexPage.objectCount.compactTextRecords';
    } else {
      langToken = 'indexPage.objectCount.compactText';
    }
  } else {
    langToken = 'indexPage.objectCount.text';
  }

  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: langToken,
    options: {
      count: readableViewObjectCount,
      objectName: singularObjectName,
      pluralObjectName: pluralObjectName,
      totalObjectCount: readableTotalObjectCount
    }
  });
};

ViewObjectCount.propTypes = {
  compact: PropTypes.bool.isRequired,
  isCrmObject: PropTypes.bool.isRequired,
  isPipelineable: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  view: ViewType.isRequired
};
ViewObjectCount.defaultProps = {
  compact: false
};
export default ViewObjectCount;