import React, { useCallback } from 'react';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Button } from '@trello/nachos/button';
import styles from './BoardsListViewsPopoverButton.less';
import { PopoverMenuLink, PopoverMenu } from 'app/src/components/PopoverMenu';
import { forTemplate } from '@trello/i18n';
import { ActionSubjectIdType, Analytics } from '@trello/atlassian-analytics';
import { HomeTestIds } from '@trello/test-ids';
const { DownIcon } = require('@trello/nachos/icons/down');
const { TableIcon } = require('@trello/nachos/icons/table');

const format = forTemplate('boards_list_views_button');

interface BoardsListViewsPopoverButtonProps {
  orgName: string;
  orgId: string;
  canSeeOrgDefaultViews: boolean;
}

export const BoardsListViewsPopoverButton: React.FunctionComponent<BoardsListViewsPopoverButtonProps> = ({
  orgName,
  orgId,
  canSeeOrgDefaultViews,
}) => {
  const { toggle, triggerRef, popoverProps } = usePopover<HTMLButtonElement>();

  const { Controller } = require('app/scripts/controller');
  const myWorkUrl = Controller.getWorkspaceDefaultMyWorkViewUrl(orgName);
  const customViewUrl = Controller.getWorkspaceDefaultCustomViewUrl(orgName);

  const toggleViewsPopover = useCallback(() => {
    toggle();
    Analytics.sendClickedButtonEvent({
      buttonName: 'boardsListViewsPopoverButton',
      containers: {
        organization: {
          id: orgId,
        },
      },
      source: 'memberBoardsHomeScreen',
    });
  }, [orgId, toggle]);

  const sendAnalyticsEvent = useCallback(
    (linkName: ActionSubjectIdType) => {
      return Analytics.sendClickedLinkEvent({
        linkName,
        source: 'memberBoardsHomeScreen',
        containers: {
          organization: {
            id: orgId,
          },
        },
      });
    },
    [orgId],
  );

  const onClickMyWork = useCallback(
    () => sendAnalyticsEvent('organizationMyWorkViewLink'),
    [sendAnalyticsEvent],
  );
  const onClickCustomView = useCallback(
    () => sendAnalyticsEvent('organizationCustomViewLink'),
    [sendAnalyticsEvent],
  );

  return (
    <>
      <Button
        className={styles.boardsPageBoardSectionHeaderOptionsItem}
        ref={triggerRef}
        onClick={toggleViewsPopover}
        role="button"
        data-test-id={HomeTestIds.BoardsListViewsPopoverButton}
        iconBefore={<TableIcon size={'small'} />}
        iconAfter={
          <DownIcon dangerous_className={styles.downIcon} size={'small'} />
        }
      >
        {format('views')}
      </Button>
      <Popover {...popoverProps} noHorizontalPadding size={'small'}>
        <PopoverMenu>
          {canSeeOrgDefaultViews && (
            <PopoverMenuLink
              icon={
                <TableIcon
                  dangerous_className={styles.linkIcon}
                  size={'small'}
                />
              }
              href={myWorkUrl}
              title={format('my-work')}
              data-test-id={HomeTestIds.BoardsListViewsPopoverMyWorkButton}
              onClick={onClickMyWork}
            />
          )}
          <PopoverMenuLink
            icon={
              <TableIcon dangerous_className={styles.linkIcon} size={'small'} />
            }
            href={customViewUrl}
            data-test-id={HomeTestIds.BoardsListViewsPopoverCustomViewButton}
            onClick={onClickCustomView}
            title={format('custom-view')}
          />
        </PopoverMenu>
      </Popover>
    </>
  );
};
