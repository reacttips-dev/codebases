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

import adminConsoleMessages from '../../../../components/ChromeNavigation/navigationMessages'

const accountMessages = defineMessages({
  account: {
    id: `navigation.account`,
    defaultMessage: `Account`,
  },
  accountActivity: {
    id: `navigation.account.activity`,
    defaultMessage: `Activity`,
  },
  accountCostAnalysis: {
    id: `navigation.account.cost.analysis`,
    defaultMessage: `Cost analysis`,
  },
  accountApiKeys: {
    id: `navigation.account.api-keys`,
    defaultMessage: `API keys`,
  },
  accountProfile: {
    id: `navigation.account.profile`,
    defaultMessage: `Profile`,
  },
  accountContacts: {
    id: `navigation.account.contacts`,
    defaultMessage: `Contacts`,
  },
  accountSecurity: {
    id: `navigation.account.security`,
    defaultMessage: `Security`,
  },
  billing: {
    id: `navigation.account.billing`,
    defaultMessage: `Billing`,
  },
  billingHistory: {
    id: `navigation.account.billing-history`,
    defaultMessage: `Billing history`,
  },
  deploymentFeatures: {
    id: `navigation.deployments.features`,
    defaultMessage: `Features`,
  },
  loggingMonitoring: {
    id: `navigation.deployments.logging-monitoring`,
    defaultMessage: `Logs and metrics`,
  },
  extensionsOverview: {
    id: `navigation.extensions.overview`,
    defaultMessage: `Extensions`,
  },
  createExtension: {
    id: `navigation.extensions.create`,
    defaultMessage: `Create`,
  },
  support: {
    id: `navigation.support`,
    defaultMessage: `Support`,
  },
  indexCurationSettings: {
    id: `navigation.index-curation-settings`,
    defaultMessage: `Index curation`,
  },
  deploymentEdit: {
    id: `navigation.deployment.edit`,
    defaultMessage: `Edit`,
  },
  createDeployment: {
    id: `navigation.deployments.create-deployment`,
    defaultMessage: `Create deployment`,
  },
  accountTrafficFilters: {
    id: `navigation.account-traffic-filters`,
    defaultMessage: `Traffic filters`,
  },
  trustManagement: {
    id: `navigation.trust-management`,
    defaultMessage: `Trust`,
  },
})

export default {
  ...adminConsoleMessages,
  ...accountMessages,
}
