import React, { Component } from 'react';
import styled from '@emotion/styled';
import { isIOS, isAndroidChrome } from '../../../helpers/serverRenderingUtils';
import {
  AppStoreButton,
  PlayStoreButton,
} from '../../components/AppDownloadButtons';
import Box from '../../shared/Box';
import Text from '../../shared/Text';
import OutboundLink from '../../components/OutboundLink';
import Image from '../../shared/Image';
import Heading from '../../shared/Heading';
import ScreenSection from '../../shared/ScreenSection';
import { Footer } from '../../components/Footer';
import If from '../../shared/If';
import styles from './styles.sass';
import { useBrowserSize } from '../../contexts/BrowserSize/index.tsx';
import { Button } from '../../shared/Button/NewButton';
import { MarketingButton } from '../../components/MarketingPagesShared/MarketingButton';
import { MoneyBag } from '../../components/svgs/MoneyBag';
import { Audience } from '../../components/svgs/Audience';
import { Script } from '../../components/svgs/Script';

const howItWorksSteps = [
  {
    title: 'Meet your sponsor',
    description:
      'Activate Sponsorships and we’ll match you right away with your first sponsor: Anchor.',
  },
  {
    title: 'Record your message',
    description:
      'Read using your own voice and customize the message so it fits the tone of your podcast.',
  },
  {
    title: 'Get paid for your plays',
    description:
      'Activate Sponsorships in any of your episodes, and you’ll get paid every time your ad is heard.',
  },
];

const becomeASponsorSteps = [
  {
    title: 'Reach the right audience, at scale',
    description:
      'Host-read podcast ads are more effective than any other form of digital advertising, and Anchor powers over 70% of all new podcasts created.',
    icon: <Audience width={53} fillColor="#5000B9" />,
  },
  {
    title: 'Easy podcast advertising on any budget',
    description:
      'Take the pain out of podcast advertising: easily find shows that fit your brand, and run advertisements that match your budget and needs.',
    icon: <MoneyBag width={38} fillColor="#5000B9" />,
  },
  {
    title: 'Set-up that’s easy, efficient and flexible',
    description:
      'Submit a script for your sponsored message, which will be recorded by participating podcast hosts and programatically served to their audiences.',
    icon: <Script width={34} fillColor="#5000B9" />,
  },
];

// todo: can be a statelesscomponent
class SponsorshipsPageClassComponent extends Component {
  // TODO (bui): remove inline styles
  constructor(props) {
    super(props);
    this.forPodcastersRef = React.createRef();
    this.forBrandsRef = React.createRef();
  }

