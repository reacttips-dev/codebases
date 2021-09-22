/* @jsx jsx */
import _ from 'underscore';
import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, useTheme, withTheme } from '@coursera/cds-core';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import CML from 'bundles/cml/components/CML';
import type { CmlContent } from 'bundles/cml/types/Content';
import moment from 'moment';
import classNames from 'classnames';
import _t from 'i18n!nls/discussions';
import store from 'js/lib/coursera.store';
import type { Contributor } from 'bundles/discussions/lib/types';
import { formatReplyLegendId } from 'bundles/discussions/utils/threadUtils';
import { isSuperuser } from 'js/lib/user';

import LikeButtonWithData from 'bundles/discussions/components/forumsV2-LikeButtonWithData';

import { naptimeForumTypes } from 'bundles/discussions/constants';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import mapProps from 'js/lib/mapProps';
import { isTopContributor, getCourseRoleString } from 'bundles/classmates/utils/lib';
import PillTag from 'bundles/discussions/components/forumsV2-PillTag';

import AdminDetails from 'bundles/discussions/components/forumsV2-ForumThreads/__components/AdminDetails';
import ProfileAvatar from '../../../forumsV2-ProfileAvatar';
import ReplyButton from '../../../forumsV2-ReplyButton';
import FollowButton from '../../../forumsV2-FollowButton';
import ForumsConnectedReplyCMLInput from '../ReplyCMLInput';
import ReplyCMLEdit from '../ReplyCMLEdit';
import ModerationDropdown from '../ModerationDropdown';
import SoftDelete from '../SoftDelete';
import { formatThreadLegendId } from '../../../../utils/threadUtils';
import type { ForumPostWithCreator } from '../../__providers__/ForumPostDataProvider/__types__';
import { shimmerColor, ShimmerParagraph, ShimmerSentence } from '../../../forumsV2-ShimmerLib';
import type { Forum } from '../ReplyCMLInput/__types__';

import 'css!./__styles__/ForumItemCard';

export function ReplyCardShimmer() {
  return (
    <div className="ForumsV2ItemCard">
      <div className="ForumsV2ItemCard__content">
        <ShimmerSentence width="100px" />
        <span
          className={classNames('comment', 'br', 'animated', 'ForumsV2ItemCard__content__PostAge')}
          style={{ backgroundColor: shimmerColor, display: 'block', height: '10px', width: '40px' }}
        />
      </div>

      <ShimmerParagraph />
    </div>
  );
}

export function PostAge({ createdAt }: { createdAt: number }) {
  return (
    <Typography
      color="supportText"
      css={{
        height: '18px',
        lineHeight: '18px',
      }}
    >
      {moment(new Date(createdAt)).fromNow()}
    </Typography>
  );
}

// TODO: this needs to be fixed for i18n
// only supports Latin alphabet
export function initialsFromName(fullName: string) {
  const fullNameParts = fullName.split(' ').filter((part) => part !== '');
  if (fullNameParts.length == 0) {
    return '--';
  }
  const [firstName, ...rest] = fullNameParts;
  let lastInitial = '';

  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i][0].match(/^[a-z,A-Z]/)) {
      lastInitial = rest[i][0];
    }
  }
  return `${firstName[0]}${lastInitial}`;
}

export function ContributorNameWithIcon({
  fullName,
  photoUrl,
  helperStatus,
}: {
  fullName: string | undefined;
  photoUrl?: string;
  helperStatus?: string;
}) {
  const theme = useTheme();
  const initials = (fullName && initialsFromName(fullName)) || '--';
  return (
    <div className="ContributorNameWithIcon">
      <ProfileAvatar initials={initials} photoUrl={photoUrl} />
      <Typography
        component="span"
        variant="h3bold"
        css={{
          height: '36px',
          display: 'inline-block',
          lineHeight: '36px',
          padding: theme.spacing(0, 0, 0, 8),
        }}
      >
        {fullName}
      </Typography>
      <Typography
        component="div"
        css={{
          display: 'inline-block',
          padding: theme.spacing(0, 0, 0, 8),
          alignSelf: 'center',
        }}
      >
        {isTopContributor(helperStatus) && <PillTag label={getCourseRoleString(helperStatus)} />}
      </Typography>
    </div>
  );
}

