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

import { portalUrl } from './urlBuilder'

import { messages as portalMessages } from '../components/Portal/messages'

import { RoutableBreadcrumb } from '../types'

export const rootPortalCrumbs = (): RoutableBreadcrumb[] => [
  {
    text: <FormattedMessage {...portalMessages.elasticCloud} />,
  },
]

export const rootEssCloudCrumbs = (): RoutableBreadcrumb[] => [
  {
    text: <FormattedMessage {...portalMessages.elasticCloud} />,
  },
]

export const portalCrumbs = (): RoutableBreadcrumb[] => [
  {
    to: portalUrl(),
    text: <FormattedMessage {...portalMessages.elasticCloud} />,
  },
]

export const portalUserSettingsCrumbs = (): RoutableBreadcrumb[] => [
  {
    text: <FormattedMessage {...portalMessages.userSettings} />,
  },
]
