import { trackEvent } from '../../../modules/analytics';

const events = {
  audioTranscriptionScreenViewed: () => {
    trackEvent(
      'screen_viewed',
      { screen_name: 'video_transcription' },
      { providers: [mParticle] }
    );
  },
  audioTranscriptionCreated: () => {
    trackEvent('audio_transcription_created', {}, { providers: [mParticle] });
  },
  videoCreated: () => {
    trackEvent('video_created', {}, { providers: [mParticle] });
  },
  videoDownloaded: () => {
    trackEvent('video_downloaded', {}, { providers: [mParticle] });
  },
};

export { events };
