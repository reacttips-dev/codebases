import React from 'react';
import { compose } from 'recompose';

import Retracked from 'js/lib/retracked';

import VideoItem from 'bundles/item-lecture/components/v1/VideoItem';
import VideoItemWithHighlighting from 'bundles/item-lecture/components/v1/VideoItemWithHighlighting';

import { isVideoHighlightingEnabled } from 'bundles/video-highlighting';

import withVideoItemData from 'bundles/item-lecture/utils/withVideoItemData';

// Props are typed in children.
type Props = any;

const VideoItemContainer = ({ ...props }: Props) => {
  const includeHighlighting = isVideoHighlightingEnabled(props.courseId);

  if (includeHighlighting) {
    return <VideoItemWithHighlighting {...props} />;
  }

  return <VideoItem {...props} />;
};

export default compose(
  withVideoItemData(),

  Retracked.createTrackedContainer(() => ({
    namespace: 'open_course_home.video_item',
  }))
)(VideoItemContainer);
