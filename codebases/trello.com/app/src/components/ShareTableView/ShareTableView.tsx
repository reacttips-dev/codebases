import React, { useRef, useCallback, useEffect, useContext } from 'react';
import styles from './ShareTableView.less';
import { Popover, usePopover, PopoverPlacement } from '@trello/nachos/popover';
import { forTemplate } from '@trello/i18n';
// import { IconButton } from '@trello/nachos/button';
import { Tooltip } from '@trello/nachos/tooltip';
import { CopyIcon } from '@trello/nachos/icons/copy';
import { Button } from '@trello/nachos/button';
import { Analytics } from '@trello/atlassian-analytics';
import { ViewFiltersContext } from 'app/src/components/ViewFilters/ViewFiltersContext';

const format = forTemplate('share_table_view');

interface ShareTableViewProps {
  idOrganization: string;
  isDisabled?: boolean;
  numberBoardsSelected?: number;
  totalMemberFiltersEnabled?: number;
  totalLabelFiltersEnabled?: number;
  totalListFiltersEnabled?: number;
  totalDateFiltersEnabled?: number;
}

export const ShareTableView: React.FunctionComponent<ShareTableViewProps> = function ShareTableView({
  idOrganization,
  isDisabled,
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const { toggle, triggerRef, popoverProps } = usePopover<HTMLButtonElement>();
  const {
    viewFilters: { filters: viewFilters },
  } = useContext(ViewFiltersContext);

  const onClickBookmarkButton = useCallback(() => {
    if (!popoverProps.isVisible) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'bookmarkTableViewButton',
        source: 'multiBoardTableViewScreen',
        containers: {
          organization: {
            id: idOrganization,
          },
        },
        attributes: {
          numberBoardsSelected: viewFilters.boards.filterLength(),
          totalMemberFiltersEnabled: viewFilters.members.filterLength(),
          totalLabelFiltersEnabled: viewFilters.labels.filterLength(),
          totalListFiltersEnabled: viewFilters.list.filterLength(),
          totalDateFiltersEnabled: viewFilters.due.filterLength(),
        },
      });
    }
    toggle();
  }, [toggle, idOrganization, popoverProps.isVisible, viewFilters]);

  const onClickCopyButton = useCallback(() => {
    inputRef.current?.focus();
    document.execCommand('copy');
    Analytics.sendClickedButtonEvent({
      buttonName: 'copyTableViewUrlButton',
      source: 'bookmarkTableViewInlineDialog',
      containers: {
        organization: {
          id: idOrganization,
        },
      },
    });
  }, [idOrganization]);

  useEffect(() => {
    if (popoverProps.isVisible) {
      Analytics.sendScreenEvent({
        name: 'bookmarkTableViewInlineDialog',
        containers: {
          organization: {
            id: idOrganization,
          },
        },
      });
    }
  }, [popoverProps.isVisible, idOrganization]);

  const onFocus: React.FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => e.currentTarget.select(),
    [],
  );

  return (
    <>
      <Button
        className={styles.shareButton}
        onClick={onClickBookmarkButton}
        ref={triggerRef}
        isDisabled={isDisabled}
      >
        {format('bookmark')}
      </Button>
      <Popover
        {...popoverProps}
        dangerous_disableFocusManagement
        placement={PopoverPlacement.BOTTOM_END}
      >
        <div className={styles.desc}>
          {format('bookmark-or-share-link-to-see-this-view')}
        </div>
        <div className={styles.url}>
          <input
            className={styles.urlInput}
            value={location.href}
            readOnly
            ref={inputRef}
            autoFocus
            onFocus={onFocus}
          ></input>
          <Tooltip content={format('copy-to-clipboard')} delay={100}>
            <Button
              className={styles.copy}
              ref={copyButtonRef}
              onClick={onClickCopyButton}
              iconBefore={<CopyIcon />}
            />
          </Tooltip>
        </div>
        <div className={styles.desc2}>
          {format('people-with-this-link-only-see-permissioned-boards')}
        </div>
      </Popover>
    </>
  );
};
