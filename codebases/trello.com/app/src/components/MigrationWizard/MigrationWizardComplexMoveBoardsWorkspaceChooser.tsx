import { Spinner } from '@trello/nachos/spinner';
import { forNamespace, localizeCount } from '@trello/i18n';
import { MigrationWizardComplexCreateWorkspace } from './MigrationWizardComplexCreateWorkspace';
import classNames from 'classnames';
import { PopoverMenu, PopoverMenuButton } from 'app/src/components/PopoverMenu';
import React, { useState } from 'react';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { useAvailableWorkspaces } from './useAvailableWorkspaces';
import styles from './MigrationWizardComplexMoveBoardsWorkspaceChooser.less';
import { Popover, usePopover, PopoverScreen } from '@trello/nachos/popover';

const format = forNamespace(['migration wizard']);

enum PopoverScreens {
  ChooseWorkspace,
  CreateWorkspace,
}

export type SelectedWorkspaceType = ReturnType<
  typeof useAvailableWorkspaces
>['workspaces'][number];

interface MigrationWizardComplexMoveBoardsWorkspaceChooserProps {
  onSelectWorkspace?: (id: string) => void;
  loading: boolean;
  workspaces: ReturnType<typeof useAvailableWorkspaces>['workspaces'];
}

export const MigrationWizardComplexMoveBoardsWorkspaceChooser: React.FC<MigrationWizardComplexMoveBoardsWorkspaceChooserProps> = ({
  onSelectWorkspace,
  loading,
  workspaces,
}) => {
  const {
    popoverProps,
    toggle,
    hide,
    push,
    triggerRef,
  } = usePopover<HTMLButtonElement>({
    initialScreen: PopoverScreens.ChooseWorkspace,
  });
  const [selectedWorkspace, setSelectedWorkspace] = useState({
    id: '',
    displayName: format('start-migration-workspace-dropdown'),
  });

  const selectWorkspace = (workspace: SelectedWorkspaceType) => {
    setSelectedWorkspace({
      id: workspace.id,
      displayName: workspace.displayName,
    });
    onSelectWorkspace?.(workspace.id);
    hide();
  };

  return (
    <>
      <Button
        iconAfter={<DownIcon />}
        className={styles.workspaceListButton}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => toggle()}
        isDisabled={loading}
        ref={triggerRef}
        testId={MigrationWizardTestIds.WorkspaceChooserButton}
      >
        {loading ? <Spinner small /> : selectedWorkspace.displayName}
      </Button>
      <Popover {...popoverProps} hasBackButton>
        <PopoverScreen id={PopoverScreens.ChooseWorkspace} noHorizontalPadding>
          <div className={styles.workspacePopover}>
            <PopoverMenu>
              {workspaces.map((workspace) => (
                <PopoverMenuButton
                  key={workspace.id}
                  title={workspace.displayName}
                  disabled={workspace.numberOfFreeBoardsAvailable === 0}
                  description={
                    workspace.numberOfFreeBoardsAvailable !== null &&
                    workspace.numberOfFreeBoardsAvailable <= 7
                      ? localizeCount(
                          'free-boards-remaining',
                          workspace.numberOfFreeBoardsAvailable,
                        )
                      : null
                  }
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => {
                    selectWorkspace(workspace);
                  }}
                  className={classNames(styles.workspaceOption, {
                    [styles.selected]: selectedWorkspace.id === workspace.id,
                  })}
                  testId={MigrationWizardTestIds.WorkspaceOption}
                />
              ))}
              <PopoverMenuButton
                title={format('popover-menu-title')}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => push(PopoverScreens.CreateWorkspace)}
              />
            </PopoverMenu>
          </div>
        </PopoverScreen>
        <PopoverScreen
          id={PopoverScreens.CreateWorkspace}
          title={format('popover-button-and-title')}
        >
          <MigrationWizardComplexCreateWorkspace
            // eslint-disable-next-line react/jsx-no-bind
            onCreateWorkspace={(workspace) => {
              selectWorkspace(workspace);
            }}
          />
        </PopoverScreen>
      </Popover>
    </>
  );
};
