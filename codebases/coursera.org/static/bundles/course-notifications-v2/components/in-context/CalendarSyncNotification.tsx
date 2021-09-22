import React from 'react';

import CalendarSyncCard from 'bundles/calendar-sync/CalendarSyncCard';

import 'css!./__styles__/CalendarSyncNotification';

export default () => (
  <div className="rc-CalendarSyncNotification">
    <CalendarSyncCard asBanner />
  </div>
);
