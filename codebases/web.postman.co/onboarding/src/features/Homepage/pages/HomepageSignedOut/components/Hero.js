import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Text, ResponsiveContainer } from '@postman/aether';

import Link from '../../../../../../../appsdk/components/link/Link';
import AnalyticsService from '../../../../../../../js/modules/services/AnalyticsService';
import NavigationService from '../../../../../../../js/services/NavigationService';
import ThemeManager from '../../../../../../../js/controllers/theme/ThemeManager';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { STYLED_CONSTANTS } from '../StyledConstants';
import { getStringifiedQueryParams } from '../../../../../../../js/common/utils/url';

import InputButton from './InputButton';
import Typewriter from './Typewriter';
import ProgressiveImage from './ProgressiveImage';

import HeroIllustrationUrl from '../../../../../../../assets/images/empty-state/homepage-header-illustration.svg';
import MicrosoftLightUrl from '../../../../../../../assets/images/thumbnails/microsoft-logo-light.svg';
import MicrosoftDarkUrl from '../../../../../../../assets/images/thumbnails/microsoft-logo-dark.svg';
import AppleLightUrl from '../../../../../../../assets/images/thumbnails/apple-logo-light.svg';
import AppleDarkUrl from '../../../../../../../assets/images/thumbnails/apple-logo-dark.svg';
import LinuxLightUrl from '../../../../../../../assets/images/thumbnails/linux-logo-light.svg';
import LinuxDarkUrl from '../../../../../../../assets/images/thumbnails/linux-logo-dark.svg';

const StyledHeroContainer = styled(ResponsiveContainer)`
    position: relative;
    align-items: center;
    padding: var(--spacing-zero) max(calc((100vw - ${STYLED_CONSTANTS.maxContentWidth}px) / 2), var(--spacing-xxxl));
    @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.xs}px) {
      padding: var(--spacing-zero) var(--spacing-l);
    }

    @media only screen and (min-width: ${STYLED_CONSTANTS.breakpoint.sm}px) and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
      padding: var(--spacing-zero) var(--spacing-xl);
    }

    .hero-content-left {
      position: relative;
      z-index: 10;
      margin-top: 100px;

      .cta-hero {
        margin-top: var(--spacing-xl);

        @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
          border: none;

          .input-button {
            width: 100%;
            border: var(--border-width-default) solid var(--base-color-brand);
            border-radius: var(--border-radius-default);
          }
        }

        & button {
          @media only screen and (max-width:  ${STYLED_CONSTANTS.breakpoint.lg}px) {
            border-radius: var(--border-radius-default);
            width: 100%;
            margin-top: var(--spacing-l);
          }
        }
      }
    }

    .hero-content-right {
      position: relative;
      width: 100%;
      height: 570px;
    }

    .quarter-circle-mobile {
      --width: 100px;
      width: var(--width);
      height: var(--width);
      background: rgb(255, 224, 133);
      border-radius: 0 0 0 var(--width);
      position: absolute;
      top: 0px;
      right: 0px;
    }

    .hero-download-container {
      img {
        width: 42px;
        height: 42px;
      }
    }
  `,
  StyledHeroImage = styled.div`
    display: flex;
    position: absolute;
    top: -48px;
    left: -75px;

    img {
      width: 994px;
      height: 610px;
      z-index: 1;
    }
  `,
  StyledHeroImageMobile = styled(Flex)`
    img {
      max-height: 100%;
      max-width: 100%;
      margin: var(--spacing-zero) auto;
      padding:  var(--spacing-zero);
    }
  `,
  StyledHeroMobileIllustration = styled.img`
    width: 184px;
    height: 129px;
    margin-top: -30px;
  `,
  StyledHeroDesktopIllustration = styled.img`
    position: absolute;
    width: 312px;
    height: 205px;
    right: -10px;
    bottom: -125px;
    z-index: 1;

    @media only screen and (max-width: 1024px) {
      width: 312px;
      height: 170px;
    }
  `,
  StyledHeading = styled.h1`
    margin: 0;
    > span:first-of-type {
      display: block;
      font-size: 28px;
    }
  `;

const labels = ['Build', 'Test', 'Debug', 'Document', 'Monitor', 'Publish'],
  DOWNLOAD_LINK = 'https://www.postman.com/downloads',
  AETHER_MOBILE_VIEW_WIDTH = 720;

