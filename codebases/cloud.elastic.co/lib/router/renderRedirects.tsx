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
import { Switch, Redirect } from 'react-router'

import { RedirectConfig } from './types'

export function renderRedirects(redirects: RedirectConfig[]) {
  return <Switch>{redirects.map(renderRedirect)}</Switch>
}

export function renderRedirect({
  from,
  to,
  exact = true,
  key = `${String(from)}__${String(to)}`,
}: RedirectConfig) {
  return <Redirect key={key} exact={exact} from={from} to={to} />
}
