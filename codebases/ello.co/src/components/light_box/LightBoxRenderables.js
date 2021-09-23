import React from 'react'
import PropTypes from 'prop-types'
import { css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import PostContainer from './../../containers/PostContainer'
import PostLightBoxContainer from './../../containers/PostLightBoxContainer'
import CommentContainer from './../../containers/CommentContainer'
import { DismissButtonLGReverse } from './../buttons/Buttons'
import { LightBoxArrow } from '../assets/Icons'

const baseLightBoxStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { margin: '0 auto' },
  select(
    '> .LightBoxMask',
    s.fullscreen,
    s.fullWidth,
    s.fullHeight,
    s.bgcModal,
    s.zModal,
    { transition: `background-color 0.4s ${s.ease}` },
    select(
      '> .LightBox',
      s.fixed,
      s.flood,
      s.fullWidth,
      s.fullHeight,
      s.overflowHidden,
      s.flex,
      s.itemsCenter,
      select(
        '> .LightBoxQueue',
        s.transitionOpacity,
        s.relative,
        {
          width: 'auto',
          whiteSpace: 'nowrap',
          opacity: 1,
        },
      ),
    ),
    select(
      '> .LightBox.loaded',
      select(
        '> .LightBoxQueue.transition',
        s.transitionTransform,
      ),
    ),
    select(
      '> .LightBox.loading',
      select(
        '> .LightBoxQueue',
        { opacity: 0 },
      ),
    ),
  ),
)

const imageRegionStyle = select(
  '> .ImageRegion',
  s.inlineBlock,
  s.relative,
  s.pb20,
  {
    margin: 0,
    marginLeft: 40,
    marginRight: 40,
    width: 'auto',
  },
  media(
    s.maxBreak4,
    { marginLeft: 30,
      marginRight: 30,
    },
  ),
  media(
    s.maxBreak3,
    { marginLeft: 20,
      marginRight: 20,
    },
  ),
  media(
    s.maxBreak2,
    { marginLeft: 10,
      marginRight: 10,
    },
  ),
  select(
    '> .ImgHolderLightBox',
    s.inline,
  ),
)

const commentsLightBoxStyle = css(
  { ...baseLightBoxStyle },
  select(
    '> .LightBoxMask',
    select(
      '> .LightBox',
      select(
        '> .LightBoxQueue',
        select(
          '> .Comment',
          s.inline,
          { padding: 0 },
          select(
            '> .CommentBody',
            s.inline,
            { padding: 0,
              margin: 0,
              border: 'none',
              width: 'auto',
            },
            select(
              '> div',
              s.inline,
              { ...imageRegionStyle },
            ),
          ),
        ),
      ),
    ),
  ),
)

const postsListLightBoxStyle = css(
  { ...baseLightBoxStyle },
  select(
    '> .LightBoxMask',
    select(
      '> .LightBox',
      select(
        '> .LightBoxQueue',
        select(
          '> .Post',
          s.inline,
          { margin: 0,
            padding: 0,
          },
          select(
            '> .PostBody',
            s.inline,
            { padding: 0,
              margin: 0,
              border: 'none',
              width: 'auto',
            },
            select(
              '> div',
              s.inline,
              { ...imageRegionStyle },
            ),
          ),
        ),
      ),
    ),
  ),
)

const navButtonStyle = css(
  s.fixed,
  s.flex,
  s.itemsCenter,
  s.justifyCenter,
  s.wv40,
  s.hv40,
  s.zIndex4,
  {
    top: 'calc(50% - 20px)',
    left: 20,
    borderRadius: 40,
    backgroundColor: '#000',
  },

  select('&.next',
    {
      left: 'auto',
      right: 20,
    },
  ),

  // style icon
  select('& .label', s.displayNone),
  select('& .icon',
    s.block,
    {
      width: 14,
      height: 13,
    },
    select('& .LightBoxArrow',
      s.block,
      { verticalAlign: 'baseline' },
      select('& path',
        { fill: '#fff' },
      ),
    ),
  ),
  select('&.prev',
    select('& .icon',
      s.rotate180,
    ),
  ),
)

