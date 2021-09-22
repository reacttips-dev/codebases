import React, { useState } from 'react';
import { compose } from 'recompose';
import Naptime from 'bundles/naptimejs';

import TrackedButton from 'bundles/page/components/TrackedButton';
import Icon from 'bundles/iconfont/Icon';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { stringKeyToTuple, tupleToStringKey } from 'js/lib/stringKeyTuple';
import redirect from 'js/lib/coursera.redirect';
import requestCountry from 'js/lib/requestCountry';

import LoadingIcon from 'bundles/courseraLoadingIcon/LoadingIcon';
import PaymentChoiceBulkPay from 'bundles/s12n-enroll/components/bulk-pay/PaymentChoiceBulkPay';
import PaymentChoiceSubscription from 'bundles/s12n-enroll/components/bulk-pay/PaymentChoiceSubscription';

import ProductType, { SPECIALIZATION } from 'bundles/payments/common/ProductType';
import type { PropsFromWithPromotionInfo } from 'bundles/promotions/components/withPromotionInfo';
import withPromotionInfo from 'bundles/promotions/components/withPromotionInfo';
import type CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import type PromotionEligibilitiesV1 from 'bundles/naptimejs/resources/promotionEligibilities.v1';
import S12nDerivativesV1 from 'bundles/naptimejs/resources/s12nDerivatives.v1';
import ValidPaymentProcessorsV1 from 'bundles/naptimejs/resources/validPaymentProcessors.v1';

import { getS12nMonthlySkuId } from 'bundles/s12n-common/utils/subscriptionPriceUtils';
import {
  choiceTypeToHandleSubmitPromise,
  submitEnrollmentPromise,
  /* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
} from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import { getCourseHomeLinkBySlug } from 'bundles/program-common/utils/courseAndS12nUtils';

import getS12nProductLabels from 'bundles/s12n-common/constants/s12nProductLabels';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';

import _t from 'i18n!nls/s12n-enroll';

import 'css!bundles/s12n-enroll/components/__styles__/PaymentChoices';

type PropsFromCaller = {
  title?: string;
  s12nId: string;
  course?: CoursesV1;
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1;
  onEnrollFailure?: (error: Record<string, string>) => void;
  onSdp?: boolean;
  isFromS12nSelection?: boolean;
  auditComponent?: JSX.Element;
};

type PropsFromNaptime = {
  s12nDerivatives?: S12nDerivativesV1;
  s12n: OnDemandSpecializationsV1;
  s12nBulkPayPrice: ProductPricesV3;
  validPaymentProcessors?: ValidPaymentProcessorsV1;
};

type PropsToComponent = PropsFromCaller & PropsFromWithPromotionInfo & PropsFromNaptime;

const PaymentChoiceTypes = {
  FULL: 'full',
  SUBSCRIPTION: 'subscription',
};

const paymentChoiceToEnrollmentChoice = {
  [PaymentChoiceTypes.FULL]: EnrollmentChoiceTypes.BULKPAY_FULL_SPECIALIZATION,
  [PaymentChoiceTypes.SUBSCRIPTION]: EnrollmentChoiceTypes.ENROLL_THROUGH_S12N_SUBSCRIPTION_TRIAL,
};

const handleOnEnrollClick = (
  ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  currentSelectedType: string,
  setShowChoosePaymentError: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEnrolling: React.Dispatch<React.SetStateAction<boolean>>,
  s12nId: string,
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1,
  course: CoursesV1,
  promotionEligibilities?: PromotionEligibilitiesV1 | null,
  onEnrollFailure?: (error: Record<string, string>) => void
) => {
  ev.stopPropagation();

  if (!currentSelectedType) {
    setShowChoosePaymentError(true);
  }

  setIsEnrolling(true);
  setShowChoosePaymentError(false);

  const promoCode = promotionEligibilities?.isEligible ? promotionEligibilities.promoCodeId : null;
  const data: Record<string, string> = {};
  if (s12nId) {
    data.s12nId = s12nId;
  }

  const productSkuId = getS12nMonthlySkuId(enrollmentAvailableChoices, s12nId);

  const options = {
    productSkuId,
    courseId: course.id,
    s12nId,
    data,
  };

  const enrollmentChoice = paymentChoiceToEnrollmentChoice[currentSelectedType];

  const handleSubmitPromise = choiceTypeToHandleSubmitPromise[enrollmentChoice];
  submitEnrollmentPromise({ handleSubmitPromise, options, promoCode })
    .then((promiseData: $TSFixMe /* TODO: type submitEnrollmentPromise */) => {
      if (promiseData.didEnroll && course) {
        redirect.setLocation(getCourseHomeLinkBySlug(course.slug));
      }
    })
    .catch(onEnrollFailure);
};

const renderSubTitle = (s12n: OnDemandSpecializationsV1, program: string, onSdp?: boolean) => (
  <div className="sub-title bt3-text-center">
    {onSdp ? (
      <FormattedMessage
        className="center"
        message={_t(`This is a {courseCount}-course {program} with a shareable Certificate after you've completed.`)}
        courseCount={s12n.courseIds?.length}
        program={program}
      />
    ) : (
      <FormattedMessage
        className="center"
        message={_t(
          `This is part of the {courseCount}-course {program}, {programTitle}. A shareable Certificate is available after you've completed.`
        )}
        courseCount={s12n.courseIds?.length}
        programTitle={s12n.name}
        program={program}
      />
    )}
  </div>
);

