import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import { selectCommentOriginalPostId } from '../selectors/comment'
import {
  selectInnerHeight,
  selectInnerWidth,
  selectIsLightBoxActive,
  selectIsMobile,
} from '../selectors/gui'
import { setIsLightBoxActive } from '../actions/gui'
import { selectPostsAssetIds } from '../selectors/light_box'
import { selectPostIsGridMode } from '../selectors/post'
import { scrollToPosition } from '../lib/jello'
import LightBox from '../components/light_box/LightBoxRenderables'
import { SHORTCUT_KEYS } from '../constants/application_types'

// Wraps LightBox controls/state around a component
// This function takes a component
function LightBoxWrapper(WrappedComponent) {
  class BaseLightBox extends Component {
    static propTypes = {
      commentIds: PropTypes.object, // for comment stream
      dispatch: PropTypes.func.isRequired,
      innerHeight: PropTypes.number,
      innerWidth: PropTypes.number,
      isMobile: PropTypes.bool.isRequired,
      isRelatedPost: PropTypes.bool,
      isGridMode: PropTypes.bool.isRequired,
      isLightBoxActive: PropTypes.bool.isRequired,
      parentPostId: PropTypes.string,
      postAssetIdPairs: PropTypes.array, // post/asset id pairs
    }

    static defaultProps = {
      commentIds: null,
      innerHeight: null,
      innerWidth: null,
      isRelatedPost: false,
      parentPostId: null,
      postAssetIdPairs: null,
    }

    constructor(props) {
      super(props)
      this.state = {
        open: false,
        loading: true,
        loaded: false,
        direction: null,
        directionsEnabled: {
          next: false,
          prev: false,
        },
        assetIdToSet: null,
        assetIdToSetPrev: null,
        assetIdToSetNext: null,
        postIdToSet: null,
        postIdToSetPrev: null,
        postIdToSetNext: null,
        queuePostIdsArray: null,
        oldestQueuePostId: null,
        innerWidth: this.props.innerWidth,
        innerHeight: this.props.innerHeight,
        resize: false,
        queueOffsetX: 0,
        showOffsetTransition: false,
      }

      this.handleImageClick = this.handleImageClick.bind(this)
      this.handleViewPortResize = this.handleViewPortResize.bind(this)
      this.close = this.close.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
      // set keybindings
      if (!prevState.open && this.state.open) {
        this.bindKeys()
        if (!this.props.isLightBoxActive) {
          if (!this.props.isLightBoxActive) {
            this.props.dispatch(setIsLightBoxActive({ isActive: true }))
          }
        }
      }

      // light box was closed externally
      if (this.state.open &&
        (prevProps.isLightBoxActive && !this.props.isLightBoxActive)) {
        this.close()
      }

      // might need to shift the queue left/right if we've added/removed new posts
      if (this.state.open && (prevState.oldestQueuePostId !== this.state.oldestQueuePostId)) {
        const nextPrev = this.getSetPagination(this.state.assetIdToSet,
          this.state.postIdToSet,
          false)

        // need to reset; new posts may have shifted queue
        if (this.state.direction === 'next') {
          this.slideQueue(nextPrev.assetIdToSetPrev, nextPrev.postIdToSetPrev)
        } else {
          this.slideQueueDomDelay = setTimeout(() => {
            this.slideQueue(nextPrev.assetIdToSetNext, nextPrev.postIdToSetNext)
          }, 1) // small timeout allows DOM time to instantiate new post
        }
      }

      let slideDelay = 100
      let transitionDelay = 200
      if (!prevState.open) {
        slideDelay = this.props.isGridMode ? 1250 : 200
      }
      if (this.props.isGridMode) {
        transitionDelay = !prevState.open ? 1250 : 500
      }

      // update the DOM post Ids array and move the queue to the select item
      if (this.state.open &&
        ((prevState.assetIdToSet !== this.state.assetIdToSet) ||
        (prevState.postIdToSet !== this.state.postIdToSet))) {
        this.constructPostIdsArray()

        this.slideQueueDelay = setTimeout(() => {
          this.slideQueue()
        }, slideDelay)
      }

      // remove loading class if lightbox was recently opened
      if (this.state.open && !prevState.open) {
        this.removeLoadingClassDelay = setTimeout(() => {
          this.removeLoadingClass()
        }, transitionDelay)
      }

      // check for viewport resizes
      if ((this.state.open && !this.state.resize) &&
        ((this.props.innerWidth !== this.state.innerWidth) ||
        (this.props.innerHeight !== this.state.innerHeight))) {
        this.handleViewPortResize(true)
      }

      // reset resize bool
      if (!prevState.resize && this.state.resize) {
        this.handleViewPortResize(false)
      }
    }

    componentWillUnmount() {
      const releaseKeys = true
      this.bindKeys(releaseKeys)
      if (this.state.open && this.props.isLightBoxActive) {
        this.props.dispatch(setIsLightBoxActive({ isActive: false }))
      }

      // clear timeouts
      if (this.slideQueueDomDelay) { clearTimeout(this.slideQueueDomDelay) }
      if (this.slideQueueDelay) { clearTimeout(this.slideQueueDelay) }
      if (this.removeLoadingClassDelay) { clearTimeout(this.removeLoadingClassDelay) }
      if (this.slideQueueResizeDelay) { clearTimeout(this.slideQueueResizeDelay) }
      if (this.setLoadedStateDelay) { clearTimeout(this.setLoadedStateDelay) }
    }

    getSetPagination(assetId, postId, updateState = true) {
      const { postAssetIdPairs } = this.props

      if (postAssetIdPairs) {
        const numberItems = postAssetIdPairs.length
        let existingItemIndex = null

        // match `assetId` and `postId` with `postAssetIdPairs` pair
        postAssetIdPairs.map((postAssetIdPair, index) => {
          if ((postAssetIdPair[1] === assetId) &&
            (postAssetIdPair[0] === postId)) {
            existingItemIndex = index
            return existingItemIndex
          }
          return null
        })

        // if there was a match, set prev/next indices + grab ids
        if (existingItemIndex !== null) {
          let prevIndex = existingItemIndex - 1
          let nextIndex = existingItemIndex + 1
          let isPrevEnabled = true
          let isNextEnabled = true

          if (existingItemIndex === 0) {
            prevIndex = 0
            isPrevEnabled = false
          }

          if (existingItemIndex === (numberItems - 1)) {
            nextIndex = existingItemIndex
            isNextEnabled = false
          }

          const prevItemAssetId = postAssetIdPairs[prevIndex][1]
          const nextItemAssetId = postAssetIdPairs[nextIndex][1]
          const prevItemPostId = postAssetIdPairs[prevIndex][0]
          const nextItemPostId = postAssetIdPairs[nextIndex][0]

          if (updateState) {
            return this.setState({
              assetIdToSetPrev: prevItemAssetId,
              assetIdToSetNext: nextItemAssetId,
              postIdToSetPrev: prevItemPostId,
              postIdToSetNext: nextItemPostId,
              directionsEnabled: {
                next: isNextEnabled,
                prev: isPrevEnabled,
              },
            })
          }
          const nextPrevSet = {
            assetIdToSetPrev: prevItemAssetId,
            assetIdToSetNext: nextItemAssetId,
            postIdToSetPrev: prevItemPostId,
            postIdToSetNext: nextItemPostId,
            directionsEnabled: {
              next: isNextEnabled,
              prev: isPrevEnabled,
            },
          }
          return nextPrevSet
        }
        return null
      }
      return null
    }

    advance(direction) {
      const {
        assetIdToSet,
        assetIdToSetNext,
        assetIdToSetPrev,
        postIdToSet,
        postIdToSetNext,
        postIdToSetPrev,
      } = this.state

      let newAssetIdToSet = null
      let newPostIdToSet = null

      switch (direction) {
        case 'prev':
          newAssetIdToSet = assetIdToSetPrev
          newPostIdToSet = postIdToSetPrev
          break
        case 'next':
          newAssetIdToSet = assetIdToSetNext
          newPostIdToSet = postIdToSetNext
          break
        default:
          newAssetIdToSet = assetIdToSet
          newPostIdToSet = postIdToSet
      }

      // advance to new image
      this.setState({
        direction,
        assetIdToSet: newAssetIdToSet,
        postIdToSet: newPostIdToSet,
      })

      // scroll the page to image
      this.scrollToSelectedAsset(newAssetIdToSet, newPostIdToSet)

      // update pagination
      return this.getSetPagination(newAssetIdToSet, newPostIdToSet)
    }

    slideQueue(assetIdToReset = null, postIdToReset = null) {
      const reset = (assetIdToReset !== null && postIdToReset !== null)

      // either reset the queue position, or advance to new asset
      const assetId = reset ? assetIdToReset : this.state.assetIdToSet
      const postId = reset ? postIdToReset : this.state.postIdToSet
      const assetDomId = `lightBoxAsset_${assetId}_${postId}`

      // select the DOM elements
      const lightBoxDomQueue = document.getElementsByClassName('LightBoxQueue')[0]
      const assetInDom = document.getElementById(assetDomId)

      // measurements
      const viewportWidth = window.innerWidth
      const lightBoxDimensions = lightBoxDomQueue.getBoundingClientRect()
      const assetDimensions = assetInDom.getBoundingClientRect()

      // positioning calculations
      const desiredGap = ((viewportWidth - (assetDimensions.width)) / 2)
      const imageOffsetToBox = assetDimensions.left - lightBoxDimensions.left
      const newOffset = desiredGap - imageOffsetToBox

      // update the box position
      return this.setState({
        queueOffsetX: newOffset,
        showOffsetTransition: !reset,
      })
    }

    scrollToSelectedAsset(newAssetIdToSet, newPostIdToSet) {
      const commentsStream = this.props.commentIds
      const assetDomId = `asset_${newAssetIdToSet}_${newPostIdToSet}`

      // grab elements from the dom
      const postList = document.getElementsByClassName('PostList')
      const postSideBar = document.getElementsByClassName('PostSideBar')
      const assetInDom = document.getElementById(assetDomId)

      if (assetInDom) {
        // determine scroll offset of asset in dom
        let assetInDomTopOffset = null
        // post detail view (scrolling inner-div needs different treatement)
        if (postSideBar.length) {
          if (commentsStream) {
            assetInDomTopOffset = assetInDom.getBoundingClientRect().top + postSideBar[0].scrollTop
          } else {
            assetInDomTopOffset = assetInDom.getBoundingClientRect().top + postList[0].scrollTop
          }
        } else {
          assetInDomTopOffset = assetInDom.getBoundingClientRect().top + window.scrollY
        }

        // adjust scroll offset for window height / nav bar
        const windowHeight = window.innerHeight
        const offsetPadding = (windowHeight / 10)
        const scrollToOffset = (assetInDomTopOffset - offsetPadding)

        // scroll to new position
        if (postList.length && postSideBar.length) { // post detail view
          let scrollElement = postList[0]
          if (commentsStream) {
            scrollElement = postSideBar[0]
          }
          return scrollToPosition(0, scrollToOffset, { el: scrollElement, duration: 0 })
        }
        return scrollToPosition(0, scrollToOffset, { duration: 0 }) // stream container view
      }
      return null
    }

    close() {
      const releaseKeys = true
      this.bindKeys(releaseKeys)
      if (this.props.isLightBoxActive) {
        this.props.dispatch(setIsLightBoxActive({ isActive: false }))
      }

      return this.setState({
        open: false,
        loading: true,
        loaded: false,
        assetIdToSet: null,
        queueOffsetX: 0,
      })
    }

    handleMaskClick(e) {
      if (e.target.nodeName !== 'IMG' &&
        e.target.nodeName !== 'VIDEO' &&
        e.target.nodeName !== 'BUTTON' &&
        !e.target.classList.contains('PostTool')) {
        return this.close()
      }
      return null
    }

    handleImageClick(assetId, postId) {
      const {
        open,
        assetIdToSet,
        assetIdToSetPrev,
        postIdToSet,
        postIdToSetPrev,
      } = this.state

      if (open && (assetId === assetIdToSet) && (postId === postIdToSet)) {
        return this.close()
      }

      // determine direction
      let direction = 'next'
      if (open && (assetId === assetIdToSetPrev) && (postId === postIdToSetPrev)) {
        direction = 'prev'
      }

      // advance to new image
      this.setState({
        open: true,
        direction,
        assetIdToSet: assetId,
        postIdToSet: postId,
      })

      // scroll the page to image
      this.scrollToSelectedAsset(assetId, postId)

      // update pagination
      return this.getSetPagination(assetId, postId)
    }

    handleViewPortResize(isResize) {
      // resize on
      if (isResize) {
        return this.setState({
          innerWidth,
          innerHeight,
          resize: true,
        })
      }

      // resize off
      this.slideQueueResizeDelay = setTimeout(() => {
        this.slideQueue(this.state.assetIdToSet, this.state.postIdToSet)
      }, 250)

      return this.setState({
        resize: false,
      })
    }

    removeLoadingClass() {
      const setLodedDelay = 200

      this.setState({
        loading: false,
      })

      this.setLoadedStateDelay = setTimeout(() => {
        this.setState({
          loaded: true,
        })
      }, setLodedDelay)
      return null
    }

    bindKeys(unbind) {
      Mousetrap.unbind(SHORTCUT_KEYS.ESC)
      Mousetrap.unbind(SHORTCUT_KEYS.PREV)
      Mousetrap.unbind(SHORTCUT_KEYS.NEXT)

      if (!unbind) {
        Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.close() })
        Mousetrap.bind(SHORTCUT_KEYS.PREV, () => { this.advance('prev') })
        Mousetrap.bind(SHORTCUT_KEYS.NEXT, () => { this.advance('next') })
      }
    }

    constructPostIdsArray() {
      const { postAssetIdPairs } = this.props
      const { assetIdToSet, postIdToSet } = this.state
      const allPostIds = []

      // set the offset indices
      const assetsOffset = 6
      const indexOfSelected = postAssetIdPairs.findIndex(
        postAssetIdPair =>
          (postAssetIdPair[0] === postIdToSet && postAssetIdPair[1] === assetIdToSet))
      const indexLower = indexOfSelected > (assetsOffset - 1) ? (indexOfSelected - assetsOffset) : 0
      const indexHigher = indexOfSelected + assetsOffset

      // truncate the postAssetIdPairs array
      const truncatedPostAssetIdPairs = postAssetIdPairs.slice(indexLower, indexHigher)
      truncatedPostAssetIdPairs.forEach(postAssedIdPair => allPostIds.push(postAssedIdPair[0]))

      // grab the unique postIds from the pairs array
      const postIds = Array.from(new Set(allPostIds))

      this.setState({
        queuePostIdsArray: postIds,
        oldestQueuePostId: postIds[0],
      })

      return postIds
    }

    render() {
      const {
        commentIds,
        isRelatedPost,
        isMobile,
        parentPostId,
        postAssetIdPairs,
      } = this.props

      const {
        assetIdToSet,
        directionsEnabled,
        loading,
        loaded,
        open,
        queueOffsetX,
        queuePostIdsArray,
        resize,
        showOffsetTransition,
      } = this.state

      return (
        <div className="with-lightbox">
          {open &&
            <LightBox
              advance={direction => this.advance(direction)}
              advanceDirections={directionsEnabled}
              assetIdToSet={assetIdToSet}
              close={() => this.close()}
              commentIds={commentIds}
              handleMaskClick={e => this.handleMaskClick(e)}
              handleImageClick={
                (assetId, postIdToSet) => this.handleImageClick(assetId, postIdToSet)
              }
              isMobile={isMobile}
              isRelatedPost={isRelatedPost}
              loading={loading}
              loaded={loaded}
              parentPostId={parentPostId}
              postAssetIdPairs={postAssetIdPairs}
              postIdToSet={this.state.postIdToSet}
              queuePostIdsArray={queuePostIdsArray}
              queueOffsetX={queueOffsetX}
              resize={resize}
              showOffsetTransition={showOffsetTransition}
            />
          }
          <WrappedComponent
            toggleLightBox={
              (assetId, postIdToSet) => this.handleImageClick(assetId, postIdToSet)
            }
            {...this.props}
          />
        </div>
      )
    }
  }

  function mapStateToProps(state, props) {
    const isGridMode = selectPostIsGridMode(state, props)
    const isLightBoxActive = selectIsLightBoxActive(state)

    // set up commentId for grabbing originalPostId and creating parentPostId
    let commentId = null
    if (isLightBoxActive && !isGridMode) {
      if (props.commentIds) {
        props.commentIds.map((id) => {
          commentId = id
          return null
        })
      }
    }

    return {
      innerHeight: selectInnerHeight(state),
      innerWidth: selectInnerWidth(state),
      isLightBoxActive,
      isGridMode,
      isMobile: selectIsMobile(state),
      parentPostId: selectCommentOriginalPostId(state, { commentId }),
      postAssetIdPairs: selectPostsAssetIds(state, props),
    }
  }

  return connect(mapStateToProps)(BaseLightBox)
}

export default LightBoxWrapper
