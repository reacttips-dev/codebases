import React from 'react';
import { Notification } from '@coursera/coursera-ui';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

import 'css!./__styles__/InContextNotification';

type Props = {
  type: 'success' | 'warning' | 'info' | 'danger';
  message: string | JSX.Element;
  trackingName: string;
  isDismissible?: boolean;
  onDismiss?: () => void;
};

class InContextNotification extends React.Component<Props> {
  render() {
    const { trackingName } = this.props;

    return (
      <TrackedDiv
        trackClicks={false}
        withVisibilityTracking
        trackingName={trackingName}
        className="rc-InContextNotification body-1-text"
      >
        <Notification
          {...this.props}
          htmlAttributes={{
            'data-classname': 'in-context-notification',
          }}
        />
      </TrackedDiv>
    );
  }
}

export default InContextNotification;
