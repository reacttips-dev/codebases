import { trackEvent, trackScreenView } from '../../modules/analytics';

const BASE_ATTRIBUTES = { location: 'episode_edit_video' };

export const events = {
  trackVideoUploadScreenView: () => {
    trackScreenView('episode_edit_video');
  },
  trackSaveAsDraftButtonClick: () => {
    trackEvent('save_as_draft_button_clicked', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
  trackPublishButtonClick: () => {
    trackEvent('episode_published', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
  trackInsertAdButtonClick: () => {
    trackEvent('insert_ads_button_clicked', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
};
