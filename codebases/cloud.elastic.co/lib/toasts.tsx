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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import { addToast } from '../cui'

export const addTerminatedDeploymentToast = () => {
  addToast({
    family: `deployment-was-terminated`,
    color: `primary`,
    iconType: `broom`,
    title: (
      <FormattedMessage
        id='toasts.deployment-terminated.title'
        defaultMessage='Deployment terminated'
      />
    ),
    text: (
      <FormattedMessage
        id='toasts.deployment-terminated.text'
        defaultMessage='The deployment has been terminated.'
      />
    ),
  })
}

export const addDeletedDeploymentToast = () => {
  addToast({
    family: `deployment-was-deleted`,
    color: `primary`,
    iconType: `broom`,
    title: (
      <FormattedMessage id='toasts.deployment-deleted.title' defaultMessage='Deployment deleted' />
    ),
    text: (
      <FormattedMessage
        id='toasts.deployment-deleted.text'
        defaultMessage='The deployment has been deleted.'
      />
    ),
  })
}

export const addHiddenDeploymentToast = () => {
  addToast({
    family: `deployment-was-hidden`,
    color: `primary`,
    iconType: `broom`,
    title: (
      <FormattedMessage id='toasts.deployment-hidden.title' defaultMessage='Deployment hidden' />
    ),
    text: (
      <FormattedMessage
        id='toasts.deployment-hidden.text'
        defaultMessage='The deployment has been hidden.'
      />
    ),
  })
}

export const addExtendTrialToast = () => {
  addToast({
    family: `trial-extended`,
    color: `primary`,
    iconType: `email`,
    title: <FormattedMessage id='toasts.trial-extended.title' defaultMessage='Trial extended' />,
    text: (
      <FormattedMessage
        id='toasts.trial-extended.text'
        defaultMessage='We added 7 days to your trial period. This action can only be performed once.'
      />
    ),
  })
}

export const addUpdateBillingLevelToast = () => {
  addToast({
    'data-test-subj': `billing-level-updated`,
    family: `billing-updated`,
    color: `primary`,
    title: (
      <FormattedMessage id='toasts.billing-updated.title' defaultMessage='Change successful' />
    ),
    text: (
      <FormattedMessage
        id='toasts.billing-updated.text'
        defaultMessage='Your subscription is being updated. It might take a few moments to see the changes.'
      />
    ),
  })
}

export const addPendingBillingLevelToast = () => {
  addToast({
    'data-test-subj': `billing-level-pending`,
    family: `billing-level-pending`,
    color: `warning`,
    title: (
      <FormattedMessage
        data-test-id='billing-level-pending'
        id='toasts.billing-level-pending.title'
        defaultMessage='Change pending'
      />
    ),
    text: (
      <FormattedMessage
        id='toasts.billing-level-pending.text'
        defaultMessage='The subscription change was successful. The pending change begins with the next billing cycle.'
      />
    ),
  })
}
