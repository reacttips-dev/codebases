import React from 'react';
import 'css!./__styles__/NotificationUnreadCount';

type Props = {
  count: number;
};

const NotificationUnreadCount: React.FC<Props> = ({ count }) => (
  <div className="rc-NotificationUnreadCount">{count}</div>
);

export default NotificationUnreadCount;
