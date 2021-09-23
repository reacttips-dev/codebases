import styled from '@emotion/styled';
import {
  MAX_WIDTH,
  BREAKPOINT_SMALL,
  DEFAULT_MOBILE_PADDING,
  BREAKPOINT_MEDIUM,
  DEFAULT_DESKTOP_PADDING,
} from '../MarketingPagesShared/styles';

export const FooterContainer = styled.footer`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 20px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  box-sizing: border-box;
  padding: ${DEFAULT_MOBILE_PADDING}px;
  margin: ${DEFAULT_DESKTOP_PADDING}px auto 0;
  font-size: 1.2rem;
  color: white;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin-top: ${DEFAULT_MOBILE_PADDING}px;
    display: flex;
    flex-direction: column;
    grid-gap: 0;
  }
`;

export const CompactCopyrightContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CopyrightContainer = styled.p`
  color: inherit;
  opacity: 0.8;
`;

export const LinksContainer = styled.div`
  display: grid;
  grid-gap: 40px;
  grid-auto-flow: column;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    grid-gap: 10px;
  }
`;

export const SocialContainer = styled.div`
  display: grid;
  grid-gap: 25px;
  grid-auto-flow: column;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    grid-gap: 10px;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-gap: 25px;
    margin: 64px 0;
  }
`;

export const TextLink = styled.a`
  color: inherit;
  font-weight: normal;
  font-size: inherit;
  opacity: 0.8;

  &:hover,
  &:active,
  &:focus,
  &:active:hover {
    opacity: 1;
    text-decoration: none;
    color: inherit;
  }
`;
