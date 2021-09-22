import React from 'react';
import { compose } from 'recompose';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import SessionEnrollBox from 'bundles/course-home/page-course-week/components/SessionEnrollBox';
import SessionSwitchBox from 'bundles/course-home/page-course-week/components/SessionSwitchBox';

import withComputedCourseProgress from 'bundles/learner-progress/utils/withComputedCourseProgress';

import { CourseProgress } from 'bundles/learner-progress/types/Course';

type Props = {
  isPreviewMode: boolean;
  hasSessionEnded: boolean;
  computedCourseProgress: CourseProgress;
};

class SessionBox extends React.Component<Props> {
  render() {
    const {
      isPreviewMode,
      hasSessionEnded,
      computedCourseProgress: { isLagging },
    } = this.props;

    if (!isPreviewMode && (isLagging || hasSessionEnded)) {
      return <SessionSwitchBox hasEnded={hasSessionEnded} />;
    } else {
      return <SessionEnrollBox />;
    }
  }
}

export default compose<Props, {}>(
  withComputedCourseProgress(),
  // TODO: connectToStores<Props, InputProps, Stores>
  connectToStores<any, any>(['SessionStore'], ({ SessionStore }) => ({
    hasSessionEnded: SessionStore.hasEnded(),
    isPreviewMode: SessionStore.isPreviewMode(),
  }))
)(SessionBox);
