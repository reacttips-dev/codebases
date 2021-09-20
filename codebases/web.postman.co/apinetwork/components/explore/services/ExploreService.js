/* eslint-disable lodash/prefer-lodash-chain */
import DateHelper from '@postman/date-helper';
import util from '../../../utils/explore-utils';
import number from '../../../utils/number';
import AnalyticsService from '../../../../js/modules/services/AnalyticsService';
import NavigationService from '../../../../js/services/NavigationService';
import { OPEN_WORKSPACE_IDENTIFIER, OPEN_WORKSPACE_PUBLIC_ALIAS_IDENTIFIER } from '../../../../collaboration/navigation/constants';
import PostmanGatewayService from '../../../../js/utils/PostmanGatewayService';
import {
  OPEN_EXPLORE_VIEW_APINETWORK_ENTITY_IDENTIFIER,
  OPEN_EXPLORE_CURATED_LIST_IDENTIFIER,
  OPEN_EXPLORE_VIEW_ALL_WORKSPACES_WITH_CATEGORY_IDENTIFIER
} from '../../../navigation/constants';
import { PUBLIC_PROFILE_PAGE } from '../../../../team/constants';
import HttpService from '../../../../js/utils/HttpService';

const TEAM = 'team',
  WORKSPACE = 'workspace',
  API = 'api',
  COLLECTION = 'collection',
  PREVIEW_DISPLAY_LIMIT = 3,
  REFERRER = 'explore';

/**
 * This is for desktop apps. We make a request to API Network UI Service which returns the full URL to redirect
 *
 */
function fetchRedirectUrlAndTransition (url, entityType) {
  HttpService
    .request(`${url}&json=true`)
    .then((response) => {
      const redirectTo = _.get(response, ['body', 'url']);

      if (!redirectTo) {
        return;
      }

      NavigationService.openURL(redirectTo);
    })
    .catch((err) => {
      pm.toasts.error(`This ${entityType} is not accessible anymore`);

      pm.logger.error('ExploreService~fetchRedirectUrlAndTransition', err);
    });
}

/**
 * Handles redirect based on type and entity id passed
 */
function handleRedirect (type, options = {}, event) {
  const POSTMAN_EXPLORE_URL = pm.config && pm.config.get('__WP_EXPLORE_URL__');

  if (window.SDK_PLATFORM !== 'browser') {
    event && event.preventDefault();

    switch (type) {
      case API: {
        const url = `${POSTMAN_EXPLORE_URL}/v1/backend/redirect?type=api&id=${options.id}&entityId=${options.entityId}&publisherType=${options.publisherType}&publisherId=${options.publisherId}`;

        fetchRedirectUrlAndTransition(url, 'API');
        break;
      }
      case COLLECTION: {
        if (options.collectionType === 'apinetwork') {
          return NavigationService.transitionTo(OPEN_EXPLORE_VIEW_APINETWORK_ENTITY_IDENTIFIER, {
            id: options.id,
            slug: options.slug
          });
        }

        const url = `${POSTMAN_EXPLORE_URL}/v1/backend/redirect?type=collection&id=${options.id}&entityId=${options.entityId}&publisherType=${options.publisherType}&publisherId=${options.publisherId}`;

        fetchRedirectUrlAndTransition(url, COLLECTION);
        break;
      }
      case WORKSPACE:
        return NavigationService.transitionTo(OPEN_WORKSPACE_IDENTIFIER, {
          wid: options.id,
          publicHandle: options.publicHandle
        }, null, null, null, OPEN_WORKSPACE_PUBLIC_ALIAS_IDENTIFIER);
      case TEAM:
        return NavigationService.transitionTo(PUBLIC_PROFILE_PAGE, {
          publicProfileHandle: options.publicHandle
        });
      default: return;
    }
  }

  return;
}

/**
 * Returns the data required for Link component's `to` property
 */
