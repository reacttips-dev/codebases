import React from 'react';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import Tooltip from 'components/common/Tooltip';
import { MoreInfo } from 'components/icons';

import css from 'styles/components/common/sponsoredBanner.scss';

const SponsoredBanner = ({ index = 0, newCard = false }) => {
  const { testId, marketplace: { shortName } } = useMartyContext();
  const tooltipContent = `These are ads for products you'll find on ${shortName}.com. Clicking an ad will take you to the product's page.`;
  const additionalParams = { id: `sponsoredBanner-${index}` };
  return (
    <div className={cn(css.sponsoredBanner, { [css.newCard]: newCard })} data-test-id={testId('sponsoredBanner')} {...additionalParams}>
      Sponsored
      <Tooltip
        content={tooltipContent}
        wrapperClassName={css.sponsoredTooltipWrapper}
        tooltipClassName={css.sponsoredTooltip}
        direction="down"
        sponsored={true}
        tooltipId="sponsoredProducts">
        <MoreInfo />
      </Tooltip>
      <span className="screenReadersOnly">{tooltipContent}</span>
    </div>
  );
};

export default SponsoredBanner;
