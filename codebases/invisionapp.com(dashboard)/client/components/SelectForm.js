import React from 'react'
import styled from 'styled-components'
import ReactSelect from 'react-select'
import { Label } from '@invisionapp/helios'
import NavigateUpIcon from '@invisionapp/helios/icons/NavigateUp'
import NavigateDownIcon from '@invisionapp/helios/icons/NavigateDown'
import { GlobalStyle } from './reactSelectStyles'

const renderArrow = ({ isOpen }) => {
  return isOpen ? <NavigateUpIcon /> : <NavigateDownIcon />
}

class SelectForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value
    }
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    if (value !== prevProps.value) {
      // eslint-disable-next-line
      this.setState({ value })
    }
  }

  onBlur() {
    if (!this.props.onBlur) {
      return
    }

    this.props.onBlur({
      type: 'blur',
      target: {
        value: this.state.value
      }
    })
  }

  onChange(value) {
    this.props.onChange({
      type: 'change',
      target: {
        value
      }
    })

    this.setState({ value })
  }

  render() {
    const { id, label, className, ...props } = this.props
    return (
      <>
        <GlobalStyle />
        <InputWrapper className={className}>
          {label && <Label htmlFor={id}>{label}</Label>}
          <StyledSelect
            onChange={e => this.onChange(e)}
            onBlur={() => this.onBlur()}
            {...props}
            {...this.state}
            arrowRenderer={renderArrow}
          />
        </InputWrapper>
      </>
    )
  }
}

SelectForm.defaultProps = {
  className: ''
}

const InputWrapper = styled.div`
  height: 100%;

  input.error {
    border-color: ${({ theme }) => theme.palette.danger.regular};
  }
`

const StyledSelect = styled(ReactSelect)`
  .Select-control {
    height: 54px;
    padding: ${({ theme }) => theme.spacing.xxs};
    border-color: ${({ theme }) => theme.palette.structure.darker};
    background-color: transparent;
    color: ${({ theme }) => theme.palette.text.regular};
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.aktiv};
  }
  /* placehoder (Select...) */
  .Select-placeholder,
  .Select--single > .Select-control .Select-value {
    padding-left: ${({ theme }) => theme.spacing.s};
    color: ${({ theme }) => theme.palette.text.regular};
    line-height: 44px;
  }
  .Select-input > input {
    padding: 0;
    line-height: 44px;
  }
  /* selected value */
  .Select-value-label {
    padding-left: ${({ theme }) => theme.spacing.xxs};
    font-family: ${({ theme }) => theme.fonts.aktiv};
    font-size: 14px;
    line-height: 44px;
  }
  .Select-menu-outer {
    color: ${({ theme }) => theme.palette.text.regularLighter};
    font-family: ${({ theme }) => theme.fonts.aktiv};
    font-size: 14px;
    line-height: 20px;
  }

  svg {
    display: inline-block;
    vertical-align: middle;
  }
`

export default SelectForm
