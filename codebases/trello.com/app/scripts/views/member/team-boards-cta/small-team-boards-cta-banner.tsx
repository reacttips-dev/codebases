/* eslint-disable import/no-default-export,jsx-a11y/accessible-emoji */
import { Banner } from 'app/src/components/Banner';
import { forNamespace } from '@trello/i18n';
import React from 'react';

import styles from './small-team-boards-cta-banner.less';

interface SmallCtaProps {
  teamName: string;
  teamBoardsLink: string;
  onDismiss: () => void;
  onClickLink?: React.EventHandler<React.MouseEvent<HTMLElement>>;
}

const SmallBanner = (props: SmallCtaProps) => {
  const format = forNamespace('board section banner');

  return (
    <Banner onDismiss={props.onDismiss} inlinePadding roundedCorners>
      {
        <div className={styles.smallTeamBoardsBanner}>
          <div className={styles.boardsPageEmoji}>👀</div>
          {format('collaborate on boards', {
            teamName: props.teamName,
          })}{' '}
          <a href={props.teamBoardsLink} onClick={props.onClickLink}>
            {format('check them out')}
          </a>
        </div>
      }
    </Banner>
  );
};

export default SmallBanner;
