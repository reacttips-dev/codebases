import { useEffect } from 'react';

import { Auth } from 'app/scripts/db/auth';

import { defaultRouter } from 'app/src/router';

export const useTimezoneUpdater = () => {
  useEffect(() => {
    const currentRoutePath = defaultRouter.getRoute().routePath;
    return defaultRouter.subscribe(({ routePath }) => {
      if (currentRoutePath !== routePath) {
        if (!Auth.isLoggedIn()) {
          return;
        }

        const member = Auth.me();
        if (!member || member.get('isAaMastered')) {
          return;
        }

        const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone !== member.getPref('timezone')) {
          member.api({
            type: 'put',
            method: 'prefs/timezone',
            data: { value: timezone },
          });
        }
      }
    });
  }, []);
};
