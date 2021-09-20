import { Button, Heading, Modal } from '@udacity/veritas-components';
import { IconChecked, IconWarning } from '@udacity/veritas-icons';

import Actions from 'actions';
import AuthenticationService from 'services/authentication-service';
import BusyButton from 'components/common/busy-button';
import { MinimalCard } from 'components/nanodegree-dashboard/overview/card/_card';
import PropTypes from 'prop-types';
import UserService from 'services/user-service';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import { reportError } from 'initializers/sentry';
import styles from './personal-data.scss';

const rightToAccessValues = {
  ELIGIBLE: 'eligible',
  INELIGIBLE_NOT_VERIFIED: 'ineligible_not_verified',
  INELIGIBLE_NOT_EU: 'ineligible_not_eu',
  INELIGIBLE_NOT_SELF: 'ineligible_not_self',
};

const USER_ACCOUNT_DELETE_STATES = {
  NOT_REQUESTED: 'NOT_REQUESTED',
  REQUESTED: 'REQUESTED',
  VERIFIED: 'VERIFIED',
  CONFIRMED: 'CONFIRMED',
};

const USER_ACCOUNT_DELETE_ERROR_MESSAGES = {
  ACCOUNT_DELETE_ERROR:
    'An error occured while trying to delete your data. Please try again in a few minutes.',
  ACCOUNT_NOT_FOUND:
    'Unable to fulfill account data deletion request. We could not find your user account',
  CODE_MISMATCH: 'Code does not match. Please enter the code from your email.',
  CODE_NOT_REQUESTED:
    'Unable to verify request code. You need to request the code first.',
  CODE_NOT_VERIFIED:
    'Unable to fulfill account data deletion request. You need to first verify your deletion request code.',
  INTERNAL_ERROR:
    'There was an error processing your request. Please try again in a few minutes.',
};

const DELETE_CODE_LENGTH = 32;

@cssModule(styles)
export class PersonalData extends React.Component {
  static displayName = 'settings/setting-personal-info/personal-data';

  static propTypes = {
    userId: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
    rightToAccessValues: PropTypes.oneOf(_.map(rightToAccessValues)),
    accountDeleteState: PropTypes.string,
  };

  state = {
    verificationRequestSent: false,
    accountDeleteState: this.props.accountDeleteState,
    showDeleteModal: false,
    deleteCode: '',
  };

  handleSendEmailVerification = () => {
    return UserService.requestEmailVerification().then(() => {
      this.setState({
        verificationRequestSent: true,
      });
    });
  };

  handleDeleteRequestCode = () => {
    const { createWarningAlert } = this.props;

    return UserService.requestDeleteAccountCode()
      .then((data) => {
        if (!data.error) {
          this.setState({
            accountDeleteState: data.account_delete_state,
          });
        } else {
          createWarningAlert(
            __(USER_ACCOUNT_DELETE_ERROR_MESSAGES[data.error.code])
          );
        }
      })
      .catch((error) => {
        reportError(error);
        createWarningAlert(
          __(
            'We had some trouble sending your delete code. Please try again in a few minutes.'
          )
        );
      });
  };

  handleRequestData = () => {
    const { createNotificationAlert, createWarningAlert } = this.props;

    return UserService.createRightToAccessRequest()
      .then(() => {
        createNotificationAlert(
          __('Your request has been sent. Please look out for our email.')
        );
      })
      .catch((error) => {
        reportError(error);
        createWarningAlert(
          __(
            'We had some trouble sending the information you requested. <a href=https://udacity.zendesk.com/hc/en-us/requests/new target="_blank">Report an Issue</a>'
          )
        );
      });
  };

  confirmDelete = () => {
    this.setState({
      showDeleteModal: true,
    });
  };

  cancelDelete = () => {
    this.setState({
      showDeleteModal: false,
    });
  };

  deleteUser = () => {
    const { createWarningAlert } = this.props;

    UserService.deleteAccount()
      .then((data) => {
        if (!data.error) {
          this.setState({
            accountDeleteState: data.account_delete_state,
            showDeleteModal: false,
          });
          AuthenticationService.signOut();
        } else {
          this.cancelDelete();
          createWarningAlert(
            __(
              'We had some trouble deleting your data. Please try again in a few minutes.'
            )
          );
        }
      })
      .catch((error) => {
        reportError(error);
        this.cancelDelete();
        createWarningAlert(
          __(
            'We had some trouble deleting your data. Please try again in a few minutes.'
          )
        );
      });
  };

