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
  modalTitle: {
    id: `update-subscription-modal.title`,
    defaultMessage: `Update subscription`,
  },
  modalDescription: {
    id: `update-subscription-modal.description`,
    defaultMessage: `Select the subscription that's right for you:`,
  },
  standard: {
    id: `update-subscription.standard.pretty-name`,
    defaultMessage: `Standard`,
  },
  gold: {
    id: `update-subscription.gold.pretty-name`,
    defaultMessage: `Gold`,
  },
  platinum: {
    id: `update-subscription.platinum.pretty-name`,
    defaultMessage: `Platinum`,
  },
  enterprise: {
    id: `update-subscription.enterprise.pretty-name`,
    defaultMessage: `Enterprise`,
  },
  coreFeatures: {
    id: `update-subscription.standard.features.core-features`,
    defaultMessage: `Core Elastic Stack security features`,
  },
  capabilities: {
    id: `update-subscription.standard.features.capabilities`,
    defaultMessage: `Capabilities such as Elastic APM, SIEM, and Maps`,
  },
  canvasAndLens: {
    id: `update-subscription.standard.features.canvas-lens`,
    defaultMessage: `Canvas & Lens`,
  },
  ticketSupport: {
    id: `update-subscription.standard.features.ticket-support`,
    defaultMessage: `Ticket-based support for up to 2 support contacts`,
  },
  configurableMonitoring: {
    id: `update-subscription.gold.features.configurable-monitoring`,
    defaultMessage: `Configurable monitoring retention policy`,
  },
  customExtensions: {
    id: `update-subscription.gold.features.custom-extensions`,
    defaultMessage: `Custom extensions`,
  },
  pdfPng: {
    id: `update-subscription.gold.features.pdf-png`,
    defaultMessage: `PDF and PNG reports`,
  },
  businessHoursSupport: {
    id: `update-subscription-.gold.features.business-hours-support`,
    defaultMessage: `Business hours only support for up to 6 support contacts`,
  },
  machineLearning: {
    id: `update-subscription.platinum.features.machine-learning`,
    defaultMessage: `Machine learning with anomaly detection and forecasting`,
  },
  advancedFeatures: {
    id: `update-subscription.platinum.features.advanced-features`,
    defaultMessage: `Advanced Elastic Stack security features`,
  },
  graph: {
    id: `update-subscription.platinum.features.graph`,
    defaultMessage: `Graph exploration and analytics`,
  },
  totalSupport: {
    id: `update-subscription.platinum.total-support`,
    defaultMessage: `24/7/365 support for up to 8 support contacts`,
  },
  everythingInPlatinum: {
    id: `update-subscription.enterprise.everything-in-platinum`,
    defaultMessage: `Everything included in Platinum`,
  },
  searchableSnapshots: {
    id: `update-subscription.enterprise.searchable-snapshots`,
    defaultMessage: `Searchable snapshots`,
  },
  recommended: {
    id: `update-subscription.recommended`,
    defaultMessage: `Recommended`,
  },
  pricingPage: {
    id: `update-subscription.pricing-page`,
    defaultMessage: `See our {pricingPage}.`,
  },
  perHour: {
    id: `update-subscription.stat-description`,
    defaultMessage: `per hour`,
  },
  cancel: {
    id: `update-subscription.cancel-update`,
    defaultMessage: `Cancel`,
  },
  save: {
    id: `update-subscription.save-update`,
    defaultMessage: `Save subscription`,
  },
  usageWarning: {
    id: `update-subscription.usage-warning`,
    defaultMessage: `You are using {usageLevel} features that must be removed before you can change your subscription level. {seeRequiredChanges}.`,
  },
  seeRequiredChanges: {
    id: `update-subscription.usage-warning.see-changes`,
    defaultMessage: `See required changes`,
  },
  confirmSubscriptionTitle: {
    id: `confirm-subscription.title`,
    defaultMessage: `Change to {selectedSubscription}`,
  },
  confirmSubscriptionCancel: {
    id: `confirm-subscription.cancel`,
    defaultMessage: `No thanks `,
  },
  confirmSubscriptionConfirm: {
    id: `confirm-subscription.confirm`,
    defaultMessage: `Yes, update subscription `,
  },
  upgradeConfirmSubscriptionDescription: {
    id: `confirm-upgrade-subscription.description`,
    defaultMessage: `Your subscription and benefits increase immediately. If you change to a lower subscription
    later, it will not take affect until the next billing cycle. Do you want to continue?`,
  },
  firstBillingCycleConfirmSubscriptionDescription: {
    id: `first-billing-cycle-update.description`,
    defaultMessage: `Your subscription and benefits change immediately. Do you want to continue?`,
  },
  downgradeConfirmSubscriptionDescription: {
    id: `confirm-downgrade-subscription.description`,
    defaultMessage: `Your subscription change begins with the next billing cycle. {subscriptionLevels} features are not available with the selected subscription. Do you still want to continue?`,
  },
})

export const billingSubscriptions = (formatMessage) => [
  {
    value: 'standard',
    prettyName: formatMessage(messages.standard),
    features: [
      { text: messages.coreFeatures },
      { text: messages.capabilities },
      { text: messages.canvasAndLens },
      { text: messages.ticketSupport },
    ],
  },
  {
    value: 'gold',
    prettyName: formatMessage(messages.gold),
    features: [
      { text: messages.configurableMonitoring },
      { text: messages.customExtensions },
      { text: messages.pdfPng },
      { text: messages.businessHoursSupport },
    ],
  },
  {
    value: 'platinum',
    prettyName: formatMessage(messages.platinum),
    features: [
      { text: messages.advancedFeatures },
      { text: messages.machineLearning },
      { text: messages.graph },
      { text: messages.totalSupport },
    ],
    recommended: true,
  },
  {
    value: 'enterprise',
    prettyName: formatMessage(messages.enterprise),
    features: [{ text: messages.everythingInPlatinum }, { text: messages.searchableSnapshots }],
  },
]

export default messages
