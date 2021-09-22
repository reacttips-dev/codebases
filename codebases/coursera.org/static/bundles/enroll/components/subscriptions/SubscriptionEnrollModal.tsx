import React from 'react';
import PropTypes from 'prop-types';

import Naptime from 'bundles/naptimejs';
import { compose, withProps } from 'recompose';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import _ from 'lodash';
import EnrollErrorModal from 'bundles/enroll/components/common/EnrollErrorModal';
import SubscriptionEnrollButton from 'bundles/enroll/components/subscriptions/SubscriptionEnrollButton';
import SubscriptionFooter from 'bundles/enroll/components/subscriptions/SubscriptionFooter';
import SubscriptionVProp from 'bundles/enroll/components/subscriptions/SubscriptionVProp';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';

import PromotionApplicableCheckoutMessage from 'bundles/enroll/components/common/PromotionApplicableCheckoutMessage';
import SubscriptionPriceHeader from 'bundles/enroll/components/subscriptions/SubscriptionPriceHeader';
import SubscriptionVPropFreeTrial from 'bundles/enroll/components/subscriptions/free-trialV2/SubscriptionVPropFreeTrial';
import type { ApiError } from 'bundles/enroll/utils/errorUtils';

import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import type { PropsFromWithPromotionInfo } from 'bundles/promotions/components/withPromotionInfo';
import withPromotionInfo from 'bundles/promotions/components/withPromotionInfo';
import BillingCycleType from 'bundles/subscriptions/common/BillingCycleType';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import Modal from 'bundles/phoenix/components/Modal';
import _t from 'i18n!nls/enroll';
import subscriptionPriceUtils from 'bundles/s12n-common/utils/subscriptionPriceUtils';
import keysToConstants from 'js/lib/keysToConstants';
import connectToRouter from 'js/lib/connectToRouter';
import type { PropsFromWithEnrollment, PropsFromWithPrice } from 'bundles/enroll/components/xdp/withNaptimeData';
import { withEnrollment, withPrice } from 'bundles/enroll/components/xdp/withNaptimeData';

import 'css!./__styles__/SubscriptionEnrollModal';

const MODAL_TYPES = keysToConstants(['ENROLL', 'ERROR']);

type PropsFromCaller = {
  s12nId: string;
  courseIdOverride?: string;
  course?: CoursesV1;
  onClose: () => void;
  onSdp: boolean;
  disableAuditOption?: boolean;
  isFromS12nSelection?: boolean;
};

type PropsFromWithProps = {
  isSpecialization: boolean;
};

type PropsFromStore = {
  requestCountryCode: string;
};

type PropsFromRouter = {
  pathname: string;
  slug: string;
  query: { [key: string]: string };
};

type PropsFromNaptime = {
  s12n?: OnDemandSpecializationsV1;
};

type PropsToComponent = PropsFromCaller &
  PropsFromRouter &
  PropsFromWithEnrollment &
  PropsFromWithPrice &
  PropsFromWithProps &
  PropsFromStore &
  PropsFromNaptime &
  PropsFromWithPromotionInfo;

type State = {
  activeModal: keyof typeof MODAL_TYPES | null;
  error?: ApiError;
};

export class SubscriptionEnrollModal extends React.Component<PropsToComponent, State> {
  state: State = {
    activeModal: MODAL_TYPES.ENROLL,
    error: undefined,
  };

