import React from 'react';

// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import PaymentChoice from 'bundles/s12n-enroll/components/PaymentChoice';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';

import { FormattedMessage } from 'js/lib/coursera.react-intl';

import PromotionApplicableCheckoutMessage from 'bundles/enroll/components/common/PromotionApplicableCheckoutMessage';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';

import _t from 'i18n!nls/s12n-enroll';

import 'css!bundles/s12n-enroll/components/bulk-pay/__styles__/PaymentChoiceBulkPay';

type Props = {
  s12nId: string;
  currentType: string;
  onClick: (type: string) => void;
  price: ProductPricesV3;
  unownedCourseCount: number;
  program: string;
  isPromoEligible: boolean;
  showEMIOption: boolean;
};

const getBulkPayBodyMessage = (unownedCourseCount: number, program: string) => (
  <FormattedMessage
    message={_t(
      'Pre-pay for all course materials from this {unownedCourseCount}-course {program}. 14-day refund period included.'
    )}
    unownedCourseCount={unownedCourseCount}
    program={program}
  />
);

const getBulkPayTitleMessage = (price: ProductPricesV3, showEMIOption: boolean) => (
  <span>
    <span>
      {_t('One-time payment')}
      &nbsp;•&nbsp;
    </span>
    <span className="price">
      <ReactPriceDisplay value={price.amount} currency={price.currencyCode} />
    </span>
    {showEMIOption && <span className="emi-option">{_t('EMI Available')}</span>}
  </span>
);

const PaymentChoiceBulkPay: React.FunctionComponent<Props> = ({
  s12nId,
  unownedCourseCount,
  price,
  currentType,
  program,
  onClick,
  isPromoEligible,
  showEMIOption,
}) => (
  <PaymentChoice
    title={getBulkPayTitleMessage(price, showEMIOption)}
    type="full"
    currentType={currentType}
    onClick={onClick}
  >
    {isPromoEligible && <PromotionApplicableCheckoutMessage s12nId={s12nId} />}
    <span>{getBulkPayBodyMessage(unownedCourseCount, program)}</span>
  </PaymentChoice>
);

export default PaymentChoiceBulkPay;
