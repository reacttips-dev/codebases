import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ApprovedAristInviteSubmissionNotification,
  ApprovedArtistInviteSubmissionFromFollowingNotification,
  CommentNotification,
  CommentMentionNotification,
  CommentOnOriginalPostNotification,
  CommentOnRepostNotification,
  FeaturedCategoryPostNotification,
  FeaturedCategoryRepostNotification,
  FeaturedCategoryPostViaRepostNotification,
  InvitationAcceptedNotification,
  LoveNotification,
  LoveOnOriginalPostNotification,
  LoveOnRepostNotification,
  NewFollowerPost,
  NewFollowedUserPost,
  PostMentionNotification,
  RepostNotification,
  UserAddedAsFeaturedNotification,
  UserAddedAsCuratorNotification,
  UserAddedAsModeratorNotification,
  WatchNotification,
  WatchCommentNotification,
  WatchOnOriginalPostNotification,
  WatchOnRepostNotification,
} from '../components/notifications/NotificationRenderables'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { getLinkObject } from '../helpers/json_helper'
import { selectJson } from '../selectors/store'

const NOTIFICATION_KIND = {
  APPROVED_ARTIST_INVITE_SUBMISSION: 'approved_artist_invite_submission',
  APPROVED_ARTIST_INVITE_SUBMISSION_FROM_FOLLOWING: 'approved_artist_invite_submission_notification_for_followers',
  COMMENT: 'comment_notification',
  COMMENT_MENTION: 'comment_mention_notification',
  COMMENT_ORIGINAL: 'comment_on_original_post_notification',
  COMMENT_REPOST: 'comment_on_repost_notification',
  INVITATION_ACCEPTED: 'invitation_accepted_post',
  LOVE: 'love_notification',
  LOVE_ORIGINAL: 'love_on_original_post_notification',
  LOVE_REPOST: 'love_on_repost_notification',
  NEW_FOLLOWED_USER: 'new_followed_user_post',
  NEW_FOLLOWER: 'new_follower_post',
  POST_MENTION: 'post_mention_notification',
  REPOST: 'repost_notification',
  WATCH: 'watch_notification',
  WATCH_COMMENT: 'watch_comment_notification',
  WATCH_ORIGINAL: 'watch_on_original_post_notification',
  WATCH_REPOST: 'watch_on_repost_notification',
  WELCOME: 'welcome_notification',
  CATEGORY_POST_FEATURED: 'category_post_featured',
  CATEGORY_REPOST_FEATURED: 'category_repost_featured',
  CATEGORY_POST_VIA_REPOST_FEATURED: 'category_post_via_repost_featured',
  USER_ADDED_AS_FEATURED: 'user_added_as_featured_notification',
  USER_ADDED_AS_CURATOR: 'user_added_as_curator_notification',
  USER_ADDED_AS_MODERATOR: 'user_added_as_moderator_notification',
}

const SUBJECT_TYPE = {
  LOVE: 'love',
  POST: 'post',
  COMMENT: 'comment',
  USER: 'user',
  WATCH: 'watch',
  ARTIST_INVITE_SUBMISSION: 'artistinvitesubmission',
  CATEGORY_POST: 'categorypost',
  CATEGORY_USER: 'categoryuser',
}