  static contextTypes = {
    enableIntegratedOnboarding: PropTypes.bool,
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleError = (error: ApiError) => {
    this.setState(() => ({
      activeModal: MODAL_TYPES.ERROR,
      error,
    }));
  };

  getCourseId() {
    const { courseIdOverride, s12n } = this.props;
    // If this component is able to be mounted, either courseIdOverride or s12n should always be available
    // as we're using one of each id to fetch the EnrollmentAvailableChoicesV1
    if (courseIdOverride) {
      return courseIdOverride;
    } else if (s12n && !_.isEmpty(s12n.courseIds)) {
      return s12n.courseIds[0];
    } else {
      return null;
    }
  }

  // used for mix and match when the user has selected to enroll in a specific s12n among several s12ns
  getSelectedS12nEnrollmentData() {
    const { enrollmentAvailableChoices, isFromS12nSelection, s12nId } = this.props;
    return (
      isFromS12nSelection &&
      enrollmentAvailableChoices &&
      enrollmentAvailableChoices.getS12nSubscriptionEnrollmentData(s12nId)
    );
  }

  getS12nMonthlySkuId(): string | null {
    const { enrollmentAvailableChoices } = this.props;

    if (!enrollmentAvailableChoices) {
      return null;
    }

    const selectedS12nEnrollmentData = this.getSelectedS12nEnrollmentData();
    let availableS12nSubscriptions;

    if (selectedS12nEnrollmentData) {
      availableS12nSubscriptions = selectedS12nEnrollmentData.enrollmentChoiceData.definition.availableSubscriptions;
    } else {
      ({ availableS12nSubscriptions } = enrollmentAvailableChoices);
    }

    return subscriptionPriceUtils.getSubscriptionSkuId(availableS12nSubscriptions, BillingCycleType.MONTHLY);
  }

  getCanEnrollThroughS12nSubscriptionFreeTrial() {
    const { enrollmentAvailableChoices } = this.props;

    if (!enrollmentAvailableChoices) {
      return false;
    }

    const selectedS12nEnrollmentData = this.getSelectedS12nEnrollmentData();

    if (selectedS12nEnrollmentData) {
      return enrollmentAvailableChoices.getCanEnrollThroughS12nSubscriptionFreeTrial(selectedS12nEnrollmentData);
    } else {
      return enrollmentAvailableChoices.canEnrollThroughS12nSubscriptionFreeTrial;
    }
  }

  getCanEnrollThroughS12nSubscription() {
    const { enrollmentAvailableChoices } = this.props;

    if (!enrollmentAvailableChoices) {
      return false;
    }

    const selectedS12nEnrollmentData = this.getSelectedS12nEnrollmentData();

    if (selectedS12nEnrollmentData) {
      return enrollmentAvailableChoices.getCanEnrollThroughS12nSubscription(selectedS12nEnrollmentData);
    } else {
      return enrollmentAvailableChoices.canEnrollThroughS12nSubscription;
    }
  }

  renderHeader() {
    const { s12nId } = this.props;

    const canEnrollThroughS12nSubscription = this.getCanEnrollThroughS12nSubscription();

    if (canEnrollThroughS12nSubscription) {
      return <SubscriptionPriceHeader s12nId={s12nId} />;
    } else {
      return null;
    }
  }

  renderBody(): React.ReactNode {
    const { s12nId, onSdp } = this.props;

    const courseId = !onSdp ? this.getCourseId() : null;
    const subscriptionVProp = {
      s12nId,
      courseId,
    };

    const canEnrollThroughS12nSubscription = this.getCanEnrollThroughS12nSubscription();
    const canEnrollThroughS12nSubscriptionFreeTrial = this.getCanEnrollThroughS12nSubscriptionFreeTrial();

    if (canEnrollThroughS12nSubscriptionFreeTrial) {
      return <SubscriptionVPropFreeTrial {...subscriptionVProp} />;
    } else if (canEnrollThroughS12nSubscription) {
      return <SubscriptionVProp {...subscriptionVProp} />;
    } else {
      return null;
    }
  }

  render() {
    const {
      enrollmentAvailableChoices,
      promotionEligibilities,
      disableAuditOption,
      s12nId,
      course,
      s12n,
      isFromS12nSelection,
    } = this.props;
    const { activeModal, error } = this.state;
    const { enableIntegratedOnboarding } = this.context;
    const s12nMonthlySkuId = this.getS12nMonthlySkuId();

    if (!enrollmentAvailableChoices || !s12nMonthlySkuId) {
      return null;
    }

    const courseId = this.getCourseId();
    const { canAuditCourse } = enrollmentAvailableChoices;
    const isFreeTrial = this.getCanEnrollThroughS12nSubscriptionFreeTrial();

    const promoCode = promotionEligibilities?.isEligible ? promotionEligibilities?.promoCodeId : null;
    const wrapperClassname = enableIntegratedOnboarding
      ? 'rc-SubscriptionEnrollModalExp'
      : 'rc-SubscriptionEnrollModal';

    switch (activeModal) {
      case MODAL_TYPES.ENROLL:
        return (
          <div className={wrapperClassname}>
            <CSSTransitionGroup transitionName="fade" transitionEnter={false} transitionLeaveTimeout={300}>
              <Modal
                trackingName="subscription_enroll_modal"
                key="SubscriptionEnrollModal"
                modalName={_t('Join this Specialization')}
                handleClose={this.handleClose}
                className="subscription-enroll-modal"
              >
                <div className="enroll-modal-container">
                  {isFromS12nSelection && (
                    <div className="m-t-1s">
                      <strong data-unit="step2">{_t('Step 2 of 2')}</strong>
                    </div>
                  )}
                  {this.renderHeader()}
                  <PromotionApplicableCheckoutMessage
                    course={course}
                    s12n={s12n}
                    isFromS12nSelection={isFromS12nSelection}
                  />
                  {this.renderBody()}
                  <SubscriptionEnrollButton
                    onError={this.handleError}
                    s12nId={s12nId}
                    s12nMonthlySkuId={s12nMonthlySkuId}
                    courseId={courseId}
                    isFreeTrial={isFreeTrial}
                    promoCode={promoCode}
                  />
                  {courseId && (
                    <SubscriptionFooter
                      courseId={courseId}
                      canAuditCourse={canAuditCourse}
                      disableAuditOption={disableAuditOption}
                    />
                  )}
                </div>
              </Modal>
            </CSSTransitionGroup>
          </div>
        );
      case MODAL_TYPES.ERROR:
        return (
          <EnrollErrorModal error={error} onClose={this.handleClose} isFinancialAid={false} isFreeEnroll={false} />
        );
      default:
        return null;
    }
  }
}

export const forTesting = {
  SubscriptionEnrollModal,
};

export default compose<PropsToComponent, PropsFromCaller>(
  connectToStores<PropsFromStore, {}>(['ApplicationStore'], ({ ApplicationStore }) => ({
    requestCountryCode: ApplicationStore.getState().requestCountryCode,
  })),
  connectToRouter<PropsFromCaller & PropsFromRouter, PropsFromCaller>(({ params, location }) => ({
    slug: params.courseSlug || params.slug,
    pathname: location.pathname,
    query: location.query,
  })),
  withProps<PropsFromWithProps, PropsFromCaller>((props) => ({
    isSpecialization: !props.courseIdOverride,
  })),
  Naptime.createContainer<PropsFromNaptime, PropsFromCaller>(({ s12nId }) => ({
    s12n: OnDemandSpecializationsV1.get(s12nId, {
      fields: ['courseIds', 'productVariant'],
    }),
  })),
  withEnrollment<PropsFromCaller & PropsFromWithProps>(),
  withPrice<PropsFromCaller & PropsFromStore & PropsFromWithEnrollment>(),
  withPromotionInfo()
)(SubscriptionEnrollModal);
