import React from 'react';
import PropTypes from 'prop-types';
import SponsorImageAd from './sponsor-image-ad';
import InnerCard from './inner-card';
import glamorous from 'glamorous';
import {WHITE, ASH} from '../../style/colors';
import {BASE_TEXT} from '../../style/typography';
import {ROW, COLUMN, SHORT, THEMES} from './themes';
import {grid} from '../../utils/grid';
import {PHONE} from '../../style/breakpoints';
import {NON_ADBLOCKED_AD_NAME} from '../../constants/settings';

const Container = glamorous.div(
  {
    ...BASE_TEXT,
    padding: '10px 15px',
    margin: 0
  },
  ({theme}) => ({
    ...THEMES[theme].Container
  })
);

const CompCard = glamorous.a({
  textDecoration: 'none',
  alignItems: 'center',
  justifyContent: 'space-around',
  position: 'relative',
  backgroundColor: WHITE,
  paddingTop: grid(2),
  paddingBottom: grid(2),
  borderRadius: 4,
  border: `1px solid ${ASH}`,
  margin: '0 auto',
  display: 'none',
  '&:hover': {
    backgroundColor: WHITE
  }
});

const LargeCompCard = glamorous(CompCard)(
  {
    [PHONE]: {
      display: 'none'
    }
  },
  ({theme, maxWidth, height, showLargeAd}) => ({
    display: showLargeAd ? 'none' : 'flex',
    height,
    maxWidth,
    ...THEMES[theme].CompCard
  })
);

const SmallCompCard = glamorous(CompCard)(
  {
    display: 'none'
  },
  ({theme, maxWidth, height, showMobileAd}) => ({
    [PHONE]: {
      display: showMobileAd ? 'none' : 'flex',
      boxShadow: 'none'
    },
    height,
    maxWidth,
    ...THEMES[theme].CompCard
  })
);

const SponsoredCard = ({
  sponsor,
  theme,
  truncateLength,
  sendAnalyticsEvent,
  maxWidth,
  height,
  website
}) => {
  if (sponsor) {
    const site = website || sponsor.targetUrl;
    const text = sponsor.text;
    const name = sponsor.name || sponsor.title;
    const imageUrl = sponsor.imageUrl || sponsor.image_url;
    const ctaText = sponsor.ctaText || sponsor.cta_text || 'Learn more';
    const target = '_blank';
    let showLargeAd = false,
      showMobileAd = false;
    if (sponsor.bannerAdUrl || sponsor.sidebarAdUrl || sponsor.mobileAdUrl) {
      let isBannerImg = sponsor.bannerAdUrl !== null && (theme === ROW || theme === SHORT);
      let isSidebarImg = sponsor.sidebarAdUrl !== null && theme === COLUMN;
      let isMobileImg = sponsor.mobileAdUrl !== null && theme === ROW;
      showLargeAd = isBannerImg || isSidebarImg;
      showMobileAd = isMobileImg;
    }

    return (
      <Container data-testid={NON_ADBLOCKED_AD_NAME} theme={theme}>
        <SponsorImageAd
          sponsor={sponsor}
          showLargeAd={showLargeAd}
          showMobileAd={showMobileAd}
          theme={theme}
          maxWidth={maxWidth}
          height={height}
          href={site}
          target={target}
          onClick={sendAnalyticsEvent}
        />
        <LargeCompCard
          theme={theme}
          showLargeAd={showLargeAd}
          showMobileAd={showMobileAd}
          rel="nofollow"
          maxWidth={maxWidth}
          height={height}
          href={site}
          target={target}
          onClick={sendAnalyticsEvent}
        >
          <InnerCard
            theme={theme}
            ctaText={ctaText}
            text={text}
            name={name}
            imageUrl={imageUrl}
            truncateLength={truncateLength}
          />
        </LargeCompCard>
        <SmallCompCard
          theme={theme}
          showLargeAd={showLargeAd}
          showMobileAd={showMobileAd}
          maxWidth={maxWidth}
          rel="nofollow"
          height={height}
          href={site}
          target={target}
          onClick={sendAnalyticsEvent}
        >
          <InnerCard
            theme={theme}
            ctaText={ctaText}
            text={text}
            name={name}
            imageUrl={imageUrl}
            truncateLength={truncateLength}
          />
        </SmallCompCard>
      </Container>
    );
  }
  return null;
};

SponsoredCard.propTypes = {
  sponsor: PropTypes.object,
  truncateLength: PropTypes.number,
  sendAnalyticsEvent: PropTypes.func,
  maxWidth: PropTypes.any,
  height: PropTypes.any,
  theme: PropTypes.string,
  website: PropTypes.string
};

export default SponsoredCard;
