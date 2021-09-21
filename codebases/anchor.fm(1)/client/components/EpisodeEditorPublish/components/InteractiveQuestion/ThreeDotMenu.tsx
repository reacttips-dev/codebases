import React, { useState } from 'react';
import DottedOptionsSVG from 'components/svgs/DottedOptions';
import {
  ThreeDotMenuContainer,
  ThreeDotMenuItem,
} from 'components/EpisodeEditorPublish/components/InteractivePoll/styles';
import { useDeleteQuestion } from 'hooks/useInteractivityQnA';
import { MenuItemIconWrapper } from 'screens/EpisodeEditorScreen/styles';
import { Icon } from 'shared/Icon';
import { ConfirmationModal, ModalActions } from './ConfirmationModal';

export function ThreeDotMenu({
  episodeId,
  questionId,
}: {
  episodeId: string;
  questionId: number;
}) {
  const { deleteQuestion, status: deleteStatus } = useDeleteQuestion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const toggleOpen = () => setIsMenuOpen(!isMenuOpen);

  return (
    <ThreeDotMenuContainer
      id="three-dot"
      title={<DottedOptionsSVG />}
      noCaret
      pullRight
      onClick={toggleOpen}
      open={isMenuOpen}
    >
      <li>
        <ThreeDotMenuItem
          onClick={() => {
            setIsConfirmationOpen(true);
          }}
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
          {deleteStatus === 'loading'
            ? 'Deleting question ...'
            : 'Delete question'}
        </ThreeDotMenuItem>
      </li>
      {isConfirmationOpen && (
        <ConfirmationModal
          action={ModalActions.DELETE_QUESTION}
          onCancel={() => {
            setIsConfirmationOpen(false);
            setIsMenuOpen(false);
          }}
          onConfirm={() => {
            setIsConfirmationOpen(false);
            return onDeleteQuestion();
          }}
        />
      )}
    </ThreeDotMenuContainer>
  );

  async function onDeleteQuestion() {
    try {
      deleteQuestion(
        { episodeId, questionId },
        {
          onSuccess: toggleOpen,
          onError: toggleOpen,
        }
      );
    } catch (e) {
      throw new Error(`Couldn't delete question; error: ${e}`);
    }
  }
}
