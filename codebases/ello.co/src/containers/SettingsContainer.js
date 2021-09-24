import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import debounce from 'lodash/debounce'
import { preferenceToggleChanged } from '../helpers/junk_drawer'
import { openModal, closeModal } from '../actions/modals'
import { logout } from '../actions/authentication'
import {
  availableToggles,
  blockedUsers,
  checkAvailability,
  deleteProfile,
  exportData,
  loadProfile,
  mutedUsers,
  saveAvatar,
  saveCover,
  saveProfile,
} from '../actions/profile'
import Emoji from '../components/assets/Emoji'
import { SettingsLink } from '../components/buttons/Buttons'
import AdultPostsDialog from '../components/dialogs/AdultPostsDialog'
import DeleteAccountDialog from '../components/dialogs/DeleteAccountDialog'
import EmailControl from '../components/forms/EmailControl'
import FormButton from '../components/forms/FormButton'
import PasswordControl from '../components/forms/PasswordControl'
import UsernameControl from '../components/forms/UsernameControl'
import Preference from '../components/forms/Preference'
import {
  getUsernameStateFromClient,
  getUsernameStateFromServer,
  getEmailStateFromClient,
  getEmailStateFromServer,
  getPasswordState,
} from '../components/forms/Validators'
import Uploader from '../components/uploaders/Uploader'
import Avatar from '../components/assets/Avatar'
import BackgroundImage from '../components/assets/BackgroundImage'
import TreeButton from '../components/navigation/TreeButton'
import TreePanel from '../components/navigation/TreePanel'
import StreamContainer from '../containers/StreamContainer'
import InfoForm from '../components/forms/InfoForm'
import { MainView } from '../components/views/MainView'
import { PREFERENCES, SETTINGS } from '../constants/locales/en'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import CreatorTypeContainer from '../containers/CreatorTypeContainer'
import { isElloAndroid } from '../lib/jello'
import { profilePath } from '../networking/api'
import { selectDPI, selectIsMobile } from '../selectors/gui'
import {
  selectAvailability,
  selectBlockedCount,
  selectMutedCount,
} from '../selectors/profile'
import { css } from '../styles/jss'
import * as s from '../styles/jso'

const creatorTypeStyle = css(
  s.my20,
)

function getOriginalAssetUrl(asset) {
  return (
    asset && asset.original && asset.original.url ?
      <a
        href={asset.original.url}
        rel="noopener noreferrer"
        target="_blank"
      >
      View original image
      </a> :
      <span>&mdash;</span>
  )
}

function renderStatus(message) {
  if (message) {
    return () => <p>{message}</p>
  }
  return null
}

function mapStateToProps(state) {
  return {
    availability: selectAvailability(state),
    blockedCount: selectBlockedCount(state) || 0,
    dpi: selectDPI(state),
    isMobile: selectIsMobile(state),
    mutedCount: selectMutedCount(state) || 0,
    profile: state.profile,
  }
}

class SettingsContainer extends PureComponent {

  static propTypes = {
    availability: PropTypes.object,
    blockedCount: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    mutedCount: PropTypes.number.isRequired,
    profile: PropTypes.object,
  }

  static defaultProps = {
    availability: null,
  }

