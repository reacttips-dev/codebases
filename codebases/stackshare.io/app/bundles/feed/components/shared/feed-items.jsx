import {DOMAIN} from '../../constants/utils';
import {toolsPresenter} from '../../../../shared/utils/presenters';
import PostCard from '../../../../shared/library/cards/post';
import {
  FEED_CARD_SOURCE_DECISION,
  FEED_CARD_SOURCE_STACKUP,
  FEED_CARD_SOURCE_STORY,
  DECISION_SOURCE_FEED
} from '../../constants/analytics';
import StackupCard from '../stackup-card/stackup-card';
import FeaturedPostCard from '../featured-post-card/featured-post-card';
import ArticleCard, {
  SOURCE_TYPE_HACKER_NEWS,
  SOURCE_TYPE_REDDIT,
  SOURCE_TYPE_RSS,
  SOURCE_TYPE_BLOG,
  SOURCE_TYPE_LOBSTERS
} from '../article-card/article-card';
import React from 'react';

const mapSourceType = importSource => {
  switch (importSource) {
    case 'hackernews':
      return SOURCE_TYPE_HACKER_NEWS;
    case 'reddit':
      return SOURCE_TYPE_REDDIT;
    case 'lobsters':
      return SOURCE_TYPE_LOBSTERS;
    case 'company_blog_post':
    case 'blog_post':
      return SOURCE_TYPE_BLOG;
    default:
      return SOURCE_TYPE_RSS;
  }
};

function renderDecisionCard(item, sharedProps, payload, disableFirstRun, isFirstNonUpvoted) {
  return (
    <PostCard
      {...sharedProps}
      post={{...item}}
      sharedProps={sharedProps}
      disableFirstRun={disableFirstRun}
      isFirstNonUpvoted={isFirstNonUpvoted}
      analyticsPayload={{
        ...payload,
        cardSource: FEED_CARD_SOURCE_DECISION,
        decisionSource: DECISION_SOURCE_FEED
      }}
    />
  );
}

function renderStackupCard(item, sharedProps, payload, isPrivateMode) {
  return (
    <StackupCard
      {...sharedProps}
      analyticsPayload={{
        ...payload,
        cardSource: FEED_CARD_SOURCE_STACKUP
      }}
      functionName={item.function}
      isPrivateMode={isPrivateMode}
    />
  );
}

function renderFeaturedPostCard(item, sharedProps, payload, maxServicesVisible, isPrivateMode) {
  return (
    <FeaturedPostCard
      {...sharedProps}
      analyticsPayload={{
        ...payload,
        cardSource: FEED_CARD_SOURCE_STORY,
        relevanceStrength: item.relevanceStrength
      }}
      imageUrl={item.imageUrl}
      author={item.author.displayName}
      authorPath={item.author.path}
      views={item.views}
      maxVisible={maxServicesVisible}
      relevanceStrength={item.relevanceStrength}
      promoted={item.promoted}
      description={item.description}
      isPrivateMode={isPrivateMode}
    />
  );
}

function renderArticleCard(item, sharedProps, payload, maxServicesVisible, isPrivateMode) {
  return (
    <ArticleCard
      {...sharedProps}
      id={item.id}
      analyticsPayload={{
        ...payload,
        cardSource: item.importSource,
        cardURL: item.discussionSourceUrl
      }}
      description={item.description}
      owner={item.owner}
      url={item.outboundUrl}
      maxVisible={maxServicesVisible}
      createdAt={item.createdAt}
      flagged={item.flagged}
      isPrivateMode={isPrivateMode}
      source={{
        type: mapSourceType(item.importSource),
        count: Number(item.discussionScore),
        url: item.discussionSourceUrl
      }}
    />
  );
}

const unique = (arr, item) => {
  if (!arr.find(i => i.id === item.id)) {
    arr.push(item);
  }
  return arr;
};

const FeedItems = ({items, tools, maxServicesVisible, disableFirstRun, isPrivateMode}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return items
    .filter(item => (item.object ? !item.object.deleted : !item.deleted))
    .reduce(unique, [])
    .map((item, index) => {
      const payload = {
        cardPosition: index + 1,
        streamId: item.object ? item.object.streamId : null,
        ...toolsPresenter('cardTools', item.object ? item.object.services : item.services),
        ...toolsPresenter('userToolFollows', tools)
      };

      if (item.object ? item.object.title : item.title)
        payload.title = item.object ? item.object.title : item.title;
      if (item.object ? item.object.path : item.path)
        payload.cardURL = DOMAIN + item.object ? item.object.path : item.path;
      if (item.object ? item.object.viewCount : item.viewCount)
        payload.views = item.object ? item.object.viewCount : item.viewCount;

      const sharedProps = {
        position: index + 1,
        key: item.object ? item.object.id : item.id,
        title: item.object ? item.object.title : item.title,
        path: item.object ? item.object.path : item.path,
        services: item.object ? item.object.services : item.services
      };

      switch (item.object ? item.object.__typename : item.__typename) {
        case 'StackDecision':
          return renderDecisionCard(
            item.object ? item.object : item,
            sharedProps,
            payload,
            disableFirstRun
          );
        case 'Stackup':
          return renderStackupCard(
            item.object ? item.object : item,
            sharedProps,
            payload,
            isPrivateMode
          );
        case 'FeaturedPost':
          return renderFeaturedPostCard(
            item.object ? item.object : item,
            sharedProps,
            payload,
            maxServicesVisible,
            isPrivateMode
          );
        case 'Article':
          return renderArticleCard(
            item.object ? item.object : item,
            sharedProps,
            payload,
            maxServicesVisible,
            isPrivateMode
          );
      }
    });
};

export {FeedItems as default};
