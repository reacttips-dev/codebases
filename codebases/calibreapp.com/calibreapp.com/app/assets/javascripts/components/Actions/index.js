import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {
  ReorderIcon,
  EditIcon,
  DeleteIcon,
  CopyIcon,
  ResendIcon,
  CrossIcon
} from '../Icon'
import { StyledTextLink } from '../Type'
import { InlineBox } from '../Grid'

const StyledButton = styled(StyledTextLink)`
  font-weight: 600;
  line-height: inherit;
  vertical-align: inherit;
  white-space: nowrap;
`
StyledButton.defaultProps = {
  as: 'button'
}

const DragButton = styled(StyledButton)`
  pointer-events: none;
`
DragButton.defaultProps = {
  as: 'button'
}

const DragDiv = styled.div`
  display: inline-block;
  line-height: 1;
  vertical-align: middle;

  &:hover {
    button {
      color: ${({ theme }) => theme.colors.blue400};
    }
  }
`

export const Reorder = ({ label, variant, ...props }) => (
  <DragDiv {...props}>
    <DragButton variant={variant}>
      <ReorderIcon mt="1px" mr="8px" />
      {label ? label : 'Reorder'}
    </DragButton>
  </DragDiv>
)
Reorder.defaultProps = {
  variant: 'base'
}

export const Edit = ({ label, ...props }) => (
  <InlineBox verticalAlign="middle">
    <StyledButton as={Link} {...props}>
      <EditIcon mt="1px" mr="8px" />
      {label ? label : 'Edit'}
    </StyledButton>
  </InlineBox>
)
Edit.defaultProps = {
  variant: 'base'
}

export const Delete = ({ label, ...props }) => (
  <InlineBox verticalAlign="middle">
    <StyledButton {...props}>
      <DeleteIcon mt="1px" mr="8px" />
      {label ? label : 'Delete'}
    </StyledButton>
  </InlineBox>
)
Delete.defaultProps = {
  variant: 'base'
}

export const Copy = ({ label, ...props }) => (
  <InlineBox lineHeight="1" verticalAlign="middle">
    <StyledButton {...props}>
      <CopyIcon mt="1px" mr="8px" />
      {label ? label : 'Copy'}
    </StyledButton>
  </InlineBox>
)
Copy.defaultProps = {
  variant: 'base'
}

export const Resend = ({ label, ...props }) => (
  <InlineBox verticalAlign="middle">
    <StyledButton {...props}>
      <ResendIcon mt="1px" mr="8px" />
      {label ? label : 'Resend'}
    </StyledButton>
  </InlineBox>
)
Resend.defaultProps = {
  variant: 'base'
}

export const Remove = ({ label, ...props }) => (
  <InlineBox verticalAlign="middle">
    <StyledButton {...props}>
      <CrossIcon mt="3px" mr="8px" />
      {label ? label : 'Remove'}
    </StyledButton>
  </InlineBox>
)
Remove.defaultProps = {
  variant: 'base'
}
