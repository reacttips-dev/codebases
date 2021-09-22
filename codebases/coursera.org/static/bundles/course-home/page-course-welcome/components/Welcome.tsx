import React, { useEffect } from 'react';
import { compose } from 'recompose';

import Retracked from 'js/lib/retracked';
import connectToRouter from 'js/lib/connectToRouter';
import epic from 'bundles/epic/client';

import TrackedDiv from 'bundles/page/components/TrackedDiv';

import CourseWeekCards from 'bundles/course-home/page-course-welcome/components/CourseWeekCards';
import CourseNameHeader from 'bundles/course-home/page-course-welcome/components/CourseNameHeader';
import BrowserForProjectNotification from 'bundles/course-home/page-course-welcome/components/BrowserForProjectNotification';

import EndOfCourseNpsModal from 'bundles/course-v2/components/nps/EndOfCourseNpsModal';
import InstructorWelcomeNote from 'bundles/course-home/page-course-welcome/components/InstructorWelcomeNote';
import LegacyEmailSubscription from 'bundles/course-home/page-course-welcome/components/LegacyEmailSubscription';
import AliceWelcomeNotification from 'bundles/course-home/page-course-welcome/components/AliceWelcomeNotification';
import TrackPageViewAction from 'bundles/ui-actions/components/TrackPageViewAction';

import WelcomeNotifications from 'bundles/course-notifications-v2/components/WelcomeNotifications';

import LabSandboxLauncher from 'bundles/labs-common/components/lab-sandbox/LabSandboxLauncher';
import CourseHomeCards from 'bundles/course-home/page-course-welcome/components/CourseHomeCards';
import { PAGE_VIEW_COURSE_HOME } from 'bundles/ui-actions/constants/actionTypes';
import initLearnerPlatformFeedbackPendo from 'bundles/common/utils/initLearnerPlatformFeedbackPendo';

import 'css!./__styles__/Welcome';

type PropsFromCaller = {
  courseId: string;
};

type PropsFromConnectToRouter = {
  courseSlug: string;
};

type PropsToComponent = PropsFromCaller & PropsFromConnectToRouter;

const Welcome: React.FC<PropsToComponent> = ({ courseSlug, courseId }) => {
  useEffect(() => {
    if (epic.get('BlueJays', 'LearnerWelcomePendoSampleIncluded')) {
      initLearnerPlatformFeedbackPendo();
    }
  }, []);

  return (
    <TrackPageViewAction name={PAGE_VIEW_COURSE_HOME} courseId={courseId}>
      <div className="rc-Welcome">
        <TrackedDiv
          trackClicks={false}
          requireFullyVisible={false}
          withVisibilityTracking={true}
          trackingName="guided_course_home"
        >
          <WelcomeNotifications />
          <BrowserForProjectNotification />
          <CourseNameHeader />
          <CourseHomeCards courseId={courseId} courseSlug={courseSlug} />
          <InstructorWelcomeNote />

          <LabSandboxLauncher
            className="lab-sandbox-launcher"
            courseId={courseId}
            isPrimaryCallToAction={false}
            showForFreeTrial={false}
          />

          <CourseWeekCards courseId={courseId} />
          <LegacyEmailSubscription />
          <AliceWelcomeNotification />
          <EndOfCourseNpsModal />
        </TrackedDiv>
      </div>
    </TrackPageViewAction>
  );
};

export default compose<PropsToComponent, PropsFromCaller>(
  Retracked.createTrackedContainer(() => ({
    namespace: {
      page: 'home_page',
    },
  })),
  connectToRouter((router) => ({
    courseSlug: router.params.courseSlug,
  }))
)(Welcome);
