import { trackEvent, trackScreenView } from '../../../modules/analytics';

const BASE_ATTRIBUTES = { location: 'episode_editor' };

const events = {
  fileUploaded: () => {
    trackEvent(
      'file_uploaded',
      {
        ...BASE_ATTRIBUTES,
        method: 'drag_and_drop',
        component: 'EpisodeEditorStagingArea',
      },
      { providers: [mParticle] }
    );
  },
  recordANewSegmentButtonClicked: () => {
    trackEvent(
      'record_a_new_segment_button_clicked',
      {
        ...BASE_ATTRIBUTES,
      },
      { providers: [mParticle] }
    );
  },
  newRecordingButtonClicked: () => {
    trackEvent(
      'new_recording_button_clicked',
      {
        ...BASE_ATTRIBUTES,
      },
      { providers: [mParticle] }
    );
  },
  mobileRecordingButtonClicked: () => {
    trackEvent(
      'mobile_recording_button_clicked',
      {
        ...BASE_ATTRIBUTES,
      },
      { providers: [mParticle] }
    );
  },
  startRecordingButtonClicked: () => {
    trackEvent(
      'start_recording_button_clicked',
      { ...BASE_ATTRIBUTES },
      { providers: [mParticle] }
    );
  },
  stopRecordingButtonClicked: attributes => {
    trackEvent(
      'stop_recording_button_clicked',
      { ...BASE_ATTRIBUTES, ...attributes },
      { providers: [mParticle] }
    );
  },
  recordingInputSelected: () => {
    trackEvent(
      'recording_input_selected',
      { ...BASE_ATTRIBUTES },
      {
        providers: [mParticle],
      }
    );
  },
  saveButtonClicked: () => {
    trackEvent(
      'save_button_clicked',
      { ...BASE_ATTRIBUTES },
      {
        providers: [mParticle],
      }
    );
  },
  previewButtonClicked: attributes => {
    trackEvent(
      'preview_button_clicked',
      { ...BASE_ATTRIBUTES, ...attributes },
      {
        providers: [mParticle],
      }
    );
  },
  segmentDragAndDropped: attributes => {
    trackEvent(
      'segment_drag_and_dropped',
      { ...BASE_ATTRIBUTES, ...attributes },
      {
        providers: [mParticle],
      }
    );
  },
  createEpisodePageViewed: () => {
    trackEvent('InitiateCheckout', {}, { providers: [fbq] });
  },
  recordEpisodePageViewed: () => {
    trackEvent('AddPaymentInfo', {}, { providers: [fbq] });
  },
  episodeCreated: () => {
    trackEvent('episode_created', {}, { providers: [mParticle] });
  },
  musicAdded: attributes => {
    trackEvent(
      'episode_builder_music_added',
      { ...attributes, ...BASE_ATTRIBUTES },
      { providers: [mParticle] }
    );
  },
  musicConfirmationClicked: () => {
    trackEvent('episode_builder_music_confirmation_clicked', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
  learnMoreClicked: () => {
    trackEvent(
      'episode_builder_music_confirmation_learn_more_clicked',
      BASE_ATTRIBUTES,
      { providers: [mParticle] }
    );
  },
  trackAddMoreTalkContentModalView: () => {
    trackScreenView('add_more_talk_content_modal', BASE_ATTRIBUTES);
  },
  spotifyOAuthConnected: () => {
    trackEvent('episode_builder_spotify_connected', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
  audioMarkedAsExternalAd: attributes => {
    trackEvent(
      'episode_builder_external_ad_marked',
      { ...attributes, ...BASE_ATTRIBUTES },
      { providers: [mParticle] }
    );
  },
  audioUnmarkedAsExternalAd: attributes => {
    trackEvent(
      'episode_builder_external_ad_unmarked',
      { ...attributes, ...BASE_ATTRIBUTES },
      { providers: [mParticle] }
    );
  },
  episodeSubmitted: () => {
    trackEvent('episode_editor_submitted', {}, { providers: [mParticle] });
  },
  tabClicked: ({ tab, attributes }) => {
    trackEvent(
      `episode_builder_${tab}_tab_clicked`,
      { ...BASE_ATTRIBUTES, ...attributes },
      { providers: [mParticle] }
    );
  },
  unableToAddSongToPaywalledEpisodeModalViewed: webEpisodeId => {
    trackEvent(
      'pw_unable_to_add_song_to_paywalled_episode_message_viewed',
      { web_episode_id: webEpisodeId, location: 'unable_to_add_song_error' },
      { providers: [mParticle] }
    );
  },
  unableToAddSongToPaywalledEpisodeModalDismissClicked: () => {
    trackEvent(
      'pw_unable_to_add_song_to_paywalled_episode_message_dismiss_button_clicked',
      { location: 'unable_to_add_song_error' },
      { providers: [mParticle] }
    );
  },
  trackShareVoiceMessageUrlLinkButtonClick: () => {
    trackEvent('share_voice_message_link_button_clicked', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
  trackAddSponsoredSegmentClick: () => {
    trackEvent('segment_added', BASE_ATTRIBUTES, { providers: [mParticle] });
  },
};

export default events;
