import React, { useEffect, useState } from 'react';
import DottedOptionsSVG from 'components/svgs/DottedOptions';
import { POLL_STATUS } from 'modules/AnchorAPI/v3/episodes/fetchInteractivityPoll';
import { useDeletePoll, useUpdatePoll } from 'hooks/useInteractivityPolls';
import { MenuItemIconWrapper } from 'screens/EpisodeEditorScreen/styles';
import { Icon } from 'shared/Icon';
import { ConfirmationModal } from 'components/EpisodeEditorPublish/components/InteractivePoll/ConfirmationModal';
import {
  CircularIconContainer,
  ThreeDotMenuContainer,
  ThreeDotMenuItem,
} from './styles';

export function ThreeDotMenu({
  episodeId,
  userId,
  status,
}: {
  episodeId: string;
  userId: number;
  status?: POLL_STATUS;
}) {
  const { deletePoll, status: deleteStatus } = useDeletePoll();
  const { updatePoll, status: updateStatus } = useUpdatePoll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<
    'delete' | 'end' | undefined
  >();
  const toggleOpen = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (updateStatus === 'idle' && deleteStatus === 'idle') {
      setConfirmationAction(undefined);
    }
  }, [updateStatus, deleteStatus]);

  return (
    <ThreeDotMenuContainer
      id="three-dot"
      title={<DottedOptionsSVG />}
      noCaret
      pullRight
      onClick={toggleOpen}
      open={isMenuOpen}
    >
      {status && status !== POLL_STATUS.DRAFT && (
        <li role="presentation">
          <ThreeDotMenuItem
            href={`/api/proxy/v3/episodes/webEpisodeId:${episodeId}/poll?results=true`}
            onClick={toggleOpen}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MenuItemIconWrapper>
              <Icon
                type="download"
                fillColor="#CCCDCF"
                isInCircle={false}
                circleColor="#fff"
              />
            </MenuItemIconWrapper>
            View results
          </ThreeDotMenuItem>
        </li>
      )}
      {status === POLL_STATUS.LIVE && (
        <li role="presentation">
          <ThreeDotMenuItem
            onClick={() => {
              setConfirmationAction('end');
              setIsConfirmationOpen(true);
            }}
            type="button"
          >
            <MenuItemIconWrapper>
              <CircularIconContainer>
                <Icon
                  type="x"
                  fillColor="#FFF"
                  isInCircle={true}
                  circleColor="#cccdcf"
                />
              </CircularIconContainer>
            </MenuItemIconWrapper>{' '}
            {updateStatus === 'loading' ? 'Ending poll ...' : 'End Poll'}
          </ThreeDotMenuItem>
        </li>
      )}
      <li role="presentation">
        <ThreeDotMenuItem
          onClick={() => {
            setConfirmationAction('delete');
            setIsConfirmationOpen(true);
          }}
          isWarning={true}
          type="button"
        >
          <MenuItemIconWrapper>
            <Icon
              type="trash"
              fillColor="#CCCDCF"
              isInCircle={false}
              circleColor=""
            />
          </MenuItemIconWrapper>{' '}
          {deleteStatus === 'loading' ? 'Deleting poll ...' : 'Delete Poll'}
        </ThreeDotMenuItem>
      </li>
      {isConfirmationOpen && (
        <ConfirmationModal
          action={confirmationAction}
          onCancel={() => {
            setIsConfirmationOpen(false);
            setIsMenuOpen(false);
          }}
          onConfirm={() => {
            setIsConfirmationOpen(false);
            return confirmationAction === 'end'
              ? onClosePoll()
              : onDeletePoll();
          }}
        />
      )}
    </ThreeDotMenuContainer>
  );

  async function onDeletePoll() {
    try {
      deletePoll(
        { episodeId, userId },
        {
          onSuccess: toggleOpen,
          onError: toggleOpen,
        }
      );
    } catch (e) {
      throw new Error(`Couldn't delete poll; error: ${e}`);
    }
  }

  async function onClosePoll() {
    try {
      updatePoll(
        {
          episodeId,
          poll: {
            closing_date: new Date().getTime(),
          },
        },
        {
          onSuccess: toggleOpen,
          onError: toggleOpen,
        }
      );
    } catch (e) {
      throw new Error(`Couldn't close poll; error: ${e}`);
    }
  }
}
