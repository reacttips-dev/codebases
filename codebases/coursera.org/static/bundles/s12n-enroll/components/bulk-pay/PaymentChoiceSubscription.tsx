import React from 'react';

import S12nDerivativesV1 from 'bundles/naptimejs/resources/s12nDerivatives.v1';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';

import PromotionApplicableCheckoutMessage from 'bundles/enroll/components/common/PromotionApplicableCheckoutMessage';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import PaymentChoice from 'bundles/s12n-enroll/components/PaymentChoice';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';

import { FormattedMessage } from 'js/lib/coursera.react-intl';

import cartUtils from 'bundles/payments/lib/cartUtils';

import _t from 'i18n!nls/s12n-enroll';

type Props = {
  s12nId: string;
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1;
  isFromS12nSelection?: boolean;
  unownedCourseCount: number;
  currentType: string;
  onClick: (type: string) => void;
  s12nDerivatives: S12nDerivativesV1;
  program: string;
  isPromoEligible: boolean;
};

// used for mix and match when the user has selected to enroll in a specific s12n among several s12ns
const getSelectedS12nEnrollmentData = (
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1,
  s12nId: string,
  isFromS12nSelection?: boolean
) =>
  isFromS12nSelection &&
  enrollmentAvailableChoices &&
  enrollmentAvailableChoices.getS12nSubscriptionEnrollmentData(s12nId);

const getCanEnrollWithFreeTrial = (
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1,
  s12nId: string,
  isFromS12nSelection?: boolean
) => {
  const selectedS12nEnrollmentData = getSelectedS12nEnrollmentData(
    enrollmentAvailableChoices,
    s12nId,
    isFromS12nSelection
  );

  if (selectedS12nEnrollmentData) {
    return enrollmentAvailableChoices.getCanEnrollThroughS12nSubscriptionFreeTrial(selectedS12nEnrollmentData);
  } else {
    return enrollmentAvailableChoices.canEnrollThroughS12nSubscriptionFreeTrial;
  }
};
const getBulkPayBodyMessage = (unownedCourseCount: number, withFreeTrial: boolean, program: string) => (
  <React.Fragment>
    <FormattedMessage
      message={_t(
        'Get billed monthly for access to all course materials from this {unownedCourseCount}-course {program}.'
      )}
      unownedCourseCount={unownedCourseCount}
      program={program}
    />
    {withFreeTrial && <span data-test="free-trial-message">&nbsp;{_t('7-day free trial included.')}</span>}
  </React.Fragment>
);

const getBulkPayTitleMessage = (catalogPrice: { currencyCode: string; amount: number }) => (
  <span>
    <span>
      {_t('Monthly payment')}
      &nbsp;•&nbsp;
    </span>
    <span className="price">
      <ReactPriceDisplay
        currency={catalogPrice?.currencyCode}
        value={catalogPrice?.amount}
        {...cartUtils.amountToDigitsProps(catalogPrice?.amount)}
      />
    </span>
  </span>
);

const PaymentChoiceSubscription: React.FunctionComponent<Props> = ({
  s12nId,
  s12nDerivatives,
  enrollmentAvailableChoices,
  isFromS12nSelection,
  onClick,
  currentType,
  program,
  unownedCourseCount,
  isPromoEligible,
}) => {
  const withFreeTrial = getCanEnrollWithFreeTrial(enrollmentAvailableChoices, s12nId, isFromS12nSelection);

  return (
    <PaymentChoice
      title={getBulkPayTitleMessage(s12nDerivatives.catalogPrice!)} // eslint-disable-line @typescript-eslint/no-non-null-assertion
      type="subscription"
      currentType={currentType}
      onClick={onClick}
    >
      {isPromoEligible && <PromotionApplicableCheckoutMessage s12nId={s12nId} />}
      <span>{getBulkPayBodyMessage(unownedCourseCount, withFreeTrial, program)}</span>
    </PaymentChoice>
  );
};

export default PaymentChoiceSubscription;