function mapStateToProps(state, ownProps) {
  const { notification } = ownProps
  const json = selectJson(state)
  const subject = getLinkObject(notification, 'subject', json)

  // postActions are used for loves/watches
  let postActionPost = null
  let postActionAuthor = null
  let postActionCategory = null
  let postActionUser = null

  let postAuthor = null
  let repost = null
  let repostAuthor = null
  let repostedSource = null
  let repostedSourceAuthor = null
  let parentPost = null
  let parentPostAuthor = null
  const subjectType = notification.get('subjectType').toLowerCase()

  // subject is a post or comment
  if (subjectType === SUBJECT_TYPE.POST || subjectType === SUBJECT_TYPE.COMMENT) {
    postAuthor = getLinkObject(subject, 'author', json) ||
      json.getIn([MAPPING_TYPES.USERS, subject.get('authorId')])
    // comment
    if (subject.get('postId')) {
      parentPost = getLinkObject(subject, 'parentPost', json)
      parentPostAuthor = getLinkObject(parentPost, 'author', json) ||
        json.getIn([MAPPING_TYPES.USERS, parentPost.get('authorId')])
    }
    // repost
    if (parentPost && parentPost.get('repostId')) {
      repost = parentPost
      repostAuthor = getLinkObject(repost, 'author', json) ||
        json.getIn([MAPPING_TYPES.USERS, repost.get('authorId')])
      repostedSource = getLinkObject(repost, 'repostedSource', json)
      repostedSourceAuthor = getLinkObject(repostedSource, 'author', json) ||
        json.getIn([MAPPING_TYPES.USERS, repostedSource.get('authorId')])
    }
  }
  // subject is a love or a watch
  if (subjectType === SUBJECT_TYPE.LOVE || subjectType === SUBJECT_TYPE.WATCH) {
    postActionUser = getLinkObject(subject, 'user', json)
    postActionPost = getLinkObject(subject, 'post', json)
    postActionAuthor = getLinkObject(postActionPost, 'author', json) ||
      json.getIn([MAPPING_TYPES.USERS, postActionPost.get('authorId')])
    // repost
    if (postActionPost.get('repostId')) {
      repost = postActionPost
      repostAuthor = getLinkObject(repost, 'author', json)
      repostedSource = getLinkObject(repost, 'repostedSource', json)
      repostedSourceAuthor = getLinkObject(repostedSource, 'author', json) ||
        json.getIn([MAPPING_TYPES.USERS, repostedSource.get('authorId')])
    }
  }
  // subject is an artist invite submission
  if (subjectType === SUBJECT_TYPE.ARTIST_INVITE_SUBMISSION) {
    postActionPost = getLinkObject(subject, 'post', json)
    postActionAuthor = getLinkObject(postActionPost, 'author', json) ||
      json.getIn([MAPPING_TYPES.USERS, postActionPost.get('authorId')])
  }

  // subject is a category post
  if (subjectType === SUBJECT_TYPE.CATEGORY_POST) {
    postActionUser = getLinkObject(subject, 'featuredBy', json)
    postActionPost = getLinkObject(subject, 'post', json)
    postActionAuthor = getLinkObject(postActionPost, 'author', json) ||
      json.getIn([MAPPING_TYPES.USERS, postActionPost.get('authorId')])
  }

  // subject is a category user
  let identifier
  if (subjectType === SUBJECT_TYPE.CATEGORY_USER) {
    switch (notification.get('kind')) {
      case NOTIFICATION_KIND.USER_ADDED_AS_FEATURED:
        identifier = 'featuredBy'
        break;
      case NOTIFICATION_KIND.USER_ADDED_AS_CURATOR:
        identifier = 'curatorBy'
        break;
      case NOTIFICATION_KIND.USER_ADDED_AS_MODERATOR:
        identifier = 'moderatorBy'
        break;
      default:
        break;
    }
    postActionUser = getLinkObject(subject, identifier, json) || getLinkObject(subject, 'user', json)
    postActionCategory = getLinkObject(subject, 'category', json)
  }

  // subject can be a user as well but we don't
  // need to add any additional properties
  return {
    createdAt: notification.get('createdAt'),
    kind: notification.get('kind'),
    parentPost,
    parentPostAuthor,
    postActionAuthor,
    postActionCategory,
    postActionPost,
    postActionUser,
    postAuthor,
    repost,
    repostAuthor,
    repostedSource,
    repostedSourceAuthor,
    subject,
  }
}

class NotificationParser extends Component {
  static propTypes = {
    createdAt: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    parentPost: PropTypes.object,
    parentPostAuthor: PropTypes.object,
    postActionAuthor: PropTypes.object,
    postActionCategory: PropTypes.object,
    postActionPost: PropTypes.object,
    postActionUser: PropTypes.object,
    postAuthor: PropTypes.object,
    repost: PropTypes.object,
    repostAuthor: PropTypes.object,
    repostedSource: PropTypes.object,
    repostedSourceAuthor: PropTypes.object,
    subject: PropTypes.object.isRequired,
  }

