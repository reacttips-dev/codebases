import React from 'react';
import type { ApolloQueryResult } from 'apollo-client';

import NotificationHeader from 'bundles/notification-center/components/NotificationHeader';
import NotificationListEmpty from 'bundles/notification-center/components/NotificationListEmpty';

import CalendarSyncNotification from 'bundles/notification-center/components/notifications/CalendarSyncNotification';
import DeadlineOverdueNotification from 'bundles/notification-center/components/notifications/DeadlineOverdueNotification';
import DeadlineReminderNotification from 'bundles/notification-center/components/notifications/DeadlineReminderNotification';
import UserVerificationNotification from 'bundles/notification-center/components/notifications/UserVerificationNotification';
import LearnerIncentiveNotification from 'bundles/learner-incentives/components/LearnerIncentiveNotification';
import VerifiedCertificateCongratsNotification from 'bundles/notification-center/components/notifications/VerifiedCertificateCongratsNotification';
import DiscussionForumNewAnswerForFollowerNotification from 'bundles/notification-center/components/notifications/DiscussionForumNewAnswerForFollowerNotification';
import DiscussionForumNewAnswerForQuestionCreatorNotification from 'bundles/notification-center/components/notifications/DiscussionForumNewAnswerForQuestionCreatorNotification';
import AssignmentHasBeenPeerReviewedMessageNotification from 'bundles/notification-center/components/notifications/AssignmentHasBeenPeerReviewedMessageNotification';
import PeerReviewGradeReadyMessageNotification from 'bundles/notification-center/components/notifications/PeerReviewGradeReadyMessageNotification';

import type { Notification as NotificationType } from 'bundles/notification-center/types';

import type {
  NotificationCenterMessagesQueryResponse,
  NotificationCenterMessagesQueryVariables,
} from 'bundles/notification-center/components/data/NotificationCenterMessagesQuery';

import 'css!./__styles__/NotificationListView';

type Props = {
  unreadCount: number;
  notifications: Array<NotificationType>;
  refetchNotifications: (
    variables?: NotificationCenterMessagesQueryVariables
  ) => Promise<ApolloQueryResult<NotificationCenterMessagesQueryResponse>>;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;
};

// TODO: Improve a11y. see https://medium.com/@im_rahul/focus-trapping-looping-b3ee658e5177
class NotificationListView extends React.Component<Props> {
  componentDidMount() {
    const { refetchNotifications } = this.props;
    // refetch notifications on mount to catch any updates in the current user session
    refetchNotifications();
  }

  handleMarkAllAsRead = () => {
    const { markAllNotificationsAsRead } = this.props;
    markAllNotificationsAsRead();
  };

  handleMarkAsRead = (notification: NotificationType) => {
    const { markNotificationAsRead } = this.props;
    markNotificationAsRead(notification.id);
  };

  render() {
    const { unreadCount, notifications } = this.props;

    const NotificationsComponent = notifications.map((notification) => {
      let component;

      switch (notification.messageType) {
        case 'DeadlineOverdueMessage':
          component = (
            <DeadlineOverdueNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );
          break;
        case 'DeadlineReminderMessage':
          component = (
            <DeadlineReminderNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );
          break;
        case 'UserVerificationMessage':
          component = (
            <UserVerificationNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );
          break;
        case 'CalendarSyncMessage':
          component = (
            <CalendarSyncNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );
          break;
        case 'PartnerIncentiveMessage':
          component = (
            <LearnerIncentiveNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );
          break;
        case 'VerifiedCertificateCongratsMessage':
          component = (
            <VerifiedCertificateCongratsNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );

          break;
        case 'AssignmentHasBeenPeerReviewedMessage':
          component = (
            <AssignmentHasBeenPeerReviewedMessageNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );

          break;
        case 'PeerReviewGradeReadyMessage':
          component = (
            <PeerReviewGradeReadyMessageNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );

          break;
        case 'DiscussionForumNewAnswerForFollowerMessage':
          component = (
            <DiscussionForumNewAnswerForFollowerNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );

          break;
        case 'DiscussionForumNewAnswerForQuestionCreatorMessage':
          component = (
            <DiscussionForumNewAnswerForQuestionCreatorNotification
              key={notification.id}
              notification={notification}
              onClick={this.handleMarkAsRead}
            />
          );

          break;
        default:
          component = null;
          break;
      }

      return component;
    });

    return (
      <div className="rc-NotificationListView">
        <span className="notification-list-view-triangle" />

        <div className="notification-list-view-content">
          <NotificationHeader unreadCount={unreadCount} onMarkAllAsRead={this.handleMarkAllAsRead} />

          {notifications.length === 0 && <NotificationListEmpty />}

          <div className="notification-list-view-notifications">{NotificationsComponent}</div>
        </div>
      </div>
    );
  }
}

export default NotificationListView;