  render() {
    const { width } = this.props;
    const imageType =
      width > 768 ? 'desktop' : width > 600 ? 'tablet' : 'mobile';
    return (
      <Box
        testId="SponsorshipsScreen"
        dangerouslySetInlineStyle={{
          overflow: 'hidden',
        }}
      >
        <Box
          testId="SponsorshipsScreen_header-section"
          paddingTop={76}
          mdPaddingTop={60}
          dangerouslySetInlineStyle={{
            background: '#24203F',
          }}
        >
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            className={styles.sponsorshipsHeader}
            minHeight={800}
            color="#24203F"
          >
            <Box
              testId="SponsorshipsScreen_header-section_content"
              maxWidth={1015}
              width="100%"
              paddingLeft={30}
              paddingRight={30}
            >
              <Box paddingBottom={40}>
                <h1 className={styles.topHeaderText}>Anchor Sponsorships</h1>
                <h2 className={styles.topSubheaderText}>
                  A new world for podcast advertising
                </h2>
                <Box
                  alignContent="center"
                  justifyContent="center"
                  mdPaddingTop={20}
                  lgPaddingTop={20}
                  smPaddingTop={15}
                  dangerouslySetInlineStyle={{
                    'text-align': 'center',
                  }}
                >
                  <div className={styles.buttonWrapper}>
                    <Button
                      kind="button"
                      color="purple"
                      onClick={() => {
                        window.scrollTo(0, this.forPodcastersRef.offsetTop);
                      }}
                    >
                      For podcasters
                    </Button>

                    <Button
                      kind="button"
                      color="onDark"
                      onClick={() => {
                        window.scrollTo(0, this.forBrandsRef.offsetTop);
                      }}
                    >
                      For brands
                    </Button>
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <ScreenSection color="#ffffff">
          <Box
            testId="SponsorshipsScreen_about-section"
            justifyContent="center"
            display="flex"
            paddingTop={40}
            paddingBottom={40}
            paddingLeft={30}
            paddingRight={30}
            marginTop={-1}
          >
            <Box
              testId="SponsorshipsScreen_about-section_top-content"
              maxWidth={950}
              display="flex"
              justifyContent="around"
              alignItems="center"
              wrap
              width="100%"
            >
              <Box align="center" maxWidth={780}>
                <Box
                  paddingTop={8}
                  paddingBottom={20}
                  mdPaddingLeft
                  mdPaddingRight
                >
                  <Heading size="lg" align="center" isBold>
                    Meet the first podcast advertising platform for everyone.
                  </Heading>
                </Box>
                <Box paddingTop={8} paddingBottom={8} maxWidth={620}>
                  <Heading size="sm" align="center">
                    Anchor Sponsorships makes it easy for any podcaster to
                    monetize their content as their audience grows.
                  </Heading>
                </Box>
                <Box marginTop={15} maxWidth={620}>
                  <Heading size="xs" align="center">
                    Currently available in the U.S. and expanding to more
                    countries soon. If you’re interested in using Anchor
                    Sponsorships in your country,{' '}
                    <a href="https://docs.google.com/forms/d/1uXUCB1VzNNkdh7FhlZLi042GArEuZ5p1nQBQHpD5gCc/viewform?edit_requested=true">
                      let us know
                    </a>
                    .
                  </Heading>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            testId="SponsorshipsScreen_about-section_content"
            justifyContent="center"
            display="flex"
            paddingTop={40}
            paddingBottom={40}
            paddingLeft={30}
            paddingRight={30}
            smPaddingTop={20}
          >
            <Box
              maxWidth={950}
              display="flex"
              justifyContent="around"
              alignItems="center"
              wrap
              width="100%"
              className={styles.aboutContentWrapper}
            >
              <Box
                testId="SponsorshipsScreen_about-steps-section_bullet-section"
                maxWidth={450}
                width="100%"
                className={styles.aboutSimplifyText}
                smMarginTop={20}
              >
                <Box paddingTop={8} paddingBottom={8}>
                  <Heading size="md" isBold>
                    Podcast monetization, simplified
                  </Heading>
                </Box>
                <Box paddingTop={8} paddingBottom={8}>
                  <Box paddingBottom={32}>
                    <Heading size="sm">
                      Once you activate Sponsorships, all you have to do is
                      record your ad, choose where it goes in your episode, and
                      you’re set.
                    </Heading>
                  </Box>
                </Box>
              </Box>
              <Box
                testId="SponsorshipsScreen_about-steps-section_image-section"
                className={styles.aboutSimplifyImage}
              >
                <Image
                  imageUrl="https://d12xoj7p9moygp.cloudfront.net/images/screens/sponsorships/space_sm.gif"
                  retinaImageUrl="https://d12xoj7p9moygp.cloudfront.net/images/screens/sponsorships/space_sm.gif"
                  width="100%"
                />
              </Box>
            </Box>
          </Box>
          <Box
            justifyContent="center"
            display="flex"
            paddingTop={40}
            paddingBottom={80}
            paddingLeft={30}
            paddingRight={30}
            smPaddingTop={20}
          >
            <Box
              maxWidth={950}
              display="flex"
              justifyContent="around"
              alignItems="center"
              wrap
              width="100%"
              className={styles.aboutContentWrapper}
            >
              <Box className={styles.aboutMonetizeImage}>
                <Image
                  imageUrl="https://d12xoj7p9moygp.cloudfront.net/images/screens/sponsorships/mountain_sm.gif"
                  retinaImageUrl="https://d12xoj7p9moygp.cloudfront.net/images/screens/sponsorships/mountain_sm.gif"
                  width="100%"
                />
              </Box>
              <Box
                maxWidth={450}
                width="100%"
                smMarginTop={20}
                className={styles.aboutMonetizeText}
              >
                <Box paddingTop={8} paddingBottom={8}>
                  <Heading size="md" isBold>
                    Your podcast, your ads
                  </Heading>
                </Box>
                <Box paddingTop={8} paddingBottom={8}>
                  <Box paddingBottom={32}>
                    <Heading size="sm">
                      All your ads are read by you, so you can seamlessly blend
                      promotions into your podcast.
                    </Heading>
                  </Box>
                  <Box>
                    <Heading size="sm">
                      You decide which ads to read, how many to include in your
                      episodes, and the exact moments when they appear.
                    </Heading>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ScreenSection>
        <ScreenSection color="#24203F">
          <Box testId="SponsorshipsScreen_how-it-works-section">
            <Box
              justifyContent="center"
              display="flex"
              paddingTop={70}
              paddingBottom={70}
              paddingLeft={30}
              paddingRight={30}
            >
              <Box
                testId="SponsorshipsScreen_how-it-works-section_content"
                maxWidth={780}
              >
                <Box paddingTop={8} paddingBottom={8} marginBottom={60}>
                  <div
                    ref={el => {
                      this.forPodcastersRef = el;
                    }}
                    id="forPodcasters"
                  >
                    <Heading size="lg" align="center" color="#ffffff" isBold>
                      How it works
                    </Heading>
                  </div>
                </Box>
                <div className={styles.sponsorshipsVideoWrapper}>
                  <iframe
                    title="How it works"
                    width="779"
                    height="438"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    layout="responsive"
                    frameBorder="0"
                    src="https://www.youtube.com/embed/videoseries?list=PLJ_1GxcJR2S89NFDjzVOdlzpZuFBpypLP&amp;cc_load_policy=1&amp;loop=1&amp;showinfo=0&amp;autoplay=1&amp;mute=1&amp;rel=0&amp;ytp-pause-overlay=0 "
                    scrolling="no"
                    allow="autoplay; fullscreen"
                    className={styles.sponsorshipsVideo}
                  >
                    <img
                      alt="man recording a podcast using Anchor for iPhone"
                      layout="fill"
                      src="https://d12xoj7p9moygp.cloudfront.net/images/home-video-placeholder-2.jpg"
                      placeholder
                    />
                  </iframe>
                </div>
                <Box paddingTop={8} paddingBottom={8}>
                  <Box justifyContent="center" display="flex">
                    <Box maxWidth={1000} width="100%">
                      <Box
                        testId="SponsorshipsScreen_how-it-works-section_steps"
                        display="flex"
                        justifyContent="around"
                        wrap
                        className={styles.stepsSection}
                      >
                        {howItWorksSteps.map((step, index) => (
                          <Box
                            key={step.title}
                            width={230}
                            marginLeft={10}
                            marginRight={10}
                            marginTop={15}
                            marginBottom={15}
                          >
                            <Box
                              testId="SponsorshipsScreen_how-it-works-section_step-icon-container"
                              display="flex"
                              justifyContent="center"
                              marginBottom={31}
                              className={styles.howItWorksStepsInt}
                              color="rgba(255, 255, 255, 0.1)"
                              direction="column"
                              dangerouslySetInlineStyle={{
                                'margin-left': 'auto',
                                'margin-right': 'auto',
                              }}
                            >
                              {index + 1}
                            </Box>
                            <Box marginBottom={8}>
                              <Heading
                                size="xs"
                                align="center"
                                color="#ffffff"
                                isBold
                              >
                                {step.title}
                              </Heading>
                            </Box>
                            <Box>
                              <Text size="md" align="center" color="#ffffff">
                                {step.description}
                              </Text>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    paddingTop={30}
                    alignContent="center"
                    justifyContent="center"
                    dangerouslySetInlineStyle={{
                      'text-align': 'center',
                    }}
                  >
                    <div className={styles.buttonWrapper}>
                      <MarketingButton
                        kind="link"
                        href="/signup"
                        color="yellow"
                      >
                        Sign up now!
                      </MarketingButton>

                      <MarketingButton
                        kind="link"
                        href="https://anch.co/sponsorships-faq"
                        color="onDark"
                      >
                        Learn more
                      </MarketingButton>
                    </div>
                    <Box>
                      <OutboundLink to="/login">
                        <button
                          className={styles.existingAccountButton}
                          type="button"
                        >
                          Log in to existing account
                        </button>
                      </OutboundLink>
                    </Box>
                    <Box
                      alignContent="center"
                      justifyContent="center"
                      alignItems="center"
                      direction="column"
                    >
                      <If
                        condition={isIOS()}
                        ifRender={() => (
                          <AppStoreButton
                            height={50}
                            width={169}
                            className={styles.mobileAppLink}
                          />
                        )}
                      />

                      <If
                        condition={isAndroidChrome()}
                        ifRender={() => (
                          <PlayStoreButton
                            height={50}
                            width={169}
                            className={styles.mobileAppLink}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ScreenSection>
        <ScreenSection color="#ffffff">
          <Box testId="SponsorshipsScreen_become-a-sponsor-section">
            <Box
              justifyContent="center"
              display="flex"
              paddingTop={70}
              paddingBottom={70}
              paddingLeft={30}
              paddingRight={30}
            >
              <Box
                testId="SponsorshipsScreen_become-a-sponsor_content"
                maxWidth={1000}
              >
                <Box paddingTop={8} paddingBottom={8} marginBottom={37}>
                  <div
                    ref={el => {
                      this.forBrandsRef = el;
                    }}
                    id="forBrands"
                  >
                    <Heading size="lg" align="center" isBold>
                      Become a sponsor
                    </Heading>
                  </div>
                </Box>
                <Box paddingTop={8} paddingBottom={8}>
                  <Box justifyContent="center" display="flex">
                    <Box maxWidth={1000} width="100%">
                      <Box
                        testId="SponsorshipsScreen_become-a-sponsor_steps"
                        display="flex"
                        justifyContent="around"
                        wrap
                        className={styles.stepsSection}
                      >
                        {becomeASponsorSteps.map(step => (
                          <Box
                            key={step.title}
                            width={200}
                            marginLeft={10}
                            marginRight={10}
                            marginTop={15}
                            marginBottom={15}
                          >
                            <Box
                              testId="SponsorshipsScreen_become-a-sponsor_step-icon-container"
                              display="flex"
                              justifyContent="center"
                              marginBottom={31}
                            >
                              <IconContainer>{step.icon}</IconContainer>
                            </Box>
                            <Box marginBottom={8}>
                              <Heading size="xs" align="center" isBold>
                                {step.title}
                              </Heading>
                            </Box>
                            <Box>
                              <Text size="md" align="center">
                                {step.description}
                              </Text>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  paddingTop={30}
                  alignContent="center"
                  justifyContent="center"
                  dangerouslySetInlineStyle={{
                    'text-align': 'center',
                  }}
                >
                  <Button
                    color="purple"
                    kind="link"
                    href="https://anch.co/brands"
                  >
                    Get in touch
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </ScreenSection>
        <ScreenSection color="#ffffff">
          <Box
            className={styles.mountainSeperator}
            width="100%"
            minHeight={574}
          />
        </ScreenSection>
        <Footer />
      </Box>
    );
  }
}

const IconContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background: rgb(80, 0, 185, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function SponsorshipsPage(props) {
  const { width } = useBrowserSize();
  return <SponsorshipsPageClassComponent {...props} width={width} />;
}

export default SponsorshipsPage;
