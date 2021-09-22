/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@emotion/react';
import { breakPoint } from '@coursera/coursera-ui';

// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import type ProductPricesV3 from 'bundles/naptimejs/resources/productPrices.v3';
import ReactPriceDisplay from 'bundles/payments-common/components/ReactPriceDisplay';

import _t from 'i18n!nls/s12n-enroll';

type Props = {
  choice: string;
  currentChoice: string;
  productPrice: ProductPricesV3;
  percentageOff: number;
  onClick: () => void;
  title: JSX.Element | string;
  duration?: JSX.Element | string;
};

const styles: Record<string, CSSProperties> = {
  nonRecurringChoice: {
    display: 'block',
    padding: '30px 0 30px 20px',
    cursor: 'pointer',
  },
  choiceLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  radioInput: {
    opacity: 0,
    ':checked~span.cif-stack': {
      '.cif-circle': {
        color: '#2571ed',
      },
    },
  },
  choiceButton: {
    position: 'absolute !important',
    left: '45px',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      left: '25px',
    },
  },
  circleThin: {
    color: 'rgba(0,0,0,0.12)',
  },
  circle: {
    color: 'white',
  },
  choiceTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  choiceTitle: {
    fontSize: '16px',
    lineHeight: '30px',
    fontFamily: 'OpenSans',
    marginBottom: 0,
  },
  price: {
    fontSize: '16px',
    lineHeight: '30px',
    fontFamily: 'OpenSans',
    fontWeight: 700,
    marginBottom: 0,
  },
  descriptionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '15px',
  },
  duration: {
    color: '#888888',
    textTransform: 'uppercase',
    padding: '4px',
    marginBottom: 0,
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '18px',
  },
  discountContainer: {
    background: '#FFE057',
    borderRadius: '4px',
  },
  discount: {
    textTransform: 'uppercase',
    padding: '4px',
    marginBottom: 0,
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '18px',
  },
};

const NonRecurringChoice: React.FunctionComponent<Props> = ({
  choice,
  currentChoice,
  productPrice,
  percentageOff,
  onClick,
  title,
  duration,
}) => {
  const descriptionId = `non-recurring-choice-description-${choice}`;
  const inputId = `non-recurring-choice-${choice}`;

  return (
    <div data-test="rc-NonRecurringChoice" css={styles.nonRecurringChoice}>
      <label htmlFor={inputId} css={styles.choiceLabel}>
        <input
          type="radio"
          id={inputId}
          value={choice}
          checked={choice === currentChoice}
          onClick={onClick}
          aria-describedby={descriptionId}
          css={styles.radioInput}
        />
        <span className="cif-stack" css={styles.choiceButton}>
          <i className="cif-circle-thin cif-stack-2x" css={styles.circleThin} />
          <i className="cif-circle cif-stack-1x" css={styles.circle} />
        </span>
        <div css={styles.choiceTitleContainer}>
          <h4 css={styles.choiceTitle} id={descriptionId}>
            {title}
          </h4>
          <p css={styles.price}>
            <ReactPriceDisplay value={productPrice.amount} currency={productPrice.currencyCode} />
          </p>
        </div>
      </label>

      <div css={styles.descriptionContainer}>
        <p style={styles.duration}>{duration}</p>
        {percentageOff > 0 && (
          <div css={styles.discountContainer}>
            <p style={styles.discount}>{_t('#{percentageOff}% off', { percentageOff })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NonRecurringChoice;
