const exported = {
  CREDIT_CARD_SAFETY_LINK: 'https://learner.coursera.help/hc/articles/208280176',
  EMAIL_PREFERENCE_LOGO_SIZE: 64,
  PARTNER_BANNER_STATUS_RECEIVED: 'partnerBannerStatusReceived',

  // Please use capture groups with an "or" character inside this regex for additional email address patterns
  // Example: /(@coursera\.org$)|(^andrewng@deeplearning\.org$)/
  TWO_FACTOR_AUTH_EMAIL_ADDRESS_REGEX: /(@coursera\.org$)|(@support\.coursera\.org$)|(@cloud\.coursera\.org$)|(@24-7intouch\.com$)/,

  Actions: {
    HIDE_DELETE_CREDIT_CARD_MODAL: 'hideDeleteCreditCardModal',
    SHOW_DELETE_CREDIT_CARD_MODAL: 'showDeleteCreditCardModal',

    RECEIVED_CREDIT_CARD_PREFERENCES: 'receivedCreditCardPreferences',
    RECEIVED_PAYMENT_WALLETS: 'receivedPaymentWallets',
    RECEIVED_EMAIL_PREFERENCES: 'receivedEmailPreferences',
    RECEIVED_USER_SETTINGS: 'receivedUserSettings',
    RESET_SECTION: 'resetSection',
    UPDATED_EMAIL_ADDRESS: 'updatedEmailAddress',

    UPDATE_FAILED: 'updateFailed',
    UPDATE_FAILED_NAME_INVALID: 'updateFailedNameInvalid',
    UPDATE_FAILED_EMAIL_IN_USE: 'updateFailedEmailInUse',
    UPDATE_FAILED_EMAIL_ADDRESS: 'updateFailedEmailAddress',
    UPDATE_FIELD_FAILED: 'updateFieldFailed',
    UPDATE_PASSWORD_FAILED_INSUFFICIENTLY_COMPLEX: 'updatePasswordFailedInsufficientlyComplex',
    UPDATE_STARTED: 'updateStarted',
    UPDATE_SUCCEEDED: 'updateSucceeded',

    UNSUBSCRIBED_ALL_EMAILS: 'unsubscribedAllEmails',
    UPDATE_PENDING_CHANGES_STATUS: 'updatePendingChangesStatus',

    CANCEL_TWO_FACTOR_AUTHENTICATION_ACTION: 'cancelTwoFactorAuthenticationAction',
    DISABLE_TWO_FACTOR_AUTHENTICATION: 'disableTwoFactorAuthentication',
    ENABLE_TWO_FACTOR_AUTHENTICATION: 'enableTwoFactorAuthentication',
    LOAD_TWO_FACTOR_AUTHENTICATION_SETTINGS: 'loadTwoFactorAuthenticationSettings',
    LOADING_TWO_FACTOR_AUTHENTICATION_SETTINGS: 'loadingTwoFactorAuthenticationSettings',
    PERFORMING_TWO_FACTOR_AUTHENTICATION_SERVER_ACTION: 'performingTwoFactorAuthenticationServerAction',
    RECEIVED_INVALID_PASSWORD: 'receivedInvalidPassword',
    RECEIVED_SUCCESSFUL_DISABLING_TWO_FACTOR_AUTHENTICATION_RESPONSE:
      'receivedSuccessfulDisablingTwoFactorAuthenticationResponse',
    RECEIVED_TWO_FACTOR_AUTHENTICATION_CODE_CONFIRMATION_RESPONSE:
      'receivedTwoFactorAuthenticationCodeConfirmationResponse',
    RECEIVED_TWO_FACTOR_AUTHENTICATION_QR_CODE: 'receivedTwoFactorAuthenticationQRCode',
    RECEIVED_TWO_FACTOR_AUTHENTICATION_SETTINGS: 'receivedTwoFactorAuthenticationSettings',
    ACCOUNT_DELETED: 'accountDeleted',
    SET_TOP_SECTION: 'setTopSection',
  },

  Fields: {
    EMAIL_ADDRESS: 'email_address',
    EMAIL_PREFERENCES: 'email_preferences',
    FULL_NAME: 'fullName',
    ID: 'id',
    LOCALE: 'locale',
    NEW_PASSWORD: 'new_password',
    PASSWORD: 'password',
    TIMEZONE: 'timezone',
    WALLET: 'wallet',
    ALTERNATIVE_EMAIL: 'alternative_email',
  },

  FieldGroups: {
    PROFILE: 'profile', // user settings group including FULL_NAME, TIMEZONE, LOCALE
  },

  PartnerBannerStatus: {
    DISMISSED: 'dismissed',
    SUBSCRIBED: 'subscribed',
    UNSUBSCRIBED: 'unsubscribed',
  },

  TopSections: {
    ACCOUNT: 'Account',
    PAYMENT: 'Payment',
    EMAIL: 'Email',
    HIGHLIGHTS: 'Highlights',
    CALENDAR: 'Calendar',
  },

  Sections: {
    BASIC_INFORMATION: 'basicInformation',
    CREDIT_CARD_DELETE: 'creditCardDelete',
    COURSE_EMAIL_PREFERENCES: 'courseEmailPreferences',
    COURSERA_EMAIL_PREFERENCES: 'courseraEmailPreferences',
    GLOBAL_EMAIL_PREFERENCES: 'globalEmailPreferences',
    PARTNER_EMAIL_PREFERENCES: 'partnerEmailPreferences',
    PASSWORD: 'password',
    PERSONAL_ACCOUNT: 'personalAccount',
  },

  Subscriptions: {
    DISABLED: 'DISABLED',
    ENABLED: 'ENABLED',
    SUBSCRIBED: 'SUBSCRIBED',
    UNSUBSCRIBED: 'UNSUBSCRIBED',
  },

  TwoFactorAuthenticationStatus: {
    DISABLED: 'disabled',
    DISABLING_CONFIRMING_PASSWORD: 'disablingConfirmingPasword',
    ENABLED: 'enabled',
    ENABLING_CONFIRMING_PASSWORD: 'enablingConfirmingPassword',
    ENABLING_CONFIRMING_CODE: 'enablingConfirmingCode',
    LOADING: 'loading',
    UNAVAILABLE: 'unavailable',
  },

  UpdateStates: {
    FAILED: 'failed',
    FAILED_NEW_PASSWORD_NOT_SUFFICIENTLY_COMPLEX: 'passwordNotComplex',
    FAILED_NAME_INVALID: 'failedNameInvalid',
    FAILED_EMAIL_IN_USE: 'failedEmailInUse',
    FAILED_EMAIL_ADDRESS: 'failedEmailAddress',
    FAILED_SAME_PASSWORD: 'failedSamePassword',
    IDLE: 'idle',
    SUCCEEDED: 'succeeded',
    UPDATING: 'updating',
  },

  PaymentMethodSectionDisplayMode: {
    ENTER_CARD: 'enterCard',
    VIEW_CURRENT_CARD: 'viewCurrentCard',
  },

  /* TODO:
  /* The program is hard coded as C4C for testing purpose. The program id is expected to change to actual Arabic program id.
  */

  ArabicMembership: {
    programId: [
      'FSxmIeo7EeavDRL9DbMJZA',
      'qpzm_RjZEemVow7bmCPKPA',
      'VERpt-wYEeiAjBL0OhNnRA',
      'mq6zxO6NEeiS7hLGAiPFyg',
      'Kx2NwBp6EemQSw4P4a3-4A',
      'K22pIhp6Eemg8Ar3iMdNuA',
      'K7vw3Rp6EemnlBKU8xHCBA',
      'K_JpwBp6EemZJRL0zIudbA',
      'LDJYvBp6EemG1goRMfMYKA',
      'LGr05Bp6Eemg8Ar3iMdNuA',
      'LMMmzhp6Eemvrg5EkvgoWA',
      'LQ6vZhp6EemQSw4P4a3-4A',
      'LXTDyBp6Eemg8Ar3iMdNuA',
      'LaYNUBp6Eemliw5PelcQhA',
      'LfHi-xp6Eem2CgrzSg4eeA',
      'LilGYxp6EemnlBKU8xHCBA',
      'LmpHJBp6Eemvrg5EkvgoWA',
      'Lq3fxRp6EemwmA4jSZXXKA',
      'LvJjthp6Eem5qhJnmMqrhg',
      'L3b9Bxp6Eem5qhJnmMqrhg',
      'L7EfRxp6EemG1goRMfMYKA',
      'MALo2Bp6EemaAhIdvdxzpA',
      'MELYSRp6Eemliw5PelcQhA',
      'MO_hDBp6EemZJRL0zIudbA',
      'MS2szRp6EemW9AqIrtIhIA',
      'MWw8bxp6EemW9AqIrtIhIA',
      'MbcoEBp6Eem5qhJnmMqrhg',
      'MfkTahp6Eem2CgrzSg4eeA',
      'MjhmbRp6EemG1goRMfMYKA',
      'MpRowhp6EemW9AqIrtIhIA',
      'MsEeDRp6EemnlBKU8xHCBA',
      'Mxfw_xp6EemG1goRMfMYKA',
      'M2qk4Bp6EemG1goRMfMYKA',
      'M_kplRp6Eemliw5PelcQhA',
      'NDjxWBp6Eemg8Ar3iMdNuA',
      'NGsklBp6EemnlBKU8xHCBA',
      'ZfyhyBs2EemHHBJRsu0RQg',
      'Ml-ZDx1HEemBLg7W77zMwg',
      'dDPKKh4yEemU2ApH06_bWg',
      'IwgTLChaEemI_RJwqUCYqA',
      'M63vZBp6Eemg8Ar3iMdNuA',
    ],
  },
};

export default exported;

export const {
  CREDIT_CARD_SAFETY_LINK,
  EMAIL_PREFERENCE_LOGO_SIZE,
  PARTNER_BANNER_STATUS_RECEIVED,
  Actions,
  Fields,
  FieldGroups,
  PartnerBannerStatus,
  TopSections,
  Sections,
  Subscriptions,
  TwoFactorAuthenticationStatus,
  UpdateStates,
  PaymentMethodSectionDisplayMode,
  ArabicMembership,
} = exported;
