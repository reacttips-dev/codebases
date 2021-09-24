import React from 'react';
import PropTypes from 'prop-types';
import BaseModal, {ButtonPanel} from '../../../library/modals/base/modal';
import {withPortal} from '../../../library/modals/base/portal';
import SimpleButton from '../../../library/buttons/base/simple.jsx';
import CancelButton from '../../../library/buttons/base/cancel.jsx';

const DeleteStage = ({onDismiss, handleSubmit, stage}) => {
  const onCancel = e => {
    e.stopPropagation();
    onDismiss();
  };
  const handleClick = e => {
    e.stopPropagation();
    handleSubmit(stage);
  };
  return (
    <BaseModal title="Confirm" onDismiss={onCancel}>
      <p>Are you sure you want to delete the stage for all tools across your company?</p>
      <ButtonPanel>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
        <SimpleButton onClick={handleClick}>{'Yes, Delete'}</SimpleButton>
      </ButtonPanel>
    </BaseModal>
  );
};

DeleteStage.propTypes = {
  onDismiss: PropTypes.func,
  handleSubmit: PropTypes.func,
  stage: PropTypes.object
};

export default withPortal(DeleteStage);
