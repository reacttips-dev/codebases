/* eslint-disable no-undef */
import { trackEvent, trackScreenView } from '../../../modules/analytics';
import { AdjustTrackEvent } from '../../../modules/analytics/adjust';

const BASE_ATTRIBUTES = { location: 'episode_edit' };

const events = {
  trackSaveAsDraftButtonClicked: () => {
    trackEvent('save_as_draft_button_clicked', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
  trackMetadataEditSaveAsDraftButtonClicked: () => {
    trackEvent(
      'save_as_draft_button_clicked',
      { location: 'episode_metadata_edit' },
      {
        providers: [mParticle],
      }
    );
  },
  trackMetadataEditPageView: () => {
    trackScreenView('episode_metadata_edit');
  },
  publishMenuButtonClicked: attributes => {
    trackEvent('publish_menu_button_clicked', attributes, {
      providers: [mParticle],
    });
  },
  publishEpisodePageViewed: () => {
    trackEvent('Purchase', {}, { providers: [fbq] });
    trackScreenView('episode_edit');
  },
  episodePublished: userId => {
    trackEvent('episode_published', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
    trackEvent(
      null,
      { eventToken: AdjustTrackEvent.EPISODE_PUBLISHED, userId },
      { providers: [Adjust] }
    );
    trackEvent(
      null,
      { eventToken: AdjustTrackEvent.EPISODE_PUBLISHED_UNIQUE, userId },
      { providers: [Adjust] }
    );
  },
  episodePublishedWithBackgroundTracks: ({ podcastEpisodeId }) => {
    trackEvent(
      'episode_published_with_background_tracks',
      { ...BASE_ATTRIBUTES, web_episode_id: podcastEpisodeId },
      { providers: [mParticle] }
    );
  },
  episodeSubscriptionToggled: ({ podcastEpisodeId, toggledOn }) => {
    trackEvent(
      'pw_episode_subscription_toggled',
      {
        web_episode_id: podcastEpisodeId,
        toggled_on: toggledOn,
        location: 'episode_edit',
      },
      { providers: [mParticle] }
    );
  },
};

export default events;
