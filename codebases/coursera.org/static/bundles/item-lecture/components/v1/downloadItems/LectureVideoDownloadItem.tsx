import React from 'react';

import DownloadItemLink from 'bundles/item-lecture/components/v1/downloadItems/DownloadItemLink';

import type VideoContent from 'bundles/video-player/models/VideoContent';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import trackCoreVideoEvent from 'pages/open-course/video/util/trackCoreVideoEvent';

import _t from 'i18n!nls/item-lecture';

import type { Item } from 'bundles/learner-progress/types/Item';

type Props = {
  courseId: string;
  computedItem: Item;
  videoContent: VideoContent;
  fileExtension?: string;
  fileName?: string;
};

type State = {
  videoSource: string;
};

type Context = {};

class LectureVideoDownloadItem extends React.Component<Props, State> {
  static defaultProps = {
    fileExtension: 'mp4',
  };

  constructor(props: Props, context: Context) {
    super(props, context);

    // Set state for the lecture video source to the 360p mp4, if available.
    // If the course has been blacklisted for video downloads don't set the source.
    const formatSources = props.videoContent.getSourcesForResolution('360p');
    const videoSource: string = formatSources && formatSources['video/mp4'];

    this.state = { videoSource };
  }

  onVideoSourceClick = (): void => {
    const {
      courseId,
      computedItem: { id },
    } = this.props;

    trackCoreVideoEvent(courseId, id, true, true);
  };

  getFilename(): string {
    const { fileName, computedItem } = this.props;
    const { name } = computedItem;

    return fileName || name || _t('lecture');
  }

  render() {
    const { fileExtension } = this.props;
    const { videoSource } = this.state;

    if (!videoSource) {
      return null;
    }

    return (
      <DownloadItemLink
        trackingName="download_video"
        onClick={this.onVideoSourceClick}
        href={videoSource}
        download={`${this.getFilename()}.${fileExtension}`}
        title={_t('Download Video')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span style={{ marginRight: '8px' }}>{_t('Lecture Video')}</span>
        <span className="caption-text color-secondary-dark-text">{fileExtension}</span>
      </DownloadItemLink>
    );
  }
}

export default LectureVideoDownloadItem;
