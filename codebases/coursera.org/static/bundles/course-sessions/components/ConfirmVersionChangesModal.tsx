import React from 'react';
import Modal from 'bundles/phoenix/components/Modal';

import BranchSwitchInfo from 'bundles/course-sessions/components/BranchSwitchInfo';

import { CmlContent } from 'bundles/cml/types/Content';

import _t from 'i18n!nls/course-sessions';

type Props = {
  handleConfirm: () => void;
  handleClose: () => void;
  changesDescription?: CmlContent;
  courseId: string;
};

const ConfirmVersionChangesModal = (props: Props) => {
  const { handleConfirm, handleClose, changesDescription, courseId } = props;

  return (
    <Modal handleClose={handleClose} modalName={_t('Confirm Version Changes')}>
      <div className="vertical-box align-items-absolute-center" style={{ height: '300px' }}>
        <BranchSwitchInfo handleConfirm={handleConfirm} changesDescription={changesDescription} courseId={courseId} />
      </div>
    </Modal>
  );
};

export default ConfirmVersionChangesModal;
