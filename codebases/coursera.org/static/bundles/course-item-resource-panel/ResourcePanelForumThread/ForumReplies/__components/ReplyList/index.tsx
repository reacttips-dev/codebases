import React from 'react';
import { BadgeTypes } from 'bundles/course-item-resource-panel/ResourcePanelForumThread/__components/AnswerBadge/__types__';
import { ForumPostWithCreator } from '../../../__providers__/ForumPostDataProvider/queries/RestForumAnswersById';
import ForumItemReplyList from '../../../__components/ForumItemReplyList';
import ForumItemCard from '../../../__components/ForumItemCard';
import AnswerBadge from '../../../__components/AnswerBadge';

export default function ReplyList({
  replies,
  showReplyControls,
  children,
}: {
  replies: ForumPostWithCreator[];
  children?: ({ reply }: { reply: ForumPostWithCreator }) => {} | null | JSX.Element;
  showReplyControls?: boolean;
}) {
  return (
    <ForumItemReplyList>
      {replies &&
        replies.map((reply) => (
          <ForumItemCard
            key={reply.id}
            cmlContent={reply.content.details}
            tags={
              <span style={{ margin: '0 0 0 6px' }}>
                {reply?.answerBadge?.answerBadge && reply.answerBadge.answerBadge === 'HIGHLIGHTED' && (
                  <AnswerBadge answerBadge={reply.answerBadge.answerBadge} />
                )}
                {reply?.creator?.courseRole && <AnswerBadge answerBadge={reply.creator.courseRole as BadgeTypes} />}
              </span>
            }
            {...reply}
            replyCount={showReplyControls ? reply.topLevelAnswerCount : undefined}
            forumQuestionId={reply.id}
          >
            {children && typeof children === 'function' && children({ reply })}
            {children && typeof children !== 'function' && children}
          </ForumItemCard>
        ))}
    </ForumItemReplyList>
  );
}