const postLightBoxContainerStyle = css(
  s.fixed,
  s.block,
  s.fullWidth,
  s.zIndex4,
  {
    bottom: 0,
    left: 0,
  },

  select('& .PostTools.with-lightbox',
    s.flex,
    s.itemsCenter,
    s.relative,
    s.fullWidth,
    s.pt30,
    s.pb10,
    s.pl10,
    s.pr10,
    {
      margin: '0 auto',
      maxWidth: 475,
    },
  ),
)

function setLightBoxStyle(commentIds) {
  if (commentIds) {
    return commentsLightBoxStyle
  }

  return postsListLightBoxStyle
}

const LightBox = ({
  advance,
  advanceDirections,
  assetIdToSet,
  close,
  commentIds,
  handleMaskClick,
  handleImageClick,
  isMobile,
  isRelatedPost,
  loading,
  loaded,
  parentPostId,
  postAssetIdPairs,
  postIdToSet,
  resize,
  showOffsetTransition,
  queuePostIdsArray,
  queueOffsetX,
}) => {
  const lightBoxSelectedIdPair = { assetIdToSet, postIdToSet }

  return (
    <div className={setLightBoxStyle(commentIds)}>
      <div className="LightBoxMask" role="presentation" onClick={handleMaskClick}>
        <DismissButtonLGReverse
          onClick={close}
        />
        {advanceDirections.prev &&
          <button
            className={`prev ${navButtonStyle}`}
            onClick={() => { advance('prev') }}
          >
            <span className="label">
              Previous
            </span>
            <span className="icon">
              <LightBoxArrow />
            </span>
          </button>
        }
        {advanceDirections.next &&
          <button
            className={`next ${navButtonStyle}`}
            onClick={() => { advance('next') }}
          >
            <span className="label">
              Next
            </span>
            <span className="icon">
              <LightBoxArrow />
            </span>
          </button>
        }
        <div className={`LightBox ${loading ? 'loading' : ''}${loaded ? 'loaded' : ''}`}>
          {postIdToSet && // render the post tools
            <div className={`${postLightBoxContainerStyle} controls-holder`}>
              <PostLightBoxContainer
                isMobile={isMobile}
                isRelatedPost={isRelatedPost}
                postId={parentPostId || postIdToSet}
                resizeLightBox={resize}
              />
            </div>
          }
          <div
            className={`LightBoxQueue${showOffsetTransition ? ' transition' : ''}`}
            style={{ transform: `translateX(${queueOffsetX}px)` }}
          >
            {!commentIds &&
              postAssetIdPairs &&
              queuePostIdsArray &&
              queuePostIdsArray.map(postId =>
              (<PostContainer
                key={`lightBoxPost_${postId}`}
                postId={postId}
                isPostHeaderHidden
                isLightBox
                isNarrowPostDetail={false}
                lightBoxSelectedIdPair={lightBoxSelectedIdPair}
                resizeLightBox={resize}
                toggleLightBox={handleImageClick}
              />),
            )}
            {commentIds &&
              postAssetIdPairs &&
              queuePostIdsArray &&
              queuePostIdsArray.map(postId =>
              (<CommentContainer
                key={`lightBoxPost_${postId}`}
                commentId={postId}
                isLightBox
                lightBoxSelectedIdPair={lightBoxSelectedIdPair}
                toggleLightBox={handleImageClick}
              />),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
const propTypes = {
  advance: PropTypes.func.isRequired,
  advanceDirections: PropTypes.object.isRequired,
  assetIdToSet: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  close: PropTypes.func.isRequired,
  commentIds: PropTypes.object,
  handleMaskClick: PropTypes.func.isRequired,
  handleImageClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isRelatedPost: PropTypes.bool,
  parentPostId: PropTypes.string,
  postIdToSet: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  loading: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  postAssetIdPairs: PropTypes.array.isRequired,
  queuePostIdsArray: PropTypes.array,
  queueOffsetX: PropTypes.number.isRequired,
  resize: PropTypes.bool.isRequired,
  showOffsetTransition: PropTypes.bool.isRequired,
}
const defaultProps = {
  commentIds: null,
  parentPostId: null,
  isRelatedPost: false,
  queuePostIdsArray: null,
}
LightBox.propTypes = propTypes
LightBox.defaultProps = defaultProps

export default LightBox
