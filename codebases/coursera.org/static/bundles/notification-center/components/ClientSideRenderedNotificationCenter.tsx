import React from 'react';

import NotificationIcon from 'bundles/notification-center/components/NotificationIcon';
import NotificationCenter from 'bundles/notification-center/components/NotificationCenter';

/**
 * We only do data fetching for notification center on the client side.
 *
 * This is a deliberate design decision to
 * 1) avoid any performance regressions in server-side rendering on apps and
 * 2) reduce risk of SSR errors
 */
class ClientSideRenderedNotificationCenter extends React.Component<{}, { componentDidMount: boolean }> {
  state = {
    componentDidMount: false,
  };

  componentDidMount() {
    this.setState({ componentDidMount: true });
  }

  render() {
    const { componentDidMount } = this.state;

    if (!componentDidMount) {
      return (
        <div className="rc-NotificationCenter">
          {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
          <NotificationIcon unreadCount={0} active={false} onClick={() => {}} />
        </div>
      );
    }

    return <NotificationCenter />;
  }
}

export default ClientSideRenderedNotificationCenter;
