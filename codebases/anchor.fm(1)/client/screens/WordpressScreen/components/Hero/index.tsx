import React from 'react';
import { css } from 'emotion';
import { Button } from '../../../../shared/Button/NewButton';
import {
  Section,
  ContentWrapper,
  Heading,
  SubHeader,
  HeroImageContainer,
  HeroImagePictureWrapper1,
  HeroImagePictureWrapper2,
} from './styles';
import { RetinaPicture } from '../../../../components/RetinaPicture';
import { events } from '../../events';
import { WordPressHero } from '../../../../components/SignupPage/components/WordPressHero';

export function Hero() {
  return (
    <Section>
      <ContentWrapper>
        <WordPressHero fillColor="#FFFFFF" />
        <Heading>The easiest way to grow your audience with audio.</Heading>
        <Button
          color="onDark"
          className={css`
            width: 240px;
            margin: 48px 0 20px;
          `}
          kind="link"
          href="/signup?ref=wp"
          onClick={() => {
            events.clickWordPressSignUpCTA('hero');
          }}
        >
          Get started
        </Button>
        <SubHeader>
          If you’re already on Anchor, you’ll need to create a new account.
        </SubHeader>
        <HeroImage />
      </ContentWrapper>
    </Section>
  );
}

function HeroImage() {
  return (
    <HeroImageContainer>
      <HeroImagePictureWrapper1>
        <RetinaPicture
          imagePath="/wordpress/hero"
          alt="Smiling woman wearing headphones writing in a notebook"
          fallbackExtension="jpg"
        />
      </HeroImagePictureWrapper1>
      <HeroImagePictureWrapper2>
        <RetinaPicture
          imagePath="/wordpress/convert-post-ui"
          alt="Abstract user interface to convert an WordPress blog post into a podcast"
          fallbackExtension="png"
        />
      </HeroImagePictureWrapper2>
    </HeroImageContainer>
  );
}
