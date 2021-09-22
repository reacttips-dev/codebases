const exported = {
  // Percentage to deem that a video is completed
  videoEndPercentage: 0.9,

  // if playing the video from a specific time point,
  // we start the video earlier by this many seconds
  videoStartPlaybackDelay: 3,

  // set of possible playback rates
  playbackRates: [0.75, 1, 1.25, 1.5, 1.75, 2],
};

export default exported;

export const { videoEndPercentage, videoStartPlaybackDelay, playbackRates } = exported;
