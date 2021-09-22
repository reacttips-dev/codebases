import React, { Component } from 'react';

import TrackedButton from 'bundles/page/components/TrackedButton';
import { getTrackingDataForVideoEvent } from 'bundles/video-player/utils/AnalyticsMetadataFetcher';
import { VideoPlayer } from 'bundles/item-lecture/types';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  trackingName: string;
  data?: {};
  player: VideoPlayer;
};

class VideoTrackedButton extends Component<Props> {
  render() {
    const { player, data, trackingName, children, ...rest } = this.props;

    const trackingData = {
      ...data,
      ...getTrackingDataForVideoEvent(player, trackingName),
    };

    return (
      <TrackedButton data={trackingData} trackingName={trackingName} {...rest}>
        {children}
      </TrackedButton>
    );
  }
}

export default VideoTrackedButton;
