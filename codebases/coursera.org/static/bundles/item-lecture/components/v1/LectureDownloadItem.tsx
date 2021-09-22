import React from 'react';
import _ from 'lodash';
import { TrackedA } from 'bundles/page/components/TrackedLink2';

import ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import VideoContent from 'bundles/video-player/models/VideoContent';
import trackCoreVideoEvent from 'pages/open-course/video/util/trackCoreVideoEvent';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import _t from 'i18n!nls/item-lecture';

type Props = {
  courseId: string;
  itemMetadata: ItemMetadata;
  videoContent: VideoContent;
  fileExtension: string;
  fileName?: string;
};

type State = {
  videoSource: string;
};

type Context = {};

class LectureDownloadItem extends React.Component<Props, State> {
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
    const { courseId, itemMetadata } = this.props;
    trackCoreVideoEvent(courseId, itemMetadata.getId(), true, true);
  };

  getFilename(): string {
    const { itemMetadata, fileName } = this.props;

    return fileName || itemMetadata.getName() || _t('lecture');
  }

  render() {
    const { fileExtension } = this.props;
    const { videoSource } = this.state;

    if (!videoSource) {
      return null;
    }

    return (
      <li className="rc-LectureDownloadItem resource-list-item">
        <TrackedA
          trackingName="download_video"
          onClick={this.onVideoSourceClick}
          className="resource-link nostyle"
          href={videoSource}
          download={`${this.getFilename()}.${fileExtension}`}
          title={_t('Download Video')}
        >
          <span className="resource-name body-2-text color-secondary-text">{_t('Lecture Video')}</span>
          <span className="caption-text color-hint-text">{fileExtension}</span>
        </TrackedA>
      </li>
    );
  }
}

export default _.flowRight(
  connectToStores(['CourseStore'], ({ CourseStore }: any) => ({
    courseId: CourseStore.getCourseId(),
  }))
)(LectureDownloadItem);
