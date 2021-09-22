import { formatReplyLegendId } from 'bundles/discussions/utils/threadUtils';

import $ from 'jquery';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CML from 'bundles/cml/components/CML';
import ProfileArea from 'bundles/discussions/components/profiles/ProfileArea';
import ProfileName from 'bundles/discussions/components/ProfileName';
import AdminDetails from 'bundles/discussions/components/AdminDetails';
import ReplyCMLEdit from 'bundles/discussions/components/repliesList/ReplyCMLEdit';
import JumpToReply from 'bundles/discussions/components/repliesList/JumpToReply';
import Badge from 'bundles/discussions/components/Badge';
import CreatedTimeLink from 'bundles/discussions/components/CreatedTimeLink';
import EditIndicator from 'bundles/discussions/components/EditIndicator';
import Upvote from 'bundles/discussions/components/Upvote';
import ModerationDropdown from 'bundles/discussions/components/ModerationDropdown';
import SoftDelete from 'bundles/discussions/components/SoftDelete';
import ReplyButton from 'bundles/discussions/components/ReplyButton';
import { naptimeForumTypes } from 'bundles/discussions/constants';
import { replyPropType } from 'bundles/discussions/lib/propTypes';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/discussions';

import 'css!./__styles__/ReplyComponent';

const SCROLL_TRANSITION = 1500;
const OFFSET_TOP_PX = 10;

class ReplyComponent extends React.Component {
  static propTypes = {
    reply: replyPropType.isRequired,
    commentsEnabled: PropTypes.bool,
    toggleComments: PropTypes.func,
    answerId: PropTypes.string,
    commentId: PropTypes.string,
    commentCount: PropTypes.number,
    className: PropTypes.string,
    children: PropTypes.node,
    isHighlighted: PropTypes.bool,
    isQuestionLoaded: PropTypes.bool,
    forumLink: PropTypes.string,
    forumType: PropTypes.string,
    showJumpLink: PropTypes.bool,
    hideUndoDelete: PropTypes.bool,
    fetchAnswerPosition: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { isQuestionLoaded } = this.props;
    if (this.isDeepLinked() && isQuestionLoaded) {
      this.scrollToLocation();
    }
  }

  isDeepLinked() {
    const { reply, commentId, answerId } = this.props;
    return (
      (commentId && reply.type === 'comment' && reply.forumCommentId === commentId) ||
      (answerId && !commentId && reply.type === 'answer' && reply.topLevelForumAnswerId === answerId)
    );
  }

  scrollToLocation() {
    const yPosition = $(this.reply).offset().top;

    // We use deep linking on several different pages, some of which have different scrolling DOM elements. Try for the
    // elements on the main discussions page separately, since scroll is handled differently.
    if ($('main.course-content').length) {
      $('html,body').animate(
        {
          scrollTop: yPosition + $('body').scrollTop() - $('body').offset().top - OFFSET_TOP_PX,
        },
        SCROLL_TRANSITION
      );
    } else if ($('body').css('overflow') !== 'hidden') {
      const headerOffset = $('.rc-PageHeader').length ? $('.rc-PageHeader')[0].offsetHeight : 0;
      $('body').animate(
        {
          scrollTop: yPosition + $('body').scrollTop() - $('body').offset().top - headerOffset - OFFSET_TOP_PX,
        },
        SCROLL_TRANSITION
      );
    }
  }

  renderShowToggle() {
    const { commentsEnabled, commentCount, toggleComments, reply } = this.props;
    const showText = _t('Show') + ` ${commentCount} ` + (commentCount === 1 ? _t('Reply') : _t('Replies'));
    const hideText = _t('Hide') + ` ${commentCount} ` + (commentCount === 1 ? _t('Reply') : _t('Replies'));
    const creator = reply.creator;

    const showMessage = <ReplyButton handleClick={toggleComments} text={showText} creator={creator} />;

    const hideMessage = <ReplyButton handleClick={toggleComments} text={hideText} creator={creator} />;

    const replyLink = <ReplyButton handleClick={toggleComments} text={_t('Reply')} creator={creator} />;

    const hideLink = <ReplyButton handleClick={toggleComments} text={_t('Hide')} creator={creator} />;

    if (commentsEnabled) {
      return commentCount ? hideMessage : hideLink;
    } else {
      return commentCount ? showMessage : replyLink;
    }
  }