function getLinkComponentData (type, options = {}) {
  if (window.SDK_PLATFORM !== 'browser') {
    return undefined;
  }

  switch (type) {
    case API:
      return `${window.postman_explore_url}/v1/backend/redirect?type=api&id=${options.id}&entityId=${options.entityId}&publisherType=${options.publisherType}&publisherId=${options.publisherId}`;
    case COLLECTION:
      return `${window.postman_explore_url}/v1/backend/redirect?type=collection&id=${options.id}&entityId=${options.entityId}&publisherType=${options.publisherType}&publisherId=${options.publisherId}`;
    case WORKSPACE:
      return {
        routeIdentifier: OPEN_WORKSPACE_IDENTIFIER,
        routeParams: { wid: options.id, publicHandle: options.publicHandle }
      };
    case TEAM:
      return `${window.postman_explore_url}/${options.publicHandle}`;
    default: return;
  }
}

/**
 * Fetches network entities based on type, entity type and limit
 *
 * @param {*} options Meta information
 */
async function fetchNetworkEntities (options) {
  const qs = {
      limit: options.limit,
      type: options.type,
      referrer: REFERRER,
      entityType: options.entityType,
      ...(options.category ? { category: options.category } : {}),
      ...(options.sort ? { sort: options.sort } : {}),
      ...(options.offset ? { offset: options.offset } : {})
    },
    response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service: 'publishing',
        method: 'get',
        path: `/v1/api/networkentity${util.getQueryParamString(qs)}`
      })
    });

  return response || [];
}

/**
 * Fetches public teams
 *
 * @param {*} options Meta information
 */
async function fetchTeams (options) {
  const qs = {
      limit: options.limit,
      referrer: REFERRER,
      ...(options.category ? { category: options.category } : {}),
      ...(options.sort ? { sort: options.sort } : {}),
      ...(options.offset ? { offset: options.offset } : {})
    },
    response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service: 'publishing',
        method: 'get',
        path: `/v1/api/team${util.getQueryParamString(qs)}`
      })
    });

  return response || [];
}

/**
 * Fetches trending entities
 *
 * @param {*} options Meta information
 */
async function fetchHomePageList (options) {
  const qs = {
      referrer: REFERRER
    },
    response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service: 'publishing',
        method: 'get',
        path: `/v1/api/curated-list/home${util.getQueryParamString(qs)}`
      })
    });

  return response || [];
}

/**
 * Fetches curated list
 *
 * @param {*} options Meta information
 */
 async function fetchCuratedList (options) {
  const qs = {
      limit: options.limit,
      referrer: REFERRER,
      ...(options.category ? { category: options.category } : {}),
      ...(options.sort ? { sort: options.sort } : {}),
      ...(options.offset ? { offset: options.offset } : {})
    },
    response = await PostmanGatewayService.request('/ws/proxy', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service: 'publishing',
        method: 'get',
        path: `/v1/api/curated-list/${options.slug}${util.getQueryParamString(qs)}`
      })
    });

  return response || [];
}

/**
 * Fetches required entities for displaying on the home page
 *
 */
