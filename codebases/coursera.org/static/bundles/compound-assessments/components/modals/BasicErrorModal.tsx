import React from 'react';

import { errorCodes, ErrorCode } from 'bundles/compound-assessments/constants';

import AuthErrorModal from 'bundles/compound-assessments/components/modals/error-modals/AuthErrorModal';
import BadRequestErrorModal from 'bundles/compound-assessments/components/modals/error-modals/BadRequestErrorModal';
import OfflineErrorModal from 'bundles/compound-assessments/components/modals/error-modals/OfflineErrorModal';
import ServerErrorModal from 'bundles/compound-assessments/components/modals/error-modals/ServerErrorModal';
import UnknownErrorModal from 'bundles/compound-assessments/components/modals/error-modals/UnknownErrorModal';

export type Props = {
  errorCode?: ErrorCode | null;
  onPrimaryButtonClick: () => void;
  onCancelButtonClick: () => void;
};

const errorCodeToModal = {
  [errorCodes.AUTH]: AuthErrorModal,
  [errorCodes.BAD_REQUEST]: BadRequestErrorModal,
  [errorCodes.OFFLINE]: OfflineErrorModal,
  [errorCodes.SERVER_ERROR]: ServerErrorModal,
  [errorCodes.UNKNOWN_ERROR]: UnknownErrorModal,
  default: UnknownErrorModal,
};

const BasicErrorModal = ({ errorCode, onPrimaryButtonClick, onCancelButtonClick }: Props) => {
  const Modal = (errorCode && errorCodeToModal[errorCode]) || errorCodeToModal.default;

  return (
    <Modal
      {...{
        onPrimaryButtonClick,
        onCancelButtonClick,
      }}
    />
  );
};

export default BasicErrorModal;
