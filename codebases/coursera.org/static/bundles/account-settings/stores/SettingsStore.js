import _ from 'lodash';
import SettingsDispatcher from 'bundles/account-settings/SettingsDispatcher';
import SettingsConstants from 'bundles/account-settings/constants/SettingsConstants';
import EventEmitter from 'js/vendor/EventEmitter';

const { Fields, Actions, UpdateStates, TwoFactorAuthenticationStatus } = SettingsConstants;

const DEFAULT_LOCALE = 'en_US';

let _user = null;
let _topSection = null;
let _notificationPreferences = null;
let _creditCardPreferences = null;
let _wallets = null;
let _showDeleteCreditCardModal = false;
let _activeWalletId = null;
let _emailPreferences = null;
let _invalidFields = null;
let _updatedEmailAddress = null;
let _unsubscribedAllEmails = null;
const _partnerBannerStatus = {};
let _updateStatus = {
  state: UpdateStates.IDLE,
};
const _pendingChanges = {};

let _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.UNAVAILABLE;
let _twoFactorAuthenticationInvalidFields = [];
let _twoFactorAuthenticationQRCode = null;
let _twoFactorAuthenticationUpdating = false;
let _isAccountDeleted = false;

const SettingsStore = _.extend({}, EventEmitter.prototype, {
  getTopSection() {
    return _topSection;
  },

  getUser() {
    return _user;
  },

  getUserId() {
    return _user[Fields.ID];
  },

  getFullName() {
    return _user[Fields.FULL_NAME];
  },

  getEmailAddress() {
    return _user[Fields.EMAIL_ADDRESS];
  },

  getLocale() {
    return _user[Fields.LOCALE] || DEFAULT_LOCALE;
  },

  getTimezone() {
    return _user[Fields.TIMEZONE];
  },

  getUpdateStatus() {
    return _updateStatus;
  },

  getInvalidFields() {
    return _invalidFields;
  },

  getUpdatedEmailAddress() {
    return _updatedEmailAddress;
  },

  getNotificationPreferences() {
    return _notificationPreferences;
  },

  getCreditCardPreferences() {
    return _creditCardPreferences;
  },

  getPaymentWallets() {
    return _wallets;
  },

  getShowDeleteCreditCardModal() {
    return _showDeleteCreditCardModal;
  },

  getActiveWalletId() {
    return _activeWalletId;
  },

  getEmailPreferences() {
    return _emailPreferences;
  },

  getUnsubscribedAllEmails() {
    return _unsubscribedAllEmails;
  },

  hasPendingChanges() {
    return !_.isEmpty(_pendingChanges);
  },

  getPartnerBannerStatus(partnerId) {
    return _partnerBannerStatus[partnerId];
  },

  getTwoFactorAuthenticationStatus() {
    return _twoFactorAuthenticationStatus;
  },

  getTwoFactorAuthenticationQRCode() {
    return _twoFactorAuthenticationQRCode;
  },

  getTwoFactorAuthenticationInvalidFields() {
    return _twoFactorAuthenticationInvalidFields;
  },

  isTwoFactorAuthenticationUpdating() {
    return _twoFactorAuthenticationUpdating;
  },

  isAccountDeleted() {
    return _isAccountDeleted;
  },
});

