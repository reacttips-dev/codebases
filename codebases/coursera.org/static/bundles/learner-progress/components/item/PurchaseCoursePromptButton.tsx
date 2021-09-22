import React from 'react';
import classNames from 'classnames';
import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import CourseEnrollModal from 'bundles/enroll-course/components/CourseEnrollModal';
import TrackedButton from 'bundles/page/components/TrackedButton';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import { VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';
import _t from 'i18n!nls/learner-progress';

type PropsFromCaller = {
  className?: string;
  courseId: string;
  buttonText?: string;
  buttonClassName?: string;
};

type PropsFromNaptime = {
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

type PropsToComponent = PropsFromCaller & PropsFromNaptime;

type State = {
  showModal: boolean;
};

class PurchaseCoursePromptButton extends React.Component<PropsToComponent, State> {
  state = {
    showModal: false,
  };

  onClick = () => this.setState({ showModal: true });

  onClose = () => this.setState({ showModal: false });

  render() {
    const { showModal } = this.state;
    const { className, courseId, buttonText, buttonClassName } = this.props;

    return (
      <div className={classNames('rc-PurchaseCoursePromptButton', className)}>
        <TrackedButton
          className={classNames('c-open-single-page-action-button', buttonClassName || 'primary')}
          onClick={this.onClick}
          trackingName="upgrade"
        >
          {buttonText || _t('Upgrade to submit')}
        </TrackedButton>
        {showModal && <CourseEnrollModal courseId={courseId} onClose={this.onClose} />}
      </div>
    );
  }
}

export default Naptime.createContainer<PropsToComponent, PropsFromCaller>(
  PurchaseCoursePromptButton,
  ({ courseId }) => ({
    courseId,
    enrollmentAvailableChoices: EnrollmentAvailableChoicesV1.get(
      tupleToStringKey([user.get().id, VERIFIED_CERTIFICATE, courseId]),
      {
        fields: ['enrollmentChoices', 'enrollmentChoiceReasonCode'],
      }
    ),
  })
);
