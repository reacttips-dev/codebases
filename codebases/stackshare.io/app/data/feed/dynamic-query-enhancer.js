import React from 'react';
import {Query} from 'react-apollo';

import {
  TYPE_ALL,
  TYPE_USER,
  TYPE_SERVICE,
  TYPE_COMPANY,
  TYPE_PRIVATE_FEED,
  TYPE_USER_DECISION,
  TYPE_MY_DECISION,
  ITEM_TYPE_ALL,
  TYPE_ADVICE,
  TYPE_PRIVATE_ADVICE
} from './constants';
import {
  items,
  companyDecisions,
  toolDecisions,
  userDecisions,
  myDecisions,
  privateFeed
} from './queries';
import {
  dataKeyForFeedType,
  dataStackType,
  mapQueryResultToItems,
  mapQueryResultToHasNextPage,
  mapQueryResultToFetchMore,
  DECISIONS_PER_PAGE,
  isDefaultFeed
} from './utils';

const queryPropsForRoute = ({feedType, typeSlug, decisionId, itemType = ITEM_TYPE_ALL}) => {
  const variables = {feedType, typeSlug, offset: 0, itemType, limit: 25};
  switch (feedType) {
    case TYPE_ALL:
      return {
        query: items,
        variables
      };
    case TYPE_ADVICE:
      return {
        query: items,
        variables: {...variables, limit: 10}
      };
    case TYPE_PRIVATE_ADVICE:
      return {
        query: privateFeed,
        variables: {feedType: 'advice', limit: 10}
      };
    case TYPE_USER:
      return {
        query: items,
        variables
      };
    case TYPE_COMPANY:
      return {
        query: companyDecisions,
        variables: {id: typeSlug, first: DECISIONS_PER_PAGE, after: ''}
      };
    case TYPE_PRIVATE_FEED:
      return {
        query: privateFeed,
        variables: {first: DECISIONS_PER_PAGE, after: ''}
      };
    case TYPE_SERVICE:
      return {
        query: toolDecisions,
        variables: {id: typeSlug, first: DECISIONS_PER_PAGE, after: ''}
      };
    case TYPE_USER_DECISION:
      return {
        query: userDecisions,
        variables: {id: typeSlug, first: DECISIONS_PER_PAGE, after: ''},
        skip: decisionId
      };
    case TYPE_MY_DECISION:
      return {
        query: myDecisions,
        variables: {id: typeSlug, first: DECISIONS_PER_PAGE, after: ''},
        skip: decisionId
      };
    default:
      return {
        query: items,
        variables
      };
  }
};

const mapQueryResultToProps = (queryResult, routeContext) => {
  const {feedType} = routeContext;
  const dataKey = dataKeyForFeedType(feedType);
  const dataStack = dataStackType(feedType);
  const items = mapQueryResultToItems(feedType, dataKey, queryResult);
  const query = isDefaultFeed(feedType) ? 'feed' : 'user';
  return {
    items,
    itemsLoading: queryResult.loading || items === null,
    hasNextPage: mapQueryResultToHasNextPage(feedType, dataKey, queryResult),
    onFetchMore: () => mapQueryResultToFetchMore(routeContext, dataKey, queryResult, dataStack),
    reloadItems: () => {
      // Force-empty the cache for the correct query; this shows the spinner
      queryResult.updateQuery(() => ({[query]: null}));
      // Give the server worker + Stream some time to compute, then refetch the data
      setTimeout(() => queryResult.refetch(), 1000);
    }
  };
};

const withDynamicQuery = Component => {
  // eslint-disable-next-line react/prop-types, react/display-name
  return function({routeContext, ...restProps}) {
    return (
      <Query {...queryPropsForRoute(routeContext)} fetchPolicy={'cache-first'}>
        {queryResult => (
          <Component
            {...restProps}
            routeContext={routeContext}
            {...mapQueryResultToProps(queryResult, routeContext)}
          />
        )}
      </Query>
    );
  };
};

export {withDynamicQuery};
