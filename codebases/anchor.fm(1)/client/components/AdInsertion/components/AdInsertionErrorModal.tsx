import { css } from 'emotion';
import React from 'react';
import { Modal } from 'screens/EpisodeScreen/components/Modal';
import { ErrorModal } from 'client/screens/EpisodeScreen/components/CuePoints/types';

export function AdInsertionErrorModal({
  dismissErrorModal,
  errorModal,
}: {
  dismissErrorModal: () => void;
  errorModal: ErrorModal;
}) {
  return (
    <Modal
      handleClose={dismissErrorModal}
      primaryButton={{
        copy: 'Ok',
        onClick: dismissErrorModal,
      }}
    >
      <h2
        className={css`
          font-size: 2.2rem;
          font-weight: bold;
          margin: 0 0 8px 0;
        `}
      >
        {errorModal.title}
      </h2>
      <p>{errorModal.body}</p>
    </Modal>
  );
}
