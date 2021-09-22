/* @jsx jsx */
import React, { useState } from 'react';
import { compose } from 'recompose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@emotion/react';
import { breakPoint } from '@coursera/coursera-ui';
import logger from 'js/app/loggerSingleton';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import LoadingIcon from 'bundles/courseraLoadingIcon/LoadingIcon';
import Icon from 'bundles/iconfont/Icon';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import TrackedButton from 'bundles/page/components/TrackedButton';
import { withS12nPrepaidPrices } from 'bundles/s12n-enroll/components/non-recurring/withS12nPrice';
import type { PropsFromWithS12nPrepaidPrices } from 'bundles/s12n-enroll/components/non-recurring/withS12nPrice';

import NonRecurringChoice from 'bundles/s12n-enroll/components/non-recurring/NonRecurringChoice';

import _t from 'i18n!nls/s12n-enroll';

const NON_RECURRING_CHOICES = {
  PASS_ONE: 'PASS_ONE',
  PASS_TWO: 'PASS_TWO',
  PASS_THREE: 'PASS_THREE',
};
const NUM_OF_PREPAID_OPTIONS = 3;

export type PrepaidOptionProp = {
  productItemId: string;
  productType: string;
  productProperties: {
    ownershipDays: number;
    refundDays: number;
  };
};

type PropsFromCaller = {
  numOfCourses: number;
  numOfHoursPerWeek: number;
  numOfMonths: number;
  prepaidEnrollmentData: {
    enrollmentChoiceData: {
      definition: {
        availablePrepaid: Array<PrepaidOptionProp>;
      };
    };
  };
  enrollmentAvailableChoices: EnrollmentAvailableChoicesV1;
  onButtonClick: (paymentPassOption: PrepaidOptionProp) => void;
  isEnrolling: boolean;
  auditComponent?: JSX.Element;
};

type PropsToComponent = PropsFromCaller & PropsFromWithS12nPrepaidPrices;

const styles: Record<string, CSSProperties> = {
  titleContainer: {
    padding: '0 50px',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      padding: '0 30px',
    },
  },
  title: {
    fontFamily: 'OpenSans',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '24px',
    marginBottom: '18px',
  },
  choicesContainer: {
    padding: '0 50px 50px',
    ':nth-of-type(n) > div': {
      borderBottom: '1px solid #BDBDBD',
    },
    ':nth-of-type(n) > div:last-of-type': {
      borderBottom: 'none',
    },
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      padding: '0 30px 50px',
    },
  },
  nonRecurringFooter: {
    position: 'sticky',
    width: '100%',
    bottom: 0,
    left: 0,
    background: 'white',
    padding: '16px 50px',
    boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.13)',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      padding: '16px 30px',
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  continueButton: {
    background: '#2a73cc',
    color: 'white',
    border: 'none',
    borderRadius: '2px',
    padding: '16px 40px',
    fontWeight: 700,
    fontSize: '14px',
    width: '100%',
    maxWidth: '300px',
    '&:disabled': {
      background: '#e5e5e5',
      borderColor: '#e5e5e5',
      color: 'rgba(0,0,0,.26)',
    },
  },
};

const getSortedPaymentPassOptions = (prepaidOptions: Array<PrepaidOptionProp>) =>
  prepaidOptions.sort((firstOption, secondOption) => {
    return firstOption.productProperties.ownershipDays - secondOption.productProperties.ownershipDays;
  });

export const getMonthsFromOwnershipDays = (ownershipDays: number) => Math.round(ownershipDays / 30);

export const getHoursPerWeek = (numOfMonths: number, numOfHoursPerWeek: number, ownershipMonths: number) =>
  Math.round((numOfMonths * numOfHoursPerWeek) / ownershipMonths);

export const getCurrentPaymentPassOption = (choiceType: string, sortedPaymentPassOptions: Array<PrepaidOptionProp>) => {
  switch (choiceType) {
    case NON_RECURRING_CHOICES.PASS_ONE:
      return sortedPaymentPassOptions[0];
    case NON_RECURRING_CHOICES.PASS_TWO:
      return sortedPaymentPassOptions[1];
    case NON_RECURRING_CHOICES.PASS_THREE:
      return sortedPaymentPassOptions[2];
    // Select the middle option by default
    default:
      return sortedPaymentPassOptions[1];
  }
};

const getProductPriceForPaymentPassOption = (
  productPrices: Array<ProductPricesV3>,
  prepaidOption: PrepaidOptionProp
): ProductPricesV3 | undefined =>
  productPrices.find(({ productItemId }) => productItemId === prepaidOption.productItemId);

export const getPercentageOffBasePrice = (
  productPrice: ProductPricesV3,
  ownershipMonths: number,
  baseProductPrice: ProductPricesV3,
  baseOwnershipMonths: number
) => {
  if (productPrice.amount === baseProductPrice.amount && ownershipMonths === baseOwnershipMonths) {
    return 0;
  }

  const basePriceForSameOwnershipMonths = (ownershipMonths / baseOwnershipMonths) * baseProductPrice.amount;
  const percentageOff = 1 - productPrice.amount / basePriceForSameOwnershipMonths;
  return Math.round(percentageOff * 100);
};

