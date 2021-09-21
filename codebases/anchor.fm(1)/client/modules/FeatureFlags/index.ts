const FEATURE_FLAGS = {
  SPOTIFY_VIDEO_PODCAST_ENABLED: 'spotifyVideoPodcastEnabled',
  STREAMING_AD_INSERTION_ENABLED: 'streamingAdInsertionEnabled',
  MUSIC_AND_TALK_ENABLED: 'isMusicAndTalkEnabled',
  WORDPRESS_CONVERT_TEXT_TO_AUDIO_ENABLED: 'isWordpressTTSEnabled',
  EP_ENABLED: 'isEPEnabled',
};

export type FeatureFlag =
  | typeof FEATURE_FLAGS.SPOTIFY_VIDEO_PODCAST_ENABLED
  | typeof FEATURE_FLAGS.STREAMING_AD_INSERTION_ENABLED
  | typeof FEATURE_FLAGS.MUSIC_AND_TALK_ENABLED
  | typeof FEATURE_FLAGS.WORDPRESS_CONVERT_TEXT_TO_AUDIO_ENABLED
  | typeof FEATURE_FLAGS.EP_ENABLED;

function getIsSaiOrVodcast(featureFlags?: FeatureFlag[] | null) {
  return featureFlags
    ? featureFlags.includes(FEATURE_FLAGS.SPOTIFY_VIDEO_PODCAST_ENABLED) ||
        featureFlags.includes(FEATURE_FLAGS.STREAMING_AD_INSERTION_ENABLED)
    : false;
}
function getIsEPEnabled(featureFlags?: FeatureFlag[] | null) {
  return featureFlags ? featureFlags.includes(FEATURE_FLAGS.EP_ENABLED) : false;
}

function getIsMTEnabled(featureFlags?: FeatureFlag[] | null) {
  return featureFlags
    ? featureFlags.includes(FEATURE_FLAGS.MUSIC_AND_TALK_ENABLED)
    : false;
}

export { getIsSaiOrVodcast, getIsEPEnabled, getIsMTEnabled, FEATURE_FLAGS };
