import React from 'react';
import {
  FEED,
  TYPE_ALL,
  TYPE_USER,
  TYPE_USER_DECISION,
  TYPE_SERVICE,
  TYPE_TOOL,
  TYPE_COMPANY,
  TYPE_FUNCTION,
  TYPE_CATEGORY,
  TYPE_LAYER,
  ITEM_TYPE_ALL,
  ITEM_TYPE_DECISIONS,
  TYPENAME_FEED_ITEM,
  TYPENAME_FEED_ITEM_EDGE,
  TYPENAME_STACK_DECISION_EDGE,
  TYPE_MY_DECISION,
  TYPE_STACK_DECISION,
  TYPE_ADVICE,
  TYPE_PRIVATE_FEED,
  TYPE_PRIVATE_ADVICE
} from './constants';
import {items, userDecisions, myDecisions, companyDecisions} from './queries';
import {flattenEdges} from '../../shared/utils/graphql';

const decisionParser = /@\{(.+?)}\|(.+?):(.+?)\|/;

export const parseDecision = str => {
  const m = decisionParser.exec(str);
  return m
    ? str.slice(0, m.index) + `<b>${m[1]}</b>` + parseDecision(str.slice(m.index + m[0].length))
    : str;
};

const boldParser = /<b>(.*?)<\/b>/;

export const parseBoldTags = str => {
  return str.split(boldParser).map((item, i) => {
    return i % 2 ? <b key={`${item}-${i}`}>{item}</b> : item;
  });
};

const decisionpParserG = new RegExp(decisionParser, 'g');

export const parseDecisionTags = str => {
  let m;
  let tags = [];
  while ((m = decisionpParserG.exec(str))) {
    tags.push({id: m[3], name: m[1], type: m[2]});
  }
  return tags;
};

export const mapPropsToDecisionVariables = ({routeContext}) => ({id: routeContext.decisionId});

export const mapPropsToContextVariables = ({routeContext: {feedType, typeSlug}}) => {
  const objectType = feedType === TYPE_USER_DECISION ? TYPE_USER : feedType;
  return {objectType: objectType, objectSlug: typeSlug};
};

export const skipIfNotContextualFeed = ({routeContext: {feedType, typeSlug}}) => {
  return feedType === TYPE_ALL || (feedType === TYPE_USER && typeSlug !== '');
};

export const buildFeedPath = (feedType, typeSlug = '') =>
  `/${FEED}${feedType !== TYPE_USER ? '/' + feedType : ''}${typeSlug !== '' ? '/' + typeSlug : ''}`;

export const mapFollowedToolsToProps = data => ({
  followedTools: data.tools ? flattenEdges(data.tools, []) : null,
  refetchFollowedTools: () => data.refetch()
});

export const currentUserLoaded = (prevProps, currentProps) => {
  return (
    prevProps.currentUser &&
    prevProps.currentUser.loading &&
    currentProps.currentUser &&
    !currentProps.currentUser.loading
  );
};

export const DECISIONS_PER_PAGE = 10;

export const dataKeyForFeedType = feedType => {
  switch (feedType) {
    case TYPE_SERVICE:
      return TYPE_TOOL;
    case TYPE_USER_DECISION:
    case TYPE_MY_DECISION:
      return TYPE_USER;
    default:
      return feedType;
  }
};

export const dataStackType = feedType => {
  switch (feedType) {
    case TYPE_MY_DECISION:
      return TYPE_MY_DECISION;
    default:
      return TYPE_STACK_DECISION;
  }
};

export const isDefaultFeed = feedType => {
  const defaultTypes = [
    TYPE_ALL,
    TYPE_ADVICE,
    TYPE_PRIVATE_ADVICE,
    TYPE_USER,
    TYPE_FUNCTION,
    TYPE_CATEGORY,
    TYPE_LAYER
  ];
  return defaultTypes.includes(feedType);
};

const mapItemsToObjects = items => {
  return items.map(item => {
    return {id: item.id, object: item};
  });
};

export const mapQueryResultToItems = (feedType, key, {data}) => {
  if (isDefaultFeed(feedType)) {
    if (key === TYPE_PRIVATE_ADVICE && data && data.privateFeed) {
      return flattenEdges(data.privateFeed);
    }
    if (data && data.feed) {
      return flattenEdges(data.feed);
    }
  } else {
    if (data && data[key]) {
      let edges = data[key].myDecisions ? data[key].myDecisions : data[key].stackDecisions;
      if (key === 'privateFeed') edges = data[key];

      return mapItemsToObjects(flattenEdges(edges));
    } else {
      return null;
    }
  }
};