async function fetchHomePageEntities () {
  const homePageEntities = await Promise.all([
      fetchTeams({ limit: 6 }),
      fetchCategories({ type: WORKSPACE }),
      fetchHomePageList()
    ]),
    teams = _.get(homePageEntities, '0.data', []).map((entity, index) => {
      return {
        name: entity.publicName,
        publisher: entity,
        id: entity.id,
        summary: entity.description,
        linkData: getLinkComponentData(TEAM, { publicHandle: entity.publicHandle }),
        onClick: (traceId, label, event) => {
          AnalyticsService.addEventV2AndPublish({
            category: 'explore',
            action: 'click',
            entityId: entity.id,
            entityType: 'team',
            label: label,
            traceId: traceId,
            value: index
          });

          return handleRedirect(TEAM, { publicHandle: entity.publicHandle }, event);
        },
        tags: entity.tags,
        metrics: [
          {
            metricName: 'Views',
            metricValue: entity.metrics && entity.metrics[0] && _.get(entity, 'metrics[0].viewCount', 0)
          },
          {
            metricName: 'Collections',
            metricValue: entity.metrics && entity.metrics[0] &&
            _.get(entity, 'metrics[0].templateCount', 0) + _.get(entity, 'metrics[0].apinetworkentityCount', 0)
          }
        ]
      };
    }),
    workspaceCategories = _.get(homePageEntities, '1', []).map((entity, index) => {
      return {
        name: entity.name,
        count: entity.count,
        id: entity.id,
        onClick: () => {
          NavigationService.transitionTo(OPEN_EXPLORE_VIEW_ALL_WORKSPACES_WITH_CATEGORY_IDENTIFIER, {
            type: 'workspace',
            id: entity.id
          });
        }
      };
    }),
    homePageList = _.reduce(_.get(homePageEntities, '2.data', []), (result, list) => {
      const isCardView = _.find(list.tags, { 'slug': 'curatedlist-card-preview' }),
        listType = util.getCuratedListType(list.entityCounts);

      if (!isCardView) {
        const entities = util.getEntityItemsAsList(_.concat(list.entities['api'], list.entities['collection'], list.entities['workspace'])),
          items = listType === 'mixed' ? _.uniqBy(entities, (item) => item.type) : entities; // pick entity of each type in mixed entity list

        result.push({
          title: list.name,
          summary: list.summary,
          description: list.description,
          items: items,
          type: listType,
          label: list.name,
          link: util.getExploreBaseURL() + list.slug,
          onViewAll: (traceId, e) => {
            e.preventDefault();
            AnalyticsService.addEventV2AndPublish({
              category: 'explore',
              action: 'click',
              label: 'home',
              entityId: list.id,
              entityType: 'spotlight-list',
              traceId: traceId
            });
            NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
              slug: list.slug
            });
          }
        });
      }
      return result;
    }, []),
    segmentCardList = _.reduce(_.get(homePageEntities, '2.data', []), (result, list) => {
      let isCardView = _.find(list.tags, { 'slug': 'curatedlist-card-preview' });

      if (isCardView) {
        result.push({
          title: list.name,
          summary: list.summary,
          label: list.name,
          iconURL: list.iconURL,
          slug: list.slug,
          onViewCard: () => {
            NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
              slug: list.slug
            });
          }
        });
      }

      return result;
    }, []);

  return {
    teams,
    workspaceCategories,
    homePageList,
    segmentCardList
  };
}

/**
 * Fetches required entities for the Spotlight page
 */
async function fetchSpotlightPageEntities (options) {
  const spotlightPageEntities = await Promise.all([
    fetchHomePageList()
  ]),
  spotlightPageList = _.get(spotlightPageEntities, '0.data', []).map((list, index) => {
    const listType = util.getCuratedListType(list.entityCounts),
      entities = util.getEntityItemsAsList(_.concat(list.entities['api'], list.entities['collection'], list.entities['workspace'])),
      items = listType === 'mixed' ? _.uniqBy(entities, (item) => item.type) : entities; // pick entity of each type in mixed entity list

    return {
      title: list.name,
      summary: list.summary,
      description: list.description,
      type: listType,
      items: items,
      label: list.name,
      id: list.id,
      displayLimit: PREVIEW_DISPLAY_LIMIT,
      link: util.getExploreBaseURL() + list.slug,
      onViewAll: (traceId, e) => {
        e.preventDefault();
        AnalyticsService.addEventV2AndPublish({
          category: 'explore',
          action: 'click',
          label: 'spotlight',
          entityId: list.id,
          entityType: 'spotlight-list',
          traceId: traceId
        });
        NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
          slug: list.slug
        });
      }
    };
  }),
  bannerContent = {
    title: 'In the spotlight',
    summary: 'The best of APIs, collections, and workspaces handpicked by Postman.',
    description: 'We at Postman think these are the most happening, useful, and exciting resources on the Public API Network. Go on, explore workspaces that interest you, browse APIs in them, and fork collections into your own workspace to get started.',
    label: 'spotlight',
    heroImageURL: '',
    iconURL: ''
  };

  return {
    spotlightPageList,
    bannerContent
  };
}

