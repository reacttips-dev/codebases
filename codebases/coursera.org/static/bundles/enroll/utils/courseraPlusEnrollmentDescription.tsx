import React from 'react';

import CourseraPlusEnrollmentChoices from 'bundles/enroll/utils/CourseraPlusEnrollmentChoices';
import { getCopy } from 'bundles/enroll/utils/courseraPlusUtils';
import { PropsFromCaller as VPropBulletPoint } from 'bundles/enroll/components/subscriptions/free-trialV2/SubscriptionVPropBulletPoint';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';
import getS12nProductLabels from 'bundles/s12n-common/constants/s12nProductLabels';

import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/enroll';

const getPlusMonthlyPrice = (courseraPlusPrice: ProductPricesV3): JSX.Element => {
  const { amount, currencyCode } = courseraPlusPrice;
  return <ReactPriceDisplay value={amount} currency={currencyCode} hideCurrencyCode={true} />;
};

const getProductTypeLabel = (s12n: OnDemandSpecializationsV1): string => {
  const { PROFESSIONAL_CERTIFICATE_LABEL, SPECIALIZATION_LABEL } = getS12nProductLabels();
  return s12n.isProfessionalCertificate ? PROFESSIONAL_CERTIFICATE_LABEL : SPECIALIZATION_LABEL;
};

export const getModalHeader = ({
  courseraPlusEnrollmentChoices,
  courseraPlusPrice,
  s12n,
  course,
}: {
  courseraPlusEnrollmentChoices: CourseraPlusEnrollmentChoices;
  courseraPlusPrice: ProductPricesV3;
  s12n: OnDemandSpecializationsV1;
  course?: CoursesV1;
}): { title: string | JSX.Element; subheader: string | JSX.Element } => {
  const hasExhaustedFreeTrial =
    courseraPlusEnrollmentChoices?.courseraPlusSubscriptionPlan?.hasExhaustedFreeTrial ?? false;

  let title;

  if (hasExhaustedFreeTrial) {
    const monthlyPrice = getPlusMonthlyPrice(courseraPlusPrice);
    title = (
      <FormattedMessage
        message={_t('Enroll with Coursera Plus for {monthlyPrice}/month')}
        monthlyPrice={monthlyPrice}
      />
    );
  } else {
    title = _t('Enjoy a 7-day free trial to Coursera Plus');
  }

  const subscriptionType = hasExhaustedFreeTrial ? _t('subscription') : _t('trial');
  const productType = getProductTypeLabel(s12n);
  let subheader;

  if (course) {
    subheader = (
      <FormattedMessage
        message={_t('Your {subscriptionType} includes {courseName}, which is part of the {productName} {productType}.')}
        subscriptionType={subscriptionType}
        courseName={course.name}
        productName={s12n.name}
        productType={productType}
      />
    );
  } else {
    subheader = (
      <FormattedMessage
        message={_t('Your {subscriptionType} includes the {productName} {productType}.')}
        subscriptionType={subscriptionType}
        productName={s12n.name}
        productType={productType}
      />
    );
  }

  return { title, subheader };
};

export const getButtonLabel = (courseraPlusEnrollmentChoices: CourseraPlusEnrollmentChoices): string => {
  return courseraPlusEnrollmentChoices?.courseraPlusSubscriptionPlan?.hasExhaustedFreeTrial
    ? _t('Enroll')
    : _t('Start free trial');
};

export const getS12nBulletPoints = ({
  s12n,
  courseraPlusPrice,
}: {
  s12n: OnDemandSpecializationsV1;
  courseraPlusPrice: ProductPricesV3;
}): Array<VPropBulletPoint> => {
  const productType = getProductTypeLabel(s12n);
  const monthlyPrice = getPlusMonthlyPrice(courseraPlusPrice);

  return [
    {
      header: _t('Access all courses within the {productType}'),
      subheader: _t('Watch lectures, try assignments, participate in discussion forums, and more'),
      messageProps: { productType },
    },
    {
      header: _t('Learn at your own pace for {monthlyPrice}'),
      subheader: _t('The faster you learn, the more you save–cancel anytime'),
      messageProps: { monthlyPrice },
    },
    {
      header: _t('Earn a certificate upon completion'),
      subheader: _t('Showcase your knowledge on your resume, LinkedIn, or CV'),
    },
  ];
};

export const getCourseraPlusBulletPoints = (): Array<VPropBulletPoint> => {
  const { numberOfProducts } = getCopy();
  return [
    {
      header: _t(
        'Unlimited access to {numberOfProducts} courses, Guided Projects, Specializations, and Professional Certificates'
      ),
      subheader: _t('Learn job-relevant skills from 170+ leading universities and companies'),
      messageProps: { numberOfProducts },
    },
  ];
};
