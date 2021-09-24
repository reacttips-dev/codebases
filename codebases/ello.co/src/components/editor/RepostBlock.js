/* eslint-disable react/no-danger */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { scrollToPosition } from '../../lib/jello'
import { LockIcon, RepostIcon } from '../assets/Icons'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'

function mapStateToProps({ profile: currentUser }) {
  return { currentUser }
}

function getBlockElement(block, uid) {
  const data = block.get('data')
  switch (block.get('kind')) {
    case 'embed':
      return (
        <img key={`repostEmbed_${uid}`} src={data.get('thumbnailLargeUrl')} alt={data.get('service')} />
      )
    case 'image':
      return (
        <img key={`repostImage_${uid}`} src={data.get('url')} alt={data.get('alt')} />
      )
    case 'text':
      return (
        <div key={`repostText_${uid}`} dangerouslySetInnerHTML={{ __html: data }} />
      )
    default:
      return null
  }
}

const toolsStyle = css(
  s.absolute,
  s.colorA,
  s.zIndex2,
  { top: 15, right: 15 },
  media(s.minBreak2, { right: 35 }),
)

class RepostBlock extends Component {

  static propTypes = {
    editorId: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    isGridMode: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    const { isGridMode } = this.props

    // timeout gives images a chance to load/position themselves
    setTimeout(() => {
      this.scrollToRepostActions()
    }, (isGridMode ? 1000 : 500))
  }

  shouldComponentUpdate() {
    return false
  }

  scrollToRepostActions() {
    const { editorId } = this.props

    // scroll the repost block panel to make actions visible
    const postList = document.getElementsByClassName('PostList')
    const postSideBar = document.getElementsByClassName('PostSideBar')
    const repostActions = document.getElementById(editorId)
    let actionTopOffset = null
    if (postSideBar.length) { // post detail view (scrolling inner-div needs different treatement)
      actionTopOffset = repostActions.offsetTop
    } else {
      actionTopOffset = repostActions.getBoundingClientRect().top + window.scrollY
    }
    const windowHeight = window.innerHeight
    const scrollToOffset = (actionTopOffset - (windowHeight / 4))
    if (postList.length && postSideBar.length) { // post detail view
      return scrollToPosition(0, scrollToOffset, { el: postList[0] })
    }
    return scrollToPosition(0, scrollToOffset) // stream container view
  }

  render() {
    const { currentUser, data } = this.props
    return (
      <div className="editor-block readonly">
        <div className="RepostBlockLabel">
          <RepostIcon />
          {` by @${currentUser.get('username')}`}
        </div>
        {data.map((block, i) => getBlockElement(block, i))}
        <div className={toolsStyle}>
          <LockIcon />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(RepostBlock)
