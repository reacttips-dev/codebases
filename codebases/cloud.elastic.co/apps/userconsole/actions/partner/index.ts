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

import asyncRequest from '../../../../actions/asyncRequests'

import { SIGN_UP_AWS_USER, SIGN_UP_GCP_USER, SIGN_UP_AZURE_USER } from '../../constants/actions'
import { ThunkAction } from '../../../../types'

export interface PartnerUser {
  firstName: string
  lastName: string
  email: string
  company: string
  wantsInformationalEmails: boolean
}

function signUpPartnerUser(
  token,
  action,
  { firstName, lastName, email, company, wantsInformationalEmails }: PartnerUser,
): ThunkAction {
  const url = `/api/v0/users`

  const payload = {
    email,
    data: {
      first_name: firstName,
      last_name: lastName,
      company_name: company,
    },
    has_accepted_terms_and_policies: true,
    wants_informational_emails: wantsInformationalEmails,
    ...token,
  }

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: action,
        method: `POST`,
        url,
        payload,
        meta: {
          email,
        },
      }),
    )
}

export function signUpAwsUser(token, args) {
  return signUpPartnerUser({ aws_registration_token: token }, SIGN_UP_AWS_USER, args)
}

export function signUpGcpUser(token, args) {
  return signUpPartnerUser({ gcp_registration_token: token }, SIGN_UP_GCP_USER, args)
}

export function signUpAzureUser(token, args) {
  return signUpPartnerUser({ azure_access_token: token }, SIGN_UP_AZURE_USER, args)
}
