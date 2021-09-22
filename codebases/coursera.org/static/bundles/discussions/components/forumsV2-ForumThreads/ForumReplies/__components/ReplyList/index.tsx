import React from 'react';
import { BadgeTypes } from '../../../__components/AnswerBadge/__types__';
import { ForumPostWithCreator } from '../../../__providers__/ForumPostDataProvider/__types__';
import ForumItemReplyList from '../../../__components/ForumItemReplyList';
import ForumItemCard from '../../../__components/ForumItemCard';
import AnswerBadge from '../../../__components/AnswerBadge';
import { extractForumPostId } from '../../../__helpers__/forumPostDataHelpers';

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
        replies.map((reply) => {
          return (
            <ForumItemCard
              replyPost={reply}
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
              forumQuestionId={reply.forumQuestionId}
            >
              {children && typeof children === 'function' && children({ reply })}
              {children && typeof children !== 'function' && children}
            </ForumItemCard>
          );
        })}
    </ForumItemReplyList>
  );
}
