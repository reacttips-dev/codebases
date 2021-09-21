/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */
import { defineMessages } from 'react-intl'

const messages = defineMessages({
  title: {
    id: 'user-settings.profile',
    defaultMessage: 'Profile',
  },
  profileDescriptionUsername: {
    id: 'user-settings.profile-description.username',
    defaultMessage: 'You can change your contact details but your username cannot be changed.',
  },
  profileDescriptionReadonlyUsername: {
    id: 'user-settings.profile-description.readonly-username',
    defaultMessage:
      'You are logged in through an external authentication provider, and cannot edit your profile here.',
  },
  profileDescriptionBuiltIn: {
    id: 'user-settings.profile-description.readonly-builtin',
    defaultMessage:
      'You are logged in with a system user. To change the password, please see the {documentation}.',
  },
  profileDescriptionPassword: {
    id: 'user-settings.profile-description.password',
    defaultMessage:
      'Passwords must be a minimum of 8 characters and should include at least one special character (e.g. %_@$).',
  },
  username: {
    id: 'user-settings.username',
    defaultMessage: 'Username',
  },
  optional: {
    id: 'user-settings.optional',
    defaultMessage: 'Optional',
  },
  fullName: {
    id: 'user-settings.full-name',
    defaultMessage: 'Full name',
  },
  password: {
    id: 'user-settings.password',
    defaultMessage: 'Password',
  },
  confirmPassword: {
    id: 'user-settings.confirm-password',
    defaultMessage: 'Confirm password',
  },
  contactEmail: {
    id: 'user-settings.contact-email',
    defaultMessage: 'Contact email',
  },
  roles: {
    id: 'user-settings.roles',
    defaultMessage: 'Roles',
  },
  updateFailed: {
    id: 'user-settings.update-failed',
    defaultMessage: 'Failed to update user settings',
  },
  updateSucceeded: {
    id: 'user-settings.update-succeeded',
    defaultMessage: 'User settings updated',
  },
  passwordUpdateFailed: {
    id: 'user-settings.password-update-failed',
    defaultMessage: 'Failed to update password',
  },
  passwordUpdateSucceeded: {
    id: 'user-settings.password-update-succeeded',
    defaultMessage: 'Password updated',
  },
  realmType: {
    id: 'user-settings.realm-type',
    defaultMessage: 'Security realm type',
  },
  realmId: {
    id: 'user-settings.realm-id',
    defaultMessage: 'Security realm ID',
  },
  documentation: {
    id: 'user-settings.documentation',
    defaultMessage: 'documentation',
  },
  passwordMustBeValid: {
    id: 'user-settings.passwords-must-be-valid',
    defaultMessage: 'Password must be at least 8 characters long.',
  },
  passwordMustMatch: {
    id: 'user-settings.passwords-must-match',
    defaultMessage: 'Passwords must match.',
  },
  updateProfile: {
    id: 'user-settings.update-profile',
    defaultMessage: 'Update profile',
  },
  changePassword: {
    id: 'user-settings.change-password',
    defaultMessage: 'Change password',
  },
  invalidEmail: {
    id: 'user-settings.invalid-email',
    defaultMessage: 'Email must contain "@".',
  },
})

export default messages
