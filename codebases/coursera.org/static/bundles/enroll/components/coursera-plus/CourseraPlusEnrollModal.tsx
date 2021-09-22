import classNames from 'classnames';
import Naptime from 'bundles/naptimejs';
import React from 'react';
import { compose, mapProps } from 'recompose';
import PropTypes from 'prop-types';

import LoadingIcon from 'bundles/courseraLoadingIcon/LoadingIcon';
import EnrollErrorModal from 'bundles/enroll/components/common/EnrollErrorModal';
import {
  getModalHeader,
  getS12nBulletPoints,
  getCourseraPlusBulletPoints,
  getButtonLabel,
} from 'bundles/enroll/utils/courseraPlusEnrollmentDescription';
import SubscriptionVPropBulletPoint from 'bundles/enroll/components/subscriptions/free-trialV2/SubscriptionVPropBulletPoint';
import type { ApiError } from 'bundles/enroll/utils/errorUtils';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentProductTypes from 'bundles/enroll-course/common/EnrollmentProductTypes';
import {
  choiceTypeToHandleSubmitPromise,
  submitEnrollmentPromise,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import epic from 'bundles/epic/client';
import CourseraPlusEnrollmentChoices from 'bundles/enroll/utils/CourseraPlusEnrollmentChoices';
import Icon from 'bundles/iconfont/Icon';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import type PromotionEligibilitiesV1 from 'bundles/naptimejs/resources/promotionEligibilities.v1';
import TrackedButton from 'bundles/page/components/TrackedButton';
import CourseraPlusProductVariant from 'bundles/payments-common/common/CourseraPlusProductVariant';
import Modal from 'bundles/phoenix/components/Modal';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { isPhoneOrSmaller } from 'bundles/phoenix/utils/matchMedia';
import { getCourseHomeLinkBySlug } from 'bundles/program-common/utils/courseAndS12nUtils';
import withPromotionInfo from 'bundles/promotions/components/withPromotionInfo';
import { getS12nMonthlySkuId } from 'bundles/s12n-common/utils/subscriptionPriceUtils';

import logger from 'js/app/loggerSingleton';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import redirect from 'js/lib/coursera.redirect';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import fullStory from 'js/lib/fullStoryUtils';
import keysToConstants from 'js/lib/keysToConstants';
import requestCountry from 'js/lib/requestCountry';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import user from 'js/lib/user';

import _t from 'i18n!nls/enroll';

import 'css!./__styles__/CourseraPlusEnrollModal';

const MODAL_TYPES = keysToConstants(['ENROLL', 'LOADING', 'ERROR']);

type PropsFromCaller = {
  courseId?: string;
  s12nId?: string;
  onClose: () => void;
  course?: CoursesV1;
  isGuidedProject?: boolean;
  isFromS12nSelection?: boolean;
};

type PropsFromNaptimeEacAndProduct = {
  s12n?: OnDemandSpecializationsV1;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
  courseraPlusEnrollmentChoices?: CourseraPlusEnrollmentChoices;
  promotionEligibilities?: PromotionEligibilitiesV1;
};

type PropsFromNaptimePrice = {
  courseraPlusPrice?: ProductPricesV3;
};

export type PropsToComponent = PropsFromCaller & PropsFromNaptimeEacAndProduct & PropsFromNaptimePrice;

type State = {
  activeModal: keyof typeof MODAL_TYPES | null;
  selectedEnrollmentChoiceType?: keyof typeof EnrollmentChoiceTypes;
  isSubmitting: boolean;
  error?: ApiError;
};

class CourseraPlusEnrollModal extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state: State = {
    selectedEnrollmentChoiceType: undefined,
    activeModal: MODAL_TYPES.ENROLL,
    isSubmitting: false,
    error: undefined,
  };

  componentDidMount() {
    if (epic.get('payments', 'fullStoryCourseraPlusEnabled')) {
      fullStory.init();
      /* eslint camelcase: ["error", {allow: ["isCourseraPlusEnabled_bool", "isCourseraPlusModal_bool"]}] */
      fullStory.set({
        isCourseraPlusEnabled_bool: true,
        isCourseraPlusModal_bool: true,
      });
    }

    this.checkEnrollThroughCourseraPlus();
  }

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleContinue = () => {
    const { promotionEligibilities, s12nId, course, enrollmentAvailableChoices } = this.props;
    const { selectedEnrollmentChoiceType, isSubmitting } = this.state;
    const { router } = this.context;

    if (!enrollmentAvailableChoices || isSubmitting) {
      return;
    }

    const promoCode = promotionEligibilities?.isEligible ? promotionEligibilities.promoCodeId : null;

    const data: Record<string, string> = {};
    if (s12nId) {
      data.s12nId = s12nId;
    }

    const productSkuId = getS12nMonthlySkuId(enrollmentAvailableChoices, s12nId);
    const courseId = this.getCourseId();

    const options = {
      productSkuId,
      courseId,
      s12nId,
      data,
      ...(selectedEnrollmentChoiceType === EnrollmentChoiceTypes.SUBSCRIBE_TO_COURSERA_PLUS
        ? {
            productItemId: CourseraPlusProductVariant.MONTHLY_WITH_FREE_TRIAL,
          }
        : {}),
    };

    this.setState(() => ({ isSubmitting: true }));

    const handleSubmitPromise = choiceTypeToHandleSubmitPromise[selectedEnrollmentChoiceType];
    submitEnrollmentPromise({ handleSubmitPromise, options, promoCode })
      .then((promiseData: $TSFixMe /* TODO: type submitEnrollmentPromise */) => {
        if (selectedEnrollmentChoiceType === EnrollmentChoiceTypes.AUDIT_COURSE) {
          return router.push({
            ...router.location,
            params: router.params,
            query: Object.assign({}, router.location.query, {
              showOnboardingModal: 'checkAndRedirect',
              courseSlug: course?.slug,
            }),
          });
        }
        if (promiseData.didEnroll && course) {
          redirect.setLocation(getCourseHomeLinkBySlug(course.slug));
        }
      })
      .catch(this.handleError);
  };

  handleContinueWithCourseraPlus = () => {
    this.setState(
      () => ({
        selectedEnrollmentChoiceType: EnrollmentChoiceTypes.SUBSCRIBE_TO_COURSERA_PLUS,
      }),
      this.handleContinue
    );
  };

  handleContinueWithAudit = () => {
    this.setState(
      () => ({
        selectedEnrollmentChoiceType: EnrollmentChoiceTypes.AUDIT_COURSE,
      }),
      this.handleContinue
    );
  };

  handleError = (error: Record<string, string>) => {
    this.setState(() => ({
      activeModal: MODAL_TYPES.ERROR,
      error,
    }));
  };

  getCourseId(): string {
    const { courseId, s12n } = this.props;

    if (courseId) {
      return courseId;
    } else if (s12n) {
      return s12n.courseIds[0];
    } else {
      throw new Error('Must have courseId to complete enrollment');
    }
  }

  checkEnrollThroughCourseraPlus = () => {
    const { courseraPlusEnrollmentChoices, s12nId, course } = this.props;

    if (courseraPlusEnrollmentChoices?.canEnrollThroughCourseraPlus) {
      const handleSubmitPromise = choiceTypeToHandleSubmitPromise[EnrollmentChoiceTypes.ENROLL_THROUGH_COURSERA_PLUS];
      const courseId = this.getCourseId();

      const options = {
        s12nId,
        courseId,
      };

      submitEnrollmentPromise({ handleSubmitPromise, options })
        .then((data: $TSFixMe /* TODO: type submitEnrollmentPromise */) => {
          // Redirects to course home of the selected course or the s12n's first course
          if (data.didEnroll && course) {
            redirect.setLocation(getCourseHomeLinkBySlug(course.slug));
          } else {
            throw new Error('Did not complete enrollment');
          }
        })
        .catch(this.handleError);
    }
  };

  renderAuditLink() {
    return (
      <div className="audit-link">
        <FormattedMessage
          message={_t('{audit} the course')}
          audit={
            <TrackedButton
              data-e2e="coursera_plus_enroll_modal_audit_link"
              trackingName="coursera_plus_enroll_modal_audit_link"
              className="button-link"
              value={EnrollmentChoiceTypes.AUDIT_COURSE}
              onClick={this.handleContinueWithAudit}
            >
              {_t('Audit')}
            </TrackedButton>
          }
        />
      </div>
    );
  }

  renderBodyContent() {
    const { s12n, course, enrollmentAvailableChoices, courseraPlusEnrollmentChoices, courseraPlusPrice } = this.props;
    const { isSubmitting, selectedEnrollmentChoiceType } = this.state;

    if (!s12n || !enrollmentAvailableChoices || !courseraPlusEnrollmentChoices || !courseraPlusPrice) {
      logger.error('Cannot render CourseraPlusEnrollModal body content without product info');
      return null;
    }

    const s12nBulletPoints = getS12nBulletPoints({ s12n, courseraPlusPrice });
    const courseraPlusBulletPoints = getCourseraPlusBulletPoints();
    const isSubmittingCourseraPlusSub =
      isSubmitting && selectedEnrollmentChoiceType === EnrollmentChoiceTypes.SUBSCRIBE_TO_COURSERA_PLUS;

    return (
      <div>
        <ul className="nostyle">
          {s12nBulletPoints.map((bullet, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`s12n-bullet-${index}`}>
              <SubscriptionVPropBulletPoint highlightHeader={true} {...bullet} />
            </li>
          ))}
        </ul>
        <div className="coursera-plus-content">
          <div className="coursera-plus-subheader">{_t('Benefits of Coursera Plus')}</div>
          <ul className="nostyle">
            {courseraPlusBulletPoints.map((bullet, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={`plus-bullet-${index}`}>
                <SubscriptionVPropBulletPoint highlightHeader={true} {...bullet} />
              </li>
            ))}
          </ul>
        </div>
        <TrackedButton
          data-e2e="coursera_plus_enroll_modal_subscribe_button"
          trackingName="coursera_plus_enroll_modal_subscribe_button"
          data={{ s12nId: s12n.id, courseId: course?.id }}
          className="primary subscribe-button cozy"
          onClick={this.handleContinueWithCourseraPlus}
          disabled={isSubmittingCourseraPlusSub}
        >
          {isSubmittingCourseraPlusSub ? <Icon name="spinner" spin /> : getButtonLabel(courseraPlusEnrollmentChoices)}
        </TrackedButton>
        {enrollmentAvailableChoices.canAuditCourse && this.renderAuditLink()}
      </div>
    );
  }

  renderBodyTitle() {
    const { courseraPlusEnrollmentChoices, courseraPlusPrice, s12n, course, isFromS12nSelection } = this.props;

    // course is optional and only applies in the SCDP case
    if (!courseraPlusEnrollmentChoices || !courseraPlusPrice || !s12n) {
      logger.error('Cannot render CourseraPlusEnrollModal without product info');
      return null;
    }

    const { title, subheader } = getModalHeader({ courseraPlusEnrollmentChoices, courseraPlusPrice, s12n, course });

    return (
      <div>
        {isFromS12nSelection && <strong>{_t('Step 2 of 2')}</strong>}
        <div className="headline-4-text body-title">{title}</div>
        <p>{subheader}</p>
      </div>
    );
  }

  renderBody() {
    const { enrollmentAvailableChoices, courseraPlusEnrollmentChoices, s12n, isGuidedProject } = this.props;

    // Post-subscription enrollment will skip the modal and immediately enroll in componentDidMount()
    if (courseraPlusEnrollmentChoices?.canEnrollThroughCourseraPlus) {
      const modalMessage = isGuidedProject
        ? _t('Taking you to Guided Project home...')
        : _t('Taking you to course home...');

      return (
        <div className="subscribed-container">
          <div>{modalMessage}</div>
          <LoadingIcon />
        </div>
      );
    }

    // Pre-subscription enrollment is only meant to show s12n sub and Coursera Plus (no bulk pay or standalone)
    if (
      !s12n ||
      !courseraPlusEnrollmentChoices?.canSubscribeToCourseraPlus ||
      !enrollmentAvailableChoices?.canSubscribeToS12n
    ) {
      logger.error('Cannot render CourseraPlusEnrollModal without enrollmentAvailableChoices or product info');
      return null;
    }

    return (
      <div className="enrollmentChoiceContainer">
        <div>{this.renderBodyTitle()}</div>
        <div className="cem-body">{this.renderBodyContent()}</div>
      </div>
    );
  }

  render() {
    const { enrollmentAvailableChoices } = this.props;
    const { selectedEnrollmentChoiceType, activeModal, error } = this.state;
    const isMobile = isPhoneOrSmaller();
    const modalClass = classNames('rc-CourseraPlusEnrollModal', {
      subscribed: enrollmentAvailableChoices?.canEnrollThroughCourseraPlus,
    });

    switch (activeModal) {
      case MODAL_TYPES.ENROLL:
        return (
          <Modal
            className={modalClass}
            trackingName="coursera_plus_enroll_modal"
            data={{ selectedEnrollmentChoiceType }}
            modalName={_t('Enrollment modal')}
            handleClose={this.handleClose}
            shouldFocusOnXButton={!isMobile}
          >
            {this.renderBody()}
          </Modal>
        );
      case MODAL_TYPES.ERROR:
        return (
          <EnrollErrorModal
            error={error}
            onClose={this.handleClose}
            isFinancialAid={false}
            isFreeEnroll={EnrollmentAvailableChoicesV1.isFreeEnrollmentChoiceType(selectedEnrollmentChoiceType)}
          />
        );
      default:
        return null;
    }
  }
}