/**
 * Fetches required entities for the Spotlight page
 */
 async function fetchCuratedListPageEntities (options) {
  const curatedListPageEntities = await Promise.all([
      fetchCuratedList(options)
    ]),
    curatedList = _.get(curatedListPageEntities, '0.data', []),
    listType = util.getCuratedListType(curatedList.entityCounts),
    curatedPageList = [],
    bannerContent = {
      title: curatedList.name,
      summary: curatedList.summary,
      description: curatedList.description,
      aboutListDescription: curatedList.longDescription,
      label: curatedList.slug,
      heroImageURL: curatedList.heroImageURL,
      iconURL: curatedList.iconURL,
      id: curatedList.id
    };

  if (listType === 'mixed') {
    const apiEntities = util.getEntityItemsAsList(_.get(curatedList.entities, 'api', [])),
      collectionEntities = util.getEntityItemsAsList(_.get(curatedList.entities, 'collection', [])),
      workspaceEntities = util.getEntityItemsAsList(_.get(curatedList.entities, 'workspace', [])),
      entitiesMap = [
        {
          title: 'Workspaces',
          summary: 'A workspace lets you browse and collaborate on public APIs, collections, environments, etc. of a creator or a team.',
          description: curatedList.description,
          iconURL: curatedList.iconURL,
          type: WORKSPACE,
          label: curatedList.name,
          items: workspaceEntities,
          displayLimit: PREVIEW_DISPLAY_LIMIT,
          id: curatedList.id,
          onViewAll: () => {
            NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
              slug: curatedList.slug
            });
          }
        },
        {
          title: 'Collections',
          summary: 'A collection lets you find related requests organized in folders, so they’re easy to run on Postman.',
          description: curatedList.description,
          iconURL: curatedList.iconURL,
          type: COLLECTION,
          label: curatedList.name,
          items: collectionEntities,
          id: curatedList.id,
          displayLimit: PREVIEW_DISPLAY_LIMIT,
          onViewAll: () => {
            NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
              slug: curatedList.slug
            });
          }
        },
        {
          title: 'APIs',
          summary: 'An API defines related collections and environments that are generated from the same schema.',
          description: curatedList.description,
          iconURL: curatedList.iconURL,
          type: API,
          label: curatedList.name,
          items: apiEntities,
          id: curatedList.id,
          displayLimit: PREVIEW_DISPLAY_LIMIT,
          onViewAll: () => {
            NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
              slug: curatedList.slug
            });
          }
        }
      ];

    curatedPageList.push(...entitiesMap);

  } else {
    const entities = util.getEntityItemsAsList(_.concat(curatedList.entities['api'], curatedList.entities['collection'], curatedList.entities['workspace']));

    curatedPageList.push({
      title: curatedList.name,
      summary: curatedList.summary,
      description: curatedList.description,
      iconURL: curatedList.iconURL,
      id: curatedList.id,
      items: entities,
      type: listType,
      label: curatedList.name,
      onViewAll: () => {
        NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
          slug: curatedList.slug
        });
      }
    });
  }

  return {
    curatedPageList,
    bannerContent
  };
}

/**
 *
 */
async function fetchDynamicNetworkEntities () {
  const homePageEntities = await Promise.all([
      fetchHomePageList()
    ]),
    dynamicNetworkEntities = _.get(homePageEntities, '0.data', []).map((list, index) => {
      return {
        label: list.name,
        key: list.slug,
        icon: '',
        id: list.id,
        onClick: (traceId, label, event) => {
          AnalyticsService.addEventV2AndPublish({
            category: 'explore',
            action: 'click',
            label: 'side-navigation',
            entityId: list.id,
            entityType: 'spotlight-list',
            traceId: traceId
          });
          NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
            slug: list.slug
          });
        }
      };
    });

  return {
    dynamicNetworkEntities
  };
}

