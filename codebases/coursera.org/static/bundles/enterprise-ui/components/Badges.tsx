/** @jsx jsx */
import React from 'react';
import _t from 'i18n!nls/program-common';
import { css, jsx } from '@emotion/react';
import { PRODUCT_TYPE_NAMES } from 'bundles/browse/constants';
import { getTranslatedProductName } from 'bundles/browse/utils';

type Size = 'sm' | 'lg';

type Props = {
  className?: string;
  'data-e2e'?: string;
  size?: Size;
  productType?: string;
  'aria-label'?: string;
};

const getStyle = (fontColor: string, backgroundColor: string, size: Size, borderColor?: string) => {
  return css({
    color: fontColor,
    backgroundColor,
    padding: '0 6px',
    textTransform: 'uppercase',
    fontSize: size === 'sm' ? '12px' : '14px',
    lineHeight: size === 'sm' ? '18px' : '24px',
    fontWeight: 'bold',
    border: `1px solid ${borderColor || backgroundColor}`,
    borderRadius: '4px',
    display: 'inline-block',
    maxHeight: size === 'sm' ? '18px' : '24px',
  });
};

export const CreditBadge: React.FC<Props> = (props) => {
  return (
    <span
      className={props.className}
      data-e2e={props['data-e2e']}
      data-test-id={`${props.size || 'sm'}-credit-badge`}
      css={getStyle('white', '#231960', props.size || 'sm')}
      aria-label={props['aria-label']}
      role="text"
    >
      {_t('Credit')}
    </span>
  );
};

export const RecommendedForCreditBadge: React.FC<Props> = (props) => {
  return (
    <span
      className={props.className}
      data-e2e={props['data-e2e']}
      css={getStyle('#231960', 'white', props.size || 'sm', '#231960')}
    >
      {_t('Recommended for credit')}
    </span>
  );
};

export const ExclusiveBadge: React.FC<Props> = (props) => {
  return (
    <span
      className={props.className}
      data-e2e={props['data-e2e']}
      css={getStyle('#1F1F1F', '#EAC54F', props.size || 'sm')}
    >
      {_t('Exclusive')}
    </span>
  );
};

export const PrivateBadge: React.FC<Props> = (props) => {
  return (
    <span
      className={props.className}
      data-e2e={props['data-e2e']}
      css={getStyle('#1F1F1F', '#EAC54F', props.size || 'sm')}
    >
      {_t('Private')}
    </span>
  );
};

export const CourseBadge: React.FC<Props> = (props) => {
  return (
    <span
      className={props.className}
      data-e2e={props['data-e2e']}
      css={getStyle('#000000', '#EEEEEE', props.size || 'sm')}
    >
      {_t('Course')}
    </span>
  );
};

export const BetaBadge: React.FC<Props> = (props) => {
  return (
    <span
      className={props.className}
      data-e2e={props['data-e2e']}
      css={getStyle('#EEEEEE', '#000000', props.size || 'sm')}
    >
      {_t('Beta')}
    </span>
  );
};

export const ProductTypeBadge: React.FC<Props> = (props) => {
  const displayName = props.productType === 'RHYME PROJECT' ? PRODUCT_TYPE_NAMES.PROJECT : props.productType;
  return (
    <span
      className={props.className}
      data-e2e={props['data-e2e']}
      css={getStyle('#1F1F1F', '#EAEAEA', props.size || 'sm')}
    >
      {getTranslatedProductName(displayName)}
    </span>
  );
};