  render() {
    const {
      reply,
      forumLink,
      forumType,
      showJumpLink,
      isHighlighted,
      hideUndoDelete,
      fetchAnswerPosition,
      className,
      children,
    } = this.props;
    const { creator } = reply;
    // TODO: Remove animation
    if (reply.hide) {
      return null;
    }

    const replyContainerClasses = classNames(
      'horizontal-box',
      {
        'bgcolor-primary-light': this.isDeepLinked(),
      },
      'reply-content'
    );

    const replyClasses = classNames('rc-ReplyComponent', className);

    const contentClasses = classNames('reply-details', {
      flag: reply.flagDetails && reply.flagDetails.isActive,
    });

    const replyPreviewClasses = classNames(
      'action-area',
      'horizontal-box',
      'align-items-vertical-center',
      'caption-text',
      'color-secondary-text'
    );

    const isGradedDiscussionPrompt = forumType === naptimeForumTypes.gradedDiscussionPrompt;
    const replyLegendId = formatReplyLegendId(reply);

    const moderationDropdown = (
      <ModerationDropdown
        creator={creator}
        post={reply}
        isHighlighted={isHighlighted}
        forumLink={forumLink}
        isGradedDiscussionPrompt={isGradedDiscussionPrompt}
        ariaDescribedBy={replyLegendId}
      />
    );

    return (
      <li
        className={replyClasses}
        ref={(c) => {
          this.reply = c;
        }}
      >
        <div id={replyLegendId} className="screenreader-only pii-hide">
          <FormattedMessage message={_t("{name}'s Post")} name={reply.creator.fullName} />
        </div>
        <div className={replyContainerClasses}>
          <div className="profile">
            <ProfileArea
              externalUserId={reply.creator.externalUserId}
              fullName={reply.creator.fullName}
              profileImageUrl={reply.creator.isDefaultPhoto ? '' : reply.creator.photoUrl || ''}
              courseRole={reply.creator.courseRole}
              helperStatus={reply.creator.helperStatus}
            />
          </div>

          {reply.showEditor && (
            <div className="flex-1 preview-container">
              {moderationDropdown}
              <ReplyCMLEdit reply={reply} />
            </div>
          )}

          {!reply.showEditor && (
            <div className="flex-1 preview-container">
              <div className="metadata caption-text color-secondary-text">
                <ProfileName fullName={creator.fullName} externalId={creator.externalUserId} ariaHidden={true} />
                <Badge creator={creator} />
                <span aria-hidden={true}>&nbsp;·&nbsp;</span>
                <CreatedTimeLink post={reply} forumLink={forumLink} isClickable={!isGradedDiscussionPrompt} />
                {moderationDropdown}
                <EditIndicator post={reply} />
              </div>

              <div className={contentClasses}>
                <CML cml={reply.content} />
              </div>

              <div className={replyPreviewClasses}>
                <Upvote post={reply} ariaDescribedBy={replyLegendId} />

                {reply.type === 'answer' && this.renderShowToggle()}

                {showJumpLink && (
                  <JumpToReply reply={reply} forumLink={forumLink} fetchAnswerPosition={fetchAnswerPosition} />
                )}

                <AdminDetails post={reply} />
              </div>
            </div>
          )}
        </div>

        {reply.state.deleted && <SoftDelete entry={reply} hideUndoDelete={hideUndoDelete} />}

        {children}
      </li>
    );
  }
}

export default ReplyComponent;
