import { Analytics } from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import React, { useCallback } from 'react';
import styles from './VisualizeInNewWaysCallout.less';

const format = forTemplate('board-views');

const calloutImage = require('resources/images/views/BoardViewsButtonCalloutImage.svg');

interface VisualizeInNewWaysCalloutProps {
  idBoard: string;
  idOrg?: string;
}

export const VisualizeInNewWaysCallout: React.FC<VisualizeInNewWaysCalloutProps> = ({
  idBoard,
  idOrg,
}: VisualizeInNewWaysCalloutProps) => {
  const onClickLearnMore = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'viewsLandingPageLink',
      source: 'boardViewSwitcherCalloutOverlay',
      containers: {
        board: {
          id: idBoard,
        },
        organization: {
          id: idOrg,
        },
      },
    });
  }, [idBoard, idOrg]);

  return (
    <>
      <img
        className={styles.trelloViewsImage}
        alt="TrelloViews"
        src={calloutImage}
      />
      <p className={styles.calloutHeaderText}>
        {format('visualize-your-work-in-new-ways')}
      </p>
      <p className={styles.calloutContentText}>
        {format('get-a-brand-new-perspective')}{' '}
        <a
          href={'https://trello.com/views'}
          target="_blank"
          onClick={onClickLearnMore}
        >
          {format('learn-more')}
        </a>
      </p>
    </>
  );
};
