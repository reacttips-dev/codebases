import { sendMonetateEvent } from 'apis/monetate';

const HOME_PAGEVIEW = 'HOME_PAGEVIEW';

const monetateHomeView = () => {
  sendMonetateEvent(
    ['setPageType', 'main']
  );
};

export default {
  pageEvent: HOME_PAGEVIEW,
  events: {
    [HOME_PAGEVIEW]: [monetateHomeView]
  }
};
