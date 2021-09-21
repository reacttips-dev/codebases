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

import { defineMessages, IntlShape } from 'react-intl'

const messages = defineMessages({
  ece_platform_admin: {
    id: 'auth-provider-messages.roles.platform.admin',
    defaultMessage: 'Platform admin',
  },
  ece_platform_viewer: {
    id: 'auth-provider-messages.roles.platform.viewer',
    defaultMessage: 'Platform viewer',
  },
  ece_deployment_manager: {
    id: 'auth-provider-messages.roles.deployments.manager',
    defaultMessage: 'Deployments manager',
  },
  ece_deployment_viewer: {
    id: 'auth-provider-messages.roles.deployments.viewer',
    defaultMessage: 'Deployments viewer',
  },
})

const hiddenRoles = ['ece_custom_elevated_by_default']

export function translateAndSortRoles(
  formatMessage: IntlShape['formatMessage'],
  roles: string[],
): string[] {
  // Translate the roles and *then* sort them
  return roles
    .filter((role) => !hiddenRoles.includes(role))
    .map((role) => (messages[role] ? formatMessage(messages[role]) : role))
    .sort((a, b) => a.localeCompare(b))
}
