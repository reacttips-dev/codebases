import { sendMonetateEvent } from 'apis/monetate';

const BRAND_PAGEVIEW = 'BRAND_PAGEVIEW';

const monetatePageView = () => {
  sendMonetateEvent(
    ['setPageType', 'brand']
  );
};

export default {
  pageEvent: BRAND_PAGEVIEW,
  events: {
    [BRAND_PAGEVIEW]: [monetatePageView]
  }
};
