import React from 'react';
import moment from 'moment';

import InContextNotification from 'bundles/course-notifications-v2/components/in-context/InContextNotification';

import type { S12nUpgradeNotification as S12nUpgradeNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { getUpgradePreferenceMap, getNotificationConfig } from 'bundles/ondemand/utils/s12nUpgradeUtils';
import userPreferencesApi from 'bundles/user-preferences/lib/api';

import { rtlStyle } from 'js/lib/language';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

type Props = {
  notification: S12nUpgradeNotificationType;
};

type State = {
  dismissedNotifications: Array<string>;
};

class S12nUpgradeNotification extends React.Component<Props, State> {
  // array of notification ids that were dismissed by learner
  state: State = {
    dismissedNotifications: [],
  };

  handleDismiss = (s12nUpdate: { newS12nId: string }): void => {
    const {
      notification: {
        definition: { upgradePreferences },
      },
    } = this.props;

    // use userPreferences api to track this notification was dismissed by learner
    // the key will be id, i.e. 's12nId'
    const s12nId = s12nUpdate.newS12nId;
    const upgradePreferenceMap = getUpgradePreferenceMap(upgradePreferences) || {};
    // deep copy preference map, since userPreferencesApi does not support
    // partial updates as of now. So we need to put a new map every time we update it.
    const preference = JSON.parse(JSON.stringify(upgradePreferenceMap));
    // overwrite and merge existing preference
    preference[s12nId] = Object.assign({}, preference[s12nId], {
      dismissedTime: moment().valueOf(),
    });

    userPreferencesApi
      .set(userPreferencesApi.keyEnum.S12N_UPGRADE, {
        upgradePreferenceMap: preference,
      })
      .then(() => {
        this.hideNotification(s12nId);
      })
      .fail(() => {
        // hide notification on error, since it's only a preference failure.
        this.hideNotification(s12nId);
      })
      .done();
  };

  hideNotification = (id: string) => {
    const { dismissedNotifications } = this.state;
    const notifications: Array<string> = [];

    this.setState({
      dismissedNotifications: notifications.concat(dismissedNotifications, [id]),
    });
  };

  isDismissed = (notificationId: string): boolean => {
    const { dismissedNotifications } = this.state;
    return dismissedNotifications.indexOf(notificationId) !== -1;
  };

  renderSingleNotification = (s12nUpdate: { name: string; newS12nId: string; oldS12nId: string }) => {
    const { name, newS12nId, oldS12nId } = s12nUpdate;

    const config = getNotificationConfig(s12nUpdate);
    const upgradeLink = `/learn/specialization/upgrade/${oldS12nId}:${newS12nId}`;

    return (
      <InContextNotification
        key={name}
        type={config.type}
        message={
          <FormattedMessage
            message={config.htmlMessage}
            actionLabel={
              <a href={upgradeLink} style={rtlStyle({ marginLeft: '8px' })}>
                {config.actionLabel}
              </a>
            }
          />
        }
        isDismissible={config.type !== 'info'}
        trackingName="s12n_upgrade_notification"
        onDismiss={() => this.handleDismiss(s12nUpdate)}
      />
    );
  };

  render() {
    const {
      notification: {
        definition: { s12nUpdates },
      },
    } = this.props;

    return (
      <div className="rc-S12nUpgradeNotification">
        {s12nUpdates
          .filter((s12nUpdate) => !this.isDismissed(s12nUpdate.newS12nId))
          .map((s12nUpdate) => this.renderSingleNotification(s12nUpdate))}
      </div>
    );
  }
}

export default S12nUpgradeNotification;
