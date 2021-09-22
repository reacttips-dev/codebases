import React from 'react';
import { P, Button } from '@coursera/coursera-ui';
import Modal from 'bundles/phoenix/components/Modal';
import _t from 'i18n!nls/git';

type Props = {
  onClose: () => void;
  openInvitationPage: () => void;
};

const PendingInvitationModal: React.SFC<Props> = ({ onClose, openInvitationPage }) => (
  <Modal
    className="rc-GitPendingInvitationModal"
    trackingName="git_pending_invitation_modal"
    modalName={_t('Pending Repository Invitation')}
    handleClose={onClose}
  >
    <h2 className="modal-title">{_t('Pending Repository Invitation')}</h2>
    <div>
      <P>
        {_t(
          `You have a pending invitation to this repository. Please click the button below to be taken to a page where
          you can accept this invitation, then return here and launch the repository again.`
        )}
      </P>

      <Button onClick={openInvitationPage}>{_t('Open Invitation')}</Button>
    </div>
  </Modal>
);

export default PendingInvitationModal;
