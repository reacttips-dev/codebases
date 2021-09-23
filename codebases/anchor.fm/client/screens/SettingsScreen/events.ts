import { trackEvent } from '../../modules/analytics';

const BASE_ATTRIBUTES = { location: 'settings' };

const trackUpdateCoverArtClick = () => {
  trackEvent('update_cover_art_button_clicked', BASE_ATTRIBUTES, {
    providers: [mParticle],
  });
};

export { trackUpdateCoverArtClick };
