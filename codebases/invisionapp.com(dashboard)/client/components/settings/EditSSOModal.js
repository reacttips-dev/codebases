import { connect } from 'react-redux'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import isMatch from 'lodash/isMatch'
import omit from 'lodash/omit'
import set from 'lodash/set'
import React, { Component } from 'react'
import styled from 'styled-components'
import {
  Alert,
  Button,
  Link,
  LoadingDots,
  Radio,
  Spaced,
  Text,
  Toggle,
  Tooltip
} from '@invisionapp/helios'
import { Tip } from '@invisionapp/helios/icons'
import InfoIcon from '@invisionapp/helios/icons/Info'
import { ERROR_OCCURED, ERROR_SSO_LOAD_FAILED } from '../../helpers/errorMessages'
import { LoginTypes, SAMLSettingsMaxLength } from '../../../shared/constants'
import {
  trackSettingsSSOClosed,
  trackSettingsSSOFailed,
  trackSettingsSSOUpdated
} from '../../helpers/analytics'
import bffRequest from '../../utils/bffRequest'
import CrossFade from '../CrossFade'
import FormInput from '../forms/FormInput'
import Heading from '../modals/Heading'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import ModalContent from '../Modal/ModalContent'
import SelectForm from '../SelectForm'
import SettingsModalSkeleton from './SettingsModalSkeleton'
import SubHeading from '../modals/SubHeading'
import ToggleContent from '../ToggleContent'
import Wrapper from '../modals/Wrapper'
import { roleTypes } from '../../stores/roles'

class EditSSOModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isActive: false,
      isLoading: true,
      isPristine: true,
      isSCIMEnabled: false,
      isUpdating: false,
      loadFailure: null,
      updateFailure: null,
      samlSettings: {
        defaultRoleID: roleTypes.GUEST,
        disableJIT: false,
        certificate: '',
        hashAlgorithm: '',
        idpLoginURL: '',
        idpLogoutURL: '',
        jitMessage: '',
        label: '',
        name: '',
        nameIDFormat: '',
        useAltAuth: false
      }
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    bffRequest.get('/teams/api/team/scim-settings').then(response => {
      this.setState({
        isSCIMEnabled: response?.data?.enabled ?? false
      })
    })

    bffRequest
      .get('/teams/api/team/login-settings')
      .then(response => {
        const initialState = {
          isActive: response?.data?.loginType === LoginTypes.SAML,
          samlSettings: {
            ...(response?.data?.samlSettings ?? {})
          }
        }
        this.setState({ initialState: { ...initialState }, ...initialState, isLoading: false })
      })
      .catch(() => {
        this.setState({ isLoading: false, loadFailure: ERROR_SSO_LOAD_FAILED })
      })
  }

  getCurrentHashAlgorithm() {
    return find(
      this.hashAlgorithmOptions,
      opt => opt.value === this.state.samlSettings.hashAlgorithm
    )
  }

  getSettings() {
    return omit(this.state, [
      'initialState',
      'isLoading',
      'isPristine',
      'isSCIMEnabled',
      'isUpdating',
      'loadFailure',
      'updateFailure'
    ])
  }

  handleChange = (field, fieldValue) => {
    const newState = set(
      {
        isPristine: false,
        samlSettings: { ...this.state.samlSettings }
      },
      field,
      fieldValue
    )
    const oldState = this.state
    this.setState({ ...oldState, ...newState })
  }

  handleClosePortal = () => {
    trackSettingsSSOClosed()
    this.props.closePortal()
  }

  handleSubmit = e => {
    e.preventDefault()

    this.setState({ isUpdating: true })

    if (this.isFormDisabled()) {
      return
    }

    const { isActive } = this.state

    let settings = { isActive }

    if (isActive) {
      settings = this.getSettings()
    }

    bffRequest
      .post('/teams/api/team/login-settings', settings)
      .then(() => {
        trackSettingsSSOUpdated(this.state.initialState, this.getSettings())
        this.props.closePortal()
      })
      .catch(err => {
        trackSettingsSSOFailed()
        this.setState({
          updateFailure: err?.response?.data?.message ?? ERROR_OCCURED
        })
      })
      .finally(() => this.setState({ isUpdating: false }))
  }

  hashAlgorithmOptions = [
    { label: 'SHA-256', value: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256' },
    { label: 'SHA-512', value: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha512' }
  ]

  isActiveStateChanged() {
    return !isMatch(this.getSettings(), this.state.initialState)
  }

  isFormDisabled = () => {
    if (this.state.loadFailure || this.state.isUpdating || this.state.isPristine) {
      return true
    }

    if (this.state.isActive === false) {
      return false
    }

    return this.isRequiredFieldsValid() === false || this.isActiveStateChanged() === false
  }

  // Required Fields: SAML Certificate, Sign-in URL, SSO Button Label, name, Name ID Format
  isRequiredFieldsValid() {
    const { samlSettings } = this.state
    const areSamlFieldsValid =
      this.state.isActive &&
      !isEmpty(samlSettings.certificate) &&
      !isEmpty(samlSettings.idpLoginURL) &&
      !isEmpty(samlSettings.label) &&
      !isEmpty(samlSettings.name) &&
      !isEmpty(samlSettings.nameIDFormat)
    return areSamlFieldsValid
  }

  toggleIsActive = () => {
    this.setState(state => ({
      isActive: !state.isActive,
      isPristine: false
    }))
  }

  tooltipProps = () => {
    if (this.state.isSCIMEnabled) {
      return {
        tooltip: this.state.isActive && [
          'Disabling SSO will also disable',
          <br key="1" />,
          'SCIM provisioning.'
        ]
      }
    }

    return {}
  }

  renderCustomMessage() {
    return (
      <>
        <Spaced bottom="xs" top="m">
          <Text order="label">
            When disabled, users trying to join your team will be directed to request access.{' '}
            Customize that screen in the{' '}
            <Link
              href={`/auth/request-access/settings?originURL=${encodeURIComponent(
                '/teams/settings/sso'
              )}`}
            >
              Request access
            </Link>{' '}
            setting.
          </Text>
        </Spaced>
      </>
    )
  }

  renderInputs() {
    const { samlSettings } = this.state

    return (
      <div>
        <Row>
          <FormInput
            id="name"
            label="Name"
            defaultValue={samlSettings.name}
            isUncontrolled
            onChange={e => this.handleChange('samlSettings.name', e.target.value)}
          />
        </Row>
        <Row>
          <FormInput
            id="idpLoginURL"
            label="Sign-in URL"
            defaultValue={samlSettings.idpLoginURL}
            isUncontrolled
            onChange={e => this.handleChange('samlSettings.idpLoginURL', e.target.value)}
          />
        </Row>
        <Row>
          <FormInput
            id="idpLogoutURL"
            label="Sign-out URL"
            defaultValue={samlSettings.idpLogoutURL}
            isUncontrolled
            onChange={e => this.handleChange('samlSettings.idpLogoutURL', e.target.value)}
          />
        </Row>
        <Row>
          <FormInput
            id="certificate"
            label="SAML Certificate"
            defaultValue={samlSettings.certificate}
            isUncontrolled
            onChange={e => this.handleChange('samlSettings.certificate', e.target.value)}
          />
        </Row>
        <Row>
          <FormInput
            id="name-id-format"
            label="Name ID Format"
            placeholder="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
            defaultValue={samlSettings.nameIDFormat}
            isUncontrolled
            onChange={e => this.handleChange('samlSettings.nameIDFormat', e.target.value)}
          />
        </Row>
        <Row>
          <StyledSelectForm
            id="hash-algorithm"
            isOpen
            label="HASH Algorithm"
            value={this.getCurrentHashAlgorithm()}
            options={this.hashAlgorithmOptions}
            onChange={target => this.handleChange('samlSettings.hashAlgorithm', target.value)}
            clearable={false}
            searchable={false}
          />
        </Row>
        <Row>
          <FormInput
            id="sso-button-label"
            label="SSO Button Label"
            defaultValue={samlSettings.label}
            isUncontrolled
            onChange={e => this.handleChange('samlSettings.label', e.target.value)}
            placeholder="Sign In With SSO"
            maxLength={SAMLSettingsMaxLength}
          />
          <TooltipWrapper>
            <Tooltip color="dark" trigger={<InfoIcon size={18} />}>
              Keep it simple. This is what your teammates see on the sign-in button.
            </Tooltip>
          </TooltipWrapper>
        </Row>
        <BorderedRow noBottomBorder>
          <Toggle
            id="useAltAuth"
            checked={samlSettings.useAltAuth}
            onChange={checked => this.handleChange('samlSettings.useAltAuth', checked)}
          >
            <TooltipLabel order="body">
              Allow users to sign in without SAML
              <IconTooltip trigger={<Tip fill="text-lightest" size={20} />}>
                When enabled, users can sign in to <br />
                your team with an email and password
              </IconTooltip>
            </TooltipLabel>
          </Toggle>
        </BorderedRow>
        <BorderedRow>
          <Toggle
            id="disableJIT"
            checked={!samlSettings.disableJIT}
            onChange={checked => this.handleChange('samlSettings.disableJIT', !checked)}
          >
            <TooltipLabel order="body">
              Allow Just-in-Time provisioning
              <IconTooltip trigger={<Tip fill="text-lightest" size={20} />}>
                Allow authorized users to automatically
                <br /> join the team when they log in.
              </IconTooltip>
            </TooltipLabel>
          </Toggle>
          <Spaced top="s">
            <div data-component="jit-settings">
              {samlSettings.disableJIT ? this.renderCustomMessage() : this.renderRoles()}
            </div>
          </Spaced>
        </BorderedRow>
      </div>
    )
  }

  renderLoading() {
    return <SettingsModalSkeleton />
  }

  renderMain() {
    const { data, isVisible } = this.props
    const { loadFailure, updateFailure } = this.state
    const failureMessage = loadFailure || updateFailure
    const isFormDisabled = this.isFormDisabled()

    return (
      <StyledModalContent
        closePortal={this.handleClosePortal}
        closeWarning={<ModalCloseWarning />}
        isVisible={isVisible}
        showWarning={this.isActiveStateChanged()}
      >
        <Wrapper>
          <Heading order="title" size="smaller" color="text-darker">
            Single sign-on
          </Heading>
          <SubHeading order="subtitle">Turn on SSO for your team</SubHeading>
          {failureMessage && (
            <NotificationWrapper status="danger">{failureMessage}</NotificationWrapper>
          )}
          <FormContainer onSubmit={this.handleSubmit}>
            <ToggleContent
              label={`Require SSO for every member of ${data.teamName}`}
              id="require-sso"
              isOpen={this.state.isActive}
              onToggle={this.toggleIsActive}
              border
              {...this.tooltipProps()}
              disableToggle={failureMessage}
            >
              {!loadFailure && this.renderInputs()}
            </ToggleContent>

            <Row centered>
              <Spaced top="m">
                <Button type="submit" order="primary" size="larger" disabled={isFormDisabled}>
                  {this.state.isUpdating ? <CenteredLoadingDots color="white" /> : 'Update'}
                </Button>
              </Spaced>
            </Row>
          </FormContainer>
        </Wrapper>
      </StyledModalContent>
    )
  }

  renderRoles() {
    const { samlSettings } = this.state
    return (
      <Spaced top="m">
        <Text order="label">
          Select a default role that new users will be added to the team as
        </Text>
        <StyledRadio
          checked={samlSettings.defaultRoleID === roleTypes.GUEST}
          id="defaultRoleGuest"
          name="defaultRoleID"
          onChange={() => this.handleChange('samlSettings.defaultRoleID', roleTypes.GUEST)}
          unstyled
        >
          Guest - Only have access to projects and spaces they are invited to.
        </StyledRadio>
        <StyledRadio
          checked={samlSettings.defaultRoleID === roleTypes.MEMBER}
          id="defaultRoleMember"
          name="defaultRoleID"
          onChange={() => this.handleChange('samlSettings.defaultRoleID', roleTypes.MEMBER)}
          unstyled
        >
          Member - Can preview and join all open projects and spaces.
        </StyledRadio>
      </Spaced>
    )
  }

  render() {
    return (
      <CrossFade fadeKey={this.state.isLoading} fadeMs={250}>
        {this.state.isLoading ? this.renderLoading() : this.renderMain()}
      </CrossFade>
    )
  }
}

const mapStateToProps = state => {
  const { name } = state.team.data

  return {
    data: {
      teamName: name
    }
  }
}

const BorderedRow = styled.div`
  position: relative;
  padding: ${props => props.theme.spacing.s};
  border-top: ${props => `1px solid ${props.theme.palette.structure.lighter}`};
  border-right: 0;
  border-bottom: ${props => {
    const { noBottomBorder, theme } = props
    return noBottomBorder ? 0 : `1px solid ${theme.palette.structure.lighter}`
  }};
  border-left: 0;
  margin-bottom: ${props => {
    const { noBottomBorder, theme } = props
    return noBottomBorder ? 0 : theme.spacing.l
  }};
`

const CenteredLoadingDots = styled(LoadingDots)`
  margin: 0 auto;
`

const NotificationWrapper = styled(Alert)`
  margin-top: ${props => props.theme.spacing.xl};
  margin-bottom: -20px;
`

const IconTooltip = styled(Tooltip)`
  margin-left: 10px;
  text-align: center;
`

const TooltipLabel = styled(Text)`
  display: flex;
  height: 20px;
  flex-items: flex-start;
  line-height: 20px;
`

const TooltipWrapper = styled.div`
  position: absolute;
  top: calc(50% - 13px);
  right: ${props => props.theme.spacing.s};
  width: 18px;
`

const FormContainer = styled.form`
  width: 97%;
  max-width: 540px;
  margin: ${({ theme }) => theme.spacing.xl} auto 0;

  .Select-value-label {
    padding-left: 6px; /* this is 6 pixels to make up for the 10px padding in element */
  }

  .Select-option {
    padding-left: 16px;
  }
`

const Row = styled.div`
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  ${props => (props.centered ? 'text-align: center;' : '')};
`

const StyledRadio = styled(Radio)`
  /* Unfortunately we have to force an override of Helios here */
  margin-top: ${props => props.theme.spacing.xs} !important;
`
const StyledSelectForm = styled(SelectForm)`
  padding-bottom: ${({ theme }) => theme.spacing.m};
  .Select-control {
    height: ${({ theme }) => theme.spacing.l};
  }
`

const StyledModalContent = styled(ModalContent)`
  .modal-content {
    display: block;
  }
`

export default connect(mapStateToProps)(EditSSOModal)
