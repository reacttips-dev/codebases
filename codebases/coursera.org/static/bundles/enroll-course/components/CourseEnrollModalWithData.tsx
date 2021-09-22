import React from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import classNames from 'classnames';

import $ from 'jquery';
import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';
import Naptime from 'bundles/naptimejs';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import user from 'js/lib/user';
import _ from 'lodash';

import EnrollErrorModal from 'bundles/enroll/components/common/EnrollErrorModal';
import CourseEnrollChoiceDescription from 'bundles/enroll-course/components/CourseEnrollChoiceDescription';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import CourseEnrollmentConfirmation from 'bundles/enroll-course/components/CourseEnrollmentConfirmation';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentReasonMessage from 'bundles/enroll-course/components/EnrollmentReasonMessage';
import {
  choiceTypeToHandleSubmitPromise,
  submitEnrollmentPromise,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import Icon from 'bundles/iconfont/Icon';

import type { ApiError } from 'bundles/enroll/utils/errorUtils';
import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import type OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import type PromotionEligibilitiesV1 from 'bundles/naptimejs/resources/promotionEligibilities.v1';
import type PromotionDetailsV1 from 'bundles/naptimejs/resources/promotionDetails.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import TrackedButton from 'bundles/page/components/TrackedButton';
import TrackedDiv from 'bundles/page/components/TrackedDiv';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import Modal from 'bundles/phoenix/components/Modal';
import withPromotionInfo from 'bundles/promotions/components/withPromotionInfo';
import subscriptionPriceUtils from 'bundles/s12n-common/utils/subscriptionPriceUtils';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { certDpURLForCertificatePilotCourse } from 'bundles/university-program/data/certs/certificatePilotUtils';
import { MONTHLY } from 'bundles/subscriptions/common/BillingCycleType';

import { ArrowNextIcon, SpinnerIcon } from '@coursera/cds-icons';
import { Button } from '@coursera/cds-core';

import type { EnrollmentChoiceTypesValues } from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import {
  AUDIT_COURSE,
  BULKPAY_FULL_SPECIALIZATION,
  BULKPAY_REMAINING_SPECIALIZATION_COURSES,
  ENROLL_THROUGH_PROGRAM,
  ENROLL_THROUGH_GROUP,
  PURCHASE_SINGLE_COURSE,
  SUBSCRIBE_TO_CATALOG,
  SUBSCRIBE_TO_CATALOG_TRIAL,
  UPGRADE_TO_CATALOG_SUBSCRIPTION,
  SUBSCRIBE_TO_COURSERA_PLUS,
  ENROLL_COURSE,
} from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import logger from 'js/app/loggerSingleton';
import keysToConstants from 'js/lib/keysToConstants';
import redirect from 'js/lib/coursera.redirect';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import type { Program, ThirdPartyOrganization, Group } from 'bundles/enroll-course/common/Enterprise';
import _t from 'i18n!nls/enroll-course';

import 'css!./__styles__/CourseEnrollModal';

const MODAL_TYPES = keysToConstants(['ENROLL', 'ERROR']);

type PropsFromCaller = {
  course: CoursesV1;
};

type PropsFromStores = PropsFromCaller & {
  requestCountryCode: string;
};

type PropsFromNaptime = {
  productPrice: ProductPricesV3;
};

type RenderChoiceProps = {
  choiceType: EnrollmentChoiceTypesValues;
  index: number;
  selectedIndex: number;
  shouldShowRadioButton: boolean;
};

type PropsToComponent = PropsFromCaller &
  PropsFromStores & {
    s12n?: OnDemandSpecializationsV1;
    onClose: () => void;
    productPrice?: ProductPricesV3;
    enrollmentAvailableChoices: EnrollmentAvailableChoicesV1;
    promotionEligibilities?: PromotionEligibilitiesV1;
    promotionDetails?: PromotionDetailsV1;
    s12nIdBySlug?: string;
    program?: Program;
    thirdPartyOrganization?: ThirdPartyOrganization;
    group?: Group;
    defaultChoice?: EnrollmentChoiceTypesValues;
  };

type State = {
  didClickContinue: boolean;
  didJustEnroll: boolean;
  activeModal?: 'ENROLL' | 'ERROR';
  error?: ApiError;
  choiceTypeLoadedCount: number;
};

class CourseEnrollModalWithData extends React.Component<PropsToComponent, State> {
  selectedEnrollmentType!: string;

  static contextTypes = {
    router: PropTypes.object.isRequired,
    // Context provided in CDPPage and SDPPage
    enableIntegratedOnboarding: PropTypes.bool,
  };

  state: State = {
    didClickContinue: false,
    didJustEnroll: false,
    activeModal: MODAL_TYPES.ENROLL,
    error: undefined,
    choiceTypeLoadedCount: 0,
  };

  componentDidMount() {
    this.selectedEnrollmentType = this.getSelectedChoiceType();
  }

  componentDidUpdate() {
    const { course } = this.props;
    const { didJustEnroll, activeModal } = this.state;
    const { enableIntegratedOnboarding } = this.context;
    // This gets triggered after the user enrolls by clicking "Full Course, No Certificate" or "Audit"
    if (didJustEnroll && !activeModal && enableIntegratedOnboarding && course.phoenixHomeLink) {
      this.redirectToCourseHome();
    }
  }

  redirectToCourseHome = () => {
    const { course } = this.props;
    redirect.setLocation(course.phoenixHomeLink);
  };

  // Every `CourseEnrollChoiceDescription` makes its own API calls
  // Track all of their loading states so that we can only render the modal once all loaded
  handleChoiceTypeLoaded = () => {
    this.setState(({ choiceTypeLoadedCount }) => ({ choiceTypeLoadedCount: choiceTypeLoadedCount + 1 }));
  };

  handleModalClose = () => {
    const { didJustEnroll } = this.state;
    const { onClose } = this.props;

    if (didJustEnroll) {
      redirect.refresh();
    } else {
      onClose();
    }
  };

  handleRadioClick = (ev: React.MouseEvent<HTMLInputElement>) => {
    this.selectedEnrollmentType = (ev.target as HTMLInputElement).value || '';
  };

  onClickContinue = () => {
    this.setState(() => ({ didClickContinue: true }));
    const { course, enrollmentAvailableChoices, s12n, promotionEligibilities } = this.props;

    if (certDpURLForCertificatePilotCourse(course.id)) {
      window.open(certDpURLForCertificatePilotCourse(course.id), '_blank');
      return;
    }

    const selectedRadio = this.getSelectedInputEl();
    let selectedChoiceType = this.getSelectedChoiceType();
    let choiceData = this.getSelectedChoiceData();
    // There are styles of modals that don't have radio buttons. Order is guaranteed by server.
    if (!selectedChoiceType) {
      const choiceTypes = enrollmentAvailableChoices && enrollmentAvailableChoices.choiceTypes;

      // Since there was no user selection, if bulk pay is offered, we want to buy the course and not the S12N
      if (
        _.includes(choiceTypes, BULKPAY_FULL_SPECIALIZATION) ||
        _.includes(choiceTypes, BULKPAY_REMAINING_SPECIALIZATION_COURSES)
      ) {
        selectedChoiceType = PURCHASE_SINGLE_COURSE;
      } else {
        selectedChoiceType = !_.isEmpty(choiceTypes) && choiceTypes[0];
      }
    }

    if (!choiceData && s12n) {
      choiceData = { s12nId: s12n.id };
    }

    const productSkuId = selectedRadio?.dataset.productSkuId;
    const promoCode = promotionEligibilities?.isEligible ? promotionEligibilities.promoCodeId : null;

    const options = {
      data: choiceData,
      courseId: course.id,
      productSkuId,
    };

    const handleSubmitPromise = choiceTypeToHandleSubmitPromise[selectedChoiceType];
    const { enableIntegratedOnboarding } = this.context;
    submitEnrollmentPromise({
      handleSubmitPromise,
      options,
      promoCode,
      ...(enableIntegratedOnboarding && {
        additionalParams: {
          skipOnboardingModal: 'skipAndRedirect',
          courseSlug: course?.slug,
        },
      }),
    })
      .then((data: $TSFixMe /* TODO: type submitEnrollmentPromise */) => {
        if (data.didEnroll) {
          const isChoiceEnrollCourseOrAudit =
            selectedChoiceType === ENROLL_COURSE || selectedChoiceType === AUDIT_COURSE;
          const shouldDeactivateModalForExp =
            enableIntegratedOnboarding && isChoiceEnrollCourseOrAudit && course.courseStatus !== 'preenroll';

          if (!enableIntegratedOnboarding) {
            this.showOnboardingModal();
          }

          this.setState(() => ({
            didJustEnroll: true,
            // We only want to hide the confirmation modal when a user selects the "Full Course, No Certificate" option
            ...(shouldDeactivateModalForExp && {
              activeModal: undefined,
            }),
          }));
        }
      })
      .catch((data: $TSFixMe /* TODO: type submitEnrollmentPromise */) => {
        this.setState(() => ({
          activeModal: MODAL_TYPES.ERROR,
          error: data,
        }));
      });
  };

  enrollAndDeactivateWelcomeModal = () => {};

  checkoutAndGoToCourseWithFullDiscount = () => {
    this.setState(() => ({ didClickContinue: true }));
    const { course, promotionEligibilities } = this.props;

    const EnrollFullDiscountPostAPI = API('/api/userEntitlements.v1/', { type: 'rest' });
    const productId = promotionEligibilities?.productId ?? '';
    const promoCode = promotionEligibilities?.promoCodeId ?? '';

    const enrollWithFullDiscountPromotion = () => {
      const uri = new URI()
        .addQueryParam('action', 'enrollWithFullDiscountPromotion')
        .addQueryParam('productId', productId)
        .addQueryParam('promoCode', promoCode);
      return Q(EnrollFullDiscountPostAPI.post(uri.toString()));
    };

    enrollWithFullDiscountPromotion()
      .then(() => {
        redirect.setLocation(course.phoenixHomeLink);
      })
      .catch((data: $TSFixMe /* TODO: type submitEnrollmentPromise */) => {
        this.setState(() => ({
          activeModal: MODAL_TYPES.ERROR,
          error: data,
        }));
      });
  };

  getChoiceTypes(): Array<EnrollmentChoiceTypesValues> {
    const { enrollmentAvailableChoices } = this.props;
    const choiceTypes = enrollmentAvailableChoices?.choiceTypes ?? [];

    // Don't show the Coursera Plus option for standalone course enroll modal
    // @ts-ignore TODO: type EnrollmentAvailableChoicesV1
    return choiceTypes.filter((choiceType) => choiceType !== SUBSCRIBE_TO_COURSERA_PLUS);
  }

  getSelectedInputEl(): HTMLInputElement | undefined {
    // eslint-disable-next-line react/no-find-dom-node
    const radios: NodeListOf<HTMLInputElement> = (ReactDOM.findDOMNode(this) as Element).querySelectorAll(
      'input[type="radio"]'
    );
    return _.find(radios, { checked: true });
  }

  getSelectedChoiceType() {
    const selectedInputEl = this.getSelectedInputEl();
    return selectedInputEl ? selectedInputEl.value : '';
  }

  getSelectedChoiceData() {
    const selectedInputEl = this.getSelectedInputEl();
    if (selectedInputEl) {
      return $(selectedInputEl).closest('label').find('.rc-CourseEnrollChoiceDescription').data();
    }
    return undefined;
  }

  getBulletData() {
    const { productPrice } = this.props;

    if (!productPrice) {
      return null;
    }

    const monthlyPrice = <ReactPriceDisplay value={productPrice.finalAmount} currency={productPrice.currencyCode} />;
    return {
      monthlyPrice,
    };
  }

  showOnboardingModal = () => {
    const { router } = this.context;
    const { course } = this.props;
    router.push({
      ...router.location,
      params: router.params,
      query: Object.assign({}, router.location.query, {
        showOnboardingModal: 'check',
        courseSlug: course?.slug,
      }),
    });
  };

  skipOnboardingModal = () => {
    const { router } = this.context;
    const { course } = this.props;
    router.push({
      ...router.location,
      params: router.params,
      query: Object.assign({}, router.location.query, {
        skipOnboardingModal: 'skipAndRedirect',
        courseSlug: course?.slug,
      }),
    });
  };

  renderChoice = ({ choiceType, index, selectedIndex, shouldShowRadioButton }: RenderChoiceProps) => {
    const { course, enrollmentAvailableChoices, program, thirdPartyOrganization, group } = this.props;

    let productSkuId;

    if (enrollmentAvailableChoices && enrollmentAvailableChoices.canSubscribeToCatalog) {
      productSkuId = subscriptionPriceUtils.getSubscriptionSkuId(
        enrollmentAvailableChoices.availableCatalogSubscriptions,
        MONTHLY
      );
    }

    let maybeProgram;
    let maybeThirdPartyOrganization;
    let maybeGroup;

    if (choiceType === ENROLL_THROUGH_PROGRAM) {
      maybeProgram = program;
      maybeThirdPartyOrganization = thirdPartyOrganization;
    } else if (choiceType === ENROLL_THROUGH_GROUP) {
      maybeGroup = group;
    }

    const inputId = `choice-input-${choiceType}`;

    const descriptionWrapperClasses = classNames('choice-description-wrapper', {
      'show-radio-button': shouldShowRadioButton,
    });

    return (
      <div className="bt3-radio choice-radio-container" key={choiceType} data-e2e={choiceType}>
        <label htmlFor={inputId} className="horizontal-box align-items-vertical-center">
          <div className="input-container horizontal-box align-items-vertical-center">
            <input
              id={inputId}
              name="choice-input"
              type="radio"
              value={choiceType}
              defaultChecked={selectedIndex ? index === selectedIndex : index === 0}
              onClick={this.handleRadioClick}
              data-product-sku-id={productSkuId}
            />
            {shouldShowRadioButton && (
              <span className="cif-stack">
                <i className="cif-circle-thin cif-stack-2x" />
                <i className="cif-circle cif-stack-1x" />
              </span>
            )}
          </div>
          <div className={descriptionWrapperClasses}>
            <CourseEnrollChoiceDescription
              key={choiceType}
              userId={user.get().id?.toString()}
              courseId={course.id}
              choiceType={choiceType}
              program={maybeProgram}
              thirdPartyOrganization={maybeThirdPartyOrganization}
              group={maybeGroup}
              hasLoadedCallback={this.handleChoiceTypeLoaded}
            />
          </div>
        </label>
      </div>
    );
  };

  renderModalBody() {
    const {
      enrollmentAvailableChoices,
      course,
      s12nIdBySlug,
      s12n,
      group,
      program,
      thirdPartyOrganization,
      defaultChoice,
    } = this.props;
    const { didJustEnroll, choiceTypeLoadedCount } = this.state;
    const { enableIntegratedOnboarding } = this.context;

    let reasonCode = enrollmentAvailableChoices?.enrollmentChoiceReasonCode;
    if (enrollmentAvailableChoices?.isEnrolled && enrollmentAvailableChoices?.hasChoice) {
      reasonCode = false;
    }

    if (didJustEnroll) {
      return (
        <TrackedDiv
          trackingName="enrollment_confirmation"
          // eslint-disable-next-line camelcase
          data={{ enrollment_type: this.selectedEnrollmentType }}
          withVisibilityTracking={true}
          requireFullyVisible={false}
          trackClicks={false}
        >
          <CourseEnrollmentConfirmation courseId={course.id} />
        </TrackedDiv>
      );
    } else if (reasonCode) {
      return (
        <EnrollmentReasonMessage
          courseId={course.id}
          reasonCode={reasonCode}
          s12nIdBySlug={s12nIdBySlug || (s12n && s12n.id)}
          redirectToCourseHome={enableIntegratedOnboarding ? this.redirectToCourseHome : undefined}
        />
      );
    } else {
      let choiceTypes = this.getChoiceTypes();
      const { didClickContinue } = this.state;
      const continueButtonProps = didClickContinue ? { disabled: true } : {};

      if (enrollmentAvailableChoices?.canSubscribeToCatalog) {
        Object.assign(continueButtonProps, { data: { enrollmentChoiceType: this.selectedEnrollmentType } });
      }

      let selectedIndex: number;
      if (defaultChoice && choiceTypes.includes(defaultChoice)) {
        selectedIndex = choiceTypes.indexOf(defaultChoice);
      }
      // Show only purchase course option for courses with 100% promotion. The discount is applied at checkout.
      else if (this.canPurchaseSingleCourseAndHasFullDiscount()) {
        selectedIndex = 0;
        choiceTypes = [PURCHASE_SINGLE_COURSE];
      } else if (choiceTypes.includes(SUBSCRIBE_TO_CATALOG_TRIAL)) {
        selectedIndex = choiceTypes.indexOf(SUBSCRIBE_TO_CATALOG_TRIAL);
      } else if (choiceTypes.includes(SUBSCRIBE_TO_CATALOG)) {
        selectedIndex = choiceTypes.indexOf(SUBSCRIBE_TO_CATALOG);
      } else if (choiceTypes.includes(UPGRADE_TO_CATALOG_SUBSCRIPTION)) {
        selectedIndex = choiceTypes.indexOf(UPGRADE_TO_CATALOG_SUBSCRIPTION);
      } else {
        selectedIndex = 0;
      }

      const isLoadingChoiceDescriptionData = choiceTypeLoadedCount !== choiceTypes.length;

      const isLoadingGroupOrProgramData =
        (enrollmentAvailableChoices?.canEnrollThroughGroup && !group) ||
        (enrollmentAvailableChoices?.canEnrollThroughProgram && !(program && thirdPartyOrganization));

      const isLoading = isLoadingChoiceDescriptionData || isLoadingGroupOrProgramData;

      const loadingContainerClass = classNames('c-img-loading', {
        'bt3-hide': !isLoading,
      });

      // Using CSS to hide the content because `CourseEnrollChoiceDescription` must actually mount
      // in order to load its data and tell this component that it finished loading
      // So just render the child components but make not them not visible while loading
      const contentContainerClass = classNames({
        'bt3-hide': isLoading,
        'content-with-integrated-onboarding': enableIntegratedOnboarding,
      });

      // Set data-e2e attribute based on loading state to track readiness in e2e tests
      const contentContainerDataE2E = isLoading
        ? 'enroll-modal-content-container-is-loading'
        : 'enroll-modal-content-container';
      const cozyButtonClass = !enableIntegratedOnboarding ? 'cozy' : '';

      return (
        <div className="cem-body">
          <div className={loadingContainerClass} data-e2e={contentContainerDataE2E} />
          <div className={contentContainerClass}>
            {this.renderEnrollmentChoices(choiceTypes, selectedIndex)}
            {!enableIntegratedOnboarding && <hr />}
            {!this.canPurchaseSingleCourseAndHasFullDiscount() && (
              <div className="align-horizontal-center">
                {enableIntegratedOnboarding ? (
                  <Button
                    component={TrackedButton}
                    className="continue-button"
                    // className={`primary continue-button ${cozyButtonClass}`}
                    onClick={this.onClickContinue}
                    {...continueButtonProps}
                    trackingName="course_enroll_modal_continue_button"
                    dataE2e="course_enroll_modal_continue_button"
                    withVisibilityTracking={false}
                    requireFullyVisible={false}
                    icon={
                      didClickContinue ? <Icon name="spinner" spin={true} /> : <ArrowNextIcon className="arrow-icon" />
                    }
                  >
                    {didClickContinue ? '' : _t('Continue')}
                  </Button>
                ) : (
                  <TrackedButton
                    className={`primary continue-button ${cozyButtonClass}`}
                    onClick={this.onClickContinue}
                    {...continueButtonProps}
                    trackingName="course_enroll_modal_continue_button"
                    dataE2e="course_enroll_modal_continue_button"
                  >
                    {didClickContinue ? <Icon name="spinner" spin={true} /> : _t('Continue')}
                  </TrackedButton>
                )}
              </div>
            )}
            {this.canPurchaseSingleCourseAndHasFullDiscount() && (
              <div className="align-horizontal-center">
                {enableIntegratedOnboarding ? (
                  <Button
                    component={TrackedButton}
                    // className="primary cozy continue-button"
                    className="continue-button"
                    onClick={this.checkoutAndGoToCourseWithFullDiscount}
                    {...continueButtonProps}
                    trackingName="course_checkout_with_full_discount_and_go_to_course_button"
                    dataE2e="course_checkout_with_full_discount_and_go_to_course_button"
                    withVisibilityTracking={false}
                    requireFullyVisible={false}
                    icon={
                      didClickContinue ? <Icon name="spinner" spin={true} /> : <ArrowNextIcon className="arrow-icon" />
                    }
                  >
                    {didClickContinue ? '' : _t('Go to course')}
                  </Button>
                ) : (
                  <TrackedButton
                    className="primary cozy continue-button"
                    onClick={this.checkoutAndGoToCourseWithFullDiscount}
                    {...continueButtonProps}
                    trackingName="course_checkout_with_full_discount_and_go_to_course_button"
                    dataE2e="course_checkout_with_full_discount_and_go_to_course_button"
                  >
                    {didClickContinue ? <Icon name="spinner" spin={true} /> : _t('Go to course')}
                  </TrackedButton>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  canPurchaseSingleCourseAndHasFullDiscount(): boolean {
    const { enrollmentAvailableChoices, promotionEligibilities, promotionDetails } = this.props;
    return !!(
      enrollmentAvailableChoices.canPurchaseSingleCourse &&
      promotionEligibilities?.isEligible &&
      promotionDetails?.discountPercent === 100
    );
  }

  renderEnrollmentChoices(choiceTypes: Array<EnrollmentChoiceTypesValues>, selectedIndex: number) {
    const shouldShowRadioButton = choiceTypes.length > 1;
    return (
      <div className="choices">
        {choiceTypes.map((choiceType, index) =>
          this.renderChoice({ choiceType, index, selectedIndex, shouldShowRadioButton })
        )}
      </div>
    );
  }

  renderModalContent() {
    const { s12n, course } = this.props;
    const { enableIntegratedOnboarding } = this.context;

    if (enableIntegratedOnboarding) {
      return (
        <div className="enrollmentChoiceContainer xdp-experiment">
          <div className="cem-title color-primary-text align-horizontal-center">
            <div className="headline-4-text">{course.name}</div>
            {s12n && (
              <div data-unit="part-of-s12n-subheader" className="cem-subtitle body-1-text color-secondary-text">
                <FormattedMessage
                  message={_t('Part of a {length}-course series, {name}')}
                  length={s12n.courseIds.length}
                  name={s12n.name}
                />
              </div>
            )}
          </div>
          {this.renderModalBody()}
        </div>
      );
    }

    return (
      <div className="enrollmentChoiceContainer">
        <div className="theme-dark">
          <div className="cem-title color-primary-text align-horizontal-center">
            <div className="headline-4-text">{course.name}</div>
            {s12n && (
              <div data-unit="part-of-s12n-subheader" className="cem-subtitle body-1-text color-secondary-text">
                <FormattedMessage
                  message={_t('Part of a {length}-course series, {name}')}
                  length={s12n.courseIds.length}
                  name={s12n.name}
                />
              </div>
            )}
          </div>
        </div>
        {this.renderModalBody()}
      </div>
    );
  }

  render() {
    const { enrollmentAvailableChoices, course, onClose } = this.props;
    const { activeModal, error } = this.state;
    const { enableIntegratedOnboarding } = this.context;
    if (!enrollmentAvailableChoices) {
      logger.error('Cannot render CourseEnrollModal without any enrollment available choices');
      return false;
    }
    const courseEnrollModalNames = classNames('rc-CourseEnrollModal', {
      'catalog-sub-standalone':
        enrollmentAvailableChoices && enrollmentAvailableChoices.isCatalogSubscriptionStandaloneCourse,
      'with-integrated-onboarding': enableIntegratedOnboarding,
    });

    switch (activeModal) {
      case MODAL_TYPES.ERROR:
        return <EnrollErrorModal error={error} onClose={onClose} />;

      case MODAL_TYPES.ENROLL:
        return (
          <Modal
            className={courseEnrollModalNames}
            modalName="CourseEnrollModal"
            handleClose={this.handleModalClose}
            trackingName="course_enroll_modal"
            data={{ id: course.id }}
          >
            {this.renderModalContent()}
          </Modal>
        );

      default:
        return null;
    }
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  connectToStores<PropsFromStores, PropsFromCaller>(['ApplicationStore'], ({ ApplicationStore }) => ({
    requestCountryCode: ApplicationStore.getState().requestCountryCode,
  })),
  Naptime.createContainer<PropsFromNaptime, PropsFromStores>(({ course, requestCountryCode }) => ({
    productPrice: ProductPricesV3.getCourseProductPrice(course.id, requestCountryCode, {}),
  })),
  withPromotionInfo()
)(CourseEnrollModalWithData);
export { CourseEnrollModalWithData as BaseComponent };
