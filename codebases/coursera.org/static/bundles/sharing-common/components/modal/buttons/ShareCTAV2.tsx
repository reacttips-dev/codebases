// V2 share CTA with share icon and subtle to bold styless with rectangular rounded corner background for light themes.
import React from 'react';
import classNames from 'classnames';

import { SvgShare } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/sharing-common';

import 'css!bundles/sharing-common/components/modal/buttons/__styles__/ShareCTAV2';

// Default theme is 'Subtle', blue icon no background and light text
type Props = {
  // Blue bold text and icon
  isSemiBold?: boolean;
  // Dark blue background and white bold text and icon
  isBold?: boolean;
  // Black background with white bold text and icon
  isDark?: boolean;
  // Increase padding/width
  isLarge?: boolean;
  buttonText?: string;
};

export default ({ isSemiBold, isBold, isDark, isLarge, buttonText }: Props) => {
  // 'Subtle' theme is default styling
  const ctaClasses = classNames('rc-ShareCTAV2', {
    'semi-bold-theme': isSemiBold,
    'bold-theme': isBold,
    'dark-theme': isDark,
    'large-button': isLarge,
  });
  const svgColor = isBold || isDark ? '#FFFFFF' : '#0056D2';
  const svgStrokeWidth = isSemiBold ? 3 : 2;

  return (
    <div className={ctaClasses}>
      <div className="rc-ShareCTAV2__button-icon">
        <SvgShare size={13} strokeWidth={svgStrokeWidth} stroke={svgColor} color={svgColor} />
      </div>
      <span aria-hidden="true" className="rc-ShareCTAV2__button-text">
        {buttonText || _t('Share')}
      </span>
    </div>
  );
};
