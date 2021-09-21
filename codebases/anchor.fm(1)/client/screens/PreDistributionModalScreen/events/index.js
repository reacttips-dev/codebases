import { trackEvent, trackScreenView } from '../../../modules/analytics';

const BASE_ATTRIBUTES = { location: 'distribution_decision' };

const events = {
  viewPodcastSetupModal: () => {
    trackEvent(
      'screen_viewed',
      { screen_name: 'setup_podcast' },
      { providers: [mParticle] }
    );
  },
  trackDistributionOptInPromptView: () => {
    trackScreenView('distribution_decision');
  },
  clickOptInToDistribution: () => {
    trackEvent('distribution_optin', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
  clickOptOutToDistribution: () => {
    trackEvent('distribution_optout', BASE_ATTRIBUTES, {
      providers: [mParticle],
    });
  },
  optedOutUserViewsDistributionModal: () => {
    trackEvent(
      'opted_out_user_views_distribution_modal',
      {},
      { providers: [mParticle] }
    );
  },
  optsBackIntoDistribution: () => {
    trackEvent('opts_back_into_distribution', {}, { providers: [mParticle] });
  },
};

export { events };