  renderDeleteModal = () => {
    const { showDeleteModal } = this.state;

    return (
      <Modal
        open={showDeleteModal}
        onClose={this.cancelDelete}
        label={__('Confirm Account Deletion')}
        closeLabel={__('Cancel Account Deletion')}
      >
        <div styleName="delete-modal">
          <IconWarning size="lg" color="red" />
          <span styleName="warning-confirm">
            {__(
              'Are you sure you want to delete all your data and close your account?'
            )}
          </span>
          <span styleName="warning-text">
            {__(
              'This action is irreversible and your information will be lost.'
            )}
          </span>
          <div styleName="actions">
            <Button
              label={__("No, Don't")}
              onClick={this.cancelDelete}
              variant="secondary"
            />
            <Button
              label={__('Yes, Delete')}
              onClick={this.deleteUser}
              variant="destructive"
            />
          </div>
        </div>
      </Modal>
    );
  };

  handleDeleteRequestCodeInput = (evt) => {
    const code = evt.target.value;

    this.setState({
      deleteCode: code,
    });
  };

  handleVerifyCode = () => {
    const { deleteCode } = this.state;
    const { createWarningAlert } = this.props;

    UserService.verifyDeleteAccountCode(deleteCode)
      .then((data) => {
        if (!data.error) {
          this.setState({
            accountDeleteState: data.account_delete_state,
          });
        } else {
          createWarningAlert(
            __(USER_ACCOUNT_DELETE_ERROR_MESSAGES[data.error.code])
          );
        }
      })
      .catch((error) => {
        reportError(error);
        createWarningAlert(
          __(
            'We had some trouble verifiying your delete code. Please try again in a few minutes.'
          )
        );
      });
  };

  renderAccountDeletionConfirmation = () => {
    return (
      <p>
        {__(
          'Your account is being deleted. You will be unable to access this account shortly.'
        )}
      </p>
    );
  };

  renderAccountDeletionStep = () => {
    const { accountDeleteState } = this.state;

    return (
      <div>
        <p>
          {__(
            'To permanently delete your data across all Udacity applications and close your account, please click on the Delete My Account button.'
          )}
        </p>
        <div styleName="flex-col--justify-start-align-start">
          {accountDeleteState === USER_ACCOUNT_DELETE_STATES.VERIFIED && (
            <div>
              <span>
                <IconChecked color="green" title="success" />
              </span>
              <span>{__('Request Verified')}</span>
            </div>
          )}
          <div id="delete-account" styleName="cta-button">
            <Button
              className="delete-account-btn"
              label={__('Delete My Account')}
              onClick={this.confirmDelete}
              variant="destructive"
            />
          </div>
        </div>
      </div>
    );
  };

  renderRequestAccountDeletionCodeStep = () => {
    const { accountDeleteState } = this.state;
    const accountDeletionNotRequested =
      !accountDeleteState ||
      accountDeleteState === USER_ACCOUNT_DELETE_STATES.NOT_REQUESTED;

    return (
      <div styleName="cta-button">
        {accountDeletionNotRequested && (
          <div>
            <p>
              <strong>
                {__(
                  'NOTE: You must cancel any active enrollments prior to deleting your account, to avoid any future charges.'
                )}
              </strong>
            </p>
            <p>
              {__('Before deleting your account, please review the following:')}
            </p>
            <p>
              <ul styleName="delete-warnings-list">
                <li>
                  {' '}
                  {__(
                    'If you delete your account, all of your personal information, including enrollments and certificates, will be deleted. You will immediately lose access to your account and be unable to log in.'
                  )}
                </li>
                <li>
                  {' '}
                  {__(
                    'This action is irreversible - once your data has been deleted, we cannot recover it again.'
                  )}
                </li>
                <li>
                  {__(
                    'You will not be able to sign up again using the same email address for 30 days.'
                  )}
                </li>
              </ul>
            </p>
            <p>
              {__(
                'To prevent account deletion by accident, we have a 2-step verification process. Click below to get a delete code sent to your email. Use that code to verify your request and to continue with the deletion process.'
              )}
            </p>
          </div>
        )}
        {accountDeleteState === USER_ACCOUNT_DELETE_STATES.REQUESTED && (
          <div styleName="notification">
            <span>
              {__(
                'An email with a code has been sent to your email address. Copy and paste the code below to confirm that you would like to proceed to delete your account data.'
              )}
            </span>
          </div>
        )}
        <div
          className={[
            styles['flex-col--justify-start-align-start'],
            styles['delete-request-verification'],
          ].join(' ')}
        >
          {accountDeleteState === USER_ACCOUNT_DELETE_STATES.REQUESTED && (
            <div styleName="flex-row--justify-start-align-center">
              <input
                type="text"
                styleName="delete-code-input"
                onChange={this.handleDeleteRequestCodeInput}
                placeholder={__('Enter Delete Code')}
                maxLength={DELETE_CODE_LENGTH}
              />

              <BusyButton
                className="verify-code-btn"
                onClick={this.handleVerifyCode}
                variant="primary"
                label={__('Verify Code')}
              />
            </div>
          )}
          <BusyButton
            onClick={this.handleDeleteRequestCode}
            variant="secondary"
            label={
              accountDeletionNotRequested
                ? __('Send Delete Code')
                : __('Re-send Delete Code')
            }
          />
        </div>
      </div>
    );
  };

