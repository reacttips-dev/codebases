/* eslint-disable import/no-default-export */
import { Banner } from 'app/src/components/Banner';
import { ButtonLink } from '@trello/nachos/button';
import React from 'react';

import { N0 } from '@trello/colors';
import { forNamespace } from '@trello/i18n';

import styles from './large-team-boards-cta-banner.less';

interface LargeBannerProps {
  teamName: string;
  teamBoardsLink: string;
  onDismiss: () => void;
  onClickLink?: React.EventHandler<React.MouseEvent<HTMLElement>>;
}

const LargeBanner = (props: LargeBannerProps) => {
  const format = forNamespace('board section banner');

  return (
    <div className={styles.largeTeamBoardsBannerPadding}>
      <Banner
        onDismiss={props.onDismiss}
        bannerColor={N0}
        shadow
        roundedCorners
        alignCloseTop
      >
        <div className={styles.largeTeamBoardsBanner}>
          <div className={styles.teamBoardsBannerImage}>
            <img
              src={require('resources/images/banners/happy-team.svg')}
              width="167"
              height="126"
              alt=""
              role="presentation"
            />
          </div>
          <div className={styles.teamBoardsBannerHeader}>
            <h4>{format('welcome to the team')}</h4>
            <p className={styles.teamBoardsBannerParagraph}>
              {format('all set up', { teamName: props.teamName })}
            </p>
            <div className={styles.teamBoardsButton}>
              <ButtonLink
                link={props.teamBoardsLink}
                isPrimary
                onClick={props.onClickLink}
              >
                {format('see all boards')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Banner>
    </div>
  );
};

export default LargeBanner;
