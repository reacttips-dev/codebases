import { Actions } from '../constants/SettingsConstants';
import SettingsDispatcher from '../SettingsDispatcher';

const exported = {
  /**
   * User settings is received
   * @param {Object} userData
   */
  receivedUserSettings(userData) {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_USER_SETTINGS,
      userData,
    });
  },

  /**
   * Credit card preferences is received
   * @param {Object} creditCardPreferences
   */
  receivedCreditCardPreferences(creditCardPreferences) {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_CREDIT_CARD_PREFERENCES,
      creditCardPreferences,
    });
  },

  receivedPaymentWallets(wallets) {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_PAYMENT_WALLETS,
      wallets,
    });
  },

  receivedEmailPreferences(notificationPreferences, emailPreferences) {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_EMAIL_PREFERENCES,
      notificationPreferences,
      emailPreferences,
    });
  },

  /**
   * Update started for a section
   * @param {String} section
   */
  updateStarted(section) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATE_STARTED,
      section,
    });
  },

  /**
   * Section is updated successfully
   * @param {String} section
   * @param {Object} [data]
   */
  updateSucceeded(section, data) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATE_SUCCEEDED,
      section,
      data,
    });
  },

  /**
   * Update failed for a field
   * @param {String} field
   */
  updateFieldFailed(field) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATE_FIELD_FAILED,
      field,
    });
  },

  /**
   * Update failed for a section
   * @param {String} section
   */
  updateFailed(section) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATE_FAILED,
      section,
    });
  },

  /**
   * Update failed due to name being malformatted
   * @param {String} section
   */
  updateFailedNameInvalid(section) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATE_FAILED_NAME_INVALID,
      section,
    });
  },

  /**
   * Update failed due to email being in use
   * @param {String} section
   */
  updateFailedEmailInUse(section) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATE_FAILED_EMAIL_IN_USE,
      section,
    });
  },

  /**
   * Update failed due to email being invalid
   * @param {String} section
   */
  updateInvalidEmail(section) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATE_FAILED_EMAIL_ADDRESS,
      section,
    });
  },

  /**
   * Update failed due to insufficiently complex password
   * @param {String} section
   */
  updatePasswordFailedInsufficientlyComplex(section) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATE_PASSWORD_FAILED_INSUFFICIENTLY_COMPLEX,
      section,
    });
  },

  /**
   * Email address is updated
   * @param {String} email
   */
  updatedEmailAddress(email) {
    SettingsDispatcher.handleServerAction({
      type: Actions.UPDATED_EMAIL_ADDRESS,
      email,
    });
  },

  partnerBannerStatusReceived(partnerId, status) {
    SettingsDispatcher.handleServerAction({
      type: Actions.PARTNER_BANNER_STATUS_RECEIVED,
      partnerId,
      status,
    });
  },

  unsubscribedAllEmails() {
    SettingsDispatcher.handleServerAction({
      type: Actions.UNSUBSCRIBED_ALL_EMAILS,
    });
  },

  /**
   * Performing some server action for Two-Factor Authentication
   */
  beginTwoFactorAuthenticationServerAction() {
    SettingsDispatcher.handleServerAction({
      type: Actions.PERFORMING_TWO_FACTOR_AUTHENTICATION_SERVER_ACTION,
    });
  },

  /**
   * Beginning to load Two-Factor Authentication settings
   */
  beganLoadingTwoFactorAuthenticationSettings() {
    SettingsDispatcher.handleServerAction({
      type: Actions.LOADING_TWO_FACTOR_AUTHENTICATION_SETTINGS,
    });
  },

  /**
   * Two-Factor Authentication settings are received
   * @param {Object} settings
   */
  receivedTwoFactorAuthenticationSettings(settings) {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_TWO_FACTOR_AUTHENTICATION_SETTINGS,
      settings,
    });
  },

  /**
   * Received the qr code to finish Two-Factor Authentication setup from the server
   * @param {String} qrCode
   */
  receivedTwoFactorQRCode(qrCode) {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_TWO_FACTOR_AUTHENTICATION_QR_CODE,
      qrCode,
    });
  },

  /**
   * Received response from the server that the user entered an invalid password
   */
  receivedInvalidPassword() {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_INVALID_PASSWORD,
    });
  },

  /**
   * Received response from server whether Two-Factor Authentication code confirmation was successful
   * @param {Boolean} success
   */
  receivedConfirmTwoFactorAuthenticationCodeResponse(success) {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_TWO_FACTOR_AUTHENTICATION_CODE_CONFIRMATION_RESPONSE,
      success,
    });
  },

  /**
   * Received a response from the server that Two-Factor Authentication was disabled successfully
   */
  receivedSuccessfulDisablingTwoFactorAuthenticationResponse() {
    SettingsDispatcher.handleServerAction({
      type: Actions.RECEIVED_SUCCESSFUL_DISABLING_TWO_FACTOR_AUTHENTICATION_RESPONSE,
    });
  },

  accountDeleted() {
    SettingsDispatcher.handleServerAction({
      type: Actions.ACCOUNT_DELETED,
    });
  },
};

export default exported;

export const {
  receivedUserSettings,
  receivedCreditCardPreferences,
  receivedPaymentWallets,
  receivedEmailPreferences,
  updateStarted,
  updateSucceeded,
  updateFieldFailed,
  updateFailed,
  updateFailedEmailInUse,
  updateInvalidEmail,
  updatePasswordFailedInsufficientlyComplex,
  updatedEmailAddress,
  partnerBannerStatusReceived,
  unsubscribedAllEmails,
  beginTwoFactorAuthenticationServerAction,
  beganLoadingTwoFactorAuthenticationSettings,
  receivedTwoFactorAuthenticationSettings,
  receivedTwoFactorQRCode,
  receivedInvalidPassword,
  receivedConfirmTwoFactorAuthenticationCodeResponse,
  receivedSuccessfulDisablingTwoFactorAuthenticationResponse,
  accountDeleted,
} = exported;
