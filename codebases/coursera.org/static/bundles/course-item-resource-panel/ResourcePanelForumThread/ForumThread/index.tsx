import React from 'react';
import { BadgeTypes } from 'bundles/course-item-resource-panel/ResourcePanelForumThread/__components/AnswerBadge/__types__';
import _t from 'i18n!nls/course-item-resource-panel';
import ForumItemCard, { ReplyCardShimmer } from '../__components/ForumItemCard';
import { ForumQuestionsDataProviderResponse } from '../__providers__/ForumPostDataProvider/__types__';
import AnswerBadge from '../__components/AnswerBadge';
import 'css!./__styles__/index';
import SectionDivider from '../../__components/SectionDivider';
import { ForumRepliesProps } from '../ForumReplies/__types__';
import { ShimmerSentence } from '../../__components/ShimmerLib';

export function ShimmerState() {
  return (
    <div className="ForumThread">
      <h2 className="ForumThread__title">
        <ShimmerSentence width="125px" />
      </h2>
      <div className="ForumThread__content" style={{ overflowY: 'scroll', position: 'relative' }}>
        <ReplyCardShimmer />
        <SectionDivider />
        <ReplyCardShimmer />
      </div>
    </div>
  );
}

export default function ForumThreadModal({
  forumPost,
  children,
}: ForumQuestionsDataProviderResponse & {
  children?: ({ highlightedId, id, topLevelAnswerCount }: ForumRepliesProps) => {};
}) {
  if (forumPost && forumPost.content && forumPost.content.details) {
    return (
      <section aria-label={_t('Forum Thread Modal')} className="ForumThread">
        <h2 className="ForumThread__title">{forumPost.content.question}</h2>
        <div className="ForumThread__content">
          <ForumItemCard
            cmlContent={forumPost.content.details}
            tags={
              <span style={{ margin: '0 0 0 6px' }}>
                {forumPost?.answerBadge?.answerBadge === 'HIGHLIGHTED' && (
                  <AnswerBadge answerBadge={forumPost.answerBadge.answerBadge} />
                )}
                {forumPost?.creator?.courseRole && (
                  <AnswerBadge answerBadge={forumPost.creator.courseRole as BadgeTypes} />
                )}
              </span>
            }
            creator={forumPost.creator}
            isUpvoted={forumPost.isUpvoted}
            upvoteCount={forumPost.upvoteCount}
            replyCount={forumPost.topLevelAnswerCount}
            createdAt={forumPost.createdAt}
            courseId={forumPost.courseId}
            forumQuestionId={forumPost.id}
            deepLink={forumPost.deepLink}
          />
          <SectionDivider />
          <div aria-label={_t('Replies')} className="rc-ForumItemReplyList">
            <h3 className="rc-ForumItemReplyList__title">
              {_t('#{count} Replies', { count: forumPost.topLevelAnswerCount })}
            </h3>
            {children &&
              typeof children === 'function' &&
              children({
                id: forumPost.id,
                highlightedId: forumPost?.forumAnswerBadgeTagMap?.HIGHLIGHTED?.forumAnswerId,
                topLevelAnswerCount: forumPost?.topLevelAnswerCount || 0,
              })}
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <span>
        <ReplyCardShimmer />
      </span>
    );
  }
}
