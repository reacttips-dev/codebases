import styled from '@emotion/styled';
import React from 'react';
import { Icon } from '../../../../shared/Icon';
import { clickedFooterLink } from '../../events';

const IconLink = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  opacity: 0.8;
  // Fixes a strange clipping issue in Mobile Safari that happens when you give
  // the SVG an opacity
  padding: 2px;

  &:hover,
  &:focus,
  &:active {
    opacity: 1;
  }
`;

type Platform = 'facebook' | 'twitter' | 'instagram';

type SocialLinkProps = {
  platformName: Platform;
};

function SocialLink({ platformName }: SocialLinkProps) {
  const { url = '', component = null, title = '' } = getPlatformInfo(
    platformName
  );
  return (
    <IconLink
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      onClick={() => clickedFooterLink(platformName)}
      aria-label={`link to Anchor's ${platformName} page`}
    >
      {component}
    </IconLink>
  );
}

type PlatformInfo = {
  url?: string;
  component?: JSX.Element;
  title?: string;
};

function getPlatformInfo(platformName: Platform): PlatformInfo {
  switch (platformName) {
    case 'twitter':
      return {
        url: 'https://twitter.com/anchor',
        component: <Icon type="TwitterLogo" fillColor="white" />,
        title: 'Twitter',
      };
    case 'facebook':
      return {
        url: 'https://www.facebook.com/anchor.fm/',
        component: <Icon type="FacebookLogo" fillColor="white" />,
        title: 'Facebook',
      };
    case 'instagram':
      return {
        url: 'https://www.instagram.com/anchor.fm/',
        component: <Icon type="Instagram" fillColor="white" />,
        title: 'Instagram',
      };
    default:
      return {};
  }
}

export { SocialLink };
