import React from 'react';

import { getMessage, ApiError } from 'bundles/enroll/utils/errorUtils';
import Modal from 'bundles/phoenix/components/Modal';

import 'css!./__styles__/EnrollErrorModal';

const EnrollErrorModal = ({
  onClose,
  error,
  isFinancialAid = false,
  isFreeEnroll = false,
  messageOverride,
}: {
  onClose: () => void;
  error?: ApiError;
  isFinancialAid?: boolean;
  isFreeEnroll?: boolean;
  messageOverride?: string;
}) => {
  const message = messageOverride ? messageOverride : getMessage(error, isFinancialAid, isFreeEnroll);
  return (
    <Modal modalName="EnrollErrorModal" className="rc-EnrollErrorModal" handleClose={onClose} allowClose={true}>
      <p className="m-t-1s m-b-0">{message}</p>
    </Modal>
  );
};

export default EnrollErrorModal;
