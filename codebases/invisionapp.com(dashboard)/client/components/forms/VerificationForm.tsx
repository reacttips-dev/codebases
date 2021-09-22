import React from 'react'
import styled from 'styled-components'
import take from 'lodash/take'
import findIndex from 'lodash/findIndex'
import { Text, Spinner } from '@invisionapp/helios'
import CheckIcon from '@invisionapp/helios/icons/Check'
import WarningIcon from '@invisionapp/helios/icons/Warning'

// helpers
const updateAtIndex = (index: number, value: string, list: string[]) => {
  const newList = [...list]
  newList[index] = value
  return newList
}
const isBackspace = (code: number) => code === 8
const focusAndSelectElement = (element: HTMLInputElement) => {
  if (element.type === 'text') {
    element.focus()

    if (element.value.length > 0) {
      element.select()
    }
  }
}

const defaultInputs = () => ['', '', '', '', '', '']

type VerificationFormProps = {
  validating?: boolean
  isValid?: boolean
  hideError?: boolean
  validateCode?: (numbers: string, callback: (isValid: boolean) => void) => void
  validationRequested?: boolean
  onComplete?: () => void
  autoFocus?: boolean
  onSuccess?: (numbers: string) => void
  onError?: (numbers: string) => void
  onChange?: (numbers: string) => void
}

type VerificationFormState = {
  isValid: boolean | null
  validating: boolean
  focusedGroup: number | null
  focusedInput: number | null
  inputs: string[]
}

class VerificationForm extends React.Component<VerificationFormProps, VerificationFormState> {
  static defaultProps = {
    validating: false,
    isValid: false,
    hideError: false,
    validateCode() {},
    validationRequested: false,
    onComplete() {},
    autoFocus: false,
    onSuccess() {},
    onError() {},
    onChange() {}
  }

  constructor(props: VerificationFormProps) {
    super(props)

    this.state = {
      isValid: null,
      validating: false,
      focusedGroup: null,
      focusedInput: null,
      inputs: defaultInputs()
    }
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focusInput(0)
    }
  }

  getFirstEditableInputIndex() {
    const index = findIndex(this.state.inputs, val => val === '')
    return index > -1 ? index : 0
  }

  focusNextInputOrByIndex(nextIndex: number) {
    // Only find first blank input that is before the "next input"
    const index = findIndex(this.state.inputs, val => val === '')

    this.focusInput(index > -1 ? index : nextIndex)
  }

  focusInput(index: number) {
    // @ts-ignore - I have no clue what this error means
    const inputRef = this[`input${index}Ref`]

    if (inputRef) {
      focusAndSelectElement(inputRef)
    }
  }

  focusFirstEmptyInput() {
    const index = findIndex(this.state.inputs, val => val === '')

    if (index !== undefined) {
      this.focusInput(index)
    }
  }

  focusPreviousInput() {
    if (this.state.focusedInput === null) {
      return
    }

    const previousIndex = this.state.focusedInput === 0 ? 0 : this.state.focusedInput - 1

    this.focusInput(previousIndex)
  }

  handleInputChange = (index: number, event: any) => {
    const { value } = event.target as HTMLInputElement

    this.setState(
      state => ({
        inputs: updateAtIndex(index, value, state.inputs),
        isValid: null // Reset validation on every input change
      }),
      () => {
        this.props.onChange?.(this.encodeInputs())

        if (this.areAllInputsValid()) {
          this.validateCode()
        } else if (value !== '') {
          // value can be blank if it is being deleted
          this.focusNextInputOrByIndex(index + 1)
        }
      }
    )
  }

  // Used just to handle the backspace
  handleInputKeyDown = (_: any, event: React.KeyboardEvent) => {
    // This replicates deleting a previous character in a single input
    if (isBackspace(event.keyCode) && (event.target as HTMLInputElement).value === '') {
      this.focusPreviousInput()
    }
  }

  validateCode() {
    const inputs = this.encodeInputs()

    this.setState({ validating: true }, () => {
      this.props.validateCode?.(inputs, isValid => {
        this.setState(
          state => ({
            isValid,
            validating: false,
            inputs: isValid === true ? state.inputs : defaultInputs()
          }),
          () => isValid === false && this.focusInput(0)
        )

        isValid ? this.props.onSuccess?.(inputs) : this.props.onError?.(inputs)
      })
    })
  }

  encodeInputs() {
    return this.state.inputs.join('')
  }

  groupIsFocused(groupNumber: number) {
    return this.state.focusedGroup === groupNumber
  }

  handleInputFocus = (index: number) =>
    this.setState({
      focusedInput: index,
      focusedGroup: index < 3 ? 0 : 1
    })

  handleInputBlur = () => this.setState({ focusedInput: null, focusedGroup: null })

  areAllInputsValid() {
    return this.state.inputs.every(val => val !== '')
  }

  focusFirstEditableInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.preventDefault()

    const target = e.target as HTMLInputElement

    if (target.value !== '') {
      return focusAndSelectElement(target)
    }

    return this.focusInput(this.getFirstEditableInputIndex())
  }

  blurAllInputs() {
    this.state.inputs.forEach((_, index) => {
      // @ts-ignore - ??
      const inputRef = this[`input${index}Ref`]

      if (inputRef) {
        inputRef.blur()
        this.setState({ focusedGroup: null })
      }
    })
  }

  handlePaste(e: ClipboardEvent) {
    // Ignore browsers that don't support clipboard features
    if (!e.clipboardData) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    const newInputs = e.clipboardData
      .getData('text')
      .split('')
      .splice(0, 6)

    const { inputs } = this.state
    const focusedInput = this.state.focusedInput || 0
    const filledInputs = take(inputs, focusedInput)
    const inputsToPasteTo = take(inputs, inputs.length - focusedInput)
    const pastedValues = inputsToPasteTo.map((_, index) => newInputs[index] || '')

    this.setState(
      {
        inputs: filledInputs.concat(pastedValues),
        isValid: null
      },
      () => {
        this.blurAllInputs()

        if (this.areAllInputsValid()) {
          this.validateCode()
          return
        }
        this.focusFirstEmptyInput()
      }
    )
  }

  renderInput(value: string, index: number) {
    return (
      // @ts-ignore
      <Input
        type="text"
        name={index}
        maxLength="1"
        placeholder="0"
        value={value}
        onFocus={() => this.handleInputFocus(index)}
        onKeyDown={e => this.handleInputKeyDown(index, e)}
        onChange={e => this.handleInputChange(index, e)}
        ref={input => {
          // @ts-ignore
          this[`input${index}Ref`] = input
        }}
        autoFocus={this.props.autoFocus && index === 0}
        onPaste={e => this.handlePaste(e as any)}
      />
    )
  }

  render() {
    return (
      // @ts-ignore
      <Wrapper onMouseDown={this.focusFirstEditableInput} onBlur={this.handleInputBlur}>
        <Group
          hasFocus={this.groupIsFocused(0)}
          isValid={this.state.isValid}
          validating={this.state.validating}
          submitted={false}
        >
          {this.renderInput(this.state.inputs[0], 0)}
          {this.renderInput(this.state.inputs[1], 1)}
          {this.renderInput(this.state.inputs[2], 2)}
        </Group>

        <Dash size="larger" order="body">
          &mdash;
        </Dash>

        <Group
          hasFocus={this.groupIsFocused(1)}
          isValid={this.state.isValid}
          validating={this.state.validating}
          submitted={false}
        >
          {this.renderInput(this.state.inputs[3], 3)}
          {this.renderInput(this.state.inputs[4], 4)}
          {this.renderInput(this.state.inputs[5], 5)}

          {this.state.validating && <StyledSpinner />}

          {this.state.isValid === true && !this.state.validating && (
            <StyledCheckIcon glyph="check" fill="info" />
          )}

          {this.state.isValid === false && !this.state.validating && !this.props.hideError && (
            <StyledWarningIcon fill="warning" />
          )}
        </Group>
      </Wrapper>
    )
  }
}