const DownloadCTA = ({ traceId, className }) => {
  const captureDownloadEvent = (e, platform) => {
    const utmParams = {
        'utm_source': 'postman-home'
      },
      params = getStringifiedQueryParams(utmParams),
      downloadPageUrl = `${DOWNLOAD_LINK}/?${params}`;

    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'download',
      entityType: platform,
      value: 1,
      traceId
    });

    // Case when click is done with Cmd or Ctrl key.
    if ((e.metaKey || e.ctrlKey)) {
      return;
    }

    e.preventDefault();
    NavigationService.openURL(downloadPageUrl);
  },
    currentTheme = ThemeManager.getCurrentTheme();

  return (
    <Flex direction='column' gap='spacing-s' alignSelf='flex-end' className='hero-download-container' hiddenFor={['mobile']}>
      <Text
        type='body-medium'
        color='content-color-secondary'
        typographyStyle={{
          fontSize: 'text-size-m',
          fontWeight: 'text-weight-bold',
          lineHeight: 'line-height-s'
        }}
      >
        Download the desktop app
      </Text>
      <Flex gap='spacing-l'>
        <Link to={DOWNLOAD_LINK} onClick={(e) => captureDownloadEvent(e, 'windows')}>
          <img src={currentTheme === 'light' ? MicrosoftLightUrl : MicrosoftDarkUrl} alt='Download Postman for Windows' />
        </Link>
        <Link to={DOWNLOAD_LINK} onClick={(e) => captureDownloadEvent(e, 'mac')}>
          <img src={currentTheme === 'light' ? AppleLightUrl : AppleDarkUrl} alt='Download Postman for Mac' />
        </Link>
        <Link to={DOWNLOAD_LINK} onClick={(e) => captureDownloadEvent(e, 'linux')}>
          <img src={currentTheme === 'light' ? LinuxLightUrl : LinuxDarkUrl} alt='Download Postman for Linux' />
        </Link>
      </Flex>
    </Flex>
  );
};

