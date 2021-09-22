import React from 'react';

import VideoPlayer from 'bundles/video-player/components/video/VideoPlayer';

import type VideoContent from 'bundles/video-player/models/VideoContent';

import type { VideoPlayer as VideoPlayerType, VideoRegion, InteractiveTranscript } from 'bundles/item-lecture/types';

type Props = {
  computedItem: any;
  courseProgress: any;
  itemMetadata: any;

  enrollmentMode: any;
  verificationDisplay: any;

  videoQuizModel: any;
  videoContent: VideoContent;

  autoplay: boolean;
  startPlaybackSeconds: number;

  ariaLabel?: string;

  setVideoPlayer: (videoPlayer: VideoPlayerType) => void;
  setVideoRegion: (videoRegion: VideoRegion) => void;
  setInteractiveTranscript: (interactiveTranscript: InteractiveTranscript | null) => void;
};

const VideoOrigamiRegion = ({
  computedItem,
  courseProgress,
  verificationDisplay,
  itemMetadata,
  videoContent,
  videoQuizModel,
  enrollmentMode,
  startPlaybackSeconds,
  autoplay,
  setVideoPlayer,
  setInteractiveTranscript,
  setVideoRegion,
  ariaLabel,
}: Props) => {
  const course = itemMetadata.get('course');
  const courseMaterials = itemMetadata.get('courseMaterials');
  const nextItemMetadataOrItemGroup = courseMaterials?.getNeighbors(itemMetadata)?.nextItemMetadataOrItemGroup;

  const viewOptions = {
    course,
    courseProgress,
    computedItem,
    videoContent,
    videoQuizModel,
    nextItemMetadataOrItemGroup,
    enrollmentMode,
    verificationDisplay,
    startPlaybackSeconds,
    autoplay,
    setVideoPlayer,
    setInteractiveTranscript,
  };

  // Backbone viewOptions remain necessary as long as IVQs use backbone.
  return (
    <VideoPlayer
      viewOptions={viewOptions}
      setVideoRegion={setVideoRegion}
      ariaLabel={ariaLabel}
      itemMetadata={itemMetadata}
    />
  );
};

export default VideoOrigamiRegion;
