import { EXPLORE_CARD_TYPES } from './ExploreCardsConstants';

import {
  getLinkComponentData,
  handleRedirect
} from '../../../../../../../../apinetwork/components/explore/services/ExploreService';
import AnalyticsService from '../../../../../../../../js/modules/services/AnalyticsService';

export const getLinkToExplore = () => {
  return window.SDK_PLATFORM === 'browser' ? window.postman_explore_redirect_url : '';
};

const getPublisherDetails = (popularEntities, { id, type }, traceId) => {
  const publisherId = type === 'user' ? id : id.toString(),
    publisherDetails = _.find(_.get(popularEntities, `meta.publisherInfo.${type}`), {
      id: publisherId
    });

  return {
    publisherId: publisherId,
    publisherType: type,
    publisherName: _.get(publisherDetails, 'name'),
    publisherPicUrl: _.get(publisherDetails, 'profileURL'),
    publisherLinkData: getLinkComponentData('team', { publicHandle: publisherDetails.publicHandle }),
    onPublisherLinkClick: (e) => {
      e && e.stopPropagation();
      AnalyticsService.addEventV2AndPublish({
        category: 'home',
        action: 'click',
        label: 'trending-home',
        value: 1,
        traceId
      });

      publisherDetails.publicHandle && handleRedirect('team', { publicHandle: publisherDetails.publicHandle }, e);
    }
  };
};

const getMeta = (entity, type) => {
  const metrics = _.get(entity, 'metrics');
  switch (type) {
    case EXPLORE_CARD_TYPES.API: {
      return {
        views: _.get(_.find(metrics, { metricName: 'viewCount' }), 'metricValue'),
        type: _.get(entity, 'meta.schema.type'),
        format: _.get(entity, 'meta.schema.language')
      };
    }
    case EXPLORE_CARD_TYPES.WORKSPACE: {
      return {
        views: _.get(_.find(metrics, { metricName: 'viewCount' }), 'metricValue'),
        collectionCount: _.get(entity, 'meta.dependencyCount.collections'),
        apiCount: _.get(entity, 'meta.dependencyCount.apis')
      };
    }
    case EXPLORE_CARD_TYPES.COLLECTION: {
      return {
        views: _.get(_.find(metrics, { metricName: 'viewCount' }), 'metricValue'),
        forks: _.get(_.find(metrics, { metricName: 'forkCount' }), 'metricValue')
      };
    }
  }
};

const getLinkData = (entity, entityMeta, type) => {
  const publisherType = entity.publisherType,
    publisherId = publisherType === 'user' ? entity.publisherId : entity.publisherId.toString(),
    publisherInfo = _.find(_.get(entityMeta, `publisherInfo.${publisherType}`, []), { id: publisherId });

  switch (type) {
    case EXPLORE_CARD_TYPES.API: {
      return {
        linkData: getLinkComponentData(EXPLORE_CARD_TYPES.API, {
          id: entity.entityId,
          entityId: entity.id,
          publisherType,
          publisherId,
          publicHandle: publisherInfo.publicHandle
        }),
        onClick: (event) => {
          return handleRedirect(
            EXPLORE_CARD_TYPES.API,
            {
              id: entity.entityId,
              entityId: entity.id,
              publisherType,
              publisherId,
              publicHandle: publisherInfo.publicHandle
            },
            event
          );
        }
      };
    }
    case EXPLORE_CARD_TYPES.WORKSPACE: {
      return {
        linkData: getLinkComponentData(EXPLORE_CARD_TYPES.WORKSPACE, {
          id: entity.meta && entity.meta.slug,
          publicHandle: publisherInfo.publicHandle
        }),
        onClick: (event) => {
          return handleRedirect(
            EXPLORE_CARD_TYPES.WORKSPACE,
            { id: entity.meta && entity.meta.slug, publicHandle: publisherInfo.publicHandle },
            event
          );
        }
      };
    }
    case EXPLORE_CARD_TYPES.COLLECTION: {
      return {
        linkData: getLinkComponentData(EXPLORE_CARD_TYPES.COLLECTION, {
          id: entity.entityId,
          entityId: entity.id,
          publisherType,
          publisherId,
          publicHandle: publisherInfo.publicHandle
        }),
        onClick: (event) => {
          return handleRedirect(
            EXPLORE_CARD_TYPES.COLLECTION,
            {
              id: entity.entityId,
              entityId: entity.id,
              publisherType,
              publisherId,
              publicHandle: publisherInfo.publicHandle
            },
            event
          );
        }
      };
    }
  }
};

export const transformPopularEntitiesResponse = (popularEntities, traceId) => {
  try {
    return _.transform(
      popularEntities.data,
      (acc, entity) => {
        acc.push({
          id: _.get(entity, 'entityId'),
          type: _.get(entity, 'entityType'),
          title: _.get(entity, 'name'),
          description: _.get(entity, 'summary'),
          ...getPublisherDetails(popularEntities, {
            id: _.get(entity, 'publisherId'),
            type: _.get(entity, 'publisherType')
          }, traceId),
          meta: { ...getMeta(entity, _.get(entity, 'entityType')) },
          ...getLinkData(entity, popularEntities.meta, _.get(entity, 'entityType'))
        });
      },
      []
    );
  } catch (e) {
    return [];
  }
};
