/* @jsx jsx */
import React from 'react';

import { compose } from 'recompose';
import classNames from 'classnames';
import Help from 'bundles/course/components/Help';
import CourseNavigation from 'bundles/course-v2/components/CourseNavigation';
import CDSCourseNavigation from 'bundles/course-v2/components/cds/CourseNavigation';
import CoursePageHeader from 'bundles/course-v2/components/CoursePageHeader';
import GlobalNotification from 'bundles/course-notifications-v2/components/GlobalNotification';

import withShowEnrollmentStateBanner from 'bundles/preview/containers/withShowEnrollmentStateBanner';

import type { ActAsLearnerSessionProps } from 'bundles/course-staff-impersonation';
import {
  LearnerImpersonationBanner,
  withPartnerLearnerImpersonationSessionData,
} from 'bundles/course-staff-impersonation';

import _t from 'i18n!nls/course-v2';
// eslint-disable-next-line
import { jsx } from '@emotion/react';
import {
  isCdsLeftNavEnabled,
  isHelpIconEnabled,
  isFullstoryOnCourseHomeForPartnersEnabled,
} from 'bundles/course-v2/featureFlags';

import fullStory from 'js/lib/fullStoryUtils';

type InputProps = {
  courseId: string;
  children: JSX.Element;
};

type Props = InputProps &
  ActAsLearnerSessionProps & {
    showEnrollmentStateBanner: boolean;
  };

type State = {
  showMobileNavigation: boolean;
};

export class Home extends React.Component<Props, State> {
  state = {
    showMobileNavigation: false,
  };

  helpEnabled = isHelpIconEnabled();

  cdsleftNavEnabled = isCdsLeftNavEnabled();

  componentDidMount() {
    const { showEnrollmentStateBanner } = this.props;

    if (showEnrollmentStateBanner && isFullstoryOnCourseHomeForPartnersEnabled()) {
      fullStory.init();
    }
  }

  render() {
    const { children, showEnrollmentStateBanner, courseId, actAsLearnerSession } = this.props;
    const { showMobileNavigation } = this.state;
    // TODO(wbowers): Think of a better name for this. This pushes the course content and sidebar down
    // to make room for the enrollment state banner.
    const pushed = showEnrollmentStateBanner;

    return (
      <div className="rc-Home">
        {/* Act as Learner replaces the standard course page header with its own banner */}
        {actAsLearnerSession ? (
          <LearnerImpersonationBanner actAsLearnerSession={actAsLearnerSession} />
        ) : (
          <CoursePageHeader
            showAccountDropdown
            onMobileNavigationToggle={() => this.setState({ showMobileNavigation: !showMobileNavigation })}
          />
        )}

        {this.cdsleftNavEnabled ? (
          <CDSCourseNavigation className={classNames({ pushed })} showMobileNavigation={showMobileNavigation} />
        ) : (
          <CourseNavigation className={classNames({ pushed })} showMobileNavigation={showMobileNavigation} />
        )}

        <main id="main" className={classNames('course-content', { pushed })}>
          <GlobalNotification />

          <div className="course-content-body">{children && React.cloneElement(children, { courseId })}</div>
        </main>

        {this.helpEnabled && <Help />}
      </div>
    );
  }
}

// TODO: Decouple this component's layout from enrollment state banner.
export default compose<Props, InputProps>(
  withPartnerLearnerImpersonationSessionData,
  withShowEnrollmentStateBanner()
)(Home);
