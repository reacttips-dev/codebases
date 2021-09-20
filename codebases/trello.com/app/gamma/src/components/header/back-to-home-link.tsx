/* eslint-disable import/no-default-export */
import { HouseIcon } from '@trello/nachos/icons/house';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { TrelloStorage } from '@trello/storage';
import { memberId } from '@trello/session-cookie';
import { HeaderTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';
import React from 'react';
import HeaderLink from './header-link';

import styles from './header.less';

const format = forTemplate('header_back_menu_button');

const BackToHomeLink: React.FC = () => {
  return (
    <HeaderLink
      aria-label={format('backToHome')}
      buttonStyle={'headerButton'}
      className={styles.backToHomeLink}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        const cachedRoute = memberId
          ? String(TrelloStorage.get(`home_${memberId}_last_tab_2`))
          : null;
        let tab = '';
        if (cachedRoute === '/') {
          tab = 'home';
        } else if (cachedRoute && cachedRoute.endsWith('/boards')) {
          tab = 'boards';
        } else if (
          cachedRoute &&
          (cachedRoute.endsWith('/home') ||
            cachedRoute.endsWith('/highlights') ||
            cachedRoute.includes('/cards/'))
        ) {
          tab = 'team';
        }

        Analytics.sendClickedButtonEvent({
          buttonName: 'homeHeaderButton',
          source: getScreenFromUrl(),
          attributes: {
            landingTab: tab,
          },
        });
      }}
      href={'/'}
      testId={HeaderTestIds.HomeButton}
    >
      <HouseIcon
        color="light"
        size="medium"
        dangerous_className={styles.headerButtonIcon}
      />
    </HeaderLink>
  );
};

export default BackToHomeLink;
