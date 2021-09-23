import React from 'react'
import PropTypes from 'prop-types'
import Editor from '../editor/Editor'
import PostContainer from '../../containers/PostContainer'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'
import { loadRelatedPosts } from '../../actions/posts'
import { LaunchMobileCommentEditorButton, LaunchNativeCommentEditorButton } from '../posts/PostRenderables'
import { css, hover, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import * as ElloAndroidInterface from '../../lib/android_interface'

const postDetailStyle = css(
  s.relative,
  select('& .ViewsTool.isPill.isPostDetail > a', s.colorA, { backgroundColor: 'transparent' }, hover({ backgroundColor: 'transparent' })),
  select('& .PostDetails.Posts.asList aside .PostDetailAsideTop',
    select('& header', s.px20, { borderBottom: '1px solid #f2f2f2' }),
    select('& footer', s.px20, { borderBottom: '1px solid #f2f2f2' }),
  ),
  select('& .PostDetails.Posts.asList .PostList > .Post, & .PostDetails.Posts.asList > aside .PostDetailAsideTop',
    select('& .PostToolValue', s.fontSize18, s.ml10),
    select('& .PostTool .SVGIcon + .PostToolValue', s.fontSize18, { marginLeft: 15 }),
    select('& .PostHeaderTimeAgoLink',
      media(s.minBreak3,
        s.block,
        s.pointerNone,
        { right: 20 },
      ),
    ),
    select('& .PostTools',
      s.flex,
      s.justifySpaceBetween,
      s.itemsCenter,
      s.p0,
      media(s.minBreak3, s.pr10, { paddingLeft: 15, maxWidth: 640 }),
      select('& .ShyTool',
        s.absolute,
        s.pointerAuto,
        s.opacity1,
        { top: -50 },
        modifier('.EditTool', { right: 0 }),
        modifier('.DeleteTool', { right: 0 }),
      ),
      select('& .SVGIcon', { transform: 'scale(1.5)' }, select('& > g', { strokeWidth: 0.9375 })),
      select('& .CommentTool', s.displayNone),
      select('& .WatchTool', s.displayNone),
      select('& .FlagTool', s.displayNone),
      select('& .TimeAgoTool', s.displayNone),
      select('& .CategoryHistory', s.displayNone),
      select('& .ShareTool', { position: 'static' }),
      select('& .ViewsTool', s.pointerNone, modifier('.isPill', { marginRight: '0 !important' })),
    ),
  ),
  select('& .PostDetails.Posts.asList .PostList > .Post',
    select('& .PostTools',
      s.pt30,
      s.pb40,
      { height: 'auto' },
    ),
  ),
  select('> .PostDetails.Posts.asList', s.relative),
  select('& .PostDetails.Posts.asList .PostDetailAsideBottom',
    select('& .PostTools',
      s.px0,
      s.pt0,
      s.flex,
      s.justifyStart,
      {
        paddingBottom: 15,
        height: 'auto',
      },
      media(s.minBreak3, s.justifyEnd, s.px10),
    ),
    select('& .PostTool', s.displayNone,
      modifier('.WatchTool', s.block),
      modifier('.FlagTool', s.block, s.opacity1, s.pointerAuto),
    ),
    select('& .CategoryHistory',
      s.pl20,
      s.pr20,
    ),
  ),
  media(
    s.maxBreak2,
    select('&.PostDetail.MainView', { paddingBottom: 0 }), // select override because of legacy css
  ),
)

const listStyle = css(
  s.px10,
  media(
    s.minBreak3,
    s.overflowScrollWebY,
    { height: '100vh', paddingBottom: 40 },
    s.px20,
  ),
  media(
    s.minBreak3,
    { width: 'calc(100vw - 420px)' },
    select('& .PostBody > div', s.flex, s.flexColumn, s.justifyCenter, s.itemsCenter, s.pt20),
  ),
  select('.PostDetails & .TabListStreamContainer', s.px0),
  select('& .StreamContainer.empty',
    media(
      s.minBreak3,
      { paddingBottom: 42 },
    ),
  ),
)

const relatedPostsStyle = css(
  select('& .Column',
    media(s.minBreak3, { width: 'calc(50% - 20px)' }),
    media(s.minBreak4, { width: 'calc(33.33333% - 40px)' }),
    media(s.minBreak5, { width: 'calc(25% - 40px)' }),
    media(s.minBreak6, { width: 'calc(20% - 40px)' }),
    media(s.minBreak7, { width: 'calc(16.66666% - 40px)' }),
  ),
)

const asideStyle = css(
  s.absolute,
  s.overflowScrollWebY,
  { height: '100vh', paddingBottom: 160, width: 420, borderLeft: '1px solid #f2f2f2', top: 0, right: 0 },
  select('& .CommentContent',
    s.m20,
    select('& .Paginator',
      s.m0,
      s.mt30,
      s.fullWidth,
    ),
  ),
  select('.PostDetails & .TabListStreamContainer', s.px0),
  select('& .UserProfileCard',
    media(s.minBreak3, s.mt20, { width: 'calc(100% - 40px)' }),
  ),
)

const CommentContent = (
  { activeType, avatar, hasEditor, isInlineCommenting, isLoggedIn, post, streamAction },
  { onToggleInlineCommenting },
) => {
  let editorOrButton = null
  if (isLoggedIn && ElloAndroidInterface.supportsNativeEditor()) {
    editorOrButton = <LaunchNativeCommentEditorButton avatar={avatar} post={post} />
  } else if (hasEditor && activeType === 'comments') {
    if (isInlineCommenting) {
      editorOrButton = <Editor post={post} isComment onCancel={onToggleInlineCommenting} />
    } else {
      editorOrButton = <LaunchMobileCommentEditorButton avatar={avatar} post={post} />
    }
  }

  if (isLoggedIn) {
    return (
      <div className="CommentContent">
        {editorOrButton}
        {streamAction &&
          <StreamContainer
            action={streamAction}
            className="TabListStreamContainer"
            key={`TabListStreamContainer_${activeType}`}
            paginatorText="Load More"
            shouldInfiniteScroll={false}
          />
        }
      </div>
    )
  }
  return null
}
CommentContent.propTypes = {
  activeType: PropTypes.string.isRequired,
  avatar: PropTypes.object,
  hasEditor: PropTypes.bool.isRequired,
  isInlineCommenting: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  post: PropTypes.object.isRequired,
  streamAction: PropTypes.object,
}
CommentContent.defaultProps = {
  avatar: null,
  isInlineCommenting: false,
  streamAction: null,
}
CommentContent.contextTypes = {
  onToggleInlineCommenting: PropTypes.func.isRequired,
}

// TODO: Remove references to the PostDetailStreamContainer styles
export const PostDetail = (props) => {
  const {
    columnCount,
    post,
    shouldInlineComments,
    toggleLightBox,
  } = props
  return (
    <MainView className={`PostDetail ${postDetailStyle}`}>
      <div className="PostDetails Posts asList">
        <article className={`PostList ${listStyle}`} id={`Post_${post.get('id')}`}>
          <PostContainer
            isNarrowPostDetail={shouldInlineComments}
            postId={post.get('id')}
            toggleLightBox={shouldInlineComments ? toggleLightBox : null}
            type={shouldInlineComments ? null : 'PostDetailBody'}
          />
          {shouldInlineComments && <CommentContent {...props} />}
          <StreamContainer
            action={loadRelatedPosts(`~${post.get('token')}`, columnCount > 2 ? columnCount - 1 : columnCount)}
            className={`RelatedPostsStreamContainer ${relatedPostsStyle}`}
            shouldInfiniteScroll={false}
          />
          {shouldInlineComments && <PostContainer type="PostDetailAsideBottom" postId={post.get('id')} />}
        </article>
        {!shouldInlineComments &&
          <aside className={`PostSideBar ${asideStyle}`}>
            <PostContainer type="PostDetailAsideTop" postId={post.get('id')} />
            <CommentContent {...props} isInlineCommenting />
            <PostContainer type="PostDetailAsideBottom" postId={post.get('id')} />
          </aside>
        }
      </div>
    </MainView>
  )
}
PostDetail.propTypes = {
  columnCount: PropTypes.number.isRequired,
  post: PropTypes.object.isRequired,
  shouldInlineComments: PropTypes.bool.isRequired,
  toggleLightBox: PropTypes.func,
}
PostDetail.defaultProps = {
  toggleLightBox: null,
}

export const PostDetailError = ({ children }) =>
  (<MainView className="PostDetail">
    <section className="StreamContainer isError">
      {children}
    </section>
  </MainView>)
PostDetailError.propTypes = {
  children: PropTypes.node.isRequired,
}

