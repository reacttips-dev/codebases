import React, { useState, useEffect, useRef } from 'react';

import { Flex, Icon, TextInput, Button } from '@postman/aether';
import styled from 'styled-components';


const StyledCreateFolderInput = styled(Flex)`
    padding: var(--spacing-xs) var(--spacing-xs) var(--spacing-xs) var(--spacing-m);
  `,
  StyledTextInput = styled(TextInput)`
    input {
      ::placeholder {
        color: var(--content-color-tertiary)
      }
    }
  `;

/**
 * Returns Inline Editor for folder creation along with create and cancel buttons and icon
 */
const CreateFolder = (props) => {
  const [newFolderName, setNewFolderName] = useState(''),
    inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <StyledCreateFolderInput gap='spacing-xs' alignItems='center'>
      <Icon name='icon-entity-folder-stroke' color='content-color-primary' />
      <StyledTextInput ref={inputRef} onChange={(e) => setNewFolderName(e.target.value)} size='small' value={newFolderName} placeholder='Enter a folder name' />
      <Button type='primary' isDisabled={newFolderName === ''} text='Create' size='small' onClick={() => {
          props.handleCreateFolder(newFolderName);
          setNewFolderName('');
        }}
      />
      <Button type='secondary' text='Cancel' size='small' onClick={(newFolderName) => {
          props.onCreateFolderClose(newFolderName);
          setNewFolderName('');
        }}
      />
    </StyledCreateFolderInput>
  );
};

export default CreateFolder;
