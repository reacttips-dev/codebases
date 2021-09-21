import { css, Global } from '@emotion/core';
import { css as cssClassName } from 'emotion';
import {
  ConfirmationButtons,
  DeleteModalContainer,
  DeleteModalCopy,
} from 'components/EpisodeEditorPublish/components/InteractivePoll/styles';
import React from 'react';
import { Button } from 'shared/Button/NewButton';
import { Modal } from 'shared/Modal';

export enum ModalActions {
  DELETE_QUESTION = 'DELETE_QUESTION',
  BLOCK_USER = 'BLOCK_USER',
}

export function ConfirmationModal({
  onCancel,
  onConfirm,
  action,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  action: ModalActions;
}) {
  if (!action) return null;
  const actionText =
    action === ModalActions.DELETE_QUESTION
      ? 'delete this question'
      : 'block this user';
  return (
    <Modal
      isShowing
      isShowingCloseButton
      onClickOutside={onCancel}
      onClickClose={onCancel}
      renderContent={() => (
        <>
          <Global
            styles={css`
              .modal.fade .modal-dialog {
                width: 575px;
              }
            `}
          />
          <DeleteModalContainer>
            <DeleteModalCopy>
              <h3>Are you sure you want to {actionText}?</h3>
              <p>{getModalCopy(action)}</p>
            </DeleteModalCopy>
            <ConfirmationButtons>
              <Button type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                className={cssClassName`margin-left: 16px;`}
                kind="button"
                type="button"
                color="purple"
                onClick={onConfirm}
              >
                Yes, {actionText}
              </Button>
            </ConfirmationButtons>
          </DeleteModalContainer>
        </>
      )}
    />
  );
}

function getModalCopy(action: ModalActions) {
  switch (action) {
    case ModalActions.DELETE_QUESTION:
      return 'If you delete this question, we won&apos;t be able to recover it.';
    case ModalActions.BLOCK_USER:
      return 'This user will no longer be able to respond to any questions.';
    default:
      return null;
  }
}
