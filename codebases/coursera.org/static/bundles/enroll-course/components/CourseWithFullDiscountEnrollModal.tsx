import Naptime from 'bundles/naptimejs';
import React from 'react';

import API from 'js/lib/api';
import { VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';

import Icon from 'bundles/iconfont/Icon';
import EnrollErrorModal from 'bundles/enroll/components/common/EnrollErrorModal';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import TrackedButton from 'bundles/page/components/TrackedButton';
import Modal from 'bundles/phoenix/components/Modal';
import CourseTypeMetadataV1 from 'bundles/naptimejs/resources/courseTypeMetadata.v1';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import redirect from 'js/lib/coursera.redirect';
import { EnrollModalType } from 'bundles/enroll/types/modalTypes';
import _t from 'i18n!nls/enroll';

import 'css!./__styles__/CourseWithFullDiscountEnrollModal';

const userEntitlementsApi = API('/api/userEntitlements.v1', { type: 'rest' });

type PropsFromCaller = {
  courseId: string;
  onClose: () => void;
};

type PropsFromNaptime = {
  course: CoursesV1;
  courseTypeMetadata?: CourseTypeMetadataV1;
};

type PropsToComponent = PropsFromCaller & PropsFromNaptime;

type State = {
  didClickContinue: boolean;
  activeModal: EnrollModalType;
};

class CourseWithFullDiscountEnrollModal extends React.Component<PropsToComponent, State> {
  state = {
    didClickContinue: false,
    activeModal: EnrollModalType.ENROLL,
  };

  handleModalClose = () => {
    this.props.onClose();
  };

  onClickContinue = () => {
    this.setState(() => ({ didClickContinue: true }));

    const { courseId, course } = this.props;
    const productId = tupleToStringKey([VERIFIED_CERTIFICATE, courseId]);
    return userEntitlementsApi
      .post('', { data: { productId } })
      .then(() => {
        redirect.setLocation(course.learnerPhoenixHomeLink);
      })
      .catch(() => {
        this.setState(() => ({ activeModal: EnrollModalType.ERROR }));
      });
  };

  renderEnrollModal() {
    const { course, courseTypeMetadata } = this.props;
    const { didClickContinue } = this.state;

    const welcomeMessage = courseTypeMetadata?.isGuidedProject
      ? _t('Start learning from this Guided Project.')
      : _t('Start learning from this course.');

    return (
      <Modal
        className="rc-CourseWithFullDiscountEnrollModal"
        modalName="CourseWithFullDiscount"
        handleClose={this.handleModalClose}
        trackingName="course_with_full_discount"
        data={{ id: course.id }}
      >
        <div className="theme-dark">
          <div className="cem-title color-primary-text align-horizontal-center headline-4-text">{course.name}</div>
        </div>
        <div className="cem-body align-horizontal-center">
          <div className="message">{welcomeMessage}</div>
          <TrackedButton
            className="primary cozy continue-button"
            data-e2e="course_with_full_discount"
            onClick={this.onClickContinue}
            disabled={didClickContinue}
            trackingName="course_with_full_discount_continue"
          >
            {didClickContinue ? <Icon name="spinner" spin={true} /> : _t('Continue')}
          </TrackedButton>
        </div>
      </Modal>
    );
  }

  render() {
    const { onClose } = this.props;
    const { activeModal } = this.state;

    switch (activeModal) {
      case EnrollModalType.ERROR:
        const messageOverride = _t('Enrollment failed. Please contact customer support or try again.');
        return <EnrollErrorModal onClose={onClose} messageOverride={messageOverride} />;
      case EnrollModalType.ENROLL:
        return this.renderEnrollModal();
      default:
        return null;
    }
  }
}

export const forTesting = {
  CourseWithFullDiscountEnrollModal,
};

export default Naptime.createContainer<PropsToComponent, PropsFromCaller>(({ courseId }) => ({
  course: CoursesV1.get(courseId, {
    fields: ['id', 'name'],
    params: {
      showHidden: true,
    },
  }),
  courseTypeMetadata: CourseTypeMetadataV1.get(courseId, {
    fields: ['courseTypeMetadata'],
  }),
}))(CourseWithFullDiscountEnrollModal);
