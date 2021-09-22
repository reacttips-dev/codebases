import config from 'js/app/config';
import path from 'js/lib/path';

export const AUTH_PROVIDER_LOCAL_STORAGE_KEY = 'authProvider';
export const AUTH_PROVIDER_MIN_LEN = 1;
export const AUTH_PROVIDER_MAX_LEN = 200;

// Cloudfront domain can be found at https://console.aws.amazon.com/cloudfront/home and searching for "coursera_assets"
export const REBRAND_LOGO_SRC = 'https://d2j5ihb19pt1hq.cloudfront.net/front-page-rebrand/header/rebrand-logo.svg';

export const COURSERA_LOGO_IMG_SRC = path.join(config.url.assets, 'bundles/page/assets/white-logo-on-blue-bg.png');
export const COURSERA_REBRAND_LOGO_IMG_SRC = path.join(
  config.url.assets,
  'bundles/page/assets/coursera-rebrand-logo.png'
);

export const US_BCORP_LOGO_SRC = path.join(config.url.assets, 'images/icons/2018-B-Corp-Logo-Black-S.png');
export const FRENCH_CANADIAN_BCORP_LOGO_SRC = path.join(
  config.url.assets,
  'images/icons/2018-Canada-B-Corp-Logo-S.png'
);
