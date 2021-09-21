import trackScreenView from 'modules/analytics/trackScreenView';
import { trackEvent } from 'modules/analytics';

export const events = {
  // Spotify Only Distribution Modal
  distributeToSpotifyModalScreenView: () =>
    trackScreenView('publish_to_spotify_modal'),
  distributeToSpotifyPublishButtonClicked: () =>
    trackEvent(
      'publish_to_spotify_button_clicked',
      { location: 'publish_to_spotify_modal' },
      { providers: [mParticle] }
    ),
  distributeToSpotifyLaterButtonClicked: () =>
    trackEvent(
      'publish_later_button_clicked',
      { location: 'publish_to_spotify_modal' },
      { providers: [mParticle] }
    ),
  distributeToSpotifyExitButtonClicked: () =>
    trackEvent(
      'exit_button_clicked',
      { location: 'publish_to_spotify_modal' },
      { providers: [mParticle] }
    ),
  // Spotify Only Distribution Confirmation Modal
  distributeToSpotifyConfirmationScreenView: () =>
    trackScreenView('publish_to_spotify_confirmation_modal'),
  distributeToSpotifyConfirmationContinueButtonClicked: () =>
    trackEvent(
      'continue_button_clicked',
      { location: 'publish_to_spotify_confirmation_modal' },
      { providers: [mParticle] }
    ),
  distributeToSpotifyConfirmationExitButtonClicked: () =>
    trackEvent(
      'exit_button_clicked',
      { location: 'publish_to_spotify_confirmation_modal' },
      { providers: [mParticle] }
    ),
  // M+T Modal
  distributeToSpotifyMTModalScreenViewed: () =>
    trackScreenView('publish_to_spotify_mt_modal'),
  distributeToSpotifyMTDistributeButtonClicked: () =>
    trackEvent(
      'distribute_to_spotify_button_clicked',
      { location: 'publish_to_spotify_mt_modal' },
      { providers: [mParticle] }
    ),
  distributeToSpotifyMTLearnMoreButtonClicked: () =>
    trackEvent(
      'learn_more_button_clicked',
      { location: 'publish_to_spotify_mt_modal' },
      { providers: [mParticle] }
    ),
  distributeToSpotifyMTExitButtonClicked: () =>
    trackEvent(
      'exit_button_clicked',
      { location: 'publish_to_spotify_mt_modal' },
      { providers: [mParticle] }
    ),
  // Enable RSS Modal
  enableRssModalScreenViewed: () => trackScreenView('enable_rss_feed'),
  enableRssModalEnableFeedButtonClicked: () =>
    trackEvent(
      'enable_rss_feed_button_clicked',
      { location: 'enable_rss_feed' },
      { providers: [mParticle] }
    ),
  enableRssModalNotYetButtonClicked: () =>
    trackEvent(
      'not_yet_rss_feed_button_clicked',
      { location: 'enable_rss_feed' },
      { providers: [mParticle] }
    ),
  enableRssModalExitButtonClicked: () =>
    trackEvent(
      'exit_enable_rss_feed_button_clicked',
      { location: 'enable_rss_feed' },
      { providers: [mParticle] }
    ),
};
