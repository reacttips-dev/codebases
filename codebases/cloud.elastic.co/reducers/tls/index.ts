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

import { FETCH_TLS_CERTIFICATE, UPLOAD_TLS_CERTIFICATE } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { AsyncAction } from '../../types'
import { TlsPublicCertChain } from '../../lib/api/v1/types'

export interface State {
  [regionId: string]: {
    [certificateType: string]: TlsPublicCertChain
  }
}

interface FetchTlsCertificateAction
  extends AsyncAction<typeof FETCH_TLS_CERTIFICATE, TlsPublicCertChain> {
  meta: { regionId: string; certificateType: string }
}

interface UploadTlsCertificateAction extends AsyncAction<typeof UPLOAD_TLS_CERTIFICATE> {
  meta: { regionId: string; certificateType: string; chain: string[] }
}

type Action = FetchTlsCertificateAction | UploadTlsCertificateAction

export default function tlsReducer(state: State = {}, action: Action): State {
  if (action.type === FETCH_TLS_CERTIFICATE) {
    if (action.payload && !action.error) {
      const { regionId, certificateType } = action.meta
      return replaceIn(state, [regionId, certificateType], action.payload)
    }
  }

  if (action.type === UPLOAD_TLS_CERTIFICATE) {
    if (action.payload && !action.error) {
      const { regionId, certificateType, chain } = action.meta
      return replaceIn(state, [regionId, certificateType], {
        chain,
        user_supplied: true,
      })
    }
  }

  return state
}

export const getByRegion = (state: State, regionId: string) => state[regionId]

export const getById = (state: State, regionId: string, certificateTypeId: string) => {
  const certificates = getByRegion(state, regionId)

  if (!certificates) {
    return undefined
  }

  return certificates[certificateTypeId]
}
