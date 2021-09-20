import React from 'react';

import { Flex, Text, Icon } from '@postman/aether';
import styled from 'styled-components';

const folderNameMaxWidth = '300px',
  StyledRightDirectionIcon = styled(Icon)`
    visibility: hidden;
  `,
  StyledFolderListItemContainer = styled(Flex)`
    padding: var(--spacing-xs) var(--spacing-xs) var(--spacing-xs) var(--spacing-m);

    &:hover {
      background-color: var(--highlight-background-color-primary);
      cursor: pointer;

      ${StyledRightDirectionIcon} {
        visibility: visible;
      }
    }
  `,
  StyledFolderName = styled(Text)`
    padding-left: var(--spacing-s);
    max-width: ${folderNameMaxWidth};
  `;

/**
 * Returns Folder list item in Bulk Add Modal
 */
const FolderItem = (props) => {
  const { name, id, onFolderClick } = props;

  return (
    <div onClick={() => onFolderClick(id)} title={name}>
      <StyledFolderListItemContainer justifyContent='space-between' alignItems='center'>
        <Flex alignItems='center'>
          <Icon name='icon-entity-folder-stroke' color='content-color-primary' />
          <StyledFolderName type='body-medium' color='content-color-primary' isTruncated>
            {name}
          </StyledFolderName>
        </Flex>
        <StyledRightDirectionIcon name='icon-direction-right' color='content-color-primary' />
      </StyledFolderListItemContainer>
    </div>
  );
};

export default FolderItem;
