/**
 * Interface with the server for Account Settings.
 */

import URI from 'jsuri';

import Q from 'q';
import _ from 'lodash';
import SettingsServerActionCreators from 'bundles/account-settings/actions/SettingsServerActionCreators';
import SettingsConstants from 'bundles/account-settings/constants/SettingsConstants';
import SettingsStore from 'bundles/account-settings/stores/SettingsStore';
import API from 'js/lib/api';
import cookie from 'js/lib/cookie';
import user from 'js/lib/user';
import { getActionUrl } from 'bundles/user-account/common/lib';

const {
  Sections,
  Fields,
  FieldGroups,
  Subscriptions,
  PartnerBannerStatus,
  EMAIL_PREFERENCE_LOGO_SIZE,
} = SettingsConstants;

const APIs = {
  email_address: API('/api/userEmails.v1', { type: 'rest' }),
  two_factor_authentication: API('/api/2fa/v1', { type: 'rest' }),
  onDemandCourses: API('/api/onDemandCourses.v1', { type: 'rest' }),
  v1SessionCourses: API('/api/courses.v1', { type: 'rest' }),
  email_preferences: API('/api/notificationPreferences.v2/', { type: 'rest' }),
  banner_view_status: API('/api/onDemandTutorialViews.v1/', { type: 'rest' }),
  partners: API('/api/partners.v1', { type: 'rest' }),
  password: API('/api/password/v1/change', { type: 'rest' }),
  profile: API('/api/profiles.v1', { type: 'rest' }),
  wallet: API('/api/paymentWallets.v1', { type: 'rest' }),
  account_deletion: API('/api/userAccounts.v1', { type: 'rest' }),
  product_ownerships: API('/api/productOwnerships.v1', { type: 'rest' }),
  name_change_request: API('maestro/api/credentials'),
  request_reset_password: API('/api/password/v2/requestReset', { type: 'rest' }),
  alternative_email: API('/api/userEmails.v2', { type: 'rest' }),
};

const BANNER_DISMISS_PREFIX = 'partnerBannerDismissed';
const EMAIL_IN_USE_ERROR = 'Email is already used by another account.';
const INVALID_NAME_ERROR = 'Invalid name';