export const forTesting = {
  CourseraPlusEnrollModal,
};

export default compose<PropsToComponent, PropsFromCaller>(
  mapProps<PropsFromCaller, PropsFromCaller>(({ course, ...rest }) => ({
    ...(course
      ? {
          courseId: course.id,
        }
      : {}),
    ...rest,
  })),
  Naptime.createContainer<PropsFromNaptimeEacAndProduct, PropsFromCaller>(({ courseId, s12nId }) => {
    const { VerifiedCertificate, Specialization } = EnrollmentProductTypes;
    const isOnlyS12n = s12nId && !courseId;
    const productType = isOnlyS12n ? Specialization : VerifiedCertificate;
    const productId = isOnlyS12n ? s12nId : courseId;
    const userId = user.get().id;

    if (!userId || !productId) {
      return {};
    }

    const eacId = tupleToStringKey([userId, productType, productId]);
    const eacQuery = {
      fields: ['enrollmentChoices', 'enrollmentChoiceReasonCode'],
    };

    return {
      enrollmentAvailableChoices: EnrollmentAvailableChoicesV1.get(eacId, eacQuery),
      courseraPlusEnrollmentChoices: CourseraPlusEnrollmentChoices.get(eacId, eacQuery),
      ...(courseId && {
        course: CoursesV1.get(courseId, {
          fields: ['s12nIds', 'slug'],
        }),
      }),
      ...(s12nId && {
        s12n: OnDemandSpecializationsV1.get(s12nId, {
          fields: ['courseIds', 'productVariant'],
        }),
      }),
    };
  }),
  Naptime.createContainer<PropsFromNaptimePrice, PropsFromCaller & PropsFromNaptimeEacAndProduct>(
    ({ courseraPlusEnrollmentChoices, courseId, s12n }) => {
      const requestCountryCode = requestCountry.get();

      return {
        // When subscribed to Coursera Plus, we need the s12n's first course slug for post-enrollment redirect
        ...(courseraPlusEnrollmentChoices?.canEnrollThroughCourseraPlus && !courseId && s12n
          ? {
              course: CoursesV1.get(s12n.courseIds[0], {
                fields: ['slug'],
              }),
            }
          : {}),
        ...(courseraPlusEnrollmentChoices?.canSubscribeToCourseraPlus
          ? {
              courseraPlusPrice: ProductPricesV3.getCourseraPlusProductPrice(
                CourseraPlusProductVariant.MONTHLY_WITH_FREE_TRIAL,
                requestCountryCode,
                {}
              ),
            }
          : {}),
      };
    }
  ),
  withPromotionInfo()
)(CourseraPlusEnrollModal);