  static defaultProps = {
    parentPost: null,
    parentPostAuthor: null,
    postActionAuthor: null,
    postActionCategory: null,
    postActionPost: null,
    postActionUser: null,
    postAuthor: null,
    repost: null,
    repostAuthor: null,
    repostedSource: null,
    repostedSourceAuthor: null,
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.subject, this.props.subject)
  }

  render() {
    const {
      createdAt,
      kind,
      parentPost,
      parentPostAuthor,
      postActionAuthor,
      postActionCategory,
      postActionPost,
      postActionUser,
      postAuthor,
      repost,
      repostAuthor,
      repostedSource,
      repostedSourceAuthor,
      subject,
    } = this.props

    switch (kind) {
      case NOTIFICATION_KIND.APPROVED_ARTIST_INVITE_SUBMISSION:
        return (
          <ApprovedAristInviteSubmissionNotification
            subject={subject}
            createdAt={createdAt}
          />
        )
      case NOTIFICATION_KIND.APPROVED_ARTIST_INVITE_SUBMISSION_FROM_FOLLOWING:
        return (
          <ApprovedArtistInviteSubmissionFromFollowingNotification
            subject={subject}
            postActionPost={postActionPost}
            postActionAuthor={postActionAuthor}
            createdAt={createdAt}
          />
        )
      case NOTIFICATION_KIND.CATEGORY_POST_FEATURED:
        return (
          <FeaturedCategoryPostNotification
            subject={subject}
            postActionPost={postActionPost}
            postActionAuthor={postActionAuthor}
            postActionUser={postActionUser}
            createdAt={createdAt}
          />
        )
      case NOTIFICATION_KIND.CATEGORY_REPOST_FEATURED:
        return (
          <FeaturedCategoryRepostNotification
            subject={subject}
            postActionPost={postActionPost}
            postActionAuthor={postActionAuthor}
            postActionUser={postActionUser}
            createdAt={createdAt}
          />
        )
      case NOTIFICATION_KIND.CATEGORY_POST_VIA_REPOST_FEATURED:
        return (
          <FeaturedCategoryPostViaRepostNotification
            subject={subject}
            postActionPost={postActionPost}
            postActionAuthor={postActionAuthor}
            postActionUser={postActionUser}
            createdAt={createdAt}
          />
        )
      case NOTIFICATION_KIND.COMMENT:
        return (
          <CommentNotification
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            parentPost={parentPost}
            parentPostAuthor={parentPostAuthor}
          />
        )
      case NOTIFICATION_KIND.COMMENT_MENTION:
        return (
          <CommentMentionNotification
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            parentPost={parentPost}
            parentPostAuthor={parentPostAuthor}
          />
        )
      case NOTIFICATION_KIND.COMMENT_ORIGINAL:
        return (
          <CommentOnOriginalPostNotification
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
            repostedSource={repostedSource}
            repostedSourceAuthor={repostedSourceAuthor}
          />
        )
      case NOTIFICATION_KIND.COMMENT_REPOST:
        return (
          <CommentOnRepostNotification
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
          />
        )
      case NOTIFICATION_KIND.INVITATION_ACCEPTED:
        return <InvitationAcceptedNotification createdAt={createdAt} user={subject} />
      case NOTIFICATION_KIND.LOVE:
        return (
          <LoveNotification
            author={postActionAuthor}
            createdAt={createdAt}
            post={postActionPost}
            user={postActionUser}
          />
        )
      case NOTIFICATION_KIND.LOVE_ORIGINAL:
        return (
          <LoveOnOriginalPostNotification
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
            repostedSource={repostedSource}
            repostedSourceAuthor={repostedSourceAuthor}
            user={postActionUser}
          />
        )
      case NOTIFICATION_KIND.LOVE_REPOST:
        return (
          <LoveOnRepostNotification
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
            user={postActionUser}
          />
        )
      case NOTIFICATION_KIND.NEW_FOLLOWER:
        return <NewFollowerPost createdAt={createdAt} user={subject} />
      case NOTIFICATION_KIND.NEW_FOLLOWED_USER:
        return <NewFollowedUserPost createdAt={createdAt} user={subject} />
      case NOTIFICATION_KIND.POST_MENTION:
        return (
          <PostMentionNotification
            author={postAuthor}
            createdAt={createdAt}
            post={subject}
          />
        )
      case NOTIFICATION_KIND.REPOST:
        return (
          <RepostNotification
            author={postAuthor}
            createdAt={createdAt}
            post={subject}
          />
        )
      case NOTIFICATION_KIND.USER_ADDED_AS_FEATURED:
        return (
          <UserAddedAsFeaturedNotification
            category={postActionCategory}
            featuredBy={postActionUser}
            createdAt={createdAt}
          />
        )
      case NOTIFICATION_KIND.USER_ADDED_AS_CURATOR:
        return (
          <UserAddedAsCuratorNotification
            category={postActionCategory}
            curatorBy={postActionUser}
            createdAt={createdAt}
          />
        )
      case NOTIFICATION_KIND.USER_ADDED_AS_MODERATOR:
        return (
          <UserAddedAsModeratorNotification
            category={postActionCategory}
            moderatorBy={postActionUser}
            createdAt={createdAt}
          />
        )
      case NOTIFICATION_KIND.WATCH:
        return (
          <WatchNotification
            author={postActionAuthor}
            createdAt={createdAt}
            post={postActionPost}
            user={postActionUser}
          />
        )
      case NOTIFICATION_KIND.WATCH_COMMENT:
        return (
          <WatchCommentNotification
            author={postAuthor}
            comment={subject}
            createdAt={createdAt}
            parentPost={parentPost}
            parentPostAuthor={parentPostAuthor}
          />
        )
      case NOTIFICATION_KIND.WATCH_ORIGINAL:
        return (
          <WatchOnOriginalPostNotification
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
            repostedSource={repostedSource}
            repostedSourceAuthor={repostedSourceAuthor}
            user={postActionUser}
          />
        )
      case NOTIFICATION_KIND.WATCH_REPOST:
        return (
          <WatchOnRepostNotification
            createdAt={createdAt}
            repost={repost}
            repostAuthor={repostAuthor}
            user={postActionUser}
          />
        )
      case NOTIFICATION_KIND.WELCOME:
        return <p>Welcome to Ello!</p>
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(NotificationParser)

