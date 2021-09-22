import * as React from 'react';
import { Notification } from '@coursera/coursera-ui';
import _t from 'i18n!nls/third-party-auth';
import 'css!./__styles__/SlackAccountComponentNotification';
import { FormattedHTMLMessage } from 'react-intl';

export enum NotificationType {
  INFO,
  LINK_ERROR,
  LINK_SUCCESS,
}
type Props = {
  notificationType: null | NotificationType;
  onDismiss: () => void;
  isDismissable?: boolean;
  signupLink: string;
};

export class SlackAccountComponentNotification extends React.Component<Props> {
  render() {
    const { notificationType, isDismissable = false, signupLink, onDismiss } = this.props;
    let component;

    switch (notificationType) {
      case NotificationType.INFO:
        component = (
          <Notification
            message={
              <FormattedHTMLMessage
                message={_t(
                  'Looks like you haven’t set up your Slack account yet. Create a <a target="blank" rel="noopener noreferrer" href="{signupLink}">free account</a>, then enter your Slack email address below.'
                )}
                signupLink={signupLink}
              />
            }
            hideIcon={true}
            type="info"
          />
        );
        break;
      case NotificationType.LINK_ERROR:
        component = (
          <Notification
            type="error"
            hideIcon={true}
            isDismissible={isDismissable}
            message={_t(
              'We can’t find a Slack account associated with this email address. Try another email or create a free account.'
            )}
          />
        );
        break;
      case NotificationType.LINK_SUCCESS:
        component = (
          <Notification
            type="success"
            isDismissible={isDismissable}
            message={_t('Your Slack account has been linked.')}
            onDismiss={onDismiss}
            isTransient={isDismissable}
            transientDuration={2000}
          />
        );
        break;
      default:
        component = null;
    }
    return component ? <div className="slack-account-notification">{component}</div> : null;
  }
}

export default SlackAccountComponentNotification;
