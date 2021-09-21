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

import { parse } from 'query-string'
import { omit } from 'lodash'

import { getMarketoTrackingParamsFromCookies } from '../../../lib/marketo'

import { CreateSaasUserRequest } from '../../../lib/api/v1/types'

export const getCreateUserPayload = (queryString: string): Partial<CreateSaasUserRequest> => {
  const query = parse(queryString.slice(1))

  const { source, settings, ...rest } = query
  const trackingData = { ...omit(rest, `fromURI`), ...getMarketoTrackingParamsFromCookies() }

  return {
    has_accepted_terms_and_policies: true,
    wants_informational_emails: true,
    tracking_data: trackingData,
    source: typeof source === `string` ? source : undefined,
    settings: typeof settings === `string` ? settings : undefined,
  }
}
