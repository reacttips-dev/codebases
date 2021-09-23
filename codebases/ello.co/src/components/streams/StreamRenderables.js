import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ArtistInviteContainer from '../../containers/ArtistInviteContainer'
import CommentContainer from '../../containers/CommentContainer'
import NotificationContainer from '../../containers/NotificationContainer'
import ArtistInviteSubmissionContainer from '../../containers/ArtistInviteSubmissionContainer'
import PostContainer from '../../containers/PostContainer'
import UserContainer from '../../containers/UserContainer'
import withLightBoxContainer from '../../containers/LightBoxContainer'
import { SlickCarousel } from '../../components/carousels/CarouselRenderables'
import EditorialLayout from '../../components/editorials/EditorialLayout'
import Preference from '../../components/forms/Preference'
import TreeButton from '../../components/navigation/TreeButton'
import TreePanel from '../../components/navigation/TreePanel'
import { preferenceToggleChanged } from '../../helpers/junk_drawer'
import { isElloAndroid } from '../../lib/jello'
import { css, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// COMMENTS
class CommentsAsListSimple extends PureComponent { // eslint-disable-line react/no-multi-comp
  static propTypes = {
    toggleLightBox: PropTypes.func.isRequired,
    commentIds: PropTypes.object,
  }

  render() {
    const {
      toggleLightBox,
      commentIds,
    } = this.props

    return (
      <div className="Comments">
        {commentIds.map(id =>
          (<CommentContainer
            toggleLightBox={toggleLightBox}
            commentId={id}
            key={`commentContainer_${id}`}
          />),
        )}
      </div>
    )
  }
}

// wrap comments in LightBox factory
const CommentsAsList = withLightBoxContainer(CommentsAsListSimple)

export const commentsAsList = commentIds => (
  <CommentsAsList
    commentIds={commentIds}
  />
)

// EDITORIAL: chunk layouts into pages of 24 editorials
export const editorials = (editorialIds) => {
  const eIds = editorialIds.toList()
  return Immutable.Range(0, eIds.size - 1, 24)
    .map(chunkStart => eIds.slice(chunkStart, chunkStart + 24))
    .map(pageIds => <EditorialLayout key={pageIds} ids={pageIds} />)
}

export const postsAsPostStream = (postIds, renderProps) => (
  <SlickCarousel postIds={postIds} renderProps={renderProps} />
)

const artistInvitesStyle = css(
  s.flex,
  s.flexWrap,
  s.justifySpaceBetween,
  s.pt20,
  s.pr20,
  s.pl20,
  s.fullWidth,
  { margin: '0 auto', maxWidth: 1440 },
  media(
    s.maxBreak4,
    s.pt0,
    s.pr10,
    s.pl10,
  ),
)

const postGridStyle = css(
  select('& .ImageRegion img',
    s.fullWidth,
    { height: 'auto' },
  ),
)

// posts list styling (shared between POSTS and ARTIST INVITES)
const postListStyle = css(
  s.maxSiteWidth,
  s.mxAuto,
  select('& .ImageRegion img', { height: 'auto' }),
  media(
    s.minBreak3,
    select('& .PostBody > div', s.flex, s.flexColumn, s.justifyCenter, s.itemsCenter, s.pt20),
  ),
)

// ARTIST INVITES
export const artistInvites = artistInviteIds => (
  <div className={artistInvitesStyle}>
    {artistInviteIds.map(id => (
      <ArtistInviteContainer
        artistInviteId={id}
        key={`artistInvite_${id}`}
        kind="grid"
      />
    ))}
  </div>
)

const titleWrapperStyle = css(
  s.flex,
  s.itemsCenter,
  s.maxSiteWidth,
  s.px10,
  s.mxAuto,
  media(s.minBreak2, s.px20),
  media(s.minBreak4, s.px20),
)

const titleStyle = css(
  s.colorA,
  s.fontSize24,
  s.sansBlack,
  s.truncate,
  media(s.minBreak3, s.mb20, parent('.ArtistInvitesDetail', s.mb0, s.fontSize38)),
)

const blackTitleStyle = css(
  { ...titleStyle },
  s.colorBlack,
)

const postsAsListblackTitleStyle = css(
  { ...blackTitleStyle },
  s.fullWidth,
  s.maxSiteWidth,
  css({ margin: '0 auto' }),
)

const postsAsListStyle = css(
  s.fullWidth,
  s.maxSiteWidth,
  css({ margin: '0 auto' }),
)

class ArtistInviteSubmissionsAsGridSimple extends PureComponent { // eslint-disable-line max-len, react/no-multi-comp
  static propTypes = {
    submissionIds: PropTypes.object.isRequired,
    toggleLightBox: PropTypes.func.isRequired,
    columnCount: PropTypes.number.isRequired,
    headerText: PropTypes.string,
  }

  static defaultProps = {
    submissionIds: null,
    toggleLightBox: null,
    columnCount: null,
    headerText: null,
  }

  render() {
    const {
      toggleLightBox,
      submissionIds,
      columnCount,
      headerText,
    } = this.props

    if (!submissionIds || submissionIds.size === 0) { return null }

    const columns = []
    for (let i = 0; i < columnCount; i += 1) { columns.push([]) }
    submissionIds.forEach((value, index) =>
      columns[index % columnCount].push(submissionIds.get(index)),
    )

    return (
      <div className={`Posts asGrid ${postGridStyle}`}>
        {headerText &&
          <div className={titleWrapperStyle}>
            <h2 className={blackTitleStyle}>{headerText}</h2>
          </div>
        }
        {columns.map((columnSubmissionIds, i) =>
          (<div className="Column" key={`column_${i + 1}`}>
            {columnSubmissionIds.map(id => (
              <article className="PostGrid ArtistInviteSubmission" key={`postsAsGrid_${id}`}>
                <ArtistInviteSubmissionContainer
                  toggleLightBox={toggleLightBox}
                  submissionId={id}
                />
              </article>
            ))}
          </div>),
        )}
      </div>
    )
  }
}

// wrap posts list in LightBox factory
const ArtistInviteSubmissionsAsGrid = withLightBoxContainer(ArtistInviteSubmissionsAsGridSimple)

export const artistInviteSubmissionsAsGrid = (submissionIds, columnCount, headerText) => (
  <ArtistInviteSubmissionsAsGrid
    columnCount={columnCount}
    submissionIds={submissionIds}
    headerText={headerText}
  />
)

// ---------+++++++++++++++++++

class ArtistInviteSubmissionsAsListSimple extends PureComponent { // eslint-disable-line max-len, react/no-multi-comp
  static propTypes = {
    toggleLightBox: PropTypes.func.isRequired,
    submissionIds: PropTypes.object.isRequired,
    headerText: PropTypes.string,
  }

  static defaultProps = {
    toggleLightBox: null,
    submissionIds: null,
    headerText: null,
  }

  render() {
    const {
      toggleLightBox,
      submissionIds,
      headerText,
    } = this.props

    return (
      <div className={`Posts asList ${postListStyle}`}>
        {headerText &&
          <h2 className={postsAsListblackTitleStyle}>{headerText}</h2>
        }
        {submissionIds.map(id => (
          <article className={`PostList ArtistInviteSubmission ${postsAsListStyle}`} key={`postsAsList_${id}`}>
            <ArtistInviteSubmissionContainer
              toggleLightBox={toggleLightBox}
              submissionId={id}
            />
          </article>
        ))}
      </div>
    )
  }
}

// wrap posts list in LightBox factory
const ArtistInviteSubmissionsAsList = withLightBoxContainer(ArtistInviteSubmissionsAsListSimple)

export const artistInviteSubmissionsAsList = (submissionIds, headerText) => {
  if (!submissionIds || submissionIds.size === 0) { return null }
  return (
    <ArtistInviteSubmissionsAsList
      submissionIds={submissionIds}
      headerText={headerText}
    />
  )
}

// POSTS
class PostsAsGridSimple extends PureComponent { // eslint-disable-line react/no-multi-comp
  static propTypes = {
    toggleLightBox: PropTypes.func.isRequired,
    postIds: PropTypes.object.isRequired,
    columnCount: PropTypes.number.isRequired,
    isPostHeaderHidden: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    toggleLightBox: null,
    postIds: null,
    isPostHeaderHidden: false,
  }

  render() {
    const {
      columnCount,
      isPostHeaderHidden,
      postIds,
      toggleLightBox,
    } = this.props

    const postIdsAsList = postIds.toList()

    const columns = []
    for (let i = 0; i < columnCount; i += 1) { columns.push([]) }
    postIdsAsList.forEach((value, index) =>
      columns[index % columnCount].push(postIdsAsList.get(index)),
    )

    return (
      <div className={`Posts asGrid ${postGridStyle}`}>
        {columns.map((columnPostIds, i) =>
          (<div className="Column" key={`column_${i + 1}`}>
            {columnPostIds.map(id =>
              (<article className="PostGrid" key={`postsAsGrid_${id}`}>
                <PostContainer
                  isPostHeaderHidden={isPostHeaderHidden}
                  postId={id}
                  toggleLightBox={toggleLightBox}
                />
              </article>),
            )}
          </div>),
        )}
      </div>
    )
  }
}

// wrap posts grid in LightBox factory
const PostsAsGrid = withLightBoxContainer(PostsAsGridSimple)

export const postsAsGrid = (postIds, columnCount, isPostHeaderHidden) => (
  <PostsAsGrid
    columnCount={columnCount}
    postIds={postIds}
    isPostHeaderHidden={isPostHeaderHidden}
  />
)

class PostsAsListSimple extends PureComponent { // eslint-disable-line react/no-multi-comp
  static propTypes = {
    toggleLightBox: PropTypes.func.isRequired,
    postIds: PropTypes.object.isRequired,
    isPostHeaderHidden: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    toggleLightBox: null,
    postIds: null,
    isPostHeaderHidden: false,
  }

  render() {
    const {
      isPostHeaderHidden,
      postIds,
      toggleLightBox,
    } = this.props

    return (
      <div className={`Posts asList ${postListStyle}`}>
        {postIds.map(id =>
          (<article className="PostList" key={`postsAsList_${id}`}>
            <PostContainer
              postId={id}
              isPostHeaderHidden={isPostHeaderHidden}
              toggleLightBox={toggleLightBox}
            />
          </article>),
        )}
      </div>
    )
  }
}

// wrap posts list in LightBox factory
const PostsAsList = withLightBoxContainer(PostsAsListSimple)

export const postsAsList = (postIds, columnCount, isPostHeaderHidden) => (
  <PostsAsList
    postIds={postIds}
    isPostHeaderHidden={isPostHeaderHidden}
  />
)

const relatedPostsTitleStyle = css(
  s.fontSize18,
  s.colorA,
  s.m20,
  media(s.minBreak4, s.ml40),
)

class PostsAsRelatedSimple extends PureComponent { // eslint-disable-line react/no-multi-comp
  static propTypes = {
    toggleLightBox: PropTypes.func.isRequired,
    postIds: PropTypes.object.isRequired,
    columnCount: PropTypes.number.isRequired,
    isPostHeaderHidden: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    toggleLightBox: null,
    postIds: null,
    isPostHeaderHidden: false,
  }

  render() {
    const {
      columnCount,
      isPostHeaderHidden,
      postIds,
      toggleLightBox,
    } = this.props

    const columns = []

    // this is for post detail when the comments are fixed to the right
    const finalColumnCount = columnCount > 3 ? columnCount - 1 : columnCount
    for (let i = 0; i < finalColumnCount; i += 1) { columns.push([]) }

    postIds.forEach((value, index) => columns[index % finalColumnCount].push(postIds.get(index)))

    return (
      <div className={`Posts asGrid ${postGridStyle}`}>
        {postIds.size &&
          <h2 className={relatedPostsTitleStyle}>
            Related Posts
          </h2>
        }
        {columns.map((columnPostIds, i) =>
          (<div className="Column" key={`column_${i + 1}`}>
            {columnPostIds.map(id =>
              (<article className="PostGrid" key={`postsAsGrid_${id}`}>
                <PostContainer
                  isPostHeaderHidden={isPostHeaderHidden}
                  isRelatedPost
                  postId={id}
                  toggleLightBox={toggleLightBox}
                />
              </article>),
            )}
          </div>),
        )}
      </div>
    )
  }
}

// wrap related posts grid in LightBox factory
const PostsAsRelated = withLightBoxContainer(PostsAsRelatedSimple)

export const postsAsRelated = (postIds, columnCount, isPostHeaderHidden) => (
  <PostsAsRelated
    columnCount={columnCount}
    postIds={postIds}
    isPostHeaderHidden={isPostHeaderHidden}
    isRelatedPost
  />
)

// USERS
export const usersAsCompact = userIds =>
  userIds.map(id =>
    (<UserContainer
      key={`userCompact_${id}`}
      type="compact"
      userId={id}
    />),
  )

export const usersAsGrid = userIds =>
  (<div className="Users asGrid">
    {userIds.map(id =>
      (<UserContainer
        key={`userGrid_${id}`}
        type="grid"
        userId={id}
      />),
    )}
  </div>)

export const usersAsInviteeList = invitationIds =>
  (<div className="Users asInviteeList">
    {invitationIds.map(id =>
      (<UserContainer
        invitationId={id}
        key={`userInviteeList_${id}`}
        type="invitee"
      />),
    )}
  </div>)

export const usersAsInviteeGrid = invitationIds =>
  (<div className="Users asInviteeGrid">
    {invitationIds.map(id =>
      (<UserContainer
        className="UserInviteeGrid"
        invitationId={id}
        key={`userInviteeGrid_${id}`}
        type="invitee"
      />),
    )}
  </div>)

const generateNotificationId = (notification, i) =>
  (`notificationParser_${notification.get('createdAt', Date.now())}_${i + 1}`)

// NOTIFICATIONS
export const notificationList = notifications =>
  (<div className="Notifications">
    {notifications.map((notification, i) =>
      (<NotificationContainer
        key={generateNotificationId(notification, i)}
        notification={notification}
      />),
    )}
  </div>)

// SETTINGS
export const profileToggles = settings =>
  settings.map((setting, index) => {
    if (!isElloAndroid() && setting.get('label').toLowerCase().indexOf('push') === 0) { return null }
    const arr = [<TreeButton key={`settingLabel_${setting.get('label')}`}>{setting.get('label')}</TreeButton>]
    arr.push(
      <TreePanel key={`settingItems_${setting.get('label', index)}`}>
        {setting.get('items').map(item => (
          <Preference
            definition={{ term: item.get('label'), desc: item.get('info') }}
            id={item.get('key')}
            key={`preference_${item.get('key')}`}
            onToggleChange={preferenceToggleChanged}
          />
        ))}
      </TreePanel>,
    )
    return arr
  })

