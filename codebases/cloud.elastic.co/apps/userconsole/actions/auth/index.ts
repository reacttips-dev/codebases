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

import { loginAndRedirect as _loginAndRedirect } from '../../../../actions/auth'

interface LoginArgs {
  oktaRedirectUrl?: string
  redirectTo: string
  credentials: { username: string; password: string }
}

export function loginAndRedirect({ credentials, redirectTo, oktaRedirectUrl }: LoginArgs) {
  return _loginAndRedirect({
    credentials: {
      email: credentials.username,
      password: credentials.password,
    },
    redirectTo,
    oktaRedirectUrl,
  })
}
