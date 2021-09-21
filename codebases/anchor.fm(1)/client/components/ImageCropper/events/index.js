import { trackEvent } from '../../../modules/analytics';

export default {
  newImageSaved: attributes => {
    trackEvent('new_image_saved', attributes, {
      providers: [mParticle],
    });
  },
};
