import { useEffect } from 'react';
import { trackPageview } from '@trello/analytics';
import { Analytics } from '@trello/atlassian-analytics';

const onPushOrPop = function () {
  trackPageview(window.location.pathname);
  Analytics.sendPageviewEvent();
};

// This hook relies on @trello/history-events to polyfill the pushstate event.
export const usePageTracking = () => {
  useEffect(() => {
    trackPageview(window.location.pathname);
    Analytics.sendPageviewEvent();

    window.addEventListener('pushstate', onPushOrPop);
    window.addEventListener('popstate', onPushOrPop);

    return () => {
      window.removeEventListener('pushstate', onPushOrPop);
      window.removeEventListener('popstate', onPushOrPop);
    };
  }, []);
};