export const mapQueryResultToHasNextPage = (feedType, key, {data}) => {
  if (key === 'privateFeed') {
    return data && data.privateFeed ? data.privateFeed.pageInfo.hasNextPage : false;
  } else if (isDefaultFeed(feedType)) {
    return data && data.feed ? data.feed.pageInfo.hasNextPage : false;
  } else {
    if (data && data[key]) {
      const edges = data[key].myDecisions
        ? data[key].myDecisions.pageInfo.hasNextPage
        : data[key].stackDecisions.pageInfo.hasNextPage;
      return edges;
    } else {
      return null;
    }
  }
};

export const mapQueryResultToFetchMore = (
  {feedType, typeSlug},
  key,
  {data, fetchMore},
  stackType
) => {
  let variables;
  if (isDefaultFeed(feedType)) {
    variables = {offset: data.feed.edges.length};
  } else {
    variables = {
      id: typeSlug,
      first: DECISIONS_PER_PAGE,
      after:
        key === TYPE_PRIVATE_FEED
          ? data[key].pageInfo.endCursor
          : data[key][stackType].pageInfo.endCursor
    };
  }
  return fetchMore({
    variables: variables,
    updateQuery: (previousResult, {fetchMoreResult}) => {
      return updateQueryForFeedType(feedType, key, previousResult, fetchMoreResult, stackType);
    }
  });
};

const updateQueryForFeedType = (feedType, key, previousResult, fetchMoreResult, stackType) => {
  const defaultFeed = isDefaultFeed(feedType);
  let result;
  if (defaultFeed) {
    result = fetchMoreResult.feed;
  } else if (key === TYPE_PRIVATE_FEED) {
    result = fetchMoreResult[key];
  } else {
    result = fetchMoreResult[key][stackType];
  }
  const {edges, pageInfo} = result;
  if (edges.length) {
    if (defaultFeed) {
      return {
        feed: {
          __typename: previousResult.feed.__typename,
          edges: [...previousResult.feed.edges, ...edges],
          pageInfo
        }
      };
    } else if (key === TYPE_PRIVATE_FEED) {
      let newEdges = {};
      newEdges[key] = {
        __typename: previousResult[key].__typename,
        edges: [...previousResult[key].edges, ...edges],
        pageInfo
      };
      return newEdges;
    } else {
      let newEdges = {};
      newEdges[key] = {
        __typename: previousResult[key].__typename,
        [stackType]: {
          __typename: previousResult[key][stackType].__typename,
          edges: [...previousResult[key][stackType].edges, ...edges],
          pageInfo
        }
      };
      return newEdges;
    }
  } else {
    return previousResult;
  }
};

const updateFeedQuery = (store, decision, feedType, itemType) => {
  const variables = {feedType, itemType, offset: 0, typeSlug: ''};
  try {
    const data = store.readQuery({
      query: items,
      variables
    });
    data.feed.edges.unshift({
      node: {
        id: decision.id,
        object: decision,
        __typename: TYPENAME_FEED_ITEM
      },
      __typename: TYPENAME_FEED_ITEM_EDGE
    });
    store.writeQuery({
      query: items,
      variables,
      data
    });
    // Apollo-Client throws an error when attempting to read a non-existent query from the store
    // eslint-disable-next-line no-empty
  } catch (e) {}
};

const updateDecisionsQuery = (store, decision, type, query, id) => {
  const variables = {id, after: '', first: 10};
  try {
    const data = store.readQuery({
      query,
      variables
    });
    data[type].stackDecisions.edges.unshift({
      node: decision,
      __typename: TYPENAME_STACK_DECISION_EDGE
    });
    store.writeQuery({
      query,
      variables,
      data
    });
    // Apollo-Client throws an error when attempting to read a non-existent query from the store
    // eslint-disable-next-line no-empty
  } catch (e) {}
};

const updateMyDecisionsQuery = (store, decision, type, query, id) => {
  const variables = {id, after: '', first: 10};
  try {
    const data = store.readQuery({
      query,
      variables
    });
    data[type].myDecisions.edges.unshift({
      node: decision,
      __typename: TYPENAME_STACK_DECISION_EDGE
    });
    store.writeQuery({
      query,
      variables,
      data
    });
    // Apollo-Client throws an error when attempting to read a non-existent query from the store
    // eslint-disable-next-line no-empty
  } catch (e) {}
};

export const addDecisionToQueries = (store, decision) => {
  updateFeedQuery(store, decision, TYPE_USER, ITEM_TYPE_ALL);
  updateFeedQuery(store, decision, TYPE_USER, ITEM_TYPE_DECISIONS);
  updateFeedQuery(store, decision, TYPE_ALL, ITEM_TYPE_ALL);
  updateFeedQuery(store, decision, TYPE_ALL, ITEM_TYPE_DECISIONS);
  updateDecisionsQuery(store, decision, TYPE_USER, userDecisions, decision.user.username);
  updateMyDecisionsQuery(store, decision, TYPE_USER, myDecisions, decision.user.username);
  if (decision.company) {
    updateDecisionsQuery(store, decision, TYPE_COMPANY, companyDecisions, decision.company.slug);
  }
};
