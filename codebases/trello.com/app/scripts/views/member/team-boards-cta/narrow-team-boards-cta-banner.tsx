/* eslint-disable import/no-default-export */
import { NarrowBanner } from 'app/src/components/Banner';
import React from 'react';

import { forNamespace } from '@trello/i18n';
import { LinkWrapper } from 'app/src/components/RouterLink/LinkWrapper';

import styles from './small-team-boards-cta-banner.less';

interface NarrowBannerProps {
  teamName: string;
  teamBoardsLink: string;
  onDismiss: () => void;
  onClickLink?: React.EventHandler<React.MouseEvent<HTMLElement>>;
}

export const NarrowTeamBanner = (props: NarrowBannerProps) => {
  const format = forNamespace('board section banner');

  return (
    <div className="narrowBanner">
      <NarrowBanner onDismiss={props.onDismiss} roundedCorners header="👀">
        <div className={styles.boardsMenuBanner}>
          <div className="narrowBannerText">
            {format('collaborate on boards', {
              teamName: props.teamName,
            })}{' '}
            <LinkWrapper
              href={props.teamBoardsLink}
              onClick={props.onClickLink}
            >
              {format('check them out')}
            </LinkWrapper>
          </div>
        </div>
      </NarrowBanner>
    </div>
  );
};
