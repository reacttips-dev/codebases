import React from 'react';

import { Flex, Text, Icon } from '@postman/aether';
import styled from 'styled-components';

const apiNameMaxWidth = '300px',
  StyledApiListItemContainer = styled(Flex)`
    padding: var(--spacing-xs) var(--spacing-xs) var(--spacing-xs) var(--spacing-m);
  `,
  StyledApiName = styled(Text)`
    padding-left: var(--spacing-s);
    max-width: ${apiNameMaxWidth};
  `;

/**
 * Returns Api list item in Bulk Add Modal
 */
const ApiItem = (props) => {
  const { name } = props;

  return (
    <StyledApiListItemContainer>
      <Icon name='icon-entity-api-stroke' color='content-color-tertiary' />
      <StyledApiName type='body-medium' color='content-color-tertiary' isTruncated>
        {name}
      </StyledApiName>
    </StyledApiListItemContainer>
  );
};

export default ApiItem;