const SettingsAPIUtils = {
  /**
   * Get current user settings
   * User and EmailPreferences needs to be fetched sequentially
   * And then courses and partners data can be fetched simultaneously
   * After all is done user data and email setting preferences are ready
   * @return {Object}
   */
  getUserSettings(userId) {
    return Q().then(() => {
      SettingsAPIUtils.fetchCreditCardPreferences(userId);
      SettingsAPIUtils.fetchPaymentWallets(userId);
      SettingsAPIUtils.fetchEmailPreferences(userId);
      SettingsAPIUtils.fetchProductOwnerships(userId);
    });
  },

  /**
   * CREDIT CARD
   */

  fetchCreditCardPreferences(userId) {
    SettingsAPIUtils.getCreditCardPreferences(userId).then((res) => {
      SettingsServerActionCreators.receivedCreditCardPreferences(res.elements[0]);
    });
  },

  fetchPaymentWallets(userId) {
    SettingsAPIUtils.getPaymentWallets(userId).then((res) => {
      SettingsServerActionCreators.receivedPaymentWallets(res.elements);
    });
  },

  getPaymentWallets(userId) {
    const uri = new URI();
    uri.addQueryParam('q', 'me');
    uri.addQueryParam('userId', userId);
    uri.addQueryParam('getLatest', 'true');
    uri.addQueryParam(
      'fields',
      'billingCountry,billingZipcode,creditCardExpiration,creditCardLastFourDigits,creditCardType,isValid,paymentProcessorId,email'
    );
    return Q(APIs[Fields.WALLET].get(uri.toString()));
  },

  /**
   * Get user credit card preferences
   * @return {Object}
   */
  getCreditCardPreferences(userId) {
    const uri = new URI();
    uri.addQueryParam('q', 'findByUser');
    uri.addQueryParam('userId', userId);
    uri.addQueryParam('getLatest', 'true');
    uri.addQueryParam('fields', 'creditCardExpiration,creditCardLastFourDigits,creditCardType,isValid');

    return Q(APIs[Fields.WALLET].get(uri.toString()));
  },

  /**
   * Get user credit card preferences
   * @param {Number} walletId
   * @return {Object}
   */
  deleteCreditCard(walletId) {
    SettingsServerActionCreators.updateStarted(Sections.CREDIT_CARD_DELETE);

    const uri = new URI(walletId);

    return Q(APIs[Fields.WALLET].delete(uri.toString()))
      .then((data) => {
        SettingsServerActionCreators.updateSucceeded(Sections.CREDIT_CARD_DELETE, data);
      })
      .catch(() => {
        SettingsServerActionCreators.updateFailed(Sections.CREDIT_CARD_DELETE);
      });
  },

  /**
   * EMAILS
   */

  fetchEmailPreferences(userId) {
    SettingsAPIUtils.getEmailPreferences(userId).then((response) => {
      const notificationPref = response.elements[0];
      const coursePreferences = notificationPref.courses.preferences;

      let courseIds = _.keys(coursePreferences);

      // help desk degrees and certificates students enrollment has to be filtered out
      courseIds = courseIds.filter((id) => id !== 'xlDT6ls8EeaFYA4dzi3AFw');

      const partnerIds = _.keys(notificationPref.partners.preferences);

      if (_.isEmpty(partnerIds)) {
        const mergedPreferences = SettingsAPIUtils.mergePreferences(notificationPref);
        SettingsServerActionCreators.receivedEmailPreferences(notificationPref, mergedPreferences);
      } else {
        SettingsAPIUtils.getPartners(partnerIds).then((partnerResponse) => {
          const partnersData = partnerResponse.elements;
          const coursePromises = SettingsAPIUtils.getCoursePromises(courseIds);

          Q.all(coursePromises).then((data) => {
            let coursesData = [];
            _.map(data, (cd) => {
              coursesData.push(cd.elements);
            });
            coursesData = _.flattenDeep(coursesData);
            const mergedPref = SettingsAPIUtils.mergePreferences(notificationPref, coursesData, partnersData);
            SettingsServerActionCreators.receivedEmailPreferences(notificationPref, mergedPref);
          });
        });
      }
    });
  },

  /**
   * Updates email preferences
   * @param {String} section
   * @param {Object} preferences
   * @return {Object}
   */
  updateEmailPreferences(section, preferences) {
    const userId = user.get().id;
    const uri = new URI(userId);
    const preparedPreferences = this.preparePreferences(section, preferences);
    SettingsServerActionCreators.updateStarted(section);

    return Q(
      APIs[Fields.EMAIL_PREFERENCES].put(uri.toString(), {
        data: preparedPreferences,
      })
    )
      .then(() => {
        SettingsServerActionCreators.updateSucceeded(section);
      })
      .catch(() => {
        SettingsServerActionCreators.updateFailed(section);
      })
      .done(() => {
        SettingsAPIUtils.fetchEmailPreferences(userId);
      });
  },

  /**
   * Get user email preferences
   * @return {Object}
   */
  getEmailPreferences(userId) {
    const uri = new URI(userId);
    uri.addQueryParam('fields', 'volunteer');

    return Q(APIs[Fields.EMAIL_PREFERENCES].get(uri.toString()));
  },

  /**
   * Unsubscribe from all emails by explicitly changing all emails preferences to UNSUBSCRIBED
   */
  unsubscribeAllEmails() {
    const uri = new URI(user.get().id);
    const notificationPreferences = SettingsStore.getNotificationPreferences();
    SettingsServerActionCreators.updateStarted(Sections.GLOBAL_EMAIL_PREFERENCES);

    notificationPreferences.global = Subscriptions.DISABLED;
    notificationPreferences.promotions.email = Subscriptions.UNSUBSCRIBED;
    notificationPreferences.recommendations.email = Subscriptions.UNSUBSCRIBED;
    notificationPreferences.volunteer.email = Subscriptions.UNSUBSCRIBED;

    _.forEach(notificationPreferences.partners.preferences, (partnerPreference) => {
      partnerPreference.subscriptions.email = Subscriptions.UNSUBSCRIBED;
    });

    _.forEach(notificationPreferences.courses.preferences, (partnerPreference) => {
      partnerPreference.announcements.email = Subscriptions.UNSUBSCRIBED;
      if (partnerPreference.reminders) {
        partnerPreference.reminders.email = Subscriptions.UNSUBSCRIBED;
      }
    });

    return Q(
      APIs[Fields.EMAIL_PREFERENCES].put(uri.toString(), {
        data: notificationPreferences,
      })
    )
      .then(() => {
        SettingsServerActionCreators.updateSucceeded(Sections.GLOBAL_EMAIL_PREFERENCES);
        SettingsServerActionCreators.unsubscribedAllEmails();
      })
      .catch(() => {
        SettingsServerActionCreators.updateFailed(Sections.GLOBAL_EMAIL_PREFERENCES);
      })
      .done(() => {
        this.getUserSettings();
      });
  },

  togglePartnerEmailSubscription(partnerId, courseId, subscribe) {
    const preference = {};
    preference[partnerId] = {
      id: partnerId,
      value: {
        subscriptions: subscribe,
      },
    };
    const subscription = subscribe ? PartnerBannerStatus.SUBSCRIBED : PartnerBannerStatus.UNSUBSCRIBED;
    SettingsAPIUtils.updateEmailPreferences(Sections.PARTNER_EMAIL_PREFERENCES, preference).done(() => {
      SettingsServerActionCreators.partnerBannerStatusReceived(partnerId, subscription);
      this.dismissPartnerBanner(courseId, partnerId, true);
    });
  },

  /**
   * Check partner marketing email status (Dismissed, Subscribed or Waiting)
   * If not dismissed will check if user is already subscribed to partner emails
   * Otherwise the status is Waiting meaning banner will show up to ask user to subscribe or dismiss
   * @param courseId
   * @param partnerId
   */
  checkPartnerBannerStatus(courseId, partnerId) {
    const userId = user.get().id;
    const uri = new URI(`${userId}~${BANNER_DISMISS_PREFIX}-${courseId}-${partnerId}`);

    return Q(APIs.banner_view_status.get(uri.toString()))
      .then(() => {
        SettingsServerActionCreators.partnerBannerStatusReceived(partnerId, PartnerBannerStatus.DISMISSED);
      })
      .catch(() => {
        this.getEmailPreferences(userId).then((response) => {
          const preferences = response.elements[0];
          const partnerPreference = preferences.partners.preferences[partnerId];
          let subscriptionStatus = PartnerBannerStatus.SUBSCRIBED;

          if (partnerPreference && partnerPreference.subscriptions.email === Subscriptions.UNSUBSCRIBED) {
            subscriptionStatus = PartnerBannerStatus.UNSUBSCRIBED;
          }

          SettingsServerActionCreators.receivedEmailPreferences(preferences, null);
          SettingsServerActionCreators.partnerBannerStatusReceived(partnerId, subscriptionStatus);
        });
      });
  },

  dismissPartnerBanner(courseId, partnerId, quiet) {
    const userId = user.get().id;
    const uri = new URI(`${userId}~${BANNER_DISMISS_PREFIX}-${courseId}-${partnerId}`);
    return Q(APIs.banner_view_status.put(uri.toString())).done(() => {
      if (!quiet) {
        SettingsServerActionCreators.partnerBannerStatusReceived(partnerId, PartnerBannerStatus.DISMISSED);
      }
    });
  },

  /**
   * PASSWORD
   */

  /**
   * Updates account password
   * @param {Object} passwords - current and newPassword
   * @return {Object}
   */
  resetPassword(passwords) {
    SettingsServerActionCreators.updateStarted(Sections.PASSWORD);
    if (passwords.newPassword !== passwords.retypedPassword) {
      SettingsServerActionCreators.updateFieldFailed(Fields.NEW_PASSWORD);
      SettingsServerActionCreators.updateFailed(Sections.PASSWORD);
    } else {
      const formData = new FormData();
      formData.append('currentPassword', passwords.currentPassword);
      formData.append('newPassword', passwords.newPassword);

      return Q(
        APIs.password.post('', {
          contentType: false,
          processData: false,
          data: formData,
        })
      )
        .then((data) => {
          SettingsServerActionCreators.updateSucceeded(Sections.PASSWORD, data);
        })
        .catch((error) => {
          if (error.responseText === 'Password is not sufficiently complex') {
            SettingsServerActionCreators.updatePasswordFailedInsufficientlyComplex(Sections.PASSWORD);
          } else if (error.responseText === 'Incorrect existing password') {
            SettingsServerActionCreators.updateFieldFailed(Fields.PASSWORD);
            SettingsServerActionCreators.updateFailed(Sections.PASSWORD);
          } else {
            SettingsServerActionCreators.updateFailed(Sections.PASSWORD);
          }
        });
    }
  },

  requestResetPassword() {
    SettingsServerActionCreators.updateStarted(Sections.PERSONAL_ACCOUNT);
    const data = { email: user.get().email_address };

    return Q(APIs.request_reset_password.post('', { data })).then((response) => {
      SettingsServerActionCreators.updateSucceeded(Sections.PERSONAL_ACCOUNT, response);
    });
  },

  addAlternativeEmail(email) {
    SettingsServerActionCreators.updateStarted(Sections.PERSONAL_ACCOUNT);
    const uri = new URI().addQueryParam('action', 'insert');
    const data = {
      isPrimary: false,
      isVerified: false,
      email,
      userId: Number(user.get().id),
    };

    return Q(
      APIs.alternative_email.post(uri.toString(), {
        data,
      })
    )
      .then((response) => {
        SettingsServerActionCreators.updateSucceeded(Sections.PERSONAL_ACCOUNT, response);
      })
      .catch((error) => {
        if (error.responseJSON && error.responseJSON.message.includes('already exists')) {
          SettingsServerActionCreators.updateFailedEmailInUse(Sections.PERSONAL_ACCOUNT);
        } else {
          SettingsServerActionCreators.updateFailed(Sections.PERSONAL_ACCOUNT);
          SettingsServerActionCreators.updateFieldFailed(Fields.ALTERNATIVE_EMAIL);
        }
        return error;
      });
  },

  /**
   * Verifies user's password and disables Two-Factor Authentication
   */
  confirmPasswordToDisableTwoFactorAuthentication(password) {
    // HACK to get around not being able to dispatch in the middle of a dispatch
    setTimeout(() => SettingsServerActionCreators.beginTwoFactorAuthenticationServerAction());
    const uri = new URI('/disable');

    return Q(
      APIs.two_factor_authentication.post(uri.toString(), {
        data: { password },
      })
    )
      .then((res) => SettingsServerActionCreators.receivedSuccessfulDisablingTwoFactorAuthenticationResponse())
      .catch(() => SettingsServerActionCreators.receivedInvalidPassword())
      .done();
  },

  /**
   * TWO FACTOR
   */

  /**
   * Loads Two-Factor Authentication settings from the server
   */
  loadTwoFactorAuthenticationSettings() {
    // HACK to get around not being able to dispatch in the middle of a dispatch
    setTimeout(() => SettingsServerActionCreators.beganLoadingTwoFactorAuthenticationSettings());
    const uri = new URI('/enabled');

    return Q(APIs.two_factor_authentication.get(uri.toString()))
      .then((settings) => SettingsServerActionCreators.receivedTwoFactorAuthenticationSettings(settings))
      .done();
  },

  /**
   * Verifies user's password and receives QR code to continue Two-Factor Authentication setup process
   */
  confirmPasswordToEnableTwoFactorAuthentication(password) {
    // HACK to get around not being able to dispatch in the middle of a dispatch
    setTimeout(() => SettingsServerActionCreators.beginTwoFactorAuthenticationServerAction());
    const uri = new URI('/create');

    return Q(
      APIs.two_factor_authentication.post(uri.toString(), {
        data: { password },
      })
    )
      .then((res) => SettingsServerActionCreators.receivedTwoFactorQRCode(res.details.imgSrc))
      .catch(() => SettingsServerActionCreators.receivedInvalidPassword())
      .done();
  },

  /**
   * Verifies user's password and receives QR code to continue Two-Factor Authentication setup process
   */
  confirmTwoFactorAuthenticationCode(code) {
    // HACK to get around not being able to dispatch in the middle of a dispatch
    setTimeout(() => SettingsServerActionCreators.beginTwoFactorAuthenticationServerAction());
    const uri = new URI('/enable');

    return Q(APIs.two_factor_authentication.post(uri.toString(), { data: { code } }))
      .then((res) => SettingsServerActionCreators.receivedConfirmTwoFactorAuthenticationCodeResponse(true))
      .catch(() => SettingsServerActionCreators.receivedConfirmTwoFactorAuthenticationCodeResponse(false))
      .done();
  },

  /**
   * DATA MANIPULATION
   */

  /**
   * Prepares preferences request body
   * @param {String} type
   * @param {Object} preferences
   * @return {Object}
   */
  preparePreferences(type, preferences) {
    const notificationPreferences = SettingsStore.getNotificationPreferences() || {};
    let emailPreferences;
    // Re-enable global email subscription when any email pref is changed
    notificationPreferences.global = Subscriptions.ENABLED;

    switch (type) {
      case Sections.COURSE_EMAIL_PREFERENCES:
        emailPreferences = notificationPreferences.courses ? notificationPreferences.courses.preferences : {};
        break;
      case Sections.PARTNER_EMAIL_PREFERENCES:
        emailPreferences = notificationPreferences.partners ? notificationPreferences.partners.preferences : {};
        break;
      case Sections.COURSERA_EMAIL_PREFERENCES:
        emailPreferences = notificationPreferences;
        break;
    }

    _.forEach(preferences, (preference) => {
      _.forEach(preference.value, (value, key) => {
        const subscription = value ? Subscriptions.SUBSCRIBED : Subscriptions.UNSUBSCRIBED;
        if (type === Sections.COURSERA_EMAIL_PREFERENCES) {
          if (preference.id === 'degrees') {
            if (!emailPreferences[preference.id] || !emailPreferences[preference.id].preference)
              emailPreferences[preference.id] = { preferences: {} };
            emailPreferences[preference.id].degree_eoi = subscription;
          } else {
            if (!emailPreferences[preference.id]) emailPreferences[preference.id] = {};
            emailPreferences[preference.id].email = subscription;
          }
        } else if (emailPreferences[preference.id]) {
          emailPreferences[preference.id][key].email = subscription;
        } else {
          emailPreferences[preference.id] = {
            [key]: {
              email: subscription,
            },
          };
        }
      });
    });

    return notificationPreferences;
  },

  /**
   * Updates a field
   * @param {String} type
   * @param {String} value
   * @return {Object}
   */
  update(type, value) {
    return Q(
      APIs[type].post('', {
        contentType: 'application/x-www-form-urlencoded',
        processData: true,
        data: { [type]: value },
      })
    ).catch((error) => {
      SettingsServerActionCreators.updateFieldFailed(type, error);
      return { type, error };
    });
  },

  /**
   * Merges course and partners data to email preferences
   * @param {Array} preferences
   * @param {Array} courses
   * @param {Array} partners
   * @return {Object}
   */
  mergePreferences(preferences, courses, partners) {
    const mergedPreferences = {
      courses: [],
      partners: [],
      coursera: {
        promotions: preferences.promotions?.email === Subscriptions.SUBSCRIBED,
        recommendations: preferences.recommendations?.email === Subscriptions.SUBSCRIBED,
        volunteer: preferences.volunteer?.email === Subscriptions.SUBSCRIBED,
        degrees: preferences.degrees?.degree_eoi === Subscriptions.SUBSCRIBED,
      },
    };

    _.map(preferences.courses.preferences, function (preference, courseId) {
      const foundCourses = _.filter(courses, { id: courseId });
      if (!_.isEmpty(foundCourses)) {
        const course = foundCourses[0];
        const mergedCourse = {
          id: courseId,
          value: {
            announcements: preference.announcements.email === Subscriptions.SUBSCRIBED,
          },
          name: course.name,
        };
        if (course.photoUrl || course.promoPhoto) {
          const logo =
            course.photoUrl || `https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/${course.promoPhoto}`;
          mergedCourse.logo = `${logo}?h=${EMAIL_PREFERENCE_LOGO_SIZE}`;
        }
        if (course.partnerIds) {
          const partner = _.find(partners, { id: course.partnerIds[0] });
          mergedCourse.description = partner && partner.name;
        }
        if (preference.reminders) {
          mergedCourse.value.reminders = preference.reminders.email === Subscriptions.SUBSCRIBED;
        }
        if (preference.discussionForums) {
          mergedCourse.value.discussionForums = preference.discussionForums.email === Subscriptions.SUBSCRIBED;
        }
        mergedPreferences.courses.push(mergedCourse);
      }
    });

    mergedPreferences.courses = this.groupCourses(mergedPreferences.courses);

    _.map(preferences.partners.preferences, function (preference, partnerId) {
      const foundPartners = _.filter(partners, { id: partnerId });
      if (!_.isEmpty(foundPartners)) {
        const partner = foundPartners[0];
        const mergedPartner = {
          id: partnerId,
          value: {
            subscriptions: preference.subscriptions.email === Subscriptions.SUBSCRIBED,
          },
          name: partner.name,
        };
        if (partner.squareLogo) {
          mergedPartner.logo = partner.squareLogo;
        }
        mergedPreferences.partners.push(mergedPartner);
      }
    });

    return mergedPreferences;
  },

  /**
   * Checks whether a user can delete by themselves or has paid for a product and therefore needs to submit
   * a support request
   */
  getProductOwnerships() {
    const uri = new URI();
    uri.addQueryParam('q', 'getByUser');
    uri.addQueryParam('id', user.get().id);
    uri.addQueryParam('ownsAndExpiredOwnsFilter', true);

    return Q(APIs.product_ownerships.get(uri.toString()));
  },

  /**
   * Get all courses information by id
   * @param {Array} courseIds
   * @param {string} type onDemandCourses | v1SessionCourses
   * @return {Object}
   */
  getCourses(courseIds, type = 'onDemandCourses') {
    if (_.isEmpty(courseIds)) {
      return Q();
    } else {
      const uri = new URI().addQueryParam('ids', courseIds).addQueryParam('fields', 'photoUrl, partnerIds');
      return Q(APIs[type].get(uri.toString()));
    }
  },

  /**
   * Returns promises for getting courses for the user
   * @param {Array} courseIds
   * @return {Object}
   */
  getCoursePromises(courseIds) {
    const onDemandCoursePromises = [];
    const v1SessionCoursePromises = [];
    const onDemandCourseIds = courseIds.filter((id) => !/^v1/.test(id));
    const v1SessionCourseIds = courseIds.filter((id) => /^v1/.test(id));

    const idLimit = 70; // We cross the URI length limit at 79 ids

    for (let i = 0; i < onDemandCourseIds.length; i += idLimit) {
      onDemandCoursePromises.push(
        SettingsAPIUtils.getCourses(onDemandCourseIds.slice(i, i + idLimit), 'onDemandCourses')
      );
    }

    for (let i = 0; i < v1SessionCourseIds.length; i += idLimit) {
      v1SessionCoursePromises.push(
        SettingsAPIUtils.getCourses(v1SessionCourseIds.slice(i, i + idLimit), 'v1SessionCourses')
      );
    }

    return [...onDemandCoursePromises, ...v1SessionCoursePromises];
  },

  /**
   * Get all partners information by id
   * @param {Array} partnerIds
   * @return {Object}
   */
  getPartners(partnerIds) {
    if (_.isEmpty(partnerIds)) {
      return Q();
    } else {
      const uri = new URI().addQueryParam('ids', partnerIds);
      return Q(APIs.partners.get(uri.toString()));
    }
  },

  /**
   * Groups phoenix and spark courses in two lists
   * Sorts each array by course name and flatten the sorted result as a list
   * @param courses
   * @return {Array} of courses
   */
  groupCourses(courses) {
    const groupedCourses = _.groupBy(courses, (course) => course.id.indexOf('v1-') === 0);
    const phoenixCourses = this.sortCoursesByName(groupedCourses.false);
    const sparkCourses = this.sortCoursesByName(groupedCourses.true);

    return phoenixCourses.concat(sparkCourses);
  },

  /**
   * Sorts courses by course name
   * @param courses
   * @return {Array} of courses
   */
  sortCoursesByName(courses) {
    return _.sortBy(courses, (course) => course.name);
  },

  /**
   * Groups account settings by API endpoints
   * @param  {Object} settings
   * @return {Object} structured settings
   */
  getGroupedSettings(settings) {
    const profileSettings = [Fields.FULL_NAME, Fields.TIMEZONE, Fields.LOCALE];
    return settings.reduce(
      (settingsDict, setting) => {
        if (profileSettings.includes(setting.type)) {
          settingsDict.profile.push(setting);
          return settingsDict;
        } else {
          return Object.assign({}, settingsDict, {
            [setting.type]: setting.value,
          });
        }
      },
      { profile: [] }
    );
  },

  /**
   * Updates all basic information fields
   * And notifies if email address is changed
   * @param {Object} settings
   */
  updateBasicInformation(settings, userData = {}) {
    const groupedSettings = this.getGroupedSettings(settings);
    SettingsServerActionCreators.updateStarted(Sections.BASIC_INFORMATION);
    _.reduce(
      groupedSettings,
      (lastUpdate, settingValue, settingType) => {
        if (settingType === FieldGroups.PROFILE) {
          return lastUpdate.then(() => {
            if (settingValue.length > 0) {
              const data = {
                id: userData.userId.toString(),
                userId: userData.userId,
                externalId: userData.externalId,
                privacy: userData.privacy,
              };
              settingValue.forEach((setting) => {
                data[setting.type] = setting.value;
              });
              return Q(APIs[settingType].put(userData.userId.toString(), { data }));
            }
            return Q();
          });
        } else {
          return lastUpdate.then(_.partial(SettingsAPIUtils.update, settingType, settingValue));
        }
      },
      Q()
    )
      .then((data) => {
        SettingsServerActionCreators.updateSucceeded(Sections.BASIC_INFORMATION, data);
      })
      .catch((error) => {
        if (error.responseJSON && error.responseJSON?.message?.includes(EMAIL_IN_USE_ERROR)) {
          SettingsServerActionCreators.updateFailedEmailInUse(Sections.BASIC_INFORMATION);
        } else if (error.responseJSON && error.responseJSON.message === INVALID_NAME_ERROR) {
          SettingsServerActionCreators.updateFailedNameInvalid(Sections.BASIC_INFORMATION);
        } else {
          SettingsServerActionCreators.updateFailed(Sections.BASIC_INFORMATION);
        }
      })
      .done();
  },

  /**
   * Updates email address using password
   * @param {String} email
   * @param {String} password
   * @param {Number} userId
   */
  updateEmailAddressWithPassword(email, password, userId) {
    return Q(
      APIs.email_address.put(userId.toString(), {
        data: {
          email,
          password,
          sendVerificationEmail: true,
        },
      })
    )
      .then((data) => {
        SettingsServerActionCreators.updatedEmailAddress(email);
        SettingsServerActionCreators.updateSucceeded(Sections.BASIC_INFORMATION, data);
      })
      .catch((error) => {
        if (error.responseJSON && error.responseJSON?.message?.includes(EMAIL_IN_USE_ERROR)) {
          SettingsServerActionCreators.updateFailedEmailInUse(Sections.BASIC_INFORMATION);
        } else {
          throw error;
        }
      });
  },

  /**
   * Submits name change request
   * @param {Object} data
   */
  submitNameChangeRequest(nameChangeData) {
    const uri = new URI('/rename_profile');
    return Q(APIs.name_change_request.post(uri.toString(), { data: nameChangeData }));
  },

  logout() {
    const logoutAPI = API(getActionUrl('logout', cookie.get('CSRF3-Token')));
    return Q(
      logoutAPI.post('', {
        contentType: 'application/x-www-form-urlencoded',
        processData: true,
      })
    )
      .then(() => {
        SettingsServerActionCreators.accountDeleted();
      })
      .catch()
      .done();
  },
};

export default SettingsAPIUtils;

export const {
  getUserSettings,
  fetchCreditCardPreferences,
  fetchPaymentWallets,
  getCreditCardPreferences,
  deleteCreditCard,
  fetchEmailPreferences,
  updateEmailPreferences,
  getEmailPreferences,
  unsubscribeAllEmails,
  togglePartnerEmailSubscription,
  checkPartnerBannerStatus,
  dismissPartnerBanner,
  resetPassword,
  requestResetPassword,
  addAlternativeEmail,
  confirmPasswordToDisableTwoFactorAuthentication,
  loadTwoFactorAuthenticationSettings,
  confirmPasswordToEnableTwoFactorAuthentication,
  confirmTwoFactorAuthenticationCode,
  preparePreferences,
  update,
  mergePreferences,
  getProductOwnerships,
  getCourses,
  getPartners,
  groupCourses,
  sortCoursesByName,
  getGroupedSettings,
  updateBasicInformation,
  updateEmailAddressWithPassword,
  submitNameChangeRequest,
  logout,
} = SettingsAPIUtils;
