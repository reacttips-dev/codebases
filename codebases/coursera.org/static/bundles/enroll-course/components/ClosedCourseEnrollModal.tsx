import React from 'react';
import LoadingIcon from 'bundles/courseraLoadingIcon/LoadingIcon';
import Icon from 'bundles/iconfont/Icon';
import PromotionApplicableCheckoutMessage from 'bundles/enroll/components/common/PromotionApplicableCheckoutMessage';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ClosedCoursePrice from 'bundles/enroll-course/components/ClosedCoursePrice';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import TrackedButton from 'bundles/page/components/TrackedButton';
import Modal from 'bundles/phoenix/components/Modal';
import RedirectToCheckout from 'bundles/payments/components/RedirectToCheckout';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import _t from 'i18n!nls/enroll-course';
import 'css!./__styles__/ClosedCourseEnrollModal';

const getBulletPoints = () => [
  _t('Access to course materials, including videos, readings, and discussion forums'),
  _t('Access to graded assignments'),
  _t('Final grade at the end of the course'),
  _t('Shareable Course Certificate'),
];

type Props = {
  course: CoursesV1;
  onClose: () => void;
};

type State = {
  didClickContinue: boolean;
  isServerSide: boolean;
};

class ClosedCourseEnrollModal extends React.Component<Props, State> {
  state = {
    didClickContinue: false,
    isServerSide: true,
  };

  componentDidMount() {
    this.setState({ isServerSide: false });
  }

  onClickContinue = () => {
    this.setState({ didClickContinue: true });
  };

  render() {
    const { onClose, course } = this.props;

    const { didClickContinue, isServerSide } = this.state;

    return (
      <Modal
        className="rc-ClosedCourseEnrollModal"
        modalName="ClosedCourseEnrollModal"
        handleClose={() => onClose()}
        trackingName="closed_course_enroll_modal"
      >
        <div className="color-primary-text align-horizontal-center modal-container">
          <div className="headline-4-text">{course.name}</div>
          {isServerSide ? (
            <LoadingIcon />
          ) : (
            <div className="headline-6-text">
              <ClosedCoursePrice courseId={course.id} />
            </div>
          )}
          <PromotionApplicableCheckoutMessage course={course} />
          <div className="body">
            <p className="body-2-text">{_t('Your course fee includes:')}</p>
            {getBulletPoints().map((bulletPoint) => (
              <div className="bullet-point horizontal-box" key={bulletPoint}>
                <Icon name="check-list" className="color-primary" />
                <span className="body-1-text text">{bulletPoint}</span>
              </div>
            ))}
          </div>
          {didClickContinue && (
            <RedirectToCheckout
              courseId={course.id}
              showModal={false}
              enrollmentChoice={EnrollmentChoiceTypes.PURCHASE_SINGLE_COURSE}
            />
          )}
          <TrackedButton
            className="primary continue-button comfy"
            onClick={() => this.onClickContinue()}
            disabled={didClickContinue}
            trackingName="closed_course_enroll_modal_continue_button"
          >
            {didClickContinue ? <Icon name="spinner" spin={true} /> : _t('Continue to enroll')}
          </TrackedButton>
        </div>
      </Modal>
    );
  }
}

export default ClosedCourseEnrollModal;
