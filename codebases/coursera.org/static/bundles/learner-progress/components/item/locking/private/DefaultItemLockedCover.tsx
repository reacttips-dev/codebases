import React from 'react';

import { Box } from '@coursera/coursera-ui';

import LockMessage from 'bundles/learner-progress/components/item/locking/private/LockMessage';
import LockIcon from 'bundles/learner-progress/components/item/locking/private/LockIcon';

import user from 'js/lib/user';
import ResetDeadlinesButton from 'bundles/course-sessions/components/ResetDeadlinesButton';
import SessionSwitchButton from 'bundles/course-sessions/components/SessionSwitchButton';
import withSessionsV2EnrollmentEnabled from 'bundles/course-sessions/utils/withSessionsV2EnrollmentEnabled';

import { Item } from 'bundles/learner-progress/types/Item';

import CourseScheduleSuggestion from 'bundles/course-sessions/models/CourseScheduleSuggestion';
import CourseScheduleSuggestionDataProvider from 'bundles/learner-progress/components/item/locking/private/data/CourseScheduleSuggestionDataProvider';
import CourseScheduleRunningAndUpcomingDataProvider from 'bundles/learner-progress/components/item/locking/private/data/CourseScheduleRunningAndUpcomingDataProvider';

import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import 'css!./__styles__/DefaultItemLockedCover';

type InputProps = {
  computedItem: Item;
};

type Props = InputProps & {
  sessionsV2EnrollmentEnabled: boolean;
};

const renderResetDeadlinesButton = (computedItem: Item) => {
  return (
    <CourseScheduleSuggestionDataProvider
      userCourseId={tupleToStringKey([user.get().id.toString(), computedItem.courseId])}
    >
      {({ loading, error, data }: any) => {
        if (loading || error) return null;

        if (data?.LearnerCourseScheduleSuggestionsV1Resource) {
          const suggestion = data.LearnerCourseScheduleSuggestionsV1Resource.elements[0].suggestions[0];

          /**
           * The resposnse data seems to be converted from the original dot case to camel case,
           * and we need to convert it back to dot case for it to work
           * We're uncertain if there are other cases where this conversion is necessary
           */
          suggestion['org.coursera.ondemand.schedule.suggestion.Extension'] =
            suggestion.orgCourseraOndemandScheduleSuggestionExtension;

          delete suggestion.orgCourseraOndemandScheduleSuggestionExtension;

          const courseScheduleSuggestion = new CourseScheduleSuggestion(suggestion);
          const hasScheduleSuggestion = courseScheduleSuggestion?.isExtension;

          return (
            <Box rootClassName="rc-DefaultItemLockedCover" alignItems="start">
              <LockIcon />
              <div>
                <LockMessage scheduleSuggestionsAvailable={hasScheduleSuggestion} computedItem={computedItem} />
                {hasScheduleSuggestion && computedItem.itemLockedReasonCode === 'SESSION_ENDED' && (
                  <div>
                    <ResetDeadlinesButton
                      size="sm"
                      type="primary"
                      trackingName="course_item_reset_deadlines"
                      trackingData={computedItem.id}
                      courseId={computedItem.courseId}
                      courseScheduleSuggestion={courseScheduleSuggestion}
                    />
                  </div>
                )}
              </div>
            </Box>
          );
        }
      }}
    </CourseScheduleSuggestionDataProvider>
  );
};

const renderSwitchSessionButton = (computedItem: Item) => (
  <CourseScheduleRunningAndUpcomingDataProvider courseId={computedItem.courseId}>
    {({ loading, error, data }: any) => {
      if (loading || error) return null;

      if (data?.OnDemandLearnerSessionsV1Resource) {
        const suggestions = data?.OnDemandLearnerSessionsV1Resource?.runningAndUpcoming?.elements ?? [];
        const hasScheduleSuggestion = suggestions.length > 0;

        return (
          <Box rootClassName="rc-DefaultItemLockedCover" alignItems="start">
            <LockIcon />
            <div>
              <LockMessage scheduleSuggestionsAvailable={hasScheduleSuggestion} computedItem={computedItem} />
              {hasScheduleSuggestion && computedItem.itemLockedReasonCode === 'SESSION_ENDED' && (
                <div>
                  <SessionSwitchButton size="sm" courseId={computedItem.courseId} />
                </div>
              )}
            </div>
          </Box>
        );
      }
    }}
  </CourseScheduleRunningAndUpcomingDataProvider>
);

export const DefaultItemLockedCover: React.SFC<Props> = ({ sessionsV2EnrollmentEnabled, computedItem }) =>
  sessionsV2EnrollmentEnabled ? renderResetDeadlinesButton(computedItem) : renderSwitchSessionButton(computedItem);

export default withSessionsV2EnrollmentEnabled(({ computedItem }) => computedItem.courseId)(DefaultItemLockedCover);