  componentWillMount() {
    const { dispatch, profile } = this.props
    this.state = {
      categoryIds: [],
      currentPasswordState: { status: STATUS.INDETERMINATE, message: '' },
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      usernameState: { status: STATUS.INDETERMINATE, suggestions: null, message: '' },
      emailState: { status: STATUS.INDETERMINATE, message: '' },
    }
    this.passwordValue = ''
    this.passwordCurrentValue = ''
    this.emailValue = profile.get('email')
    this.usernameValue = profile.get('username')
    this.checkServerForAvailability = debounce(this.checkServerForAvailability, 666)
    dispatch(loadProfile())
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.profile.get('errors') && nextProps.profile.get('errors')) {
      const attrs = nextProps.profile.getIn(['errors', 'attrs'])
      if (attrs) {
        const obj = {}
        attrs.keySeq().forEach((attr) => {
          obj[`${attr}State`] = { status: STATUS.FAILURE, message: attrs.get(attr) }
        })
        this.setState(obj)
      }
    } else if (this.props.profile.get('errors') && !nextProps.profile.get('errors')) {
      const obj = {};
      ['currentPassword', 'email', 'password', 'username'].forEach((attr) => {
        obj[`${attr}State`] = { status: STATUS.INDETERMINATE, message: '', suggestions: [] }
      })
      this.setState(obj)
    }
    const { availability } = nextProps
    if (!availability) { return }
    const prevUsername = availability.getIn(['original', 'username'], this.usernameValue)
    const prevEmail = availability.getIn(['original', 'email'], this.emailValue)
    if (availability.has('username') && prevUsername === this.usernameValue) {
      this.validateUsernameResponse(availability)
    }
    if (availability.has('email') && prevEmail === this.emailValue) {
      this.validateEmailResponse(availability)
    }
  }

  onLogOut = () => {
    const { dispatch } = this.props
    dispatch(logout())
  }

  onChangeUsernameControl = ({ username }) => {
    this.usernameValue = username
    const { profile } = this.props
    if (username === profile.get('username')) {
      this.setState({
        usernameState: {
          status: STATUS.INDETERMINATE,
          suggestions: null,
          message: '',
        },
      })
      return
    }
    const { usernameState } = this.state
    const currentStatus = usernameState.status
    const clientState = getUsernameStateFromClient({ value: username, currentStatus })
    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ usernameState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateUsernameResponse` after fetching
      this.checkServerForAvailability({ username })
      return
    }
    this.setState({ usernameState: clientState })
  }

  onChangeEmailControl = ({ email }) => {
    this.emailValue = email
    const { profile } = this.props
    if (email === profile.get('email')) {
      this.setState({ emailState: { status: STATUS.INDETERMINATE, message: '' } })
      return
    }
    const { emailState } = this.state
    const currentStatus = emailState.status
    const clientState = getEmailStateFromClient({ value: email, currentStatus })
    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ emailState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateEmailResponse` after fetching
      this.checkServerForAvailability({ email })
      return
    }
    this.setState({ emailState: clientState })
  }

  onChangePasswordControl = ({ password }) => {
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    this.setState({ passwordState: newState })
  }

  onChangeCurrentPasswordControl = (vo) => {
    this.passwordCurrentValue = vo.current_password
  }

  onClickRequestDataExport = () => {
    const { dispatch } = this.props
    dispatch(exportData())
    this.exportButton.disabled = true
    this.exportButton.innerHTML = 'Exported'
  }

  onClickDeleteAccountModal = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <DeleteAccountDialog
        onConfirm={this.onConfirmAccountWasDeleted}
        onDismiss={this.closeModal}
      />
      , 'isDangerZone'))
  }

  onConfirmAccountWasDeleted = () => {
    const { dispatch } = this.props
    dispatch(deleteProfile())
  }

  onSubmit = (e) => {
    const { dispatch } = this.props
    e.preventDefault()
    const formData = {
      current_password: this.passwordCurrentValue,
      email: this.emailValue,
      password: this.passwordValue,
      username: this.usernameValue,
    }
    this.clearPasswords()
    this.setState({
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      usernameState: { status: STATUS.INDETERMINATE, suggestions: null, message: '' },
    })
    dispatch(saveProfile(formData))
  }

  onTogglePostsAdultContent = (obj) => {
    if (obj.postsAdultContent) {
      const { dispatch } = this.props
      dispatch(openModal(
        <AdultPostsDialog
          onConfirm={this.closeModal}
        />,
      ))
    }
    preferenceToggleChanged(obj)
  }

  getExternalLinkListAsText() {
    const { profile } = this.props
    return (
      profile.get('externalLinksList').toJS().map((link, i) =>
        (<a
          href={link.url}
          target="_blank"
          key={`settingslinks_${link.text}_${i + 1}`}
          rel="noopener noreferrer"
          style={{ marginRight: `${5 / 16}rem` }}
        >
          {link.text}
        </a>),
      )
    )
  }

  shouldRequireCredentialsSave() {
    const { currentPasswordState, emailState, passwordState, usernameState } = this.state
    const credentialsSuccess = [emailState, passwordState, usernameState].some(state =>
      state.status === STATUS.SUCCESS,
    )
    return currentPasswordState.status === STATUS.FAILURE || credentialsSuccess
  }

  clearPasswords() {
    this.newPasswordControl.clear()
    this.currentPasswordControl.clear()
  }

  checkServerForAvailability(vo) {
    this.props.dispatch(checkAvailability(vo))
  }

  validateUsernameResponse(availability) {
    const { usernameState } = this.state
    const currentStatus = usernameState.status
    const newState = getUsernameStateFromServer({ availability, currentStatus })
    this.setState({ usernameState: newState })
  }

  validateEmailResponse(availability) {
    const { emailState } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromServer({ availability, currentStatus })
    this.setState({ emailState: newState })
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  render() {
    const { blockedCount, dispatch, dpi, isMobile, mutedCount, profile } = this.props
    const { currentPasswordState, emailState, passwordState, usernameState } = this.state
    const requiresSave = this.shouldRequireCredentialsSave()
    const allowNSFWToggle = !isElloAndroid()

    if (!profile) { return null }

    const mdash = <span>&mdash;</span>
    const boxControlClassNames = 'isBoxControl onGrey'

    return (
      <MainView className="Settings">
        <div className="SettingsCoverPicker">
          <Uploader
            className="isCoverUploader"
            kind="coverImage"
            line1="2560 x 1440"
            line2="Animated Gifs work too"
            line3={isMobile ? null : 'Drag & Drop'}
            saveAction={bindActionCreators(saveCover, dispatch)}
            title="Upload Header"
          />
          <BackgroundImage
            className="hasOverlay6 inSettings"
            dpi={dpi}
            sources={profile.get('coverImage')}
            useGif
          />
        </div>

        <div className="SettingsBody">
          <div className="SettingsAvatarPicker" >
            <Uploader
              className="isAvatarUploader isSettingsAvatarUploader isLGUploader"
              kind="avatar"
              line1="360 x 360"
              line2="Animated Gifs work too"
              line3={isMobile ? null : 'Drag & Drop'}
              saveAction={bindActionCreators(saveAvatar, dispatch)}
              title="Upload Avatar"
            />
            <Avatar
              className="isLarge"
              size="large"
              sources={profile.get('avatar')}
              useGif
            />
          </div>

          <div className="SettingsRight">
            <header className="SettingsHeader">
              <h1 className="SettingsHeading">Profile</h1>
              <p>
                Your username, name, bio and links appear on your public Ello
                profile. Your email address remains private.
              </p>
            </header>

            <form
              action={profilePath().path}
              className="SettingsForm"
              method="POST"
              noValidate="novalidate"
              onSubmit={this.onSubmit}
            >
              <UsernameControl
                classList={boxControlClassNames}
                label="Username"
                onChange={this.onChangeUsernameControl}
                renderStatus={renderStatus(usernameState.message)}
                status={usernameState.status}
                suggestions={usernameState.suggestions}
                tabIndex="1"
                text={profile.get('username')}
              />
              <EmailControl
                classList={boxControlClassNames}
                label="Email"
                onChange={this.onChangeEmailControl}
                renderStatus={renderStatus(emailState.message)}
                status={emailState.status}
                tabIndex="2"
                text={profile.get('email')}
              />
              <PasswordControl
                classList={boxControlClassNames}
                label="Password"
                onChange={this.onChangePasswordControl}
                placeholder="Set a new password"
                renderStatus={renderStatus(passwordState.message)}
                ref={(comp) => { this.newPasswordControl = comp }}
                status={passwordState.status}
                tabIndex="3"
              />
              <div className={classNames('SettingsCredentialActions', { requiresSave })}>
                <p>To save changes you must re-enter your current Ello password.</p>
                <PasswordControl
                  classList={boxControlClassNames}
                  id="current_password"
                  label="Password - Please enter your current one."
                  name="user[current_password]"
                  onChange={this.onChangeCurrentPasswordControl}
                  placeholder="Enter current password"
                  ref={(comp) => { this.currentPasswordControl = comp }}
                  status={currentPasswordState.status}
                  tabIndex={requiresSave ? '4' : '0'}
                />
                <FormButton className="FormButton isRounded" disabled={!requiresSave}>
                  Save
                </FormButton>
              </div>
            </form>

            <InfoForm
              className="SettingsInfoForm"
              controlClassModifiers={boxControlClassNames}
              tabIndexStart={requiresSave ? 5 : 4}
            />

            <p className="SettingsLinks">
              <SettingsLink to={`/${profile.get('username')}`}>View profile</SettingsLink>
              <SettingsLink to="/invitations">Invite people</SettingsLink>
            </p>

            <div className="SettingsPreferences">
              <div>
                <TreeButton key="settingLabel_Creator Type">Creator Type</TreeButton>
                <TreePanel key="settingItems_Creator Type">
                  <div className={creatorTypeStyle}>
                    <CreatorTypeContainer
                      classModifier="inSettings"
                    />
                  </div>
                </TreePanel>
              </div>
              <StreamContainer
                action={availableToggles()}
              />

              {allowNSFWToggle ?
                <div>
                  <TreeButton>NSFW</TreeButton>
                  <TreePanel>
                    <Preference
                      definition={PREFERENCES.NSFW_VIEW}
                      id="viewsAdultContent"
                      isChecked={profile.get('viewsAdultContent')}
                      onToggleChange={preferenceToggleChanged}
                    />
                    <Preference
                      definition={PREFERENCES.NSFW_POST}
                      id="postsAdultContent"
                      isChecked={profile.get('postsAdultContent')}
                      onToggleChange={this.onTogglePostsAdultContent}
                    />
                    <p><em>{SETTINGS.NSFW_DISCLAIMER}</em></p>
                  </TreePanel>
                </div> :
                null}

              {blockedCount > 0 ?
                <div>
                  <TreeButton>Blocked users</TreeButton>
                  <TreePanel>
                    <StreamContainer
                      action={blockedUsers()}
                      className="BlockedUsers"
                      paginatorText="Load More"
                      shouldInfiniteScroll={false}
                    />
                  </TreePanel>
                </div> :
                null}

              {mutedCount > 0 ?
                <div>
                  <TreeButton>Muted users</TreeButton>
                  <TreePanel>
                    <StreamContainer
                      action={mutedUsers()}
                      className="MutedUsers"
                      paginatorText="Load More"
                      shouldInfiniteScroll={false}
                    />
                  </TreePanel>
                </div> :
                null}

              <TreeButton>Your Data</TreeButton>
              <TreePanel>
                <p className="SettingsDataDescription">{SETTINGS.YOUR_DATA_DESC}</p>
                <dl className="SettingsDefinitionValues">
                  <dt>Username:</dt>
                  <dd>{`@${profile.get('username')}`}</dd>
                  <dt>Name:</dt>
                  <dd>{profile.get('name') || mdash}</dd>
                  <dt>Short Bio:</dt>
                  <dd>{profile.get('shortBio') || mdash}</dd>
                  <dt>Links:</dt>
                  <dd>
                    {!profile.get('externalLinksList', Immutable.List()).isEmpty() ?
                      this.getExternalLinkListAsText() :
                      mdash}
                  </dd>
                  <dt>Avatar:</dt>
                  <dd>{getOriginalAssetUrl(profile.get('avatar'))}</dd>
                  <dt>Header:</dt>
                  <dd>{getOriginalAssetUrl(profile.get('coverImage'))}</dd>
                </dl>
                <div className="SettingsCell">
                  <dl className="SettingsDefinition">
                    <dt>Export Data</dt>
                    <dd>
                      This includes all of the content you have posted on Ello.
                      We will email you a link to download your data.
                    </dd>
                  </dl>
                  {profile.get('dataExport') ?
                    <a
                      className="SettingsButton"
                      href={profile.get('dataExport')}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Download Export
                    </a> :
                    <button
                      className="SettingsButton"
                      onClick={this.onClickRequestDataExport}
                      ref={(comp) => { this.exportButton = comp }}
                    >
                        Request Export
                    </button>
                  }
                </div>
              </TreePanel>

              <TreeButton>Account Deletion</TreeButton>
              <TreePanel>
                <div className="SettingsCell">
                  <dl className="SettingsDefinition">
                    <dt>
                      <span>{SETTINGS.ACCOUNT_DELETION_DEFINITION.term}</span>
                      <Emoji
                        name="wave"
                        title="Sad wave"
                        style={{ marginTop: `-${5 / 16}rem`, marginLeft: `${5 / 16}rem` }}
                      />
                    </dt>
                    <dd>{SETTINGS.ACCOUNT_DELETION_DEFINITION.desc}</dd>
                    <button
                      className="SettingsButton asDangerous"
                      onClick={this.onClickDeleteAccountModal}
                    >
                      Delete
                    </button>
                  </dl>
                </div>
              </TreePanel>
            </div>
          </div>
        </div>
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(SettingsContainer)

