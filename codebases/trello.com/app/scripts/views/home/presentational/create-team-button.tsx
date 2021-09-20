import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLazyComponent } from '@trello/use-lazy-component';
import classNames from 'classnames';
import { Analytics } from '@trello/atlassian-analytics';
import { preloadData } from 'app/src/components/InviteTeamMembers/TeamIllustrationAnimation';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import { HomeTestIds } from '@trello/test-ids';
import {
  ExpandableNavigationItemButtonProps,
  ExpandableNavigationItemIcon,
  ExpandableNavigationItemText,
} from 'app/src/components/ExpandableNavigation';
import styles from './create-team-button.less';

import { forTemplate } from '@trello/i18n';
import { isPaidManagedEnterpriseMember as isPaidManagedEnterpriseMemberSelector } from 'app/gamma/src/selectors/enterprises';
import { State } from 'app/gamma/src/modules/types';
import { Dispatch } from 'app/gamma/src/types';

const l = forTemplate('home');

interface CreateTeamButtonProps {
  fullTab?: boolean;
  enterpriseId?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  dispatch: Dispatch;
}

type CreateTeamButtonStateProps = ExpandableNavigationItemButtonProps & {
  isPaidManagedEnterpriseMember: boolean;
};

type AllProps = CreateTeamButtonProps & CreateTeamButtonStateProps;

const mapStateToProps = (state: State): CreateTeamButtonStateProps => {
  return {
    isPaidManagedEnterpriseMember: isPaidManagedEnterpriseMemberSelector(state),
  };
};

const CreateTeamButtonUnconnected: React.FunctionComponent<AllProps> = ({
  isPaidManagedEnterpriseMember,
  onClick,
  fullTab,
  enterpriseId,
  dispatch,
  ...props
}) => {
  // Just opt paid managed enterprise users out of using the teambuilder altogether
  const canShowTeamBuilder = !isPaidManagedEnterpriseMember;

  useEffect(() => {
    if (canShowTeamBuilder) {
      preloadData();
    }
  });

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

  const closeOverlay = useCallback(() => {
    setShowCreateWorkspaceOverlay(false);
  }, [setShowCreateWorkspaceOverlay]);

  const onClickCreateItem = useCallback(() => {
    setShowCreateWorkspaceOverlay(true);
  }, [setShowCreateWorkspaceOverlay]);

  return (
    <>
      <button
        className={classNames(styles.createTeamButton, {
          [styles.fullTab]: fullTab,
        })}
        data-test-id={HomeTestIds.NavigationCreateTeamButton}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          Analytics.sendClickedButtonEvent({
            buttonName: 'createWorkspaceButton',
            source: 'memberHomeWorkspaceSidebarSection',
            containers: {
              enterprise: {
                id: enterpriseId,
              },
            },
          });

          if (canShowTeamBuilder) {
            onClickCreateItem && onClickCreateItem();
          } else {
            onClick && onClick(e);
          }
        }}
        aria-label={l('home-create-team')}
        {...props}
      >
        <ExpandableNavigationItemIcon iconName="add" />
        {fullTab && (
          <ExpandableNavigationItemText>
            {l('home-create-team')}
          </ExpandableNavigationItemText>
        )}
      </button>
      {showCreateWorkspaceOverlay && (
        <Suspense fallback={null}>
          <CreateWorkspaceOverlay
            teamType={TeamType.Default}
            onClose={closeOverlay}
          />
        </Suspense>
      )}
    </>
  );
};

export const CreateTeamButton = connect(mapStateToProps)(
  CreateTeamButtonUnconnected,
);
