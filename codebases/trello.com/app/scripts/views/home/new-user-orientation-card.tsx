import React, { Suspense, useCallback, useState } from 'react';
import $ from 'jquery';
import { useLazyComponent } from '@trello/use-lazy-component';
import { Analytics } from '@trello/atlassian-analytics';
import { Auth } from 'app/scripts/db/auth';
import {
  CreateBoardOrientationCard,
  CreateTeamBoardOrientationCard,
} from './presentational/orientation-card';
import { maybeDisplayMemberLimitsError } from 'app/scripts/views/board-menu/member-limits-error';
import { preloadCreateBoardData } from 'app/gamma/src/modules/state/ui/create-menu';
import { useDispatch } from 'react-redux';

interface NewUserOrientationCardProps {
  onHomeTab: boolean;
  onDismissClick?: () => void;
  onCreateBoardClick: (args: { name: string }) => void;
  currentOrg?: {
    id: string;
  };
}

export const NewUserOrientationCard: React.FunctionComponent<NewUserOrientationCardProps> = (
  props,
) => {
  const [boardName, setBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useDispatch();

  const CreateBoardOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-overlay" */ 'app/gamma/src/components/overlays/create-board-overlay'
      ),

    {
      preload: false,
    },
  );

  const [showCreateBoardOverlay, setShowCreateBoardOverlay] = useState(false);

  const closeCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(false);
  }, [setShowCreateBoardOverlay]);

  const openCreateBoardOverlay = useCallback(() => {
    setShowCreateBoardOverlay(true);
  }, [setShowCreateBoardOverlay]);

  const onCreateBoardClick = () => {
    const name = boardName.trim();
    props.onCreateBoardClick({ name });
    return setIsCreating(true);
  };

  const onCreateTeamBoardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (maybeDisplayMemberLimitsError($(e.target), null, Auth.me())) {
      return;
    }

    dispatch(preloadCreateBoardData());
    openCreateBoardOverlay();

    return Analytics.sendClickedButtonEvent({
      buttonName: 'createBoardButton',
      source: 'newUserOrientationCard',
      containers: {
        organization: {
          id: props.currentOrg?.id,
        },
      },
    });
  };

  return (
    <>
      {props.onHomeTab ? (
        <CreateBoardOrientationCard
          // eslint-disable-next-line react/jsx-no-bind
          onCreateBoardClick={onCreateBoardClick}
          onDismissClick={props.onDismissClick}
          boardName={boardName}
          onBoardNameChange={setBoardName}
          autofocus={true}
          inputDisabled={isCreating}
          buttonDisabled={!boardName.trim() || isCreating}
        />
      ) : (
        <CreateTeamBoardOrientationCard
          // eslint-disable-next-line react/jsx-no-bind
          onCreateTeamBoardClick={onCreateTeamBoardClick}
          onDismissClick={props.onDismissClick}
        />
      )}
      {showCreateBoardOverlay && (
        <Suspense fallback={null}>
          <CreateBoardOverlay
            onClose={closeCreateBoardOverlay}
            trackingOpts={{
              method: 'by clicking create a team board button in new user card',
            }}
          />
        </Suspense>
      )}
    </>
  );
};
