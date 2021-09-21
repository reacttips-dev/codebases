/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { useBrowserSize } from '../../contexts/BrowserSize';
import { BREAKPOINT_SMALL } from '../MarketingPagesShared/styles';
import { SocialLink } from './components/SocialLink';
import { clickedFooterLink } from './events';
import { MarketingAppButtons } from '../MarketingPagesShared/MarketingAppButtons';
import {
  CompactCopyrightContainer,
  CopyrightContainer,
  FooterContainer,
  LinksContainer,
  SocialContainer,
  TextLink,
} from './styled';

const Footer = () => {
  const { width } = useBrowserSize();
  return <FooterContainer>{getFooterContentInOrder(width)}</FooterContainer>;
};

function AppLinks() {
  return <MarketingAppButtons clickEventLocation="Footer" />;
}

function getFooterContentInOrder(width: number) {
  if (width <= BREAKPOINT_SMALL) {
    return (
      <React.Fragment>
        <AppLinks />
        <SocialLinks />
        <CompactCopyright />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Copyright />
      <Links />
      <SocialLinks />
      <AppLinks />
    </React.Fragment>
  );
}

function LegalLink() {
  return (
    <TextLink
      onClick={() => clickedFooterLink('Legal')}
      href="/tos"
      target="_blank"
      rel="noopener noreferrer"
    >
      Legal
    </TextLink>
  );
}

function Links() {
  return (
    <LinksContainer>
      <TextLink
        onClick={() => clickedFooterLink('Jobs')}
        href="https://spotifyjobs.com/jobs?q=Podcaster%20Mission"
        target="_blank"
        rel="noopener noreferrer"
      >
        Careers
      </TextLink>
      <LegalLink />
      <TextLink
        onClick={() => clickedFooterLink('Help')}
        href="https://help.anchor.fm"
        target="_blank"
        rel="noopener noreferrer"
      >
        Help
      </TextLink>
    </LinksContainer>
  );
}

function CompactCopyright() {
  return (
    <CompactCopyrightContainer>
      <LegalLink />
      <Copyright />
    </CompactCopyrightContainer>
  );
}

function SocialLinks() {
  return (
    <SocialContainer>
      <SocialLink platformName="facebook" />
      <SocialLink platformName="twitter" />
      <SocialLink platformName="instagram" />
    </SocialContainer>
  );
}
function Copyright() {
  return <CopyrightContainer>2021 &copy; Spotify AB</CopyrightContainer>;
}

export { Footer };