type State = {
  showReplyCMLInput: boolean;
  shouldFocusReplyEditor: boolean;
};

type PropsFromStore = {
  isHighlighted?: boolean;
  showUndoDelete: boolean;
  replyPostShowAdminDetails?: boolean;
};

type PropsFromCaller = {
  replyPost?: ForumPostWithCreator;
  title?: string;
  creator?: Contributor;
  tags?: JSX.Element;
  cmlContent: CmlContent;
  isUpvoted: boolean;
  upvoteCount: number;
  replyCount?: number;
  createdAt?: number;
  forumQuestionId: string;
  courseId?: string;
  deepLink?: string;
  isRootCard?: boolean;
};

type ContextId = {
  contextId: string;
};

type PropsToComponent = PropsFromCaller & PropsFromStore & ContextId;

type GetErrorState = (
  activePost: string
) => {
  forceShowReplyInput: boolean;
  savingState?: string;
  defaultReplyValue?: string;
};

export class ForumItemCardComponent extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    currentForumUrl: PropTypes.string,
    router: PropTypes.object.isRequired,
  };

  state = {
    showReplyCMLInput: false,
    shouldFocusReplyEditor: false,
  };

  toggleReply = () => {
    const prevState = this.state;
    this.setState(() => ({ showReplyCMLInput: !prevState.showReplyCMLInput, shouldFocusReplyEditor: true }));
  };

  onDeleteSuccess = (reason) => {
    if (!reason) {
      this.context.router.replace(this.context.currentForumUrl);
    }
  };

  /**
   * Reloads can wipe out the whole subtree, so to preserve error states
   * they need to be persisted from fluxible and rehydrated here.
   * These values will return as undefined if they are not in error.
   *
   * @param topLevelForumAnswerId
   */
  getErrorState: GetErrorState = (topLevelForumAnswerId) => {
    const { contextId, isRootCard, forumQuestionId, replyCount } = this.props;
    const { answerSavingStates, retryCml } = store.get('discussionsV2Context');

    const forumAnswerId = `${contextId}~${topLevelForumAnswerId}`;
    const targetId = isRootCard ? forumQuestionId : forumAnswerId;

    const savingState = answerSavingStates?.[targetId];
    const defaultReplyValue = retryCml?.[targetId]?.content.definition.value;
    const forceShowReplyInput = savingState && defaultReplyValue && replyCount !== undefined;

    return { savingState, defaultReplyValue, forceShowReplyInput };
  };

  render() {
    const {
      title,
      cmlContent,
      creator,
      forumQuestionId,
      replyPost,
      isHighlighted,
      showUndoDelete,
      contextId,
      replyPostShowAdminDetails,
    } = this.props;
    const { question } = store.get('discussionsV2Context');
    const replyLegendId = formatReplyLegendId(question);
    const showReplyCMLEdit = replyPost ? replyPost.showEditor : question.showEditor;

    if (replyPost?.hide) {
      return null;
    }

    const activePost = replyPost || question;
    const { savingState, defaultReplyValue, forceShowReplyInput } = this.getErrorState(
      activePost.topLevelForumAnswerId
    );

    return (
      <div className="ForumsV2ItemCard">
        {title && (
          <Typography variant="h2semibold" className="ForumsV2ItemCard__title">
            {title}
          </Typography>
        )}
        <div className="ForumsV2ItemCard__content">
          <span className="ForumsV2ItemCard__content__profile">
            {creator && (
              <ContributorNameWithIcon
                fullName={creator.fullName}
                photoUrl={creator.photoUrl}
                helperStatus={creator?.helperStatus}
              />
            )}
          </span>
          <span className="ForumsV2ItemCard__content__tags">{this.props.tags}</span>
          <span className="ForumsV2ItemCard__content__PostAge">
            {this.props.createdAt && <PostAge createdAt={this.props.createdAt} />}
          </span>
        </div>

        {!showReplyCMLEdit && (
          <div className="ForumsV2ItemCard__content__CML">
            <CML cml={cmlContent} isCdsEnabled={true} />
          </div>
        )}

        <div className="ForumsV2ItemCard__content__responseControls">
          {!showReplyCMLEdit && (
            <span className="ForumsV2ItemCard__content__responseControls__likeButtonControlContainer">
              <LikeButtonWithData
                ariaDescribedBy="like-button"
                upvotes={this.props.upvoteCount}
                isUpvoted={this.props.isUpvoted}
                forumPostId={replyPost ? replyPost.answerId! : forumQuestionId}
                creator={this.props.creator}
              />
            </span>
          )}
          {!showReplyCMLEdit && this.props.creator && this.props.replyCount !== undefined && (
            <span className="ForumsV2ItemCard__content__responseControls__ReplyButtonControlContainer">
              <ReplyButton
                forumQuestionId={forumQuestionId}
                replies={this.props.replyCount}
                creator={this.props.creator}
                onClick={() => this.toggleReply()}
              />
            </span>
          )}
          {!showReplyCMLEdit && !replyPost && question && <FollowButton question={question} />}
          {!showReplyCMLEdit && (
            <ModerationDropdown
              onDeleteSuccess={replyPost ? undefined : this.onDeleteSuccess}
              creator={creator}
              post={activePost}
              forumLink={this.context.currentForumUrl}
              ariaDescribedBy={replyLegendId}
              isHighlighted={replyPost ? isHighlighted : undefined}
              showingAdminDetails={replyPost ? replyPostShowAdminDetails : question.showAdminDetails}
            />
          )}
          <AdminDetails post={replyPost ? { showAdminDetails: replyPostShowAdminDetails, ...replyPost } : question} />
          {showReplyCMLEdit && <ReplyCMLEdit reply={activePost} />}
          {(this.state.showReplyCMLInput || forceShowReplyInput) && (
            <ForumsConnectedReplyCMLInput
              question={question}
              parentPost={activePost}
              savingState={savingState}
              shouldFocusReplyEditor={this.state.shouldFocusReplyEditor}
              ariaLabel={_t('Reply to this thread')}
              ariaDescribedBy={formatThreadLegendId(forumQuestionId)}
              defaultValue={defaultReplyValue}
              contextId={contextId}
            />
          )}
        </div>

        {replyPost?.state?.deleted && (
          <SoftDelete entry={replyPost} showUndoDelete={showUndoDelete} isForQuestion={false} />
        )}

        {this.props.children && <div className="ForumsV2ItemCard__content__childContainer">{this.props.children}</div>}
      </div>
    );
  }
}

type InputProps = {
  currentForum: Forum;
  courseId: string;
  parentPost: ForumPostWithCreator;
};

export default _.compose(
  connectToStores<PropsFromCaller & PropsFromStore, PropsFromCaller>(
    ['ThreadDetailsStore', 'CourseMembershipStore'],
    ({ ThreadDetailsStore, CourseMembershipStore }, { replyPost }) => {
      return {
        isHighlighted: replyPost ? ThreadDetailsStore.isHighlighted(replyPost) : undefined,
        showUndoDelete: CourseMembershipStore.getCourseRole() !== 'LEARNER' || isSuperuser(),
        replyPostShowAdminDetails: replyPost
          ? ThreadDetailsStore.findPosts(replyPost, true)[0]?.showAdminDetails
          : undefined,
      };
    }
  ),
  withTheme,
  discussionsForumsHOC({ fields: ['link', 'title'] }),
  mapProps((props: InputProps) => {
    const addedProps: ContextId = {
      contextId: props.courseId,
    };
    if (props.currentForum && props.currentForum.forumType.typeName === naptimeForumTypes.groupForumType) {
      addedProps.contextId = props.currentForum.forumType.definition.groupId;
    }
    return addedProps;
  })
)(ForumItemCardComponent);
