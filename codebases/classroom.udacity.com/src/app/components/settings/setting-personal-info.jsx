import {
  Button,
  Heading,
  RoundButton,
  VisuallyHidden,
} from '@udacity/veritas-components';
import Actions from 'actions';
import AnalyticsService from 'services/analytics-service';
import AsyncPhoneNumberManager from './_async-phone-number-manager';
import Avatar from 'components/common/avatar';
import { FILE_TYPES } from 'constants/avatar';
import FileService from 'services/file-service';
import { IconTrash } from '@udacity/veritas-icons';
import PersonalData from './personal-data';
import PropTypes from 'prop-types';
import SettingButtons from './_setting-buttons';
import UserService from 'services/user-service';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import styles from './setting-personal-info.scss';

@cssModule(styles)
export class SettingPersonalInfo extends React.Component {
  static displayName = 'settings/setting-personal-info';

  static propTypes = {
    createNotificationAlert: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    updateHubUser: PropTypes.func,
  };

  static defaultProps = {
    user: {},
  };

  constructor(props) {
    super(props);
    const {
      first_name,
      last_name,
      email,
      phone_number,
      is_phone_number_verified,
      is_email_verified,
      photo_url: avatarUrl,
    } = this.props.user;

    this.state = {
      firstName: first_name || '',
      lastName: last_name || '',
      email: email || '',
      newEmail: '',
      showNewEmailInput: false,
      password: '',
      phoneNumber: phone_number || '',
      isPhoneNumberVerified: is_phone_number_verified,
      isEmailVerified: is_email_verified,
      isValidMap: {
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        newEmail: true,
        phoneNumber: true,
      },
      // avatar related
      showAvatarOverlay: false,
      committed: {
        avatarUrl: avatarUrl || '',
      },
      transacting: null,
    };

    this.fileInputRef = React.createRef();
  }

