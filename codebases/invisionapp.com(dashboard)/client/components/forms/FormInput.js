import React from 'react'
import styled from 'styled-components'
import pickBy from 'lodash/pickBy'

import { Input, Label, Spinner, Text, Textarea } from '@invisionapp/helios'
import Check from '@invisionapp/helios/icons/Check'
import Warning from '@invisionapp/helios/icons/Warning'

import Select from '../SelectForm'

const renderValidationIcons = (touched, error, pristine) => {
  if (pristine) {
    return null
  }

  if (touched && !error) {
    return <Check fill="info" />
  }

  if (touched && error) {
    return <Warning fill="warning" size={18} />
  }

  return null
}

const FormInput = ({
  children,
  className,
  label,
  input,
  id,
  inputComponent,
  align,
  meta: { asyncValidating, touched, error, pristine } = {},
  type,
  hideStatusIcon,
  ...rest
}) => {
  let customInput

  if (inputComponent) {
    customInput = React.cloneElement(inputComponent, {
      ...input,
      className: error && 'error'
    })
  }

  const isDefined = value => typeof value !== 'undefined'
  const childProps = pickBy(rest, isDefined)

  return (
    <InputWrapper className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <InputGroup>
        {customInput || (
          <StyledInput
            id={id}
            key="input"
            className={error && 'error'}
            align={align}
            type={type}
            {...input}
            {...childProps}
          />
        )}
        {children}
        {hideStatusIcon !== true && (
          <StatusIcon>
            {asyncValidating ? <Spinner /> : renderValidationIcons(touched, error, pristine)}
          </StatusIcon>
        )}
      </InputGroup>
      {touched && error && (
        <ErrorText order="body" size="smaller" color="danger">
          {error}
        </ErrorText>
      )}
    </InputWrapper>
  )
}

const StyledInput = styled(({ align, ...rest }) => {
  switch (rest.tag) {
    case 'textarea':
      return <Textarea {...rest} />
    case 'select':
      return <StyledSelect {...rest} />
    default:
      return <Input {...rest} />
  }
})`
  ${({ align }) => (align ? `text-align: ${align};` : '')};
`

const StyledSelect = styled(Select)`
  width: 100%;
`

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`
const InputWrapper = styled.div`
  position: relative;
  height: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.m};
`
const StatusIcon = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing.s};
`
const ErrorText = styled(Text)`
  height: 0;
  transform: translateY(4px);
`

export default FormInput
