import config from 'js/app/config';

const exported = {
  config,
  timeout: 500,
  signup: 'signup',
  enroll: 'enroll',

  googleTagManager: {
    id: 'GTM-5JKLVK',
    dataLayerName: 'dataLayer',
    url: 'https://www.googletagmanager.com/gtm.js?id=GTM-5JKLVK&l=dataLayer',
  },
};

export default exported;
export { config };

export const { timeout, signup, enroll, googleTagManager } = exported;
