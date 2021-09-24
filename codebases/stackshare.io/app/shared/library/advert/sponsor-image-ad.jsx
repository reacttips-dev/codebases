import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {PHONE} from '../../style/breakpoints';
import {ROW, COLUMN, SHORT, THEMES} from './themes';
import {ASH} from '../../style/colors';
import LazyLoadImage from '../../utils/lazy-loading-images';

const Card = glamorous.a({
  position: 'relative',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  borderRadius: 4,
  border: `1px solid ${ASH}`,
  overflow: 'hidden'
});

const DesktopCard = glamorous(Card)(
  {
    [PHONE]: {
      display: 'none'
    }
  },
  ({theme, maxWidth, height, showLargeAd}) => ({
    display: showLargeAd ? 'flex' : 'none',
    height: height,
    maxWidth,
    ...THEMES[theme].Card
  })
);

const MobileCard = glamorous(Card)(
  {
    display: 'none',
    border: 'none'
  },
  ({theme, maxWidth, height, showMobileAd}) => ({
    [PHONE]: {
      display: showMobileAd ? 'flex' : 'none',
      boxShadow: 'none'
    },
    height: theme === COLUMN ? 250 : height,
    maxWidth,
    ...THEMES[theme].Card
  })
);

const SponsorImageAd = ({
  sponsor,
  theme,
  maxWidth,
  height,
  href,
  target,
  onClick,
  showLargeAd,
  showMobileAd
}) => {
  const alt = `${sponsor.title}: ${sponsor.text}`;
  let desktopImage = null,
    mobileImage = null;
  if (sponsor.bannerAdUrl || sponsor.sidebarAdUrl || sponsor.mobileAdUrl) {
    desktopImage =
      theme === ROW || theme === SHORT
        ? sponsor.bannerAdUrl
        : theme === COLUMN
        ? sponsor.sidebarAdUrl
        : null;
    mobileImage = theme === ROW ? sponsor.mobileAdUrl : null;
  }
  return (
    <Fragment>
      <DesktopCard
        onClick={onClick}
        showLargeAd={showLargeAd}
        href={href}
        rel="nofollow"
        maxWidth={maxWidth}
        height={height}
        theme={theme}
        target={target}
      >
        <LazyLoadImage>
          <img src={desktopImage} width="100%" alt={alt} />
        </LazyLoadImage>
      </DesktopCard>
      <MobileCard
        onClick={onClick}
        showMobileAd={showMobileAd}
        href={href}
        rel="nofollow"
        maxWidth={maxWidth}
        height={height}
        theme={theme}
        target={target}
      >
        <LazyLoadImage>
          <img
            src={mobileImage}
            width="100%"
            style={{border: `1px solid ${ASH}`, borderRadius: 4}}
            alt={alt}
          />
        </LazyLoadImage>
      </MobileCard>
    </Fragment>
  );
};

SponsorImageAd.propTypes = {
  sponsor: PropTypes.object,
  theme: PropTypes.string,
  maxWidth: PropTypes.any,
  height: PropTypes.any,
  href: PropTypes.string,
  target: PropTypes.string,
  onClick: PropTypes.func,
  showLargeAd: PropTypes.bool,
  showMobileAd: PropTypes.bool
};

export default SponsorImageAd;
