// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const { l } = require('app/scripts/lib/localize');
const { unsplashClient } = require('@trello/unsplash');
const PhotoAttributionComponent = require('app/scripts/views/board-create/photo-attribution-component');
const { Analytics } = require('@trello/atlassian-analytics');

const SCROLL_BUFFER = 8; // insert marker X thumbs from the end of the list

class PhotosList extends React.Component {
  static initClass() {
    this.prototype.displayName = 'PhotosList';
  }

  constructor(props) {
    super(props);

    this.state = {
      uploadingImageID: null,
    };
    this.thumbMap = this.thumbMap.bind(this);
    this.addMarker = this.addMarker.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { images, isLoading } = this.props;
    const { uploadingImageID } = this.state;

    return (
      images.length !== nextProps.images.length ||
      isLoading !== nextProps.isLoading ||
      uploadingImageID !== nextState.uploadingImageID
    );
  }

  render() {
    const {
      collectionID,
      connectionError,
      images,
      isLoading,
      maxPage,
      page,
    } = this.props;

    const shouldShowMore = maxPage > page;
    const loadingClass = isLoading ? 'logo-loading active' : 'logo-loading';
    let thumbs = images.map(this.thumbMap);

    if (shouldShowMore) {
      thumbs = this.addMarker(thumbs);
    }

    return (
      <div className="board-backgrounds-list">
        {(() => {
          if (thumbs.length) {
            return thumbs;
          } else if (
            collectionID === 'search' &&
            !isLoading &&
            !connectionError
          ) {
            return (
              <div className="no-results">
                {l(['background photos', 'no results'])}
              </div>
            );
          }
        })()}
        {connectionError ? (
          <div className="error">
            {l(['background photos', 'connection error unsplash'])}
          </div>
        ) : undefined}
        <div className={loadingClass} />
      </div>
    );
  }

  //##################################################
  // Helper functions ################################
  //##################################################

  thumbMap(image, index) {
    const { uploadingImageID } = this.state;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className="board-background-select"
        key={['thumb', index, image.id].join(':')}
        onClick={this.setUnsplashBackground(image)}
      >
        <span
          className="background-box"
          style={{
            backgroundImage: `url(${image.urls.thumb})`,
          }}
        >
          {uploadingImageID === image.id ? (
            <div className="uploading">
              <span className="spinner small u-float-left" />
              {l([
                'templates',
                'board_background_selection',
                'uploading-ellipsis',
              ])}
            </div>
          ) : (
            <PhotoAttributionComponent user={image.user} size="large" />
          )}
        </span>
      </div>
    );
  }

  setUnsplashBackground(image) {
    return () => {
      // Dependency required at call site to avoid import cycles, do not lift to top of module
      const traceId = Analytics.startTask({
        taskName: 'edit-board/prefs/background',
        source: 'boardMenuDrawerBackgroundPhotosScreen',
      });
      const { ApiPromise } = require('app/scripts/network/api-promise');
      const { boardId } = this.props;

      unsplashClient.trackDownload(image);

      this.setState({ uploadingImageID: image.id });

      return ApiPromise({
        traceId,
        url: `/1/boards/${boardId}/prefs/background`,
        type: 'post',
        data: {
          url: unsplashClient.appendImageParameters(image.urls.raw),
        },
      })
        .then(() => {
          Analytics.sendUpdatedBoardFieldEvent({
            field: 'background',
            value: `unsplash-${image.id}`,
            source: 'boardMenuDrawerBackgroundPhotosScreen',
            containers: {
              board: {
                id: boardId,
              },
            },
            attributes: {
              backgroundType: 'photo',
            },
          });
          Analytics.taskSucceeded({
            taskName: 'edit-board/prefs/background',
            source: 'boardMenuDrawerBackgroundPhotosScreen',
            traceId,
          });
        })
        .catch((error) => {
          throw Analytics.taskFailed({
            taskName: 'edit-board/prefs/background',
            source: 'boardMenuDrawerBackgroundPhotosScreen',
            traceId,
            error,
          });
        })
        .finally(() => {
          return this.setState({ uploadingImageID: null });
        });
    };
  }

  addMarker(thumbs) {
    const { registerMarker } = this.props;

    const marker = (
      <div key="marker" className="scroll-marker" ref={registerMarker} />
    );
    thumbs.splice(-SCROLL_BUFFER, 0, marker);
    return thumbs;
  }
}

PhotosList.initClass();
module.exports = PhotosList;
