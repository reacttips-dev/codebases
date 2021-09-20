import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { sendErrorEvent } from '@trello/error-reporting';
import { isPaidManagedEnterpriseMember } from '@trello/members';
import { Popover, PopoverScreen, usePopover } from '@trello/nachos/popover';
import { Analytics } from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import { CreateTeamPopover } from 'app/gamma/src/components/popovers/create-team';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { useMemberEnterpriseLicensesQuery } from './MemberEnterpriseLicensesQuery.generated';
import styles from './MemberBoardsWorkspacesEmptyState.less';
import { Feature } from 'app/scripts/debug/constants';
import { MemberBoardsTestIds } from '@trello/test-ids';
import { memberId } from '@trello/session-cookie';

const format = forTemplate('member_boards');

enum Screen {
  CreateEnterpriseTeam,
}

export const MemberBoardsWorkspacesEmptyStateUnwrapped: React.FC<object> = () => {
  const CreateWorkspaceOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "gamma-create-team-overlay" */ 'app/gamma/src/components/overlays/create-team-overlay'
      ),

    {
      preload: false,
    },
  );
  const [showCreateWorkspaceOverlay, setShowCreateWorkspaceOverlay] = useState(
    false,
  );

  const openOverlay = useCallback(() => {
    // There are existing analytics for opening the overlay
    setShowCreateWorkspaceOverlay(true);
  }, []);
  const closeOverlay = useCallback(() => {
    Analytics.sendClosedComponentEvent({
      componentType: 'modal',
      componentName: 'createWorkspaceModal',
      source: 'memberBoardsWorkspaceEmptySection',
    });
    setShowCreateWorkspaceOverlay(false);
  }, []);

  const {
    triggerRef,
    toggle,
    hide,
    popoverProps,
  } = usePopover<HTMLButtonElement>({
    initialScreen: Screen.CreateEnterpriseTeam,
  });

  const { data, error } = useMemberEnterpriseLicensesQuery({
    variables: {
      memberId: memberId || '',
    },
  });

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-teamplates',
          feature: Feature.MemberBoardsPage,
        },
      });
    }
  }, [error]);

  const paidEnterpriseMember = isPaidManagedEnterpriseMember({
    confirmed: data?.member?.confirmed,
    idEnterprise: data?.member?.idEnterprise,
    enterpriseLicenses: data?.member?.enterpriseLicenses,
  });
  const showCreateTeam = data?.member && !paidEnterpriseMember;
  const showCreateEnterpriseTeam = !!data?.member?.enterpriseLicenses?.length;

  const onCreateWorkspaceClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'createWorkspaceButton',
      source: 'memberBoardsWorkspaceEmptySection',
    });
    showCreateEnterpriseTeam ? toggle() : openOverlay();
  }, [showCreateEnterpriseTeam, toggle, openOverlay]);

  const onHidePopover = useCallback(() => {
    Analytics.sendClosedComponentEvent({
      componentType: 'inlineDialog',
      componentName: 'createWorkspaceInlineDialog',
      source: 'memberBoardsWorkspaceEmptySection',
    });
    hide();
  }, [hide]);

  return (
    <>
      <p className={styles.text}>
        {format('you-arent-a-member')}{' '}
        {(showCreateTeam || showCreateEnterpriseTeam) && (
          <Button
            onClick={onCreateWorkspaceClick}
            ref={triggerRef}
            appearance="link"
          >
            {format('create-a-workspace')}
          </Button>
        )}
      </p>
      {showCreateWorkspaceOverlay && (
        <div data-test-id={MemberBoardsTestIds.CreateWorkspaceOverlay}>
          <Suspense fallback={null}>
            <CreateWorkspaceOverlay
              teamType={TeamType.Default}
              onClose={closeOverlay}
            />
          </Suspense>
        </div>
      )}
      <Popover {...popoverProps} onHide={onHidePopover}>
        <PopoverScreen id={Screen.CreateEnterpriseTeam}>
          <CreateTeamPopover teamType={TeamType.Enterprise} />
        </PopoverScreen>
      </Popover>
    </>
  );
};

export const MemberBoardsWorkspacesEmptyState: React.FC<object> = () => {
  return (
    <ComponentWrapper>
      <MemberBoardsWorkspacesEmptyStateUnwrapped />
    </ComponentWrapper>
  );
};
