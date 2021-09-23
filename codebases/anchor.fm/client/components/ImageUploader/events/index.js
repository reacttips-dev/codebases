import { trackEvent } from '../../../modules/analytics';

export default {
  imageUploaderClicked: (eventName, attributes) => {
    trackEvent(eventName, attributes, {
      providers: [mParticle],
    });
  },
};