const getDurationMessage = (numOfHours: number) => {
  return numOfHours > 20 ? (
    _t('at least 20 hours/week')
  ) : (
    <FormattedMessage
      message={_t('{numOfHours, plural, =1 {1 hour/week} other {# hours/week}}')}
      numOfHours={numOfHours}
    />
  );
};

const getPaymentPassOptionData = (
  sortedPaymentPassOptions: Array<PrepaidOptionProp>,
  productPrices: Array<ProductPricesV3>,
  numOfMonths: number,
  numOfHoursPerWeek: number
): Array<{
  productPrice: ProductPricesV3;
  percentageOff: number;
  title: JSX.Element;
  duration: JSX.Element | string;
}> => {
  const basePaymentPassOption = sortedPaymentPassOptions[0];
  const baseOwnershipMonths = getMonthsFromOwnershipDays(basePaymentPassOption.productProperties.ownershipDays);
  const baseProductPrice = getProductPriceForPaymentPassOption(productPrices, basePaymentPassOption);

  return sortedPaymentPassOptions.map((paymentPassOption) => {
    const ownershipMonths = getMonthsFromOwnershipDays(paymentPassOption.productProperties.ownershipDays);
    const productPrice = getProductPriceForPaymentPassOption(productPrices, paymentPassOption);
    const numOfHours = getHoursPerWeek(numOfMonths, numOfHoursPerWeek, ownershipMonths);

    return {
      productPrice,
      percentageOff: getPercentageOffBasePrice(productPrice, ownershipMonths, baseProductPrice, baseOwnershipMonths),
      title: (
        <FormattedMessage
          message={_t('{numOfMonths} {numOfMonths, plural, =1 {month} other {months}}')}
          numOfMonths={ownershipMonths}
        />
      ),
      duration: getDurationMessage(numOfHours),
    };
  });
};

const NonRecurringChoices: React.FunctionComponent<PropsToComponent> = ({
  numOfCourses,
  numOfHoursPerWeek,
  numOfMonths,
  prepaidEnrollmentData,
  onButtonClick,
  isEnrolling,
  auditComponent,
  productPrices,
}) => {
  const [choiceType, setChoiceType] = useState(NON_RECURRING_CHOICES.PASS_TWO);

  const prepaidOptions = prepaidEnrollmentData.enrollmentChoiceData.definition.availablePrepaid;

  // Product prices is fetched async, so show loading state to user
  if (!productPrices?.length) {
    return <LoadingIcon />;
  } else if (prepaidOptions.length !== NUM_OF_PREPAID_OPTIONS || productPrices.length !== NUM_OF_PREPAID_OPTIONS) {
    logger.error('Unable to render all three payment pass options');
    return null;
  }

  const sortedPaymentPassOptions = getSortedPaymentPassOptions(prepaidOptions);
  const currentPaymentPassOption = getCurrentPaymentPassOption(choiceType, sortedPaymentPassOptions);

  const paymentPassOptionData = getPaymentPassOptionData(
    sortedPaymentPassOptions,
    productPrices,
    numOfMonths,
    numOfHoursPerWeek
  );

  if (!paymentPassOptionData) {
    logger.error('Did not retrieve the product price for all three payment pass options');
    return null;
  }

  return (
    <div data-test="rc-NonRecurringChoices">
      <div css={styles.titleContainer}>
        <h3 css={styles.title}>{_t('Choose your pass')}</h3>
        <p>
          {_t(
            `We've estimated how many hours you'll need to learn each week to finish all #{numOfCourses} courses. Passes don't renew automatically.`,
            { numOfCourses }
          )}
        </p>
      </div>
      <div css={styles.choicesContainer}>
        <NonRecurringChoice
          choice={NON_RECURRING_CHOICES.PASS_ONE}
          currentChoice={choiceType}
          {...paymentPassOptionData[0]}
          onClick={() => setChoiceType(NON_RECURRING_CHOICES.PASS_ONE)}
        />
        <NonRecurringChoice
          choice={NON_RECURRING_CHOICES.PASS_TWO}
          currentChoice={choiceType}
          {...paymentPassOptionData[1]}
          onClick={() => setChoiceType(NON_RECURRING_CHOICES.PASS_TWO)}
        />
        <NonRecurringChoice
          choice={NON_RECURRING_CHOICES.PASS_THREE}
          currentChoice={choiceType}
          {...paymentPassOptionData[2]}
          onClick={() => setChoiceType(NON_RECURRING_CHOICES.PASS_THREE)}
        />
      </div>
      <div css={styles.nonRecurringFooter}>
        <div css={styles.buttonContainer}>
          <TrackedButton
            data-test="continueButton"
            trackingName="continue_button"
            className="cozy"
            css={styles.continueButton}
            onClick={() => onButtonClick(currentPaymentPassOption)}
            disabled={isEnrolling}
          >
            {isEnrolling ? <Icon name="spinner" spin /> : _t('Continue')}
          </TrackedButton>
        </div>
        {auditComponent}
      </div>
    </div>
  );
};

export default compose<PropsToComponent, PropsFromCaller>(withS12nPrepaidPrices<PropsFromCaller>())(
  NonRecurringChoices
);
