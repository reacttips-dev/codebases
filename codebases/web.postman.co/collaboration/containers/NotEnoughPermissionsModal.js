import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../js/components/base/Buttons';
import CloseIcon from '../../js/components/base/Icons/CloseIcon';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '../../js/components/base/Modals';

const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

const CloseButton = styled.div`
    cursor: pointer;
  `;

const NotEnoughPermissionsModal = ({ title, body }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    pm.mediator.on('openNotEnoughPermissionsModal', () => setOpen(true));

    return () => {
      pm.mediator.off('openNotEnoughPermissionsModal', () => setOpen(false));
    };
  }, []);

  return (
    <Modal
      isOpen={open}
      className='not-enough-permissions-modal'
    >
      <ModalHeader>
        <Header>
          {title || 'Unable to Perform Action'}
          <CloseButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </CloseButton>
        </Header>
      </ModalHeader>
      <ModalContent>
        {body || 'You do not have permission to perform this action.'}
      </ModalContent>
      <ModalFooter>
        <Button
          size='small'
          type='primary'
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default NotEnoughPermissionsModal;
