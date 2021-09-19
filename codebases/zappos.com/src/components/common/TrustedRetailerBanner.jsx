import React from 'react';

import Tooltip from 'components/common/Tooltip';
import { MoreInfo } from 'components/icons';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/trustedRetailerBanner.scss';

const CrossSiteTooltip = styleId => (
  <Tooltip
    tooltipId={`crossSite-${styleId}`}
    wrapperClassName={css.trustedRetailerTooltipWrapper}
    direction="bottom"
    content="Zappos has partnered with these retailers to give you more selection.">
    <MoreInfo/>
  </Tooltip>
);

const TrustedRetailerBanner = ({ styleId }) => {
  const { testId } = useMartyContext();
  return (
    <div data-test-id={testId('trustedRetailerBanner')} className={css.trustedRetailerBanner}>
      Trusted Site
      <CrossSiteTooltip styleId={styleId}/>
    </div>
  );
};

export default TrustedRetailerBanner;
