import styled from '@emotion/styled';
import { css } from 'emotion';
import React, { MouseEvent, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { elementScrollPolyfill } from 'seamless-scroll-polyfill';
import { FeaturesSectionURL, FeaturesSectionAnalyticsName } from '../../types';
import {
  BREAKPOINT_SMALL,
  DEFAULT_MOBILE_PADDING,
} from '../../../../components/MarketingPagesShared/styles';

interface FeaturesNavItem {
  label: string;
  url: FeaturesSectionURL;
  analyticsName: FeaturesSectionAnalyticsName;
}

type NavElementRefsMap = {
  [key in FeaturesSectionURL]?: HTMLDivElement;
};

export function FeaturesNav({
  items,
  selectedUrl,
  onNav,
  backgroundColor,
}: {
  items: FeaturesNavItem[];
  onNav: (url: FeaturesNavItem) => void;
  selectedUrl?: FeaturesSectionURL;
  backgroundColor?: string | null;
}) {
  const navRef = useRef<HTMLElement>(null);
  const navElementRefsMap: NavElementRefsMap = {};

  useEffect(() => {
    elementScrollPolyfill();
  }, []);

  useEffect(() => {
    if (!navRef.current || !selectedUrl) {
      return;
    }
    const item = navElementRefsMap[selectedUrl];
    if (!item) {
      return;
    }
    // scrollIntoView would also cause the entire page to scroll up to display
    // the element and we really only need it to scroll horizontally.
    navRef.current.scroll({
      left: item.offsetLeft,
      behavior: 'smooth',
    });
    // We don't need this to update when the refs change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUrl]);

  return (
    <FeaturesNavContainer
      style={backgroundColor ? { backgroundColor } : {}}
      ref={navRef}
    >
      {items.map(item => {
        const { label, url } = item;
        return (
          <FeaturesNavElement
            key={label}
            ref={ref => {
              if (ref) {
                navElementRefsMap[url] = ref;
              }
            }}
          >
            <FeaturesNavLink
              to={url}
              className={
                url === selectedUrl
                  ? css`
                      &,
                      &:hover {
                        opacity: 1;
                        font-weight: bold;
                      }
                    `
                  : css`
                      opacity: 0.6;
                      &,
                      &:hover {
                        font-weight: normal;
                      }
                      &:hover,
                      &:active {
                        opacity: 0.8;
                      }
                    `
              }
              onClick={(event: MouseEvent) => {
                // If we don't do this, the page will scroll to the top
                event.preventDefault();
                onNav(item);
              }}
            >
              {label}
            </FeaturesNavLink>
          </FeaturesNavElement>
        );
      })}
    </FeaturesNavContainer>
  );
}

const LINK_PADDING = 8;

const FeaturesNavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  margin: 0 ${DEFAULT_MOBILE_PADDING - LINK_PADDING}px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    flex-direction: row;
    justify-content: space-between;
    overflow: auto;
    scroll-snap-type: x mandatory;
    max-width: 100vw;
    box-sizing: border-box;
    margin: 0;
    padding-bottom: 10px;
  }
`;

const FeaturesNavElement = styled.div`
  scroll-snap-align: start;
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 0 ${DEFAULT_MOBILE_PADDING - LINK_PADDING}px;

    &:not(:first-of-type) {
      margin-left: -${DEFAULT_MOBILE_PADDING - LINK_PADDING}px;
    }
  }
`;

const FeaturesNavLink = styled(Link)`
  display: inline-block;
  padding: ${LINK_PADDING}px;
  transition: opacity 150ms ease-in-out;
  &,
  &:hover,
  &:active,
  &:focus,
  &:active:focus {
    color: white;
    text-decoration: none;
  }
  &:focus {
    opacity: 1;
  }
`;
