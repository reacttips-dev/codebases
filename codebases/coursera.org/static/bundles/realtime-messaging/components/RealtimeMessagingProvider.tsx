import React from 'react';
import PropTypes from 'prop-types';

import RealtimeMessagingManager from 'bundles/realtime-messaging/RealtimeMessagingManager';

type Props = {
  courseSlug: string;
};

class RealtimeMessagingProvider extends React.Component<Props> {
  private manager?: RealtimeMessagingManager;

  static childContextTypes = {
    realtimeMessaging: PropTypes.instanceOf(RealtimeMessagingManager),
  };

  constructor(props: Props) {
    super(props);
    this.manager = new RealtimeMessagingManager(props.courseSlug);
  }

  componentWillUnmount() {
    if (this.manager) {
      this.manager.disconnect();
    }
  }

  getChildContext() {
    return {
      realtimeMessaging: this.manager,
    };
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default RealtimeMessagingProvider;
