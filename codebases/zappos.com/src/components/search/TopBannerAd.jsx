import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';

import { evSearchAdClick, evSearchAdView } from 'events/search';
import { trackEvent } from 'helpers/analytics';
import { track } from 'apis/amethyst';
import ImageLazyLoader from 'components/common/ImageLazyLoader';
import Tooltip from 'components/common/Tooltip';
import LandingPageLink from 'components/landing/LandingPageLink';
import { MoreInfo } from 'components/icons';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/search/topBannerAd.scss';

const TopBannerAd = ({
  searchTerm = '',
  slotDetails: { src, mobilesrc, alt, link, showTooltip, tooltipCopy, crossSiteSellingUniqueIdentifier }
}) => {
  const { marketplace: { shortName, hasBannerAds }, testId } = useMartyContext();

  const handleClick = useCallback(() => {
    track(() => ([
      evSearchAdClick, { adLocation: 'HEADER', searchTerm, advertisementType: 'BANNER_AD', endpoint: crossSiteSellingUniqueIdentifier }
    ]));
    trackEvent('TE_BANNER_AD_CLICK', `searchTerm:${searchTerm}adLocation:HEADER`);
  }, [crossSiteSellingUniqueIdentifier, searchTerm]);

  useEffect(() => {
    track(() => ([
      evSearchAdView, { adLocation: 'HEADER', searchTerm, advertisementType: 'BANNER_AD', endpoint: crossSiteSellingUniqueIdentifier }
    ]));
    trackEvent('TE_BANNER_AD_VIEW', `searchTerm:${searchTerm}adLocation:HEADER`);
  }, [crossSiteSellingUniqueIdentifier, searchTerm]);

  if (!hasBannerAds) {
    return null;
  }

  const defaultTooltipCopy = `These are ads for products you'll find on ${shortName}.com. Clicking an ad will take you to the product's page.`;
  const imgProps = { src, mobilesrc, alt };
  const pictureProps = [];

  if (mobilesrc) {
    pictureProps.push(<source key={'topBannerAd' + mobilesrc} media="(max-width: 650px)" srcSet={mobilesrc} />);
  }

  return (
    <LandingPageLink
      url={link}
      className={css.innerWrapper}
      onClick={handleClick}
      data-test-id={testId('topBannerAdLink')}>
      <ImageLazyLoader
        imgProps={imgProps}
        pictureProps={pictureProps}
      />
      {showTooltip &&
        <Tooltip
          content={tooltipCopy || defaultTooltipCopy}
          wrapperClassName={css.tooltipWrapper}
          tooltipClassName={css.tooltip}
          contentClassName={css.content}
          direction="down"
          tooltipId="topBannerAd"
        >
          Sponsored   <MoreInfo className={css.icon}/>
        </Tooltip>
      }
    </LandingPageLink>
  );
};

TopBannerAd.contextTypes = {
  marketplace: PropTypes.object
};

export default TopBannerAd;
