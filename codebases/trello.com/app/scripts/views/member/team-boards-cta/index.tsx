/* eslint-disable import/no-default-export */
import React from 'react';

import LargeBanner from './large-team-boards-cta-banner';
import { NarrowTeamBanner } from './narrow-team-boards-cta-banner';
import SmallBanner from './small-team-boards-cta-banner';

interface CtaJoinBoardBannerProps {
  inBoardsMenu?: boolean;
  emptyStateBanner?: boolean;
  teamName: string;
  teamBoardsLink: string;
  onDismiss: () => void;
  onClickLink?: React.EventHandler<React.MouseEvent<HTMLElement>>;
}

const CtaJoinBoardBanner = ({
  inBoardsMenu,
  emptyStateBanner,
  ...props
}: CtaJoinBoardBannerProps) => (
  <>
    {inBoardsMenu && <NarrowTeamBanner {...props} />}
    {!inBoardsMenu && emptyStateBanner && <LargeBanner {...props} />}
    {!inBoardsMenu && !emptyStateBanner && <SmallBanner {...props} />}
  </>
);

export default CtaJoinBoardBanner;
