import React from 'react';
import styled from 'styled-components';
import { components } from 'react-select';
import { Icon, Text, IconActionCloseStrokeSmall, Spinner } from '@postman/aether';

const DROPDOWN_LOADING_MARGIN_LEFT = '180px',
  DROPDOWN_LOADING_MARGIN_TOP = '65px';

/**
 * down-arrow icon inside react-select's trigger
 */
function APIDropdownIndicatorIcon (props) {
  return (
    <components.DropdownIndicator {...props}>
      <Icon name='icon-direction-down' />
    </components.DropdownIndicator>
  );
}

// Component to define close icon of MultiSelectChip
const StyledAPIMultiSelectChipCloseIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: ${(props) => props.theme['size-s']};
  width: ${(props) => props.theme['size-s']};
  border-top-right-radius: ${(props) => props.theme['border-radius-default']};
  border-bottom-right-radius: ${(props) =>
    props.theme['border-radius-default']};
  background-color: ${(props) =>
    props.theme['highlight-background-color-tertiary']};

  svg path {
    fill: ${(props) => props.theme['content-color-secondary']};
  }

  &:hover {
    background-color: ${(props) =>
      props.theme['highlight-background-color-tertiary']};
    svg path {
      fill: ${(props) => props.theme['content-color-primary']};
    }
  }
`;

/**
 * custom close icon for api chip
 */
function APIMultiSelectChipCloseIcon (props) {
  return (
    <components.MultiValueRemove {...props}>
      <StyledAPIMultiSelectChipCloseIcon>
        <IconActionCloseStrokeSmall />
      </StyledAPIMultiSelectChipCloseIcon>
    </components.MultiValueRemove>
  );
}

// Component to define the empty state message.
// This component is rendered when no options matches the filter text
const StyledAPIEmptyState = styled.div`
  font-size: ${(props) => props.theme['text-size-m']};
  line-height: ${(props) => props.theme['line-height-m']};
  text-align: center;
  padding: ${(props) =>
    `${props.theme['spacing-xs']} ${props.theme['spacing-m']};`};
  color: ${(props) => props.theme['content-color-secondary']};
  max-height:32px
`,
 StyledLoadingAPI = styled.div`
  margin: ${DROPDOWN_LOADING_MARGIN_TOP} ${DROPDOWN_LOADING_MARGIN_LEFT};
 `;

/**
 * custom component when there is no api
 */
function APIEmptyState (props) {
  const {
    selectProps: { emptyStateMessage }
  } = props;
  return (
    <components.NoOptionsMessage {...props}>
      {emptyStateMessage === 'No APIs found' ? <StyledAPIEmptyState>{emptyStateMessage}</StyledAPIEmptyState> :
       <StyledLoadingAPI><Spinner /></StyledLoadingAPI>
      }
    </components.NoOptionsMessage>
  );
}

const StyledAPIChipLabel = styled(Text)`
  margin: 2px var(--spacing-xs) 2px var(--spacing-s);
  padding: var(--spacing-zero);
  color: var(--content-color-primary);
`;

/**
 * custom component when there is no api
 */
 function APIChipLabel (props) {
  const { children } = props;
  return (
    <StyledAPIChipLabel type='body-medium' isTruncated>
      {children}
    </StyledAPIChipLabel>
  );
}

export {
  APIDropdownIndicatorIcon,
  APIEmptyState,
  APIMultiSelectChipCloseIcon,
  APIChipLabel
};
