import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'recompose';

import user from 'js/lib/user';
import Retracked from 'js/app/retracked';

import uuid from 'bundles/common/utils/uuid';

import { ChannelName } from 'bundles/realtime-messaging/types';
import { CourseHomePageView, CourseItemPageView, CourseWeekPageView } from 'bundles/ui-actions/types/pageView';
import {
  PAGE_VIEW_COURSE_HOME,
  PAGE_VIEW_ITEM_PAGE,
  PAGE_VIEW_WEEK_PAGE,
} from 'bundles/ui-actions/constants/actionTypes';

import ConnectToRealtimeMessaging from 'bundles/realtime-messaging/components/ConnectToRealtimeMessaging';
import withActionTriggerMutation from 'bundles/ui-actions/hoc/withActionTriggerMutation';

type PageViewProps = CourseHomePageView | CourseItemPageView | CourseWeekPageView;

type InputProps = PageViewProps & {
  children: React.ReactNode;
};

type Props = InputProps & {
  branchId: string;
  // @ts-ignore ts-migrate(7031) FIXME: Binding element 'object' implicitly has an 'any' t... Remove this comment to see the full error message
  triggerAction: ({ variables: object }) => Promise<{ auth: string }>;
};

class TrackPageViewActionInternal extends Component<Props> {
  static contextTypes = {
    _eventData: PropTypes.object,
  };

  componentDidMount() {
    const { _eventData } = this.context;
    const { triggerAction, name, courseId } = this.props;

    let definition: object | null = null;

    switch (name) {
      case PAGE_VIEW_COURSE_HOME: {
        definition = { courseId };
        break;
      }
      case PAGE_VIEW_ITEM_PAGE: {
        const { itemId } = this.props as CourseItemPageView;
        definition = { courseId, itemId };
        break;
      }
      case PAGE_VIEW_WEEK_PAGE: {
        const { weekNumber } = this.props as CourseWeekPageView;
        definition = { courseId, weekNumber };
        break;
      }
      default:
        break;
    }

    if (definition !== null) {
      const traceId = uuid();

      triggerAction({
        variables: {
          traceId,
          userId: user.get().id,
          body: {
            typeName: 'pageViewAction',
            definition: {
              context: {
                definition,
                typeName: name,
              },
            },
          },
        },
      }).then(() =>
        Retracked.trackComponent(
          _eventData,
          {
            name,
            definition,
            traceId,
          },
          'pageview_trigger',
          'sent'
        )
      );
    }
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export const TrackPageViewAction: React.SFC<Props> = ({ children, ...props }) => (
  <ConnectToRealtimeMessaging channelName={ChannelName.LearningAssistance}>
    {({ channelSubscriptionComplete }) =>
      // We should only mount the TrackPageViewAction component once messaging is connected
      // in the event that a message event is reliant on the current page view
      channelSubscriptionComplete ? (
        <TrackPageViewActionInternal {...props}>{children}</TrackPageViewActionInternal>
      ) : (
        children
      )
    }
  </ConnectToRealtimeMessaging>
);

export default compose<Props, InputProps>(withActionTriggerMutation)(TrackPageViewAction);
