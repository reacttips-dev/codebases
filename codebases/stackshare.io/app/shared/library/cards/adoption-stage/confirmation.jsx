import React from 'react';
import PropTypes from 'prop-types';
import BaseModal, {ButtonPanel} from '../../../library/modals/base/modal';
import {withPortal} from '../../../library/modals/base/portal';
import SimpleButton from '../../../library/buttons/base/simple.jsx';
import CancelButton from '../../../library/buttons/base/cancel.jsx';

const Confirmation = ({onDismiss, handleSubmit}) => {
  const onCancel = e => {
    e.stopPropagation();
    onDismiss();
  };
  return (
    <BaseModal title="Confirm" onDismiss={onCancel}>
      <p>Are you sure you want to close without saving your changes?</p>
      <ButtonPanel>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
        <SimpleButton onClick={handleSubmit}>{'Yes, Close'}</SimpleButton>
      </ButtonPanel>
    </BaseModal>
  );
};

Confirmation.propTypes = {
  onDismiss: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default withPortal(Confirmation);
