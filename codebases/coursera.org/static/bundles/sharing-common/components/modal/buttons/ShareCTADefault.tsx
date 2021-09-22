// Default share CTA with rounded share icon and bold text, works for dark and light themes.
import React from 'react';
import classNames from 'classnames';

import { SvgShare } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/sharing-common';

import 'css!bundles/sharing-common/components/modal/buttons/__styles__/ShareCTADefault';

type Props = {
  isLightTheme?: boolean;
};

export default ({ isLightTheme }: Props) => {
  const ctaClasses = classNames('rc-ShareCTADefault', { 'light-theme': isLightTheme });
  const svgColor = isLightTheme ? '#FFFFFF' : '#2A73CC';

  return (
    <div className={ctaClasses}>
      <div className="rc-ShareCTADefault__button-icon">
        <SvgShare
          isThemeDark={!isLightTheme}
          size={12}
          strokeWidth={2}
          stroke={svgColor}
          color={svgColor}
          suppressTitle={true}
        />
      </div>
      <span className="rc-ShareCTADefault__button-text">{_t('Share')}</span>
    </div>
  );
};