/**
 * Fetches counts of network entities, teams, templates etc.
 *
 */
async function fetchCounts (options) {
  let countEndpoint = '/v1/api/networkentity/count';

  options.type && (countEndpoint += `?type=${options.type}`);

  const response = await PostmanGatewayService.request('/ws/proxy', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service: 'publishing',
      method: 'get',
      path: countEndpoint
    })
  });

  let modifiedResponse = {};
    modifiedResponse[API] = _.get(response, 'data.apiCount', {});
    modifiedResponse[TEAM] = _.get(response, 'data.teamCount', {});
    modifiedResponse[COLLECTION] = _.get(response, 'data.collectionCount', {});
    modifiedResponse[WORKSPACE] = _.get(response, 'data.workspaceCount', {});

  return modifiedResponse;
}

/**
 * Fetches entities based on the type passed
 *
 * @param options
 */
async function fetchEntities (options) {
  switch (options.type) {
    case WORKSPACE:
    case COLLECTION:
    case API: {
      const { data: entities, meta } = await fetchNetworkEntities({
        entityType: options.type,
        type: 'public',
        limit: options.limit,
        category: options.category,
        sort: options.sort,
        offset: options.offset
      });

      return {
        data: entities.map((entity, index) => {
          const publisherType = entity.publisherType,
            publisherId = publisherType === 'user' ? entity.publisherId : entity.publisherId.toString(),
            publisherInfo = _.find(_.get(meta, `publisherInfo.${publisherType}`, []),
              { id: publisherId }),
            updatedAt = DateHelper.getFormattedDate(entity.updatedAt);

            // set publisher publicLink
            if (publisherInfo) {
              publisherInfo.link = getLinkComponentData(TEAM, { publicHandle: _.get(publisherInfo, 'publicHandle') });
            }

          return {
            name: entity.name,
            publisher: publisherInfo,
            summary: entity.summary,
            id: entity.entityId,
            tags: entity.tags,
            publisherType,
            linkData: getLinkComponentData(options.type, {
              id: options.type === WORKSPACE ? entity.meta.slug : entity.entityId,
              entityId: entity.id,
              publisherType,
              publisherId,
              publicHandle: _.get(publisherInfo, 'publicHandle')
            }),
            onClick: (traceId, label, event) => {
              AnalyticsService.addEventV2AndPublish({
                category: 'explore',
                action: 'click',
                entityId: entity.id,
                entityType: options.type,
                label: label,
                traceId: traceId,
                value: index
              });

              return handleRedirect(options.type, {
                id: options.type === WORKSPACE ? entity.meta.slug : entity.entityId,
                entityId: entity.id,
                publisherType,
                publisherId,
                publicHandle: publisherInfo.publicHandle
              }, event);
            },
            metrics: [
              {
                metricName: util.isStandardFormat(updatedAt) ? 'Updated on' : 'Updated',
                metricValue: updatedAt
              },
              ...(options.type === WORKSPACE ?

                // Temporary condition for beta because of older entries where dependencyCount was a sum of entities
                (_.isNumber(entity.meta && entity.meta.dependencyCount) ?
                  [
                    {
                      metricName: 'APIs & Collections',
                      metricValue: entity.meta && number.convertToUserFriendlyMetric(_.get(entity, 'meta.dependencyCount', 0))
                    }
                  ] :
                  [
                    {
                      metricName: 'Collections',
                      metricValue: number.convertToUserFriendlyMetric(_.get(entity, 'meta.dependencyCount.collections', 0))
                    },
                    {
                      metricName: 'APIs',
                      metricValue: number.convertToUserFriendlyMetric(_.get(entity, 'meta.dependencyCount.apis', 0))
                    }
                  ]
                ) :
                []
              )
            ],
            performanceMetrics: [
              ...(options.type === COLLECTION ?
                [util.getMetricForKey(entity.metrics, 'Forks', 'forkCount')] : []
              ),
              ...(options.type === COLLECTION || options.type === API ?
                [util.getMetricForKey(entity.metrics, 'Watchers', 'watchCount')] : []
              ),
              util.getMetricForKey(entity.metrics, 'Views', 'viewCount')
            ]
          };
        }),
        totalCount: meta.totalCount
      };
    }
    case TEAM: {
      const { data: entities, meta = {} } = await fetchTeams({
        limit: options.limit,
        category: options.category,
        sort: options.sort,
        offset: options.offset
      });

      return {
        data: entities.map((entity, index) => {
          return {
            name: entity.publicName,
            publisher: entity,
            linkData: getLinkComponentData(TEAM, { publicHandle: _.get(entity, 'publicHandle') }),
            onClick: (traceId, label, event) => {
              AnalyticsService.addEventV2AndPublish({
                category: 'explore',
                action: 'click',
                entityId: entity.id,
                entityType: options.type,
                label: label,
                traceId: traceId,
                value: index
              });

              return handleRedirect(TEAM, { publicHandle: entity.publicHandle }, event);
            },
            id: entity.id,
            summary: entity.description,
            category: options.category,
            tags: entity.tags,
            metrics: [
              {
                metricName: 'Views',
                metricValue: entity.metrics && entity.metrics[0] && _.get(entity, 'metrics[0].viewCount', 0)
              },
              {
                metricName: 'Collections',
                metricValue: entity.metrics && entity.metrics[0] &&
                _.get(entity, 'metrics[0].templateCount', 0) + _.get(entity, 'metrics[0].apinetworkentityCount', 0)
              }
            ]
          };
        }),
        totalCount: meta.totalCount
      };
    }
    default:
      return [];
  }
}