const StyledSpinner = styled(Spinner)`
  position: absolute;
  top: calc(50% - 10px);
  left: calc(100% + 20px);
`

const StyledCheckIcon = styled(CheckIcon)`
  position: absolute;
  top: calc(50% - 10px);
  left: calc(100% + 20px);
`

const StyledWarningIcon = styled(WarningIcon)`
  position: absolute;
  top: calc(50% - 10px);
  left: calc(100% + 20px);
`

const Input = styled.input`
  width: 33.3%;
  height: 70px;
  padding: 12px 11.1%;
  border: 1px solid ${({ theme }) => theme.palette.structure.darker};
  border-right: none;
  border-radius: 0px;
  color: ${({ theme }) => theme.palette.text.regular};
  font-family: ${({ theme }) => theme.fonts.alt};
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.fonts.primaryLight};
  transition: border-color 0.15s ease-in-out;

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-of-type {
    border-right: 1px solid ${({ theme }) => theme.palette.structure.darker};
    border-radius: 0 5px 5px 0;
  }

  &::placeholder {
    color: ${({ theme }) => theme.palette.structure.regular};
    vertical-align: text-center; /* Firefox */
  }
  &::-webkit-input-placeholder {
    line-height: 1.5; /* Safari */
  }

  &:focus {
    outline: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.s}px) {
    width: 33.3%;
    max-width: 55px;
    height: 80px;
    font-size: ${props => props.theme.spacing.xxl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.m}px) {
    width: 33.3%;
    max-width: 80px;
    height: 110px;
    font-size: 3rem;
  }
`

const Group = styled.div<{
  hasFocus: boolean
  isValid: boolean | null
  validating: boolean
  submitted: boolean
}>`
  position: relative;

  ${Input} {
    ${props =>
      props.hasFocus
        ? `border-color: ${props.theme.palette.structure.darker};`
        : null} ${props => {
      // @ts-ignore
      return props.isValid === true && !props.validating
        ? `border-color: ${props.theme.palette.info.regular};`
        : null
    }};
  }

  ${Input}:last-of-type {
    ${props =>
      props.hasFocus
        ? `border-right: 1px solid ${props.theme.palette.structure.darker};`
        : null} ${props =>
      props.isValid === true && !props.validating
        ? `border-color: ${props.theme.palette.info.regular};`
        : null};
  }
`

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const Dash = styled(Text)`
  margin: 0 ${props => props.theme.spacing.sm};
  font-weight: 800;
`

export default VerificationForm
