import SettingsDispatcher from 'bundles/account-settings/SettingsDispatcher';
import SettingsServerActionCreators from 'bundles/account-settings/actions/SettingsServerActionCreators';
import SettingsConstants from 'bundles/account-settings/constants/SettingsConstants';
import SettingsAPIUtils from 'bundles/account-settings/utils/SettingsAPIUtils';

const { Actions, Sections } = SettingsConstants;

const exported = {
  setUserData(userData) {
    SettingsServerActionCreators.receivedUserSettings(userData);
  },

  /**
   * Sets top-level section to display
   */
  setTopSection(section) {
    SettingsDispatcher.handleViewAction({
      type: Actions.SET_TOP_SECTION,
      section,
    });
  },

  /**
   * Get current user settings
   */
  getUserSettings(userId) {
    SettingsAPIUtils.getUserSettings(userId);
  },

  fetchPaymentWallets(userId) {
    SettingsAPIUtils.fetchPaymentWallets(userId);
  },

  /**
   * Get current user settings
   */
  fetchCreditCardPreferences(userId) {
    SettingsAPIUtils.fetchCreditCardPreferences(userId);
  },

  /**
   * Updates user basic information
   * @param {Object} settings
   */
  updateBasicInformation(settings, userData = {}) {
    this.resetSection(Sections.BASIC_INFORMATION);
    SettingsAPIUtils.updateBasicInformation(settings, userData);
  },

  /**
   * Updates email address using password
   * @param {String} email
   * @param {String} password
   * @param {Number} userId
   */
  updateEmailAddressWithPassword(email, password, userId) {
    this.resetSection(Sections.BASIC_INFORMATION);
    return SettingsAPIUtils.updateEmailAddressWithPassword(email, password, userId);
  },

  /**
   * Submits name change request
   * @param {Object} nameChangeData
   */
  submitNameChangeRequest(nameChangeData) {
    return SettingsAPIUtils.submitNameChangeRequest(nameChangeData);
  },

  /**
   * Updates user passwords
   * @param {Object} passwords
   */
  resetPassword(passwords) {
    this.resetSection(Sections.PASSWORD);
    SettingsAPIUtils.resetPassword(passwords);
  },

  requestResetPassword() {
    SettingsAPIUtils.requestResetPassword();
  },

  addAlternativeEmail(email) {
    return SettingsAPIUtils.addAlternativeEmail(email);
  },

  showDeleteCreditCardModal(walletId) {
    this.resetSection(Sections.CREDIT_CARD_DELETE);
    SettingsDispatcher.handleViewAction({
      type: Actions.SHOW_DELETE_CREDIT_CARD_MODAL,
      walletId,
    });
  },

  hideDeleteCreditCardModal() {
    SettingsDispatcher.handleViewAction({
      type: Actions.HIDE_DELETE_CREDIT_CARD_MODAL,
    });
  },

  deleteCreditCard(walletId) {
    this.hideDeleteCreditCardModal();
    this.resetSection(Sections.CREDIT_CARD_DELETE);
    SettingsAPIUtils.deleteCreditCard(walletId);
  },

  /**
   * Updates user email preferences
   * @param {String} section
   * @param {Object} preferences
   */
  updateEmailPreferences(section, preferences) {
    this.resetSection(section);
    SettingsAPIUtils.updateEmailPreferences(section, preferences);
  },

  togglePartnerEmailSubscription(partnerId, courseId, subscribe) {
    SettingsAPIUtils.togglePartnerEmailSubscription(partnerId, courseId, subscribe);
  },

  getPartnerBannerViewStatus(courseId, partnerId) {
    SettingsAPIUtils.checkPartnerBannerStatus(courseId, partnerId);
  },

  dismissPartnerEmailSubscription(courseId, partnerId) {
    SettingsAPIUtils.dismissPartnerBanner(courseId, partnerId, false);
  },

  unsubscribeAllEmails() {
    SettingsAPIUtils.unsubscribeAllEmails();
  },

  /**
   * Reset a section to its default state
   * @param {String} section
   */
  resetSection(section) {
    SettingsDispatcher.handleViewAction({
      type: Actions.RESET_SECTION,
      section,
    });
  },

  updatePendingChangesStatus(section, isChanged) {
    SettingsDispatcher.handleViewAction({
      type: Actions.UPDATE_PENDING_CHANGES_STATUS,
      section,
      isChanged,
    });
  },

  /**
   * Request to load Two-Factor Authentication settings from the server
   */
  loadTwoFactorAuthenticationSettings() {
    SettingsAPIUtils.loadTwoFactorAuthenticationSettings();
  },

  /**
   * Initiate the Two-Factor Authentication setup process
   */
  enableTwoFactorAuthentication() {
    SettingsDispatcher.handleViewAction({
      type: Actions.ENABLE_TWO_FACTOR_AUTHENTICATION,
    });
  },

  /**
   * Confirm a user's password before enabling Two-Factor Authentication
   * @param {String} password
   */
  confirmPasswordToEnableTwoFactorAuthentication(password) {
    SettingsAPIUtils.confirmPasswordToEnableTwoFactorAuthentication(password);
  },

  /**
   * Confirm a user's Two-Factor code before enabling Two-Factor authentication
   * @param {String} code
   */
  confirmTwoFactorAuthenticationCode(code) {
    SettingsAPIUtils.confirmTwoFactorAuthenticationCode(code);
  },

  /**
   * Initiate the Two-Factor Authentication disabling process
   */
  disableTwoFactorAuthentication() {
    SettingsDispatcher.handleViewAction({
      type: Actions.DISABLE_TWO_FACTOR_AUTHENTICATION,
    });
  },

  /**
   * Confirm a user's password before disabling Two-Factor Authentication
   * @param {String} password
   */
  confirmPasswordToDisableTwoFactorAuthentication(password) {
    SettingsAPIUtils.confirmPasswordToDisableTwoFactorAuthentication(password);
  },

  /**
   * Cancel any Two-Factor Authentication process (either setup or disabling)
   */
  cancelTwoFactorAuthenticationAction() {
    SettingsDispatcher.handleViewAction({
      type: Actions.CANCEL_TWO_FACTOR_AUTHENTICATION_ACTION,
    });
  },

  /**
   * Finally after account is deleted call the logout API
   */
  accountDeleted() {
    SettingsAPIUtils.logout();
  },
};

export default exported;

export const {
  setUserData,
  setTopSection,
  getUserSettings,
  fetchCreditCardPreferences,
  fetchPaymentWallets,
  updateBasicInformation,
  updateEmailAddressWithPassword,
  submitNameChangeRequest,
  resetPassword,
  requestResetPassword,
  addAlternativeEmail,
  showDeleteCreditCardModal,
  hideDeleteCreditCardModal,
  deleteCreditCard,
  updateEmailPreferences,
  togglePartnerEmailSubscription,
  getPartnerBannerViewStatus,
  dismissPartnerEmailSubscription,
  unsubscribeAllEmails,
  resetSection,
  updatePendingChangesStatus,
  loadTwoFactorAuthenticationSettings,
  enableTwoFactorAuthentication,
  confirmPasswordToEnableTwoFactorAuthentication,
  confirmTwoFactorAuthenticationCode,
  disableTwoFactorAuthentication,
  confirmPasswordToDisableTwoFactorAuthentication,
  cancelTwoFactorAuthenticationAction,
  accountDeleted,
} = exported;
