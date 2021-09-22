import PropTypes from 'prop-types';
import * as React from 'react';
import { Button } from '@coursera/cds-core';

import _t from 'i18n!nls/enroll-course';
import user from 'js/lib/user';

import Naptime from 'bundles/naptimejs';
import { enrollInCourseForFreePromise } from 'bundles/enroll-course/lib/apiClient';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

import TrackedButton from 'bundles/page/components/TrackedButton';

import { FormattedHTMLMessage, FormattedMessage } from 'js/lib/coursera.react-intl';
import CourseEnrollmentConfirmation from 'bundles/enroll-course/components/CourseEnrollmentConfirmation';
import S12NUpgradeButton from 'bundles/ondemand/components/s12n-upgrade/S12NUpgradeButton';

import { checkSessionsV2Epic } from 'bundles/enroll-course/lib/sessionsV2ExperimentUtils';

import EnrollmentReasonCode from 'bundles/enroll-course/common/EnrollmentReasonCode';
import { API_SUCCESS, API_ERROR } from 'bundles/coursera-ui/constants/apiNotificationConstants';

import logger from 'js/app/loggerSingleton';

class EnrollmentReasonMessage extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(CoursesV1).isRequired,
    reasonCode: PropTypes.oneOf(Object.keys(EnrollmentReasonCode)).isRequired,
    s12nIdBySlug: PropTypes.string,
    redirectToCourseHome: PropTypes.func,
  };

  static contextTypes = {
    // Context set in CDPPage and SDPPage
    enableIntegratedOnboarding: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      didJustEnroll: false,
    };
  }

  handleUpgradeS12nSuccess = () => {
    this.setState({
      upgradeS12nApiStatus: API_SUCCESS,
    });
  };

  handleUpgradeS12nError = () => {
    this.setState({
      upgradeS12nApiStatus: API_ERROR,
    });
  };

  renderAlreadyEnrolled() {
    const { course } = this.props;

    return (
      <div className="align-horizontal-center">
        <p>
          <FormattedMessage message={_t('You are already enrolled in {courseName}.')} courseName={course.name} />
        </p>
        <p>
          {/* eslint-disable-next-line no-restricted-syntax */}
          <a href={course.homeLink}>{_t('Go to course home')}</a>
        </p>
      </div>
    );
  }

  renderAlreadyPurchased() {
    const { course } = this.props;
    const enrollInAlreadyPaidCourse = () => {
      checkSessionsV2Epic(course.id).then(() => {
        enrollInCourseForFreePromise(course.id).then(() =>
          this.setState(
            () => ({ didJustEnroll: true }),
            () => {
              const { enableIntegratedOnboarding } = this.context;
              const { redirectToCourseHome } = this.props;

              // We redirect immediately after enrollment to avoid the extra step in the process that renders <CourseEnrollmentConfirmation>,
              // so we can directly send the user to the in-course home
              if (enableIntegratedOnboarding && redirectToCourseHome) {
                redirectToCourseHome();
              }
            }
          )
        );
      });
    };

    const { enableIntegratedOnboarding } = this.context;

    return (
      <div className="align-horizontal-center">
        {/* eslint-disable-next-line no-restricted-syntax */}
        <p>{_t('Please click the button below to access course materials.')}</p>
        <br />
        <p>
          {enableIntegratedOnboarding ? (
            <Button
              component={TrackedButton}
              trackingName="join-course"
              onClick={enrollInAlreadyPaidCourse}
              withVisibilityTracking={false}
              requireFullyVisible={false}
            >
              {/* eslint-disable-next-line no-restricted-syntax */}
              {_t('Join Course')}
            </Button>
          ) : (
            <button type="button" className="primary" onClick={() => enrollInAlreadyPaidCourse()}>
              {/* eslint-disable-next-line no-restricted-syntax */}
              {_t('Join Course')}
            </button>
          )}
        </p>
      </div>
    );
  }

  renderCapstoneLocked() {
    return (
      <div className="align-horizontal-center">
        {_t('You can only access this Capstone after completing the courses in the Specialization')}
      </div>
    );
  }

  renderRegionBlocked() {
    return (
      <div className="align-horizontal-center">
        <FormattedHTMLMessage
          message={_t(
            `We apologize for the inconvenience. This course is not available in your region.
          Click <a href="{policyUrl}">here</a> for more information.`
          )}
          policyUrl="https://learner.coursera.help/hc/articles/208280116-International-restrictions"
        />
      </div>
    );
  }

  renderNoAvailableSession() {
    return (
      <p className="align-horizontal-center">
        {/* eslint-disable-next-line no-restricted-syntax */}
        {_t('There is no upcoming session for this course. Please check back later.')}
      </p>
    );
  }

  renderSpecializationUpgradeRequired() {
    const { s12nIdBySlug } = this.props;
    const { upgradeS12nApiStatus } = this.state;

    return (
      <div className="s12n-upgrade-required">
        {upgradeS12nApiStatus !== API_SUCCESS && (
          <p className="font-sm m-b-2 align-horizontal-center">
            {_t(
              `You are currently enrolled in an old version of the specialization.
              Upgrade the specialization to continue with your purchase.`
            )}
          </p>
        )}
        {upgradeS12nApiStatus === API_SUCCESS && (
          <div className="font-sm m-b-2 align-horizontal-center">
            <p>{_t('You have been successfully upgraded to the new version of this specialization!')}</p>
            <p>
              {_t(
                `The page will automatically reload with your upgraded version,
                so you can continue with the enrollment.`
              )}
            </p>
          </div>
        )}
        {s12nIdBySlug && (
          <div className="align-horizontal-center">
            <S12NUpgradeButton
              onSuccess={this.handleUpgradeS12nSuccess}
              onError={this.handleUpgradeS12nError}
              reloadPageOnSuccess={true}
              s12nId={s12nIdBySlug}
              userId={user.get().id}
            />
          </div>
        )}
      </div>
    );
  }

  renderUnknownReasonCode() {
    const { course } = this.props;
    return (
      <div className="align-horizontal-center">
        <p>
          <FormattedMessage
            message={_t('Sorry, we could not find any enrollment option for {courseName} at this time.')}
            courseName={course.name}
          />
        </p>
        <p>
          {/* eslint-disable-next-line no-restricted-syntax */}
          <a href={course.link}>{_t('Go to course')}</a>
        </p>
      </div>
    );
  }

  render() {
    const { reasonCode, course } = this.props;
    const { enableIntegratedOnboarding } = this.context;
    const { didJustEnroll } = this.state;

    if (!reasonCode) {
      return false;
    }

    if (didJustEnroll) {
      if (enableIntegratedOnboarding) {
        return null;
      }

      return <CourseEnrollmentConfirmation courseId={course.id} />;
    }

    // TODO(jnam) remove duplicate definitions between here and
    //   bundles/naptimejs/resources/enrollmentAvailableChoices.v1.js
    switch (reasonCode) {
      case EnrollmentReasonCode.ENROLLED:
        return this.renderAlreadyEnrolled();
      case EnrollmentReasonCode.PURCHASED_SINGLE_COURSE:
      case EnrollmentReasonCode.SPECIALIZATION_BULK_PAID:
      case EnrollmentReasonCode.SPECIALIZATION_SUBSCRIBED:
        return this.renderAlreadyPurchased();
      case EnrollmentReasonCode.CAPSTONE_ACCESS_LOCKED:
        return this.renderCapstoneLocked();
      case EnrollmentReasonCode.REGION_BLOCKED:
        return this.renderRegionBlocked();
      case EnrollmentReasonCode.NO_AVAILABLE_SESSION:
        return this.renderNoAvailableSession();
      case EnrollmentReasonCode.SPECIALIZATION_UPGRADE_REQUIRED:
        return this.renderSpecializationUpgradeRequired();
      default:
        logger.error(`Unrecognized enrollment reason code: ${reasonCode}`);
        return this.renderUnknownReasonCode();
    }
  }
}

export default Naptime.createContainer(EnrollmentReasonMessage, (props) => ({
  course: CoursesV1.get(props.courseId, {
    fields: ['name'],
  }),
}));