const renderChoices = (
  s12nId: string,
  s12n: OnDemandSpecializationsV1,
  s12nBulkPayPrice: ProductPricesV3,
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1,
  currentSelectedType: string,
  setCurrentSelectedType: React.Dispatch<React.SetStateAction<string>>,
  program: string,
  s12nDerivatives: S12nDerivativesV1,
  validPaymentProcessors: ValidPaymentProcessorsV1,
  isFromS12nSelection?: boolean,
  promotionEligibilities?: PromotionEligibilitiesV1 | null
) => {
  const showBulkPay = enrollmentAvailableChoices.canBulkPaySpecialization;
  const showSubscription = enrollmentAvailableChoices.canSubscribeToS12n;
  let isBulkPayPromoEligible = false;
  let isSubscriptionPromoEligible = false;

  if (promotionEligibilities && promotionEligibilities.isEligible) {
    const [productType] = stringKeyToTuple(promotionEligibilities.productId);
    if (productType === ProductType.SPECIALIZATION_SUBSCRIPTION) {
      isSubscriptionPromoEligible = true;
    } else if (productType === ProductType.SPECIALIZATION) {
      isBulkPayPromoEligible = true;
    }
  }

  return (
    <div>
      {showBulkPay && (
        <PaymentChoiceBulkPay
          s12nId={s12nId}
          price={s12nBulkPayPrice}
          unownedCourseCount={s12n.courseIds?.length}
          currentType={currentSelectedType}
          program={program}
          onClick={(type) => setCurrentSelectedType(type)}
          isPromoEligible={isBulkPayPromoEligible}
          showEMIOption={validPaymentProcessors.isRazorpayEnabled}
        />
      )}
      {showSubscription && (
        <PaymentChoiceSubscription
          s12nId={s12nId}
          isFromS12nSelection={isFromS12nSelection}
          enrollmentAvailableChoices={enrollmentAvailableChoices}
          s12nDerivatives={s12nDerivatives}
          unownedCourseCount={s12n.courseIds?.length}
          currentType={currentSelectedType}
          program={program}
          onClick={(type) => setCurrentSelectedType(type)}
          isPromoEligible={isSubscriptionPromoEligible}
        />
      )}
    </div>
  );
};

export const PaymentChoices: React.FunctionComponent<PropsToComponent> = ({
  title,
  s12n,
  s12nBulkPayPrice,
  s12nId,
  isFromS12nSelection,
  onSdp,
  enrollmentAvailableChoices,
  course,
  onEnrollFailure,
  promotionEligibilities,
  s12nDerivatives,
  validPaymentProcessors,
  auditComponent,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showChoosePaymentError, setShowChoosePaymentError] = useState(false);
  const [currentSelectedType, setCurrentSelectedType] = useState(PaymentChoiceTypes.FULL);

  const enrollButtonProps = {
    disabled: false,
  };

  if (isEnrolling) {
    enrollButtonProps.disabled = true;
  }

  const { productVariant } = s12n;
  const { isProfessionalCertificate } = new OnDemandSpecializationsV1({ productVariant });
  const { SPECIALIZATION_LABEL, PROFESSIONAL_CERTIFICATE_LABEL } = getS12nProductLabels();

  const program = isProfessionalCertificate ? PROFESSIONAL_CERTIFICATE_LABEL : SPECIALIZATION_LABEL;

  let content;

  if (course && s12nBulkPayPrice?.amount && s12nDerivatives?.catalogPrice && validPaymentProcessors) {
    content = (
      <React.Fragment>
        {renderChoices(
          s12nId,
          s12n,
          s12nBulkPayPrice,
          enrollmentAvailableChoices,
          currentSelectedType,
          setCurrentSelectedType,
          program,
          s12nDerivatives,
          validPaymentProcessors,
          isFromS12nSelection,
          promotionEligibilities
        )}
        <div className="horizontal-box align-items-absolute-center enroll-button">
          <TrackedButton
            trackingName="enroll_button"
            data={{ selectType: currentSelectedType }}
            className="primary cozy"
            onClick={(ev) =>
              handleOnEnrollClick(
                ev,
                currentSelectedType,
                setShowChoosePaymentError,
                setIsEnrolling,
                s12nId,
                enrollmentAvailableChoices,
                course,
                promotionEligibilities,
                onEnrollFailure
              )
            }
            {...enrollButtonProps}
          >
            {isEnrolling ? <Icon name="spinner" spin /> : _t('Enroll')}
          </TrackedButton>
        </div>
        {auditComponent}
        {showChoosePaymentError && (
          <div className="error-message align-horizontal-center body-1-text color-warn-dark">
            {_t('Please choose a payment option')}
          </div>
        )}
      </React.Fragment>
    );
  } else {
    content = <LoadingIcon />;
  }

  return (
    <div className="rc-PaymentChoices styleguide">
      <div className="title container">
        <h3 className="bt3-modal-title center">{title || _t('Pick a Payment Option')}</h3>
        {renderSubTitle(s12n, program, onSdp)}
      </div>
      <div className="content container">{content}</div>
    </div>
  );
};

export default compose<PropsToComponent, PropsFromCaller>(
  withPromotionInfo<PropsFromCaller>(),
  Naptime.createContainer<PropsFromNaptime, PropsFromCaller>(({ s12nId }) => {
    const countryCode = requestCountry.get();
    return {
      s12n: OnDemandSpecializationsV1.get(s12nId, {
        fields: ['courseIds', 'productVariant'],
      }),
      s12nDerivatives: S12nDerivativesV1.get(s12nId, {
        fields: ['catalogPrice'],
        required: false,
      }),
      s12nBulkPayPrice: ProductPricesV3.getOnDemandSpecializationProductPrice(s12nId, countryCode, {}),
      validPaymentProcessors: ValidPaymentProcessorsV1.get(tupleToStringKey([countryCode, SPECIALIZATION]), {
        fields: ['processors'],
        required: false,
      }),
    };
  })
)(PaymentChoices);
