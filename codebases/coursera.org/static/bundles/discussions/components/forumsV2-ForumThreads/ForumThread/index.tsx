import React from 'react';
import _t from 'i18n!nls/discussions';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import store from 'js/lib/coursera.store';
import { Grid, Typography, useTheme } from '@coursera/cds-core';
import { PinIcon } from '@coursera/cds-icons/dist';
import SoftDelete from '../__components/SoftDelete';
import type { BadgeTypes } from '../__components/AnswerBadge/__types__';
import ForumItemCard, { ReplyCardShimmer } from '../__components/ForumItemCard';
import type { ForumQuestionsDataProviderResponse } from '../__providers__/ForumPostDataProvider/__types__';
import AnswerBadge from '../__components/AnswerBadge';
import 'css!./__styles__/index';
import SectionDivider from '../../forumsV2-SectionDivider';
import type { ForumRepliesProps } from '../ForumReplies/__types__';
import { ShimmerSentence } from '../../forumsV2-ShimmerLib';
import { ForumDropDownWithTheme } from '../../forumsV2-ForumDropDown';
import { answerSorts } from '../../../constants';

const { newestSort, popularSort } = answerSorts;

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

export default function ForumThread({
  isPinned,
  forumPost,
  children,
}: ForumQuestionsDataProviderResponse & {
  isPinned?: boolean;
  children?: ({ highlightedId, id, topLevelAnswerCount }: ForumRepliesProps) => {};
}) {
  const theme = useTheme();

  if (forumPost && forumPost.content && forumPost.content.details) {
    const { question } = store.get('discussionsV2Context');
    const topLevelAnswerCount = forumPost.topLevelAnswerCount;

    return (
      <section aria-label={_t('Forum Thread')} className="ForumThread">
        <Grid container xs={12}>
          <Grid item>
            <Typography variant="h2semibold" className="ForumThread___title">
              {isPinned && (
                <PinIcon
                  aria-label={_t('pinned forum post')}
                  size="medium"
                  css={{
                    margin: theme.spacing(0, 8, 0, 0),
                    background: theme.palette.yellow[500],
                    padding: '3px',
                    height: '24px',
                    width: '24px',
                    borderRadius: '100%',
                    position: 'relative',
                    top: '6px',
                  }}
                />
              )}
              {forumPost.content.question}
            </Typography>
          </Grid>
        </Grid>

        <div className="ForumThread___content">
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
            replyCount={topLevelAnswerCount}
            createdAt={forumPost.createdAt}
            courseId={forumPost.courseId}
            forumQuestionId={forumPost.id}
            deepLink={forumPost.deepLink}
            isRootCard
          />
          <SectionDivider />
          <div aria-label={_t('Replies')} className="rc-ForumItemReplyList">
            <Typography variant="h3semibold" className="rc-ForumsV2__ForumItemReplyList__title">
              <FormattedMessage
                message={_t('{count, plural, =1 {1 Reply} =0 {0 Replies} other {{count} Replies}}')}
                count={topLevelAnswerCount}
              />
            </Typography>
            {!!topLevelAnswerCount && topLevelAnswerCount > 1 && (
              <span className="rc-ForumsV2__ForumItemReplyList__sort_select">
                <ForumDropDownWithTheme<string, 'sort'>
                  options={[
                    { value: newestSort, param: 'sort', label: _t('Recent') },
                    { value: popularSort, param: 'sort', label: _t('Top') },
                  ]}
                />
              </span>
            )}

            {children &&
              typeof children === 'function' &&
              children({
                id: forumPost?.id,
                highlightedId: forumPost?.forumAnswerBadgeTagMap?.HIGHLIGHTED?.forumAnswerId,
                topLevelAnswerCount: forumPost?.topLevelAnswerCount || 0,
              })}
          </div>
        </div>
        {question?.state?.deleted && <SoftDelete entry={question} showUndoDelete={true} isForQuestion={true} />}
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
