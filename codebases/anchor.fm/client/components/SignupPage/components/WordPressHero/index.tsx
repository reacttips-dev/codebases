import React from 'react';
import { css } from 'emotion';
import { Logos, WordPressDotComLogo } from './Logos';
import { LogoWrapper, DesktopHeading, MobileHeading } from './styles';
import { COLOR_DARK_PURPLE } from '../../../MarketingPagesShared/styles';

const HEADING_LABEL = 'In partnership with WordPress.com';

export function WordPressHero({ fillColor }: { fillColor?: string }) {
  const color = fillColor || COLOR_DARK_PURPLE;
  return (
    <>
      <DesktopHeading
        aria-label={HEADING_LABEL}
        className={css`
          margin: 0;
        `}
      >
        <Logos fillColor={fillColor} />
      </DesktopHeading>
      <MobileHeading
        aria-label={HEADING_LABEL}
        className={css`
          margin: 0;
          color: ${color};
        `}
      >
        In partnership with
        <LogoWrapper
          aria-hidden={true}
          className={css`
            width: 200px;
            margin: auto;
            padding-top: 4px;
          `}
        >
          <WordPressDotComLogo fillColor={color} />
        </LogoWrapper>
      </MobileHeading>
    </>
  );
}
