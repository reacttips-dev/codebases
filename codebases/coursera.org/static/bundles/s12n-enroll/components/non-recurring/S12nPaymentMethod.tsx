/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@emotion/react';
import { breakPoint } from '@coursera/coursera-ui';

import Icon from 'bundles/iconfont/Icon';
import TrackedButton from 'bundles/page/components/TrackedButton';
import { SvgCheckV2 } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/s12n-enroll';

type Props = {
  title: string;
  description: JSX.Element;
  valueProps: Array<string>;
  onButtonClick: () => void;
  isEnrolling: boolean;
  hideLoader?: boolean;
  additionalMessage?: JSX.Element;
};

const styles: Record<string, CSSProperties> = {
  paymentMethod: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '3px',
    border: '1px solid #BDBDBD',
    padding: '20px 16px',
    width: '48%',
    [`@media (max-width: ${breakPoint.md - 1}px)`]: {
      width: '100%',
    },
  },
  paymentTitle: {
    fontFamily: 'OpenSans',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '30px',
  },
  valuePropsContainer: {
    paddingTop: '25px',
  },
  valueProps: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  valueProp: {
    marginBottom: '25px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
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
    '&:disabled': {
      background: '#e5e5e5',
      borderColor: '#e5e5e5',
      color: 'rgba(0,0,0,.26)',
    },
  },
};

const S12nPaymentMethod: React.FunctionComponent<Props> = ({
  title,
  description,
  valueProps,
  onButtonClick,
  isEnrolling,
  hideLoader,
  additionalMessage,
}) => {
  return (
    <div css={styles.paymentMethod}>
      <div css={{ borderBottom: '1px solid #BDBDBD' }}>
        <h4 css={styles.paymentTitle}>{title}</h4>
        <p>{description}</p>
        {additionalMessage}
      </div>
      <div css={styles.valuePropsContainer}>
        <ul css={styles.valueProps}>
          {valueProps.map((text) => (
            <li key={text} css={styles.valueProp}>
              <SvgCheckV2
                suppressTitle
                style={{
                  minWidth: '18px',
                  height: '14px',
                  marginRight: '14px',
                  fill: '#2A73CC',
                }}
              />
              <strong>{text}</strong>
            </li>
          ))}
        </ul>
      </div>
      <div css={styles.buttonContainer}>
        <TrackedButton
          trackingName="continue_button"
          className="cozy"
          css={styles.continueButton}
          onClick={onButtonClick}
          disabled={isEnrolling}
        >
          {isEnrolling && !hideLoader ? <Icon name="spinner" spin /> : _t('Continue')}
        </TrackedButton>
      </div>
    </div>
  );
};

export default S12nPaymentMethod;