  async componentDidMount() {
    if (!this.props.user.hasOwnProperty('photo_url')) {
      await this.props.getHubUser();
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.user, this.props.user)) {
      this.setState(this._stateFromProps(this.props));
    }
  }

  _clearErrors() {
    this.setState({
      isValidMap: {
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        newEmail: true,
        phoneNumber: true,
      },
      showNewEmailInput: false,
    });
  }

  _createNewUserObject() {
    const { firstName, lastName, email, password } = this.state;
    const { user } = this.props;

    let newUserObject = {};
    if (email !== user.email) {
      newUserObject['email'] = email;
      newUserObject['password'] = password;
    }
    if (firstName !== user.first_name) {
      newUserObject['firstName'] = firstName;
    }
    if (lastName !== user.last_name) {
      newUserObject['lastName'] = lastName;
    }
    return newUserObject;
  }

  _getInputStyleName(isValid) {
    return isValid ? 'field' : 'error-field';
  }

  handleFieldChange(field, validator, value, extraState = {}) {
    const isValid = validator(value);

    this.setState(({ isValidMap }) => {
      return {
        [field]: value,
        isValidMap: {
          ...isValidMap,
          [field]: isValid,
        },
        ...extraState,
      };
    });
  }

  handlePhoneChange(phoneNumber, isPhoneNumberVerified) {
    // We're trusting the component to assert validity.
    this.setState(({ isValidMap }) => {
      return {
        phoneNumber,
        isPhoneNumberVerified,
        isValidMap: {
          ...isValidMap,
          phoneNumber: true,
        },
      };
    });
  }

  _isValid() {
    const newUserObject = this._createNewUserObject();
    return (
      (_.every(_.values(this.state.isValidMap)) && !_.isEmpty(newUserObject)) ||
      this._pendingAvatarUpdate()
    );
  }

  _validateEmail(value) {
    return isEmail(value);
  }

  _validateName(value) {
    return isLength(value, 1, 50);
  }

  _validateNewEmail = (value) => {
    const { email } = this.state;
    if (value) {
      return isEmail(value) && value === email;
    } else {
      return true;
    }
  };

  _validatePassword(value) {
    if (value) {
      return isLength(value, 6, 50);
    } else {
      return false;
    }
  }

  _stateFromProps(props) {
    const { first_name, last_name, email, photo_url } = props.user;

    return {
      firstName: first_name,
      lastName: last_name,
      email: email,
      newEmail: '',
      password: '',
      showNewEmailInput: false,
      committed: {
        avatarUrl: photo_url || '',
      },
    };
  }

  _rollback() {
    this.setState({
      ...this._stateFromProps(this.props),
      transacting: null,
    });
  }

  handleCancelClick = () => {
    this._rollback();
    this._clearErrors();
  };

  handleVerifyEmailClick = async () => {
    const { createErrorAlert, createNotificationAlert } = this.props;
    const { email } = this.state;
    UserService.requestEmailVerification()
      .then(() => {
        createNotificationAlert(
          __('A verification email has been sent to <%= email %>', { email })
        );
      })
      .catch(() => {
        createErrorAlert(
          __('Could not send a verification email to <%= email %>', { email })
        );
      });
  };

  handleSaveClick = async () => {
    const { updateUser, updateHubUser, user } = this.props;
    const { newEmail, showNewEmailInput } = this.state;
    const updatedUser = this._createNewUserObject();
    const updatedHubUser = this._createNewHubUser();

    const requests = [];
    if (!_.isEmpty(updatedUser)) {
      requests.push(updateUser(updatedUser));
    }
    if (!_.isEmpty(updatedHubUser)) {
      requests.push(updateHubUser(updatedHubUser));
    }
    Promise.all(requests).then((response) => {
      if (showNewEmailInput && updatedUser.email) {
        if (response.email === newEmail) {
          this.props.createNotificationAlert(
            __('Please check your email to confirm your new email address')
          );
        }
        this.setState({
          newEmail: '',
          password: '',
          showNewEmailInput: false,
        });
      }
      if (updatedHubUser) {
        this._commitAvatar();
        if (updatedHubUser.avatarUrl !== '') {
          AnalyticsService.track('Uploaded Avatar', {
            user_id: user.id,
          });
        }
      }
    });
  };

  // Upload Avatar related methods
  handleShowAvatarOverlay = () => this.setState({ showAvatarOverlay: true });
  handleHideAvatarOverlay = () => this.setState({ showAvatarOverlay: false });

  _getAvatar() {
    const {
      transacting,
      committed: { avatarUrl },
    } = this.state;
    if (transacting && transacting.hasOwnProperty('avatarUrl')) {
      return transacting.avatarUrl;
    }
    return avatarUrl;
  }

  _isSetToDefault() {
    return (
      this.state.committed &&
      (this.state.committed.avatarUrl === '' ||
        this.state.committed.avatarUrl === null)
    );
  }

  _setAvatar(avatarUrl) {
    // nothing to replace if we're currently set to identicon.
    const isDefault = avatarUrl === null && this._isSetToDefault();
    this.setState((prevState) => ({
      ...prevState,
      transacting: isDefault ? null : { ...prevState.transacting, avatarUrl },
    }));
  }

  _commitAvatar() {
    this.setState((prevState) => ({
      committed: { ...prevState.committed, avatarUrl: this._getAvatar() },
      transacting: null,
    }));
  }

  _pendingAvatarUpdate() {
    return this.state.transacting !== null;
  }

  handleChangeAvatar = () =>
    this.fileInputRef && this.fileInputRef.current.click();

  handleAvatarOnEnter = (e) => {
    // Change Avatar if key pressed is 'Enter' or 'Space'
    if (e.key === 'Enter' || e.key === ' ') {
      this.handleChangeAvatar();
    }
  };

  _createNewHubUser() {
    const { transacting } = this.state;
    if (!_.isNil(transacting)) {
      const { avatarUrl } = transacting;
      return { avatarUrl, showToast: true };
    }
  }

  handleSetDefault = () => {
    if (this.state.committed.avatarUrl !== '') {
      this._setAvatar('');
    } else {
      this._setAvatar(null);
    }
  };

  _previewAvatarFile = async (files) => {
    try {
      FileService.verifyPhotoFile(files);
      const avatarUrl = await FileService.getImagePreview(files);
      this._setAvatar(avatarUrl);
    } catch (e) {
      this.props.createErrorAlert(e.message);
    }
  };

  handleAddFile = (e) => {
    const { files } = e.target;
    this._previewAvatarFile(files);
    // This will reset the input's value and trigger the onChange event if the same path is selected.
    // See https://stackoverflow.com/questions/12030686/html-input-file-selection-event-not-firing-upon-selecting-the-same-file
    e.target.value = null;
  };

  // Render methods
  renderNewEmailFields() {
    const { isValidMap, password, newEmail, showNewEmailInput } = this.state;
    if (!showNewEmailInput) {
      return false;
    }

    return [
      <div key="new-email">
        <p>
          {__('To change your email, re-enter your new email address, below')}
        </p>

        <label htmlFor="newEmailInput">{__('Email Address')}</label>
        <input
          id="newEmailInput"
          styleName={this._getInputStyleName(isValidMap.newEmail)}
          type="text"
          value={newEmail}
          onChange={(evt) =>
            this.handleFieldChange(
              'newEmail',
              this._validateNewEmail,
              evt.target.value
            )
          }
          placeholder={__('Email Address')}
        />
      </div>,

      <div key="password">
        <label htmlFor="passwordInput">{__('Password')}</label>
        <input
          id="passwordInput"
          styleName={this._getInputStyleName(isValidMap.password)}
          value={password}
          onChange={(evt) =>
            this.handleFieldChange(
              'password',
              this._validatePassword,
              evt.target.value
            )
          }
          placeholder={__('Password')}
          type="password"
        />
      </div>,
    ];
  }

  renderPhoneNumberFields() {
    const { user } = this.props;
    const { isPhoneNumberVerified, isEmailVerified, phoneNumber } = this.state;

    return (
      <AsyncPhoneNumberManager
        number={phoneNumber}
        userKey={user.id}
        isEmailVerified={isEmailVerified}
        verified={isPhoneNumberVerified}
        onChange={(phoneNumber, isPhoneNumberVerified) =>
          this.handlePhoneChange(phoneNumber, isPhoneNumberVerified)
        }
      />
    );
  }

  render() {
    const {
      isValidMap,
      firstName,
      lastName,
      email,
      showAvatarOverlay,
      showNewEmailInput,
    } = this.state;
    const { user } = this.props;

    return (
      <ul>
        <li>
          <section styleName="content-container">
            <div styleName="main">
              <Heading size="h3" as="h1">
                {__('Basic Information')}
              </Heading>
              <div styleName="id-container">
                <div styleName="id-left">
                  {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                  <div
                    data-tst="avatar-overlay"
                    role="button"
                    aria-pressed="false"
                    aria-label="Upload Avatar"
                    tabIndex="0"
                    styleName={'avatar-overlay'}
                    onMouseEnter={this.handleShowAvatarOverlay}
                    onMouseLeave={this.handleHideAvatarOverlay}
                    onClick={this.handleChangeAvatar}
                    onKeyPress={this.handleAvatarOnEnter}
                  >
                    {showAvatarOverlay && (
                      <Heading size="h5" color="white" spacing="none">
                        Change
                      </Heading>
                    )}
                  </div>
                  <Avatar
                    firstName={firstName}
                    lastName={lastName}
                    avatarUrl={this._getAvatar()}
                    userId={user.id}
                    sizeSelection="xl"
                  />
                  <RoundButton
                    label="Default to identicon"
                    variant="minimal"
                    onClick={this.handleSetDefault}
                    icon={<IconTrash />}
                  />
                  <VisuallyHidden>
                    <input
                      ref={this.fileInputRef}
                      type="file"
                      id="avatar"
                      name="avatar"
                      aria-label="Avatar File"
                      accept={FILE_TYPES.join(', ')}
                      onChange={this.handleAddFile}
                    />
                  </VisuallyHidden>
                </div>
                <div styleName="id-right">
                  <label htmlFor="firstNameInput">{__('First Name')}</label>
                  <input
                    id="firstNameInput"
                    styleName={this._getInputStyleName(isValidMap.firstName)}
                    type="text"
                    value={firstName}
                    onChange={(evt) =>
                      this.handleFieldChange(
                        'firstName',
                        this._validateName,
                        evt.target.value
                      )
                    }
                    placeholder={__('First Name')}
                  />

                  <label htmlFor="lastNameInput">{__('Last Name')}</label>
                  <input
                    id="lastNameInput"
                    styleName={this._getInputStyleName(isValidMap.lastName)}
                    type="text"
                    value={lastName}
                    onChange={(evt) =>
                      this.handleFieldChange(
                        'lastName',
                        this._validateName,
                        evt.target.value
                      )
                    }
                    placeholder={__('Last Name')}
                  />
                </div>
              </div>

              <label htmlFor="emailInput">{__('Email Address')}</label>
              <div styleName="email-container">
                <input
                  id="emailInput"
                  styleName={this._getInputStyleName(isValidMap.email)}
                  type="text"
                  value={email}
                  onChange={(evt) =>
                    this.handleFieldChange(
                      'email',
                      this._validateEmail,
                      evt.target.value,
                      { showNewEmailInput: true }
                    )
                  }
                  placeholder={__('Email Address')}
                />

                {!user.is_email_verified && !showNewEmailInput && (
                  <Button
                    label={__('Verify email')}
                    onClick={this.handleVerifyEmailClick}
                    testID="verify-email-button"
                  />
                )}
              </div>

              {this.renderNewEmailFields()}

              {this.renderPhoneNumberFields()}
            </div>

            <SettingButtons
              data-tst="setting-buttons"
              onSaveClick={this.handleSaveClick}
              onCancelClick={this.handleCancelClick}
              isSaveEnabled={this._isValid()}
            />
          </section>
        </li>
        <li>
          <PersonalData
            userId={user.id}
            emailAddress={email}
            rightToAccess={user.right_to_access}
            accountDeleteState={_.get(user, 'settings.account_delete_state')}
          />
        </li>
      </ul>
    );
  }
}

const {
  createNotificationAlert,
  createErrorAlert,
  updateUser,
  updateHubUser,
  getHubUser,
} = Actions;

export default connect(null, {
  createNotificationAlert,
  createErrorAlert,
  updateUser,
  updateHubUser,
  getHubUser,
})(SettingPersonalInfo);
