import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import _ from 'underscore';
import ProfileName from 'bundles/discussions/components/ProfileName';
import SoftDelete from 'bundles/discussions/components/SoftDelete';
import ThreadBadge from 'bundles/discussions/components/ThreadBadge';
import { profilePropType } from 'bundles/discussions/lib/propTypes';
import { formatCount } from 'bundles/discussions/utils/threadUtils';
import { TrackedReactLink } from 'bundles/page/components/TrackedLink2';
import CMLText from 'bundles/cml/components/CMLText';
import { getClassmatesProfile } from 'bundles/classmates/actions/ClassmatesProfileActions';
import { getCourseRoleString } from 'bundles/classmates/utils/lib';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/discussions';
import 'css!bundles/discussions/components/discussionsBody/__styles__/ThreadsListEntry';

class Metadata extends React.Component {
  static propTypes = {
    profile: profilePropType.isRequired,
    timestamp: PropTypes.number.isRequired,
    badge: PropTypes.string,
    metadataLabel: PropTypes.string,
  };

  render() {
    const { badge, profile, metadataLabel, timestamp } = this.props;
    const role = getCourseRoleString(profile ? profile.courseRole : '');
    const roleString = role ? _t('Role #{role}', { role }) : '';
    const ariaLabel = _t(
      'Last Contributor #{fullName}, with #{roleString}, #{postsCount} posts, #{votesReceivedCount} votes, Profile',
      {
        roleString,
        fullName: profile ? profile.fullName : _t('none'),
        postsCount: profile ? profile.postsCount : '0',
        votesReceivedCount: profile ? profile.votesReceivedCount : '0',
      }
    );

    return (
      <div className="rc-Metadata entry-metadata caption-text color-secondary-text">
        <ThreadBadge badge={badge} />
        {metadataLabel || _t('Created by')}
        &nbsp;
        <ProfileName
          ariaHidden={false}
          ariaLabel={ariaLabel}
          fullName={profile.fullName}
          externalId={profile.externalUserId}
          userId={profile.userId}
        />
        <span className="timestamp-separator"> · </span>
        <span className="timestamp">{moment(timestamp).fromNow()}</span>
      </div>
    );
  }
}

class ThreadsListEntry extends React.Component {
  static propTypes = {
    threadUrl: PropTypes.string.isRequired,
    profile: profilePropType.isRequired,
    timestamp: PropTypes.number.isRequired,
    threadName: PropTypes.string.isRequired,
    questionId: PropTypes.string.isRequired,
    questionUserId: PropTypes.number.isRequired,
    entry: PropTypes.object,
    isPinned: PropTypes.bool,
    isDeleted: PropTypes.bool,
    isRead: PropTypes.bool,
    viewCount: PropTypes.number,
    answerCount: PropTypes.number,
    badge: PropTypes.string,
    metadataLabel: PropTypes.string,
    snippet: PropTypes.object,
    forumName: PropTypes.string,
    courseId: PropTypes.string,
    fullProfile: profilePropType.isRequired,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isPinned: false,
    isDeleted: false,
    isRead: true,
  };

  state = {
    threadFocus: false,
  };

  handleThreadFocus = () => {
    this.setState({ threadFocus: true });
  };

  handleThreadBlur = () => {
    this.setState({ threadFocus: false });
  };

  render() {
    const {
      entry,
      isPinned,
      isDeleted,
      isRead,
      threadUrl,
      viewCount,
      answerCount,
      badge,
      profile,
      metadataLabel,
      forumName,
      threadName,
      snippet,
      timestamp,
      questionId,
      questionUserId,
      fullProfile,
    } = this.props;
    const { threadFocus, profileFocus } = this.state;

    const titleClasses = classNames('headline-1-text question-title color-primary-text', {
      'question-title-bold': !isRead,
    });
    const hasViewCount = typeof viewCount !== 'undefined' && !Number.isNaN(viewCount);
    const hasAnswerCount = typeof answerCount !== 'undefined' && !Number.isNaN(answerCount);
    const showReplyArea = hasViewCount || hasAnswerCount;
    const threadLabel = `${isPinned ? 'Pinned ' : ''}Thread: ${threadName}, 
                          ${moment(timestamp).fromNow()}
                          ${hasViewCount ? `, ${viewCount} views` : ''} 
                          ${hasAnswerCount ? `, ${answerCount} replies` : ''}`;

    return (
      <li className={`rc-ThreadsListEntry ${threadFocus ? 'focused' : 'blurred'}`}>
        <TrackedReactLink
          href={threadUrl}
          className="horizontal-box threads-list-link nostyle"
          trackingName="thread_list_entry"
          aria-label={threadLabel}
          data={{
            question_id: questionId,
            question_user_id: questionUserId,
          }}
        >
          {isPinned && (
            <span className="cif-stack cif-lg pin-container align-self-start">
              <i className="cif-circle cif-stack-2x pin-background" />
              <i className="cif-pin cif-stack-lg pin-icon" />
            </span>
          )}

          <div className="flex-1 align-self-center">
            {forumName && <div className="forum-info caption-text color-secondary-text">{forumName}</div>}

            <div className={titleClasses}>{threadName}</div>
            {snippet && (
              <div className={classNames('body-1-text', 'entry-snippet')}>
                <CMLText cml={snippet} />
              </div>
            )}
          </div>

          {showReplyArea && (
            <div className="horizontal-box align-self-end color-secondary-text c-reply-area">
              {hasViewCount && (
                <div className="vertical-box align-items-vertical-center view-count">
                  <div className="label-text color-secondary-text">{formatCount(viewCount)}</div>
                  <div className="caption-text color-secondary-text">{_t('views')}</div>
                </div>
              )}

              {hasAnswerCount && (
                <div className="vertical-box align-items-vertical-center">
                  <div className="label-text color-secondary-text">{formatCount(answerCount)}</div>
                  <div className="caption-text color-secondary-text">{_t('replies')}</div>
                </div>
              )}
            </div>
          )}
        </TrackedReactLink>
        <Metadata
          badge={badge}
          profile={{ ...fullProfile, ...profile }}
          profileFocus={profileFocus}
          metadataLabel={metadataLabel}
          timestamp={timestamp}
        />

        {isDeleted && <SoftDelete entry={entry} hideUndoDelete={true} />}
      </li>
    );
  }
}

export default _.compose(
  connectToStores(
    ['CourseStore', 'ClassmatesProfileStore'],
    ({ CourseStore, ClassmatesProfileStore: classmatesProfileStore }, { profile }) => {
      return {
        courseId: CourseStore.getCourseId(),
        fullProfile: _(classmatesProfileStore.profiles).findWhere({ externalId: profile.externalUserId }),
      };
    }
  )
)(ThreadsListEntry);
