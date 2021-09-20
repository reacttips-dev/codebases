import React, { useCallback } from 'react';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import { ActionSubjectIdType } from '@trello/atlassian-analytics/src/constants/ActionSubjectId';
import styles from './WorkspaceViewsLink.less';
import { TableIcon } from '@trello/nachos/icons/table';
import { TestId } from '@trello/test-ids';
import { Lozenge } from 'app/src/components/Lozenge';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { isDesktop } from '@trello/browser';

const format = forTemplate('board-views');

interface WorkspaceViewsLinkProps {
  idBoard: string;
  hidePopover: () => void;
  paidStatus?: 'enterprise' | 'bc' | 'standard' | 'free';
  isBeta?: boolean;
  analyticsLinkName: ActionSubjectIdType;
  testId: TestId;
  linkName: string;
  href: string;
}

export const WorkspaceViewsLink: React.FunctionComponent<WorkspaceViewsLinkProps> = ({
  idBoard,
  hidePopover,
  paidStatus,
  isBeta = false,
  analyticsLinkName,
  testId,
  linkName,
  href,
}) => {
  const sendLinkAnalyticsEvent = useCallback(
    (linkName: ActionSubjectIdType, attributes?: object) => {
      Analytics.sendClickedLinkEvent({
        linkName: analyticsLinkName,
        source: 'boardViewsInlineDialog',
        containers: {
          board: {
            id: idBoard,
          },
        },
        ...(attributes && { attributes }),
      });

      hidePopover();
    },
    [analyticsLinkName, hidePopover, idBoard],
  );

  const onLinkClick = useCallback(() => {
    const attributes = {
      isFreeTeam: paidStatus === 'free',
      isStandardTeam: paidStatus === 'standard',
    };
    sendLinkAnalyticsEvent(analyticsLinkName, attributes);
  }, [sendLinkAnalyticsEvent, paidStatus, analyticsLinkName]);

  return (
    <div className={styles.teamTableCell}>
      <RouterLink
        className={styles.linkTile}
        href={href}
        target={!isDesktop() ? '_blank' : undefined}
        onClick={onLinkClick}
        testId={testId}
      >
        <div className={styles.tableThumbnail}>
          <div className={styles.beforeIcon}>
            <TableIcon size="small" />
          </div>
        </div>
        <div className={styles.linkDescription}>
          <div className="linkText">{linkName}</div>
        </div>
        <div className={styles.informationalIcons}>
          {isBeta && (
            <div className={styles.betaLozenge}>
              <Lozenge color="blue">{format('beta')}</Lozenge>
            </div>
          )}
          <div className={styles.linkIcon}>
            <ExternalLinkIcon size="medium" />
          </div>
        </div>
      </RouterLink>
    </div>
  );
};