  renderDataAccessEligible = () => {
    const { rightToAccess, emailAddress } = this.props;

    const showRightToAccess = _.includes(
      [
        rightToAccessValues.ELIGIBLE,
        rightToAccessValues.INELIGIBLE_NOT_VERIFIED,
      ],
      rightToAccess
    );

    if (!showRightToAccess && false) {
      return null;
    }

    return (
      <div>
        <div styleName="email-verified">
          <IconChecked color="green" title="success" />
          <div styleName="email-verified-text">
            <span>
              {__(
                'Click the Request Data button to have a copy of your data sent to your email'
              )}
              : <strong>{emailAddress}</strong>
            </span>
          </div>
        </div>
        <div styleName="request-data">
          <BusyButton
            onClick={this.handleRequestData}
            variant="secondary"
            label={__('Request Data')}
          />
        </div>
      </div>
    );
  };

  renderDataAccessVerifyEmail = () => {
    const { verificationRequestSent } = this.state;

    return (
      <div>
        <p>
          {__(
            'Verify your email address so that we send your data to the correct place.'
          )}
        </p>
        <div styleName="cta-button">
          <BusyButton
            onClick={this.handleSendEmailVerification}
            variant="secondary"
            label={__('Send Verification')}
          />
          {verificationRequestSent ? (
            <MinimalCard
              intent="warning"
              summary={__(
                'An email has been sent to your email address. When you have completed the instructions please return to this page and refresh it to continue to the next step.'
              )}
            />
          ) : null}
        </div>
      </div>
    );
  };

  renderRequestAccessData = () => {
    const { rightToAccess } = this.props;
    const eligibleForAccess = rightToAccess === rightToAccessValues.ELIGIBLE;

    return (
      <div>
        <Heading size="h3" as="h1">
          {__('Account Management')}
        </Heading>

        <h2 styleName="content-header">{__('Request Account Data')}</h2>
        {eligibleForAccess
          ? this.renderDataAccessEligible()
          : this.renderDataAccessVerifyEmail()}
      </div>
    );
  };

  renderDeleteDataAccount = () => {
    const { accountDeleteState } = this.state;

    return (
      <div>
        {this.renderDeleteModal()}
        <h2 styleName="content-header">{__('Delete Your Account')}</h2>
        {accountDeleteState === USER_ACCOUNT_DELETE_STATES.CONFIRMED
          ? this.renderAccountDeletionConfirmation()
          : accountDeleteState === USER_ACCOUNT_DELETE_STATES.VERIFIED
          ? this.renderAccountDeletionStep()
          : this.renderRequestAccountDeletionCodeStep()}
      </div>
    );
  };

  render() {
    return (
      <section styleName="content-container">
        {this.renderRequestAccessData()}
        {this.renderDeleteDataAccount()}
      </section>
    );
  }
}

export default connect(null, {
  createNotificationAlert: Actions.createNotificationAlert,
  createWarningAlert: Actions.createWarningAlert,
  updateUserSettings: Actions.updateUserSettings,
})(PersonalData);