/**
 * Fetches categories of an entity
 *
 * @param options
 */
async function fetchCategories (options) {
  const qs = {
    type: options.type,
    referrer: REFERRER
  };
  const responseBody = await PostmanGatewayService.request('/ws/proxy', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service: 'publishing',
      method: 'get',
      path: `/v1/api/category${util.getQueryParamString(qs)}`
    })
  });

  switch (options.type) {
    case API:
    case COLLECTION:
    case WORKSPACE: {
      const categories = responseBody && responseBody.data || [],
        categoryCounts = _.get(responseBody, 'meta.categoryCounts') || {};

      return categories.map((category) => {
        return {
          id: category.id,
          name: category.name,
          count: categoryCounts[category.id] || 0
        };
      });
    }
    case TEAM: {
      const categories = responseBody && responseBody.data || [],
        filteredCategories = _.filter(categories, (category) => {
          return category.type === 'apinetwork';
        });

      return filteredCategories.map((category) => {
        return {
          id: category.id,
          name: category.name,
          count: category.teamCount
        };
      });
    }
    default:
      return [];
  }
}

/**
 * Fetches API Network Entity by given id
 */
async function getAPINetworkEntityById (options) {
  const response = await PostmanGatewayService.request('/ws/proxy', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service: 'publishing',
      method: 'get',
      path: `/v1/api/apinetwork/${options.id}`
    })
  },
  {
    returnRawResponse: true
  }),
  responseBody = await response.json();


  if (_.get(response, 'status') === 404) {
    return Promise.reject(response);
  }

  return _.get(responseBody, 'data', {});
}

export {
  fetchHomePageEntities,
  fetchSpotlightPageEntities,
  fetchCuratedListPageEntities,
  fetchDynamicNetworkEntities,
  fetchCounts,
  fetchEntities,
  fetchCategories,
  getLinkComponentData,
  handleRedirect,
  getAPINetworkEntityById
};