const Hero = ({ traceId }) => {
  const { width, height } = useWindowDimensions(),
    currentTheme = ThemeManager.getCurrentTheme(),
    isMobileView = width < AETHER_MOBILE_VIEW_WIDTH;

  return (
    <StyledHeroContainer
      type='row'
      alignItems='center'
      justifyContent='space-between'
      overflow='unset'
    >
      {/* Left Content */}
      <ResponsiveContainer
        type='column'
        computer={4}
        tablet={4}
        mobile={10}
        overflow='unset'
        className='hero-content-left'
      >
        <Flex direction='column'>
          <Flex direction='column'>
            <StyledHeading>
              <Text
                type='body-large'
                typographyStyle={{
                  fontWeight: 'text-weight-bold',
                  fontSize: 'text-size-xxxl',
                  lineHeight: 'line-height-xxxl',
                  fontFamily: 'text-family-default'
                }}
                color='content-color-primary'
              >
                <Typewriter labels={labels} />
              </Text>
              <Text
                type='body-large'
                color='content-color-primary'
                typographyStyle={{
                  fontWeight: 'text-weight-bold',
                  fontSize: 'text-size-xxxl',
                  lineHeight: 'line-height-xxxl'
                }}
              >
                APIs together
              </Text>
            </StyledHeading>
          </Flex>
          <Text
            color='content-color-primary'
            typographyStyle={{
              fontSize: 'text-size-xl',
              fontWeight: 'text-weight-regular',
              lineHeight: 'line-height-xl',
              fontFamily: 'text-family-default'
            }}
          >
            Over 15 million developers use Postman. Get started by signing up or downloading the desktop app.
          </Text>
          <InputButton
            placeholder='jsmith@example.com'
            buttonText='Sign Up for Free'
            className='cta-hero'
            traceId={traceId}
            analyticsLabel='main'
          />
        </Flex>
        <Flex justifyContent='space-between'>
          {window.SDK_PLATFORM === 'browser' ? <DownloadCTA traceId={traceId} /> : <div />}
        </Flex>
      </ResponsiveContainer>

      {/* Right Content */}
      <ResponsiveContainer
        type='column'
        computer={8}
        tablet={8}
        hiddenFor={['mobile']}
        overflow='unset'
        className='hero-content-right'
        justifyContent='center'
      >
        {!isMobileView &&
          <StyledHeroImage>
            {currentTheme === 'dark' ?
              <ProgressiveImage
                srcSet='https://res.cloudinary.com/postman/image/upload/t_media_responsive_tablet/v1625575176/homepage/homepage-hero-dark.png 768w,
                  https://res.cloudinary.com/postman/image/upload/t_media_responsive_computer/v1625575176/homepage/homepage-hero-dark.png 1024w'
                placeholder='https://res.cloudinary.com/postman/image/upload/t_media_placeholder/v1625575176/homepage/homepage-hero-dark.png'
                src='https://res.cloudinary.com/postman/image/upload/t_media_responsive_computer/v1625575176/homepage/homepage-hero-dark.png'
              >
                {(src, loading, srcSet, sizes) => (
                  <img
                    srcSet={srcSet}
                    sizes={sizes}
                    src={src}
                    alt='Postman hero image'
                  />
                )}
              </ProgressiveImage> :
              <ProgressiveImage
                srcSet='https://res.cloudinary.com/postman/image/upload/t_media_responsive_tablet/v1625575178/homepage/homepage-hero-light.jpeg 768w,
                  https://res.cloudinary.com/postman/image/upload/t_media_responsive_computer/v1625575178/homepage/homepage-hero-light.jpeg 1024w'
                placeholder='https://res.cloudinary.com/postman/image/upload/t_media_placeholder/v1625575176/homepage/homepage-hero-light.jpeg'
                src='https://res.cloudinary.com/postman/image/upload/t_media_responsive_computer/v1625575178/homepage/homepage-hero-light.jpeg'
                alt='Postman hero image'
              >
                {(src, loading, srcSet, sizes) => (
                  <img
                    srcSet={srcSet}
                    sizes={sizes}
                    src={src}
                    alt='Postman hero image'
                  />
                )}
              </ProgressiveImage>
            }
          </StyledHeroImage>
        }
        {currentTheme === 'light' && <StyledHeroDesktopIllustration src={HeroIllustrationUrl} alt='hero illustration' />}
      </ResponsiveContainer>

      {/* Right Content for Mobile only */}
      <ResponsiveContainer type='column' mobile={2} overflow='unset' hiddenFor={['computer', 'tablet']}>
        <Flex className='hero-content-right__mobile' justifyContent='center' width='100px' height='100px'>
          <div className='quarter-circle-mobile' />
        </Flex>
      </ResponsiveContainer>

      {/* Illustration for mobile view */}
      <ResponsiveContainer type='column' mobile={12} overflow='unset' hiddenFor={['computer', 'tablet']}>
        <Flex justifyContent='flex-end'>
          {currentTheme === 'light' && <StyledHeroMobileIllustration src={HeroIllustrationUrl} alt='hero illustration' />}
        </Flex>
      </ResponsiveContainer>

      {/* Banner for mobile view */}
      <ResponsiveContainer type='column' mobile={12} overflow='unset' hiddenFor={['computer', 'tablet']}>
        {/*
          * aether handles responsive view by toggling display as block/none
          * using current window size to block rendering in bigger screens to improve performance
          */}
        {isMobileView &&
          <StyledHeroImageMobile justifyContent='center'>
            {currentTheme === 'dark' ?
              <ProgressiveImage
                placeholder='https://res.cloudinary.com/postman/image/upload/t_media_placeholder/v1625575174/homepage/homepage-hero-mobile-dark.png'
                src='https://res.cloudinary.com/postman/image/upload/t_media_responsive_mobile/v1625575174/homepage/homepage-hero-mobile-dark.png'
              >
                {(src, loading, srcSet, sizes) => (
                  <img
                    src={src}
                    alt='Postman hero image'
                  />
                )}
              </ProgressiveImage> :
              <ProgressiveImage
                placeholder='https://res.cloudinary.com/postman/image/upload/t_media_placeholder/v1625575174/homepage/homepage-hero-mobile-light.jpeg'
                src='https://res.cloudinary.com/postman/image/upload/t_media_responsive_mobile/v1625575179/homepage/homepage-hero-mobile-light.jpeg'
              >
                {(src, loading, srcSet, sizes) => (
                  <img
                    src={src}
                    alt='Postman hero image'
                  />
                )}
              </ProgressiveImage>
            }
          </StyledHeroImageMobile>
        }
      </ResponsiveContainer>
    </StyledHeroContainer>
  );
};

DownloadCTA.propTypes = {
  traceId: PropTypes.string
};

Hero.propTypes = {
  traceId: PropTypes.string
};

export default Hero;
