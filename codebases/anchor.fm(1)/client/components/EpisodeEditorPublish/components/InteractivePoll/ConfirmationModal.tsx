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

export function ConfirmationModal({
  onCancel,
  onConfirm,
  action,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  action?: 'delete' | 'end';
}) {
  if (!action) return null;
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
              <h3>Are you sure you want to {action} this poll?</h3>
              <p>
                {action === 'delete'
                  ? "If you delete this poll, we won't be able to recover it."
                  : 'You can always republish this poll at a later date.'}
              </p>
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
                Yes, {action} this poll
              </Button>
            </ConfirmationButtons>
          </DeleteModalContainer>
        </>
      )}
    />
  );
}
