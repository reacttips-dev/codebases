import { css } from 'emotion';
import React from 'react';

import {
  LG_SCREEN_MIN,
  MD_SCREEN_MAX,
  MD_SCREEN_MIN,
  SM_SCREEN_MAX,
} from '../../modules/Styleguide';
import { HeadingProps, SizeProp } from './Heading.d';

// TODO: Should we make lineHeight: 1 for heading that is only a single line
const getFontSizeFromSizeString = (sizeString: SizeProp): number => {
  switch (sizeString) {
    case 'xs':
      return 16;
    case 'sm':
      return 20;
    case 'md':
      return 32;
    case 'lg':
      return 40;
    case 'xl':
      return 60;
    default:
      const exhaustiveCheck: never = sizeString;
      return exhaustiveCheck;
  }
};

const getLineHeightFromSizeString = (sizeString: SizeProp) => {
  switch (sizeString) {
    case 'xs':
      return '20px';
    case 'sm':
      return '24px';
    case 'md':
      return '36px';
    case 'lg':
      return '44px';
    case 'xl':
      return '64px';
    default:
      const exhaustiveCheck: never = sizeString;
      return exhaustiveCheck;
  }
};

const getFontWeightFromSizeString = (isBold: boolean, sizeString: SizeProp) => {
  if (!isBold) {
    return 400;
  }
  switch (sizeString) {
    case 'xs':
    case 'sm':
      return 700;
    default:
      return 800;
  }
};

const defaultProps = {
  testId: '',
  accessibilityLevel: 1,
  color: 'black',
  overflow: 'normal',
  isTruncated: false,
  size: 'md',
  isBold: false,
  align: 'left',
  isUppercase: false,
  dangerouslySetFontSize: null,
};

/**
 * @deprecated Use a styled component instead
 */
const Heading = ({
  testId,
  align,
  smAlign,
  mdAlign,
  lgAlign,
  children,
  accessibilityLevel,
  color,
  overflow,
  isTruncated,
  size,
  sizeAtSmScreen,
  sizeAtMdScreen,
  sizeAtLgScreen,
  isBold,
  isUppercase,
  dangerouslySetFontSize,
}: HeadingProps) => {
  const breakWordStyles: React.CSSProperties = {
    hyphens: 'auto',
    wordWrap: 'break-word',
  };
  const truncatedStyles: React.CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  const headerStyles: React.CSSProperties = {
    // Start resets (
    // http://meyerweb.com/eric/tools/css/reset/
    // v2.0 | 20110126
    // License: none (public domain)
    margin: 0,
    padding: 0,
    border: 0,
    verticalAlign: 'baseline',
    // END resets

    color,
    ...(overflow === 'breakWord' ? breakWordStyles : {}),
    fontSize: getFontSizeFromSizeString(size),
    ...(isTruncated ? truncatedStyles : {}),
    ...(isUppercase ? { textTransform: 'uppercase' } : {}),
  };

  const smHeadingStyles = {
    textAlign: smAlign || align,
    fontSize:
      dangerouslySetFontSize ||
      getFontSizeFromSizeString(sizeAtSmScreen || size),
    lineHeight: getLineHeightFromSizeString(sizeAtSmScreen || size), // Needed to reset our global styles
    fontWeight: getFontWeightFromSizeString(isBold, sizeAtSmScreen || size),
  };
  const mdHeadingStyles = {
    textAlign: mdAlign || align,
    fontSize:
      dangerouslySetFontSize ||
      getFontSizeFromSizeString(sizeAtMdScreen || size),
    lineHeight: getLineHeightFromSizeString(sizeAtMdScreen || size), // Needed to reset our global styles
    fontWeight: getFontWeightFromSizeString(isBold, sizeAtMdScreen || size),
  };

  const lgHeadingStyles = {
    textAlign: lgAlign || align,
    fontSize:
      dangerouslySetFontSize ||
      getFontSizeFromSizeString(sizeAtLgScreen || size),
    lineHeight: getLineHeightFromSizeString(sizeAtLgScreen || size), // Needed to reset our global styles
    fontWeight: getFontWeightFromSizeString(isBold, sizeAtLgScreen || size),
  };

  const className = css({
    [`@media (max-width: ${SM_SCREEN_MAX}px)`]: {
      ...headerStyles,
      ...smHeadingStyles,
    },
    [`@media (min-width: ${MD_SCREEN_MIN}px) and (max-width: ${MD_SCREEN_MAX}px)`]: {
      ...headerStyles,
      ...mdHeadingStyles,
    },
    [`@media (min-width: ${LG_SCREEN_MIN}px)`]: {
      ...headerStyles,
      ...lgHeadingStyles,
    },
  });

  switch (accessibilityLevel) {
    case 1:
      return (
        <h1 data-testid={testId} className={className}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 data-testid={testId} className={className}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 data-testid={testId} className={className}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 data-testid={testId} className={className}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 data-testid={testId} className={className}>
          {children}
        </h5>
      );
    case 6:
      return (
        <h6 data-testid={testId} className={className}>
          {children}
        </h6>
      );
    default:
      const exhaustiveCheck: never = accessibilityLevel;
      return exhaustiveCheck;
  }
};

Heading.defaultProps = defaultProps;

export { Heading as default, Heading };
