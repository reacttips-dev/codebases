// TODO: Should we make lineHeight: 1 for text that is only a single line

import { css } from 'emotion';
import React from 'react';
import { default as If } from '../If';
import { getFontSize } from './modules/getFontSize';
import { getLetterSpacing } from './modules/getLetterSpacing';
import { getLineHeight } from './modules/getLineHeight';
import { getTextSizeFromTextSizeString } from './modules/getTextSizeFromTextSizeString';

import {
  LG_SCREEN_MIN,
  MD_SCREEN_MAX,
  MD_SCREEN_MIN,
  SM_SCREEN_MAX,
} from '../../modules/Styleguide';

import { TextAlignment, TextProps, TextSize, TextSizeString } from './index.d';

const getLineHeightInPixels = (textSize: TextSize): string =>
  `${getLineHeight(textSize)}px`;

const breakWordStyles: React.CSSProperties = {
  hyphens: 'auto',
  wordWrap: 'break-word',
};

const truncatedStyles: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const defaultProps = {
  align: 'left' as TextAlignment,
  isBold: false,
  color: 'black',
  isInline: false,
  isItalic: false,
  overflow: 'normal',
  size: 'md',
  isTruncated: false,
  isUppercase: false,
  isWrapping: true,
};

/**
 * @deprecated Use a styled component instead
 */
const Text = ({
  children,
  align,
  smAlign,
  mdAlign,
  lgAlign,
  isBold,
  color,
  isInline,
  isItalic,
  overflow,
  isUppercase,
  size: textSizeString,
  sizeAtSmScreen,
  sizeAtMdScreen,
  sizeAtLgScreen,
  isTruncated,
  dangerouslySetFontSize,
  maxVisibleLines,
  isWrapping,
}: TextProps) => {
  const size = getTextSizeFromTextSizeString(textSizeString as TextSizeString);

  const textStyles: React.CSSProperties = {
    color,
    fontStyle: isItalic ? 'italic' : 'normal',
    fontWeight: isBold ? 700 : 500,
    letterSpacing: getLetterSpacing(size),
    ...(overflow === 'breakWord' ? breakWordStyles : {}),
    ...(isTruncated ? truncatedStyles : {}),
    ...(isUppercase ? { textTransform: 'uppercase' } : {}),
    whiteSpace: isWrapping ? 'normal' : 'nowrap',
  };

  const maxVisibleLinesStyles: any = {
    WebkitLineClamp: String(maxVisibleLines),
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    display: '-webkit-box',
  };
  const smScreenTextSize = getTextSizeFromTextSizeString((sizeAtSmScreen ||
    size) as TextSizeString);
  const mdScreenTextSize = getTextSizeFromTextSizeString((sizeAtMdScreen ||
    size) as TextSizeString);
  const lgScreenTextSize = getTextSizeFromTextSizeString((sizeAtLgScreen ||
    size) as TextSizeString);
  const smTextStyles = {
    textAlign: smAlign || align,
    fontSize: dangerouslySetFontSize || getFontSize(smScreenTextSize),
    letterSpacing: getLetterSpacing(smScreenTextSize),
    lineHeight: getLineHeightInPixels(smScreenTextSize), // Needed to reset our global styles
    ...(maxVisibleLines ? maxVisibleLinesStyles : {}),
  };
  const mdTextStyles = {
    textAlign: mdAlign || align,
    fontSize: dangerouslySetFontSize || getFontSize(mdScreenTextSize),
    letterSpacing: getLetterSpacing(mdScreenTextSize),
    lineHeight: getLineHeightInPixels(mdScreenTextSize), // Needed to reset our global styles
    ...(maxVisibleLines ? maxVisibleLinesStyles : {}),
  };
  const lgTextStyles = {
    textAlign: lgAlign || align,
    fontSize: dangerouslySetFontSize || getFontSize(lgScreenTextSize),
    letterSpacing: getLetterSpacing(lgScreenTextSize),
    lineHeight: getLineHeightInPixels(lgScreenTextSize), // Needed to reset our global styles
    ...(maxVisibleLines ? maxVisibleLinesStyles : {}),
  };

  const className = css({
    [`@media (max-width: ${SM_SCREEN_MAX}px)`]: {
      ...textStyles,
      ...smTextStyles,
    },
    [`@media (min-width: ${MD_SCREEN_MIN}px) and (max-width: ${MD_SCREEN_MAX}px)`]: {
      ...textStyles,
      ...mdTextStyles,
    },
    [`@media (min-width: ${LG_SCREEN_MIN}px)`]: {
      ...textStyles,
      ...lgTextStyles,
    },
  });
  const getInlineJSX = (): JSX.Element => (
    <span className={className}>{children}</span>
  );
  const getNonInlineJSX = (): JSX.Element => (
    <div className={className}>{children}</div>
  );

  return (
    <If
      condition={isInline}
      ifRender={getInlineJSX}
      elseRender={getNonInlineJSX}
    />
  );
};

Text.defaultProps = defaultProps;

export { Text as default, Text };
