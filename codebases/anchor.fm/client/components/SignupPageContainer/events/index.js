/* eslint-disable no-undef */
import { trackEvent } from '../../../modules/analytics';

const events = {
  signUpRegisterButtonClicked: () => {
    // Required for Floodlight tagging
    gtag('event', 'conversion', {
      allow_custom_scripts: true,
      send_to: 'DC-9266237/ancho0/spoti000+standard',
    });

    trackEvent(
      'sign_up_register_button_clicked',
      {},
      {
        providers: [mParticle],
      }
    );
  },
  signUpSignInButtonClicked: () => {
    trackEvent(
      'sign_up_sign_in_button_clicked',
      {},
      {
        providers: [mParticle],
      }
    );
  },
  signUpImportButtonClicked: () => {
    trackEvent(
      'sign_up_import_button_clicked',
      {},
      {
        providers: [mParticle],
      }
    );
  },
  signUpLegalLinkClicked: attributes => {
    trackEvent('sign_up_legal_link_clicked', attributes, {
      providers: [mParticle],
    });
  },
};

export default events;
