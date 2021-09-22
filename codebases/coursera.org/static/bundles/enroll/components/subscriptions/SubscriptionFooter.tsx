import Naptime from 'bundles/naptimejs';
import path from 'js/lib/path';

import PropTypes from 'prop-types';
import { compose } from 'recompose';
import classNames from 'classnames';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

import React from 'react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import TrackedButton from 'bundles/page/components/TrackedButton';
import { enrollForFree } from 'bundles/enroll/actions/EnrollActions';
import _t from 'i18n!nls/enroll';

import 'css!./__styles__/SubscriptionFooter';

type InputProps = {
  courseId: string;
  canAuditCourse?: boolean;
  disableAuditOption?: boolean;
  removeStyles?: boolean;
};

type Props = InputProps & {
  course: CoursesV1;
};

class SubscriptionFooter extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    // Context provided in CDPPage and SDPPage
    enableIntegratedOnboarding: PropTypes.bool,
  };

  onClickAuditCourse = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { course, courseId } = this.props;
    const { enableIntegratedOnboarding } = this.context;

    enrollForFree({
      slug: course.slug,
      courseId,
      onFail: undefined,
      // An undefined onSuccess function will redirect us to course home, which is what we want for the integrated onboarding experiment
      onSuccess: enableIntegratedOnboarding ? undefined : this.showOnboardingModal,
    });
  };

  getAuditMessage() {
    const { enableIntegratedOnboarding } = this.context;
    const wrapperClassNames = classNames('body-1-text', {
      'integrated-onboarding-footer': enableIntegratedOnboarding,
    });
    return (
      <p className={wrapperClassNames}>
        <FormattedMessage
          // eslint-disable-next-line no-restricted-syntax
          message={_t('{audit} the course')}
          audit={
            <TrackedButton
              className="button-link"
              trackingName="enroll_subscribe_audit"
              onClick={this.onClickAuditCourse}
            >
              {_t('Audit')}
            </TrackedButton>
          }
        />
      </p>
    );
  }

  showOnboardingModal = () => {
    const { course } = this.props;
    const { router } = this.context;
    router.push({
      ...router.location,
      params: router.params,
      query: Object.assign({}, router.location.query, {
        showOnboardingModal: 'checkAndRedirect',
        courseSlug: course?.slug,
      }),
    });
  };

  render() {
    const { canAuditCourse, disableAuditOption, removeStyles } = this.props;
    if (canAuditCourse) {
      let message;
      if (!disableAuditOption && canAuditCourse) {
        message = this.getAuditMessage();
      } else {
        return null;
      }
      const footerClasses = classNames('rc-SubscriptionFooter', {
        subscriptionFooter: !removeStyles,
      });
      return (
        <div>
          <div className={footerClasses}>{message}</div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export const forTesting = {
  SubscriptionFooter,
};

export default compose<Props, InputProps>(
  Naptime.createContainer<Props, InputProps>(({ courseId }) => ({
    course: CoursesV1.get(courseId, {
      fields: ['slug'],
    }),
  }))
)(SubscriptionFooter);
