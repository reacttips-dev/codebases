import React from 'react';
import { compose, withProps } from 'recompose';

import Naptime from 'bundles/naptimejs';
import Modal from 'bundles/phoenix/components/Modal';
import EnrollErrorModal from 'bundles/enroll/components/common/EnrollErrorModal';

import { withEnrollment } from 'bundles/enroll/components/xdp/withNaptimeData';
import S12nEnrollModalPaymentChoices from 'bundles/s12n-enroll/components/bulk-pay/PaymentChoices';
import SubscriptionFooter from 'bundles/enroll/components/subscriptions/SubscriptionFooter';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import redirect from 'js/lib/coursera.redirect';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import type { ApiError } from 'bundles/enroll/utils/errorUtils';

import _t from 'i18n!nls/s12n-enroll';
import 'css!bundles/s12n-enroll/components/bulk-pay/__styles__/S12nBulkPayEnrollModal';

type $Values<O extends Record<string, unknown>> = O[keyof O];

const MODAL_TYPES = {
  ENROLL: 'ENROLL',
  ERROR: 'ERROR',
};
type ModalTypes = $Values<typeof MODAL_TYPES>;

type PropsFromCaller = {
  onEnrollFailure?: () => void;
  onEnrollSuccess?: () => void;
  isContentGate?: boolean;
  s12nId: string;
  onSdp?: boolean;
  onClose?: () => void;
  courseIdOverride?: string;
  isFromS12nSelection?: boolean;
  disableAuditOption?: boolean;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

type PropsFromWithProps = {
  isSpecialization: boolean;
  courseId?: string;
};

type PropsFromNaptimeCourse = {
  course?: CoursesV1;
};

type PropsFromNaptimeS12n = {
  s12n: OnDemandSpecializationsV1;
};

type PropsToComponent = PropsFromCaller & PropsFromWithProps & PropsFromNaptimeCourse & PropsFromNaptimeS12n;

type State = {
  refreshPageOnClose: boolean;
  activeModal: ModalTypes;
  error?: ApiError;
};

export class S12nBulkPayEnrollModal extends React.Component<PropsToComponent, State> {
  state = {
    activeModal: MODAL_TYPES.ENROLL,
    refreshPageOnClose: false,
    error: undefined,
  };

  handleClose = () => {
    if (this.state.refreshPageOnClose) {
      redirect.refresh();
    } else if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onEnrollFailure = (error: Record<string, string>) => {
    this.setState(() => ({
      activeModal: MODAL_TYPES.ERROR,
      error,
    }));
  };

  /**
   * @returns {courseId} The courseId to use for the Pay By Course option.
   *   Either corresponds to this.props.courseIdOverride, or the first unowned course in the s12n.
   */
  getCourseId() {
    const { courseIdOverride, s12n } = this.props;

    return courseIdOverride ?? s12n.courseIds?.[0] ?? null;
  }

  getModalName() {
    if (this.props.isContentGate) {
      return _t('Join to continue');
    } else {
      return _t('Join this Specialization');
    }
  }

  renderModalBody = () => {
    const { s12n, course, s12nId, enrollmentAvailableChoices, onSdp, isFromS12nSelection, disableAuditOption } =
      this.props;
    const { canAuditCourse } = enrollmentAvailableChoices;

    const title = onSdp ? s12n.name : course?.name;
    const courseId = this.getCourseId();

    const auditComponent = !onSdp ? (
      <SubscriptionFooter courseId={courseId} canAuditCourse={canAuditCourse} disableAuditOption={disableAuditOption} />
    ) : undefined;

    if (enrollmentAvailableChoices && enrollmentAvailableChoices.hasChoice) {
      return (
        <S12nEnrollModalPaymentChoices
          title={title}
          s12nId={s12nId}
          course={course}
          enrollmentAvailableChoices={enrollmentAvailableChoices}
          isFromS12nSelection={isFromS12nSelection}
          onEnrollFailure={this.onEnrollFailure}
          onSdp={onSdp}
          auditComponent={auditComponent}
        />
      );
    } else {
      const humanReadableReasonCode = enrollmentAvailableChoices
        ? enrollmentAvailableChoices.humanReadableReasonCode
        : _t("Sorry, we couldn't identify any available enrollment choice for this Specialization at this time.");

      return <p className="no-enrollment-option">{humanReadableReasonCode}</p>;
    }
  };

  render() {
    const { s12nId, onSdp } = this.props;
    const { activeModal, error } = this.state;

    const productId = onSdp ? s12nId : this.getCourseId();

    switch (activeModal) {
      case MODAL_TYPES.ENROLL:
        return (
          <div className="rc-S12nBulkPayEnrollModal">
            <CSSTransitionGroup transitionName="fade" transitionEnter={false} transitionLeaveTimeout={300}>
              <Modal
                trackingName="s12n_bulk_pay_enroll_modal"
                data={{ id: productId }}
                key="S12nBulkPayEnrollModal"
                modalName={this.getModalName()}
                handleClose={this.handleClose}
                allowClose={true}
              >
                {this.renderModalBody()}
              </Modal>
            </CSSTransitionGroup>
          </div>
        );
      case MODAL_TYPES.ERROR:
        return <EnrollErrorModal error={error} onClose={this.handleClose} isFinancialAid={false} />;
      default:
        return null;
    }
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  withProps<PropsFromWithProps, PropsFromCaller>(({ courseIdOverride, onSdp }) => ({
    isSpecialization: onSdp || false,
    courseId: courseIdOverride,
  })),
  withEnrollment<PropsFromCaller & PropsFromWithProps>(),
  Naptime.createContainer<PropsFromNaptimeS12n, PropsFromCaller>(({ s12nId }) => ({
    s12n: OnDemandSpecializationsV1.get(s12nId, {
      fields: ['courseIds', 'productVariant'],
    }),
  })),
  Naptime.createContainer<PropsFromNaptimeCourse, PropsFromCaller & PropsFromNaptimeS12n>(
    ({ courseIdOverride, s12n }) => {
      const courseId = courseIdOverride ?? s12n.courseIds?.[0];

      return {
        course: CoursesV1.get(courseId, {
          fields: ['name'],
        }),
      };
    }
  )
)(S12nBulkPayEnrollModal);
