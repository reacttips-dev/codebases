import React, {Fragment, useState, useContext, useEffect} from 'react';
import {defaultDataIdFromObject} from 'apollo-cache-inmemory';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {flattenEdges} from '../../../utils/graphql';
import {ASH, WHITE, GUNSMOKE, CHARCOAL} from '../../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import PostCard from './';
import Gutter from './gutter';
import {ApolloContext} from '../../../enhancers/graphql-enhancer';
import {answersQuery} from '../../../../data/feed/queries';
import {adviceAnswers} from '../../../../data/shared/fragments';
import {PHONE} from '../../../style/breakpoints';
import {trackViews} from '../../../../data/shared/mutations.js';
import {callTrackViews} from '../../../../../app/shared/utils/trackViews.js';

const Toggle = glamorous.div({
  ...BASE_TEXT,
  color: CHARCOAL,
  backgroundColor: WHITE,
  border: `1px solid ${GUNSMOKE}`,
  padding: '3px 7px 3px 7px',
  borderRadius: 100,
  marginTop: 12,
  width: 115,
  textAlign: 'center',
  cursor: 'pointer',
  letterSpacing: 0.4,
  alignSelf: 'center'
});

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: WHITE,
  border: `1px solid ${ASH}`,
  borderBottom: 0,
  padding: 10,
  paddingTop: 26,
  paddingBottom: 30,
  [PHONE]: {
    padding: 8
  },
  ' > div': {
    [PHONE]: {
      width: '100%'
    },
    ' > article ': {
      width: '100%',
      flexGrow: 1,
      marginBottom: 20,
      marginRight: 0,
      border: `1px solid ${ASH}`,
      borderBottom: 0,
      boxShadow: '0 2px 6px 0 rgba(227, 227, 227, 0.5)'
    }
  },
  ' > div:last-of-type': {
    ' > article': {
      marginBottom: 0
    }
  }
});

const Count = glamorous.div({
  ...BASE_TEXT,
  fontWeight: WEIGHT.BOLD,
  fontSize: 14,
  color: CHARCOAL,
  letterSpacing: 0.23,
  marginLeft: 14,
  marginBottom: 10,
  ' > span': {
    fontWeight: WEIGHT.NORMAL
  }
});

const PostCardWrapper = glamorous.div({
  display: 'flex'
});

const DEFAULT_DISPLAY_COUNT = 2;

const Answers = ({
  itemsData,
  parentId,
  newAnswer,
  child = null,
  onPermalink = false,
  lazyLoadImages = true
}) => {
  const client = useContext(ApolloContext);
  const {pageInfo, count: initialCount} = itemsData;
  const [createdItemCount, setCreatedItemCount] = useState(0);
  const [deletedItemCount, setDeletedItemCount] = useState(0);
  const items = flattenEdges(itemsData);
  const [hasNextPage, setHasNextPage] = useState(pageInfo.hasNextPage);
  const [viewAll, setViewAll] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    if (newAnswer) {
      const dataId = defaultDataIdFromObject({
        id: parentId,
        __typename: 'StackDecision'
      });
      const post = client.readFragment({
        id: dataId,
        fragment: adviceAnswers,
        fragmentName: 'adviceAnswers'
      });
      const newData = {
        ...post,
        answers: {
          count: post.answers.count,
          pageInfo: post.answers.pageInfo,
          edges: [
            {
              node: {...newAnswer, __typename: 'StackDecision'},
              __typename: 'StackDecision'
            },
            ...post.answers.edges
          ],
          __typename: post.answers.__typename
        }
      };
      client.writeFragment({
        id: dataId,
        fragment: adviceAnswers,
        data: newData,
        fragmentName: 'adviceAnswers'
      });
      setCreatedItemCount(createdItemCount + 1);
    }
  }, [newAnswer]);

  const fetchData = () => {
    client
      .query({
        query: answersQuery,
        variables: {id: parentId}
      })
      .then(({data}) => {
        const fetchedData = data.stackDecision.answers;
        const dataId = defaultDataIdFromObject({
          id: parentId,
          __typename: 'StackDecision'
        });

        const decisionIds = data.stackDecision.answers.edges.map(ans => ans.node.id);
        callTrackViews({
          client,
          trackViews,
          decisionIds,
          clientContext: `Answers-${window.location.pathname}`
        });
        const post = client.readFragment({
          id: dataId,
          fragment: adviceAnswers,
          fragmentName: 'adviceAnswers'
        });
        const newData = {
          ...post,
          answers: {
            count: post.answers.count,
            pageInfo: fetchedData.pageInfo,
            edges: fetchedData.edges,
            __typename: post.answers.__typename
          }
        };
        client.writeFragment({
          id: dataId,
          fragment: adviceAnswers,
          data: newData,
          fragmentName: 'adviceAnswers'
        });
        setHasNextPage(fetchedData.pageInfo.hasNextPage);
        setViewAll(true);
        setHasFetchedData(true);
      });
  };

  const sortedItems = items => {
    if (child) {
      return [child, ...items.filter(item => item.id !== child.id)];
    }
    return items;
  };

  const filteredItems = sortedItems(items).filter(item => !item.deleted);

  const displayCount = hasFetchedData
    ? filteredItems.length
    : initialCount + createdItemCount - deletedItemCount;

  const displayRange = viewAll
    ? filteredItems.length
    : filteredItems.length < DEFAULT_DISPLAY_COUNT
    ? filteredItems.length
    : DEFAULT_DISPLAY_COUNT;

  useEffect(() => {
    const deletedItems = items.length - filteredItems.length;
    if (deletedItems > 0) {
      setDeletedItemCount(deletedItems);
    }
  }, [filteredItems.length]);
  return (
    <Fragment>
      {filteredItems.length > 0 && (
        <Container>
          {filteredItems.length > 0 && (
            <Count>
              Replies <span>{`(${displayCount})`}</span>
            </Count>
          )}
          {filteredItems.slice(0, displayRange).map((item, index) => (
            <PostCardWrapper key={item.id}>
              <Gutter last={index + 1 === displayRange} />
              <PostCard
                onPermalink={onPermalink}
                isPermalinkModal={onPermalink}
                index={index}
                post={item}
                parentId={parentId}
                childCard={true}
                sharedProps={{}}
                disableFirstRun={true}
                isFirstNonUpvoted={false}
                analyticsPayload={{}}
                lazyLoadImages={lazyLoadImages}
              />
            </PostCardWrapper>
          ))}
          {(hasNextPage ||
            (!hasFetchedData && filteredItems.length > DEFAULT_DISPLAY_COUNT) ||
            (hasFetchedData && !viewAll && filteredItems.length > DEFAULT_DISPLAY_COUNT)) && (
            <Toggle
              onClick={() => {
                if (!hasFetchedData) {
                  fetchData();
                } else {
                  setViewAll(true);
                }
              }}
            >
              {`View all (${displayCount})`}
            </Toggle>
          )}
          {viewAll && filteredItems.length > DEFAULT_DISPLAY_COUNT && (
            <Toggle
              onClick={() => {
                setViewAll(false);
              }}
            >
              Hide
            </Toggle>
          )}
        </Container>
      )}
    </Fragment>
  );
};

Answers.propTypes = {
  onPermalink: PropTypes.bool,
  itemsData: PropTypes.object,
  parentId: PropTypes.string,
  newAnswer: PropTypes.object,
  child: PropTypes.any,
  lazyLoadImages: PropTypes.bool
};

export default Answers;