SettingsStore.dispatchToken = SettingsDispatcher.register((payload) => {
  const { action } = payload;

  switch (action.type) {
    case Actions.SET_TOP_SECTION:
      _topSection = action.section;
      SettingsStore.emit('change');
      break;

    case Actions.HIDE_DELETE_CREDIT_CARD_MODAL:
      _showDeleteCreditCardModal = false;
      SettingsStore.emit('change');
      break;

    case Actions.SHOW_DELETE_CREDIT_CARD_MODAL:
      _showDeleteCreditCardModal = true;
      _activeWalletId = action.walletId;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_USER_SETTINGS:
      _user = action.userData;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_CREDIT_CARD_PREFERENCES:
      _creditCardPreferences = action.creditCardPreferences;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_PAYMENT_WALLETS:
      _wallets = action.wallets;
      _notificationPreferences = action.notificationPreferences;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_EMAIL_PREFERENCES:
      _emailPreferences = action.emailPreferences;
      _notificationPreferences = action.notificationPreferences;
      SettingsStore.emit('change');
      break;

    case Actions.PARTNER_BANNER_STATUS_RECEIVED:
      _partnerBannerStatus[action.partnerId] = action.status;
      SettingsStore.emit('change');
      break;

    case Actions.RESET_SECTION:
      _updateStatus = {
        state: UpdateStates.IDLE,
        section: action.section,
      };
      _invalidFields = [];
      _updatedEmailAddress = null;
      _unsubscribedAllEmails = null;
      SettingsStore.emit('change');
      break;

    case Actions.UPDATE_STARTED:
      _updateStatus = {
        state: UpdateStates.UPDATING,
        section: action.section,
      };
      SettingsStore.emit('change');
      break;

    case Actions.UPDATE_SUCCEEDED:
      _updateStatus = {
        state: UpdateStates.SUCCEEDED,
        section: action.section,
      };
      _invalidFields = [];
      delete _pendingChanges[action.section];
      SettingsStore.emit('change');
      break;

    case Actions.UPDATE_FIELD_FAILED:
      _invalidFields.push(action.field);
      break;

    case Actions.UPDATE_PASSWORD_FAILED_INSUFFICIENTLY_COMPLEX:
      _updateStatus = {
        state: UpdateStates.FAILED_NEW_PASSWORD_NOT_SUFFICIENTLY_COMPLEX,
        section: action.section,
      };
      SettingsStore.emit('change');
      break;

    case Actions.UPDATE_FAILED:
      _updateStatus = {
        state: UpdateStates.FAILED,
        section: action.section,
      };
      SettingsStore.emit('change');
      break;

    case Actions.UPDATED_EMAIL_ADDRESS:
      _updatedEmailAddress = action.email;
      break;

    case Actions.UPDATE_FAILED_NAME_INVALID:
      _updateStatus = {
        state: UpdateStates.FAILED_NAME_INVALID,
        section: action.section,
      };
      SettingsStore.emit('change');
      break;

    case Actions.UPDATE_FAILED_EMAIL_IN_USE:
      _updateStatus = {
        state: UpdateStates.FAILED_EMAIL_IN_USE,
        section: action.section,
      };
      SettingsStore.emit('change');
      break;

    case Actions.UPDATE_FAILED_EMAIL_ADDRESS:
      _updateStatus = {
        state: UpdateStates.FAILED_EMAIL_ADDRESS,
        section: action.section,
      };
      SettingsStore.emit('change');
      break;

    case Actions.UNSUBSCRIBED_ALL_EMAILS:
      _unsubscribedAllEmails = true;
      SettingsStore.emit('change');
      break;

    case Actions.UPDATE_PENDING_CHANGES_STATUS:
      _pendingChanges[action.section] = action.isChanged;
      SettingsStore.emit('change');
      break;

    case Actions.LOADING_TWO_FACTOR_AUTHENTICATION_SETTINGS:
      _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.LOADING;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_TWO_FACTOR_AUTHENTICATION_SETTINGS:
      if (action.settings && action.settings.details.enabled === true) {
        _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.ENABLED;
      } else if (action.settings && action.settings.details.enabled === false) {
        _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.DISABLED;
      } else {
        _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.UNAVAILABLE;
      }
      SettingsStore.emit('change');
      break;

    case Actions.ENABLE_TWO_FACTOR_AUTHENTICATION:
      _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.ENABLING_CONFIRMING_PASSWORD;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_TWO_FACTOR_AUTHENTICATION_QR_CODE:
      _twoFactorAuthenticationQRCode = action.qrCode;
      _twoFactorAuthenticationUpdating = false;
      _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.ENABLING_CONFIRMING_CODE;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_INVALID_PASSWORD:
      _twoFactorAuthenticationInvalidFields = ['password'];
      _twoFactorAuthenticationUpdating = false;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_TWO_FACTOR_AUTHENTICATION_CODE_CONFIRMATION_RESPONSE:
      if (action.success) {
        _twoFactorAuthenticationQRCode = null;
        _twoFactorAuthenticationUpdating = false;
        _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.ENABLED;
      } else {
        _twoFactorAuthenticationInvalidFields = ['code'];
        _twoFactorAuthenticationUpdating = false;
      }
      SettingsStore.emit('change');
      break;

    case Actions.CANCEL_TWO_FACTOR_AUTHENTICATION_ACTION:
      if (
        _twoFactorAuthenticationStatus === TwoFactorAuthenticationStatus.ENABLING_CONFIRMING_PASSWORD ||
        _twoFactorAuthenticationStatus === TwoFactorAuthenticationStatus.ENABLING_CONFIRMING_CODE
      ) {
        _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.DISABLED;
        SettingsStore.emit('change');
      } else if (_twoFactorAuthenticationStatus === TwoFactorAuthenticationStatus.DISABLING_CONFIRMING_PASSWORD) {
        _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.ENABLED;
      }
      _twoFactorAuthenticationUpdating = false;
      _twoFactorAuthenticationInvalidFields = [];
      SettingsStore.emit('change');
      break;

    case Actions.PERFORMING_TWO_FACTOR_AUTHENTICATION_SERVER_ACTION:
      _twoFactorAuthenticationUpdating = true;
      _twoFactorAuthenticationInvalidFields = [];
      SettingsStore.emit('change');
      break;

    case Actions.DISABLE_TWO_FACTOR_AUTHENTICATION:
      _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.DISABLING_CONFIRMING_PASSWORD;
      SettingsStore.emit('change');
      break;

    case Actions.RECEIVED_SUCCESSFUL_DISABLING_TWO_FACTOR_AUTHENTICATION_RESPONSE:
      _twoFactorAuthenticationStatus = TwoFactorAuthenticationStatus.DISABLED;
      _twoFactorAuthenticationUpdating = false;
      SettingsStore.emit('change');
      break;

    case Actions.ACCOUNT_DELETED:
      _isAccountDeleted = true;
      SettingsStore.emit('change');
      break;
  }
});

export default SettingsStore;
