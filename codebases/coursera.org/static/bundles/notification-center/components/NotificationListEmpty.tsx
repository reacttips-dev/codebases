import React from 'react';

import _t from 'i18n!nls/notification-center';

import 'css!./__styles__/NotificationListEmpty';

const NotificationListEmpty: React.FC<{}> = () => (
  <div className="rc-NotificationListEmpty">
    <h2>{_t('No notifications')}</h2>

    <div className="notification-list-empty-description">
      {_t("We'll let you know when deadlines are approaching, or there is a course update")}
    </div>
  </div>
);

export default NotificationListEmpty;
