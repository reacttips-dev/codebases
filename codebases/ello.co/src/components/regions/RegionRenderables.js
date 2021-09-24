import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import EmbedRegion from '../regions/EmbedRegion'
import ImageRegion, { getTempAssetId } from '../regions/ImageRegion'
import TextRegion from '../regions/TextRegion'
import { isIOS } from '../../lib/jello'

function handleImageRegionClick(event, assetId, postId, toggleLightBox) {
  const buyButtonClick = event.target.classList.contains('ElloBuyButton')

  if (!buyButtonClick && toggleLightBox) {
    return toggleLightBox(assetId, postId)
  }
  return null
}

export class RegionItems extends PureComponent {
  static propTypes = {
    columnWidth: PropTypes.number.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    isComment: PropTypes.bool,
    isRelatedPost: PropTypes.bool,
    isLightBox: PropTypes.bool,
    resizeLightBox: PropTypes.bool,
    toggleLightBox: PropTypes.func,
    lightBoxSelectedIdPair: PropTypes.object,
    postId: PropTypes.string,
  }
  static defaultProps = {
    isComment: false,
    isLightBox: false,
    isRelatedPost: false,
    resizeLightBox: false,
    toggleLightBox: null,
    lightBoxSelectedIdPair: null,
    postId: null,
  }

  getLightBoxSelected(assetId) {
    const {
      postId,
      lightBoxSelectedIdPair,
    } = this.props

    let selected = false
    if (lightBoxSelectedIdPair) {
      selected = ((assetId === lightBoxSelectedIdPair.assetIdToSet) &&
        (postId === lightBoxSelectedIdPair.postIdToSet))
    }
    return selected
  }

  render() {
    const {
      columnWidth,
      commentOffset,
      content,
      contentWidth,
      detailPath,
      innerHeight,
      isComment,
      isGridMode,
      isPostDetail,
      isRelatedPost,
      isLightBox,
      resizeLightBox,
      toggleLightBox,
      postId,
    } = this.props
    // sometimes the content is null/undefined for some reason
    if (!content) { return null }

    const cells = []
    content.forEach((region) => {
      const regionKey = region.get('id', JSON.stringify(region.get('data')))

      switch (region.get('kind')) {
        case 'text':
          if (!isLightBox) {
            cells.push(
              <TextRegion
                content={region.get('data')}
                detailPath={detailPath}
                isComment={isComment}
                isGridMode={isGridMode}
                key={`TextRegion_${regionKey}`}
              />,
            )
          }
          break
        case 'image': {
          const asset = region.get('asset')
          const regionContent = region.get('data')

          let assetId = region.getIn(['links', 'assets'])
          if (!assetId) {
            // brand new post
            if (region.get('kind') === 'image') {
              const url = region.getIn(['data', 'url'])
              if (url) {
                assetId = getTempAssetId(url)
              }
            }
          }

          cells.push(
            <ImageRegion
              key={`ImageRegion_${regionKey}`}
              postId={postId}
              assetId={assetId}
              asset={asset}
              buyLinkURL={region.get('linkUrl')}
              columnWidth={columnWidth}
              commentOffset={commentOffset}
              content={regionContent}
              contentWidth={contentWidth}
              detailPath={detailPath}
              innerHeight={innerHeight}
              isComment={isComment}
              isGridMode={isGridMode}
              isPostDetail={isPostDetail}
              isRelatedPost={isRelatedPost}
              isLightBoxImage={isLightBox}
              isLightBoxSelected={isLightBox ? this.getLightBoxSelected(assetId) : null}
              resizeLightBoxImage={resizeLightBox}
              shouldUseVideo={!!(asset && asset.getIn(['attachment', 'video', 'url'], null)) && !isIOS() && !isPostDetail}
              handleImageRegionClick={
                event => handleImageRegionClick(event, assetId, postId, toggleLightBox)
              }
            />,
          )
          break
        }
        case 'embed':
          if (!isLightBox) {
            cells.push(
              <EmbedRegion
                detailPath={detailPath}
                isComment={isComment}
                key={`EmbedRegion_${regionKey}`}
                region={region}
              />,
            )
          }
          break
        default:
          break
      }
    })
    // loop through cells to grab out image/text
    return <div>{cells}</div>
  }
}

export function regionItemsForNotifications(content, detailPath) {
  const imageAssets = []
  const texts = []
  content.forEach((region) => {
    switch (region.get('kind')) {
      case 'text':
        texts.push(
          <TextRegion
            content={region.get('data')}
            detailPath={detailPath}
            isGridMode={false}
            key={`TextRegion_${region.get('data')}`}
          />,
        )
        break
      case 'image': {
        const asset = region.get('asset')
        imageAssets.push(
          <ImageRegion
            asset={asset}
            buyLinkURL={region.get('linkUrl')}
            content={region.get('data')}
            detailPath={detailPath}
            isGridMode
            isNotification
            key={`ImageRegion_${JSON.stringify(region.get('data'))}`}
            links={region.get('links')}
            shouldUseVideo={!!(asset && asset.getIn(['attachment', 'video', 'url'], null)) && !isIOS()}
          />,
        )
        break
      }
      case 'embed':
        imageAssets.push(
          <EmbedRegion
            detailPath={detailPath}
            key={`EmbedRegion_${JSON.stringify(region.get('data'))}`}
            region={region}
          />,
        )
        break
      // Hidden <hr>
      case 'rule':
        texts.push(<hr style={{ margin: '0.375rem', border: 0 }} key={`NotificationRule_${detailPath}`} />)
        break
      default:
        break
    }
  })
  return { assets: imageAssets, texts }
}

