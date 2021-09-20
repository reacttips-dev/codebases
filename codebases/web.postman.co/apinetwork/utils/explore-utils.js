import DateHelper from '@postman/date-helper';
import number from './number';
import moment from 'moment';
import { handleRedirect, getLinkComponentData } from '../components/explore/services/ExploreService';
import { OPEN_EXPLORE_HOME_IDENTIFIER } from '../navigation/constants';

const TEAM = 'team',
  API = 'api',
  COLLECTION = 'collection';

/**
 * Returns url encoded string in query param format
 */
function getQueryParamString (qs) {
  return `?${Object.keys(qs)
    .map((key) => { return `${encodeURIComponent(key)}=${encodeURIComponent(qs[key])}`; })
    .join('&')}`;
}

/**
   * Given entityCounts it return whether the list has mixed entities or one type of entity
   * @param {*} entityCounts
   * @returns string
   */
function getCuratedListType (entityCounts) {
  const isMixedEntitiesList = _.filter(Object.values(entityCounts), (count) => count > 0).length > 1;
  let listType = isMixedEntitiesList && 'mixed';

  if (!isMixedEntitiesList) {
    for (const [key, value] of Object.entries(entityCounts)) {
      if (value > 0) {
        listType = key;
      }
    }
  }

  return listType;
}

/**
   * from given entity items return as UI formatted List
   */
function getEntityItemsAsList (entities) {
  return entities.map((entity, index) => {
    // set publisher publicLink
    entity.publisherInfo.link = getLinkComponentData(TEAM, { publicHandle: _.get(entity.publisherInfo, 'publicHandle') });

    return {
      name: entity.name,
      publisher: entity.publisherInfo,
      publisherType: entity.publisherType,
      summary: entity.summary,
      id: entity.entityId,
      type: entity.entityType,
      tags: entity.tags,
      metrics: [
        {
          metricName: 'Last updated',
          metricValue: DateHelper.getFormattedDate(entity.updatedAt)
        }
      ],
      performanceMetrics: [
        ...(entity.entityType === COLLECTION ?
          [getMetricForKey(entity.metrics, 'Forks', 'forkCount')] : []
        ),
        ...(entity.entityType === COLLECTION || entity.entityType === API ?
          [getMetricForKey(entity.metrics, 'Watchers', 'watchCount')] : []
        ),
        getMetricForKey(entity.metrics, 'Views', 'viewCount')
      ],
      linkData: entity.redirectURL,
      onClick: (traceId, entityId, entityType, label, event) => {
        return handleRedirect(entity.entityType, {
          id: entity.entityId,
          entityId: entity.id,
          publisherType: entity.publisherType,
          publisherId: entity.publisherId,
          publicHandle: entity.publisherInfo.publicHandle
        }, event);
      }
    };
  });
}

/**
   * for a given key return entity metrics in UI friendly format
   * @param {*} metrics
   * @param {*} metricName
   * @param {*} metricKey
   * @returns
   */
function getMetricForKey (metrics, metricName, metricKey) {
  let metric = _.find(metrics, (metric) => {
    return metric.metricName === metricKey;
  });

  return {
    metricName,
    metricValue: number.convertToUserFriendlyMetric(metric && metric.metricValue || 0)
  };
}

/**
   * check if give date is in standard date format
   * @param {*} dateStr
   * @returns boolean
   */
function isStandardFormat (dateStr) {
  return moment(dateStr, 'D MMM, YYYY', true).isValid();
}

/**
  * Returns the base explore page url which can be used to assist for open link in new tab / window
  * for child pages of explore
*/
function getExploreBaseURL () {
  return `/${OPEN_EXPLORE_HOME_IDENTIFIER}/`;
}

const utils = {
  getQueryParamString,
  getCuratedListType,
  getEntityItemsAsList,
  isStandardFormat,
  getMetricForKey,
  getExploreBaseURL
};

export default utils;
