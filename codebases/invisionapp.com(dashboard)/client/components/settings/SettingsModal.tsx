import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Button, Spaced, LoadingDots } from '@invisionapp/helios'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import { showFlash } from '../../stores/flash'
import Wrapper from '../modals/Wrapper'
import Heading from '../modals/Heading'
import SubHeading from '../modals/SubHeading'
import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import { Table, Row, PaddedColumn, RoleContainer } from '../tables/Table'
import SettingsModalSkeleton from './SettingsModalSkeleton'
import CrossFade from '../CrossFade'
import { Team } from '../../stores/team'
import { AppState } from '../../stores/index'

type SettingsModalProps = {
  initialFields: Promise<Fields>
  team: Team
  closePortal: () => void
  onValidate?: (fields: Fields) => void
  onSubmit: (fields: Fields) => Promise<string>
  autoClose?: boolean
  notifySuccess: (message: string) => void
  notifyError: (message: string) => void
  heading?: string | ((team: Team) => string)
  subheading?: string | ((team: Team) => string)
  children: (helpers: any) => React.ReactChildren
  renderCustom?: (helpers: any) => any
  isVisible?: boolean
  showCustom?: boolean
}

type SettingsModalState = {
  formState: FormState
  fields: Fields
  initialFields: {
    [key: string]: any
  }
  errors: any
}

type Fields = any

type FormState =
  | 'validationErrors'
  | 'remoteErrors'
  | 'loading'
  | 'editing'
  | 'updated'
  | 'submitting'

class SettingsModal extends React.PureComponent<SettingsModalProps, SettingsModalState> {
  static Row = Row

  static Label = styled(PaddedColumn)`
    white-space: normal;
  `

  static Field = styled(RoleContainer)`
    align-self: center;
    padding-left: ${props => props.theme.spacing.m};
  `

  static defaultProps = {
    autoClose: true
  }

  constructor(props: SettingsModalProps) {
    super(props)

    this.state = {
      formState: 'loading',
      fields: {},
      initialFields: {},
      errors: {}
    }

    this.props.initialFields.then(fields => {
      this.setState({
        initialFields: { ...fields },
        fields,
        formState: 'editing'
      })
    })
  }

  getChildProps() {
    let form

    switch (this.state.formState) {
      case 'validationErrors':
      case 'remoteErrors': {
        form = {
          state: this.state.formState,
          getFields: () => this.state.fields,
          errors: this.state.errors
        }
        break
      }
      case 'loading':
      case 'editing':
      case 'updated':
      case 'submitting':
      default: {
        form = { state: this.state.formState, getFields: () => this.state.fields }
      }
    }

    return {
      setFields: this.setFields,
      form,
      team: this.props.team
    }
  }

  setFields = (fields: Fields) => {
    this.setState(state => ({
      fields: {
        ...state.fields,
        ...fields
      }
    }))
  }

  canSubmitForm() {
    switch (this.state.formState) {
      case 'editing': {
        return isEqual(this.state.initialFields, this.state.fields)
      }
      case 'loading':
      case 'submitting':
      case 'updated': {
        return true
      }
      default: {
        return false
      }
    }
  }

  closeModal() {
    this.props.closePortal()
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const { fields } = this.state
    const errors =
      typeof this.props.onValidate === 'function' ? this.props.onValidate(fields) : {}

    // Has validation errors
    if (!isEmpty(errors)) {
      return this.setState({
        errors,
        formState: 'validationErrors'
      })
    }

    // NOTE: form state progres: submitting -> updated || remoteErrors
    return this.setState({ errors: {}, formState: 'submitting' }, () =>
      this.props
        .onSubmit(fields)
        .then(successMessage => {
          this.setState({ formState: 'updated' }, () => {
            setTimeout(() => {
              if (this.props.autoClose) {
                this.closeModal()
              } else {
                this.setState({ formState: 'editing' })
              }

              this.props.notifySuccess(successMessage)
            }, 800) // NOTE: delay for 1 second for UI feedback
          })
        })
        .catch(error => {
          this.props.notifyError('There was a problem saving your settings. Please try again.')
          this.setState({
            formState: 'remoteErrors',
            errors: error.data
          })
        })
    )
  }

  showUnsavedChangesWarning() {
    return !this.canSubmitForm()
  }

  renderButtonText() {
    switch (this.state.formState) {
      case 'submitting': {
        return <StyledLoadingDots color="white" />
      }
      case 'updated': {
        return <StyledLoadingDots color="white" loaded />
      }
      default: {
        return 'Update'
      }
    }
  }

  renderHeading() {
    switch (typeof this.props.heading) {
      case 'undefined': {
        return null
      }
      case 'function': {
        return (
          <Heading order="title" size="smaller" color="text-darker">
            {this.props.heading(this.props.team)}
          </Heading>
        )
      }
      default: {
        return (
          <Heading order="title" size="smaller" color="text-darker">
            {this.props.heading}
          </Heading>
        )
      }
    }
  }

  renderSubheading() {
    switch (typeof this.props.subheading) {
      case 'undefined': {
        return null
      }
      case 'function': {
        return <SubHeading size="larger">{this.props.subheading(this.props.team)}</SubHeading>
      }
      default: {
        return <SubHeading size="larger">{this.props.subheading}</SubHeading>
      }
    }
  }

  renderLoading() {
    return <SettingsModalSkeleton />
  }

  renderForm() {
    return (
      <>
        {this.renderHeading()}
        {this.renderSubheading()}
        <FormContainer onSubmit={this.handleSubmit}>
          <Table>{this.props.children(this.getChildProps())}</Table>
          <ButtonRow centered>
            <Spaced top="m">
              <Button
                type="submit"
                order="primary"
                size="larger"
                disabled={this.canSubmitForm()}
              >
                {this.renderButtonText()}
              </Button>
            </Spaced>
          </ButtonRow>
        </FormContainer>
      </>
    )
  }

  renderContent() {
    const customComponent = this.props.renderCustom?.({
      teamName: this.props.team.name,
      ...this.getChildProps()
    })

    return this.props.showCustom === true ? customComponent : this.renderForm()
  }

  render() {
    return (
      <ModalContent
        closePortal={this.props.closePortal}
        // @ts-ignore
        closeWarning={<ModalCloseWarning />}
        isVisible={this.props.isVisible}
        showWarning={this.showUnsavedChangesWarning()}
        closeButton={!this.props.showCustom}
      >
        <Wrapper>
          <CrossFade
            fadeKey={(
              this.state.formState === 'loading' || !!this.props.showCustom
            ).toString()}
            fadeMs={250}
          >
            {this.state.formState === 'loading' ? this.renderLoading() : this.renderContent()}
          </CrossFade>
        </Wrapper>
      </ModalContent>
    )
  }
}

const FormContainer = styled.form`
  width: 97%;
  max-width: 620px;
  margin: ${({ theme }) => theme.spacing.xl} auto 0;
`

const ButtonRow = styled.div<{ centered: boolean }>(
  props => `
  padding: ${props.theme.spacing.l} 0 ${props.theme.spacing.xs} 0;
  ${props.centered ? 'text-align: center;' : ''};
  position: relative;
`
)

const StyledLoadingDots = styled(LoadingDots)`
  margin: 0 auto;
`

const mapStateToProps = (state: AppState) => {
  return {
    team: state.team
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  notifySuccess(message: string) {
    dispatch(showFlash({ message, status: 'success' }))
  },
  notifyError(message: string) {
    dispatch(showFlash({ message, status: 'danger' }))
  }
})

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal)
