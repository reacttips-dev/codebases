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

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import {
  FETCH_DEPLOYMENT_EXTENSIONS,
  FETCH_DEPLOYMENT_EXTENSION,
  CREATE_DEPLOYMENT_EXTENSION,
  UPDATE_DEPLOYMENT_EXTENSION,
  UPLOAD_DEPLOYMENT_EXTENSION,
  DELETE_DEPLOYMENT_EXTENSION,
} from '../../constants/actions'

import {
  listExtensionsUrl,
  createExtensionUrl,
  getExtensionUrl,
  updateExtensionUrl,
  uploadExtensionUrl,
  deleteExtensionUrl,
} from '../../lib/api/v1/urls'

import { CreateExtensionRequest, UpdateExtensionRequest } from '../../lib/api/v1/types'

export function fetchExtensions() {
  return asyncRequest({
    type: FETCH_DEPLOYMENT_EXTENSIONS,
    url: listExtensionsUrl(),
  })
}

export function fetchExtension({ extensionId }: { extensionId: string }) {
  return asyncRequest({
    type: FETCH_DEPLOYMENT_EXTENSION,
    url: getExtensionUrl({ extensionId }),
    meta: { extensionId },
    crumbs: [extensionId],
  })
}

export function createExtension({ extension }: { extension: CreateExtensionRequest }) {
  return asyncRequest({
    type: CREATE_DEPLOYMENT_EXTENSION,
    url: createExtensionUrl(),
    method: `POST`,
    payload: extension,
  })
}

export function updateExtension({
  extensionId,
  extension,
}: {
  extensionId: string
  extension: UpdateExtensionRequest
}) {
  return asyncRequest({
    type: UPDATE_DEPLOYMENT_EXTENSION,
    url: updateExtensionUrl({ extensionId }),
    method: `POST`,
    payload: extension,
    meta: { extensionId },
    crumbs: [extensionId],
  })
}

export function uploadExtension({ extensionId, file }: { extensionId: string; file: File }) {
  return asyncRequest({
    type: UPLOAD_DEPLOYMENT_EXTENSION,
    url: uploadExtensionUrl({ extensionId }),
    method: `PUT`,
    meta: { extensionId },
    crumbs: [extensionId],
    payload: file,
    requestSettings: {
      request: {
        headers: {
          'Content-Type': `application/zip`,
        },
      },
      json: false,
    },
  })
}

export function deleteExtension({ extensionId }: { extensionId: string }) {
  return asyncRequest({
    type: DELETE_DEPLOYMENT_EXTENSION,
    url: deleteExtensionUrl({ extensionId }),
    method: `DELETE`,
    meta: { extensionId },
    crumbs: [extensionId],
  })
}

export function resetCreateExtensionRequest() {
  return resetAsyncRequest(CREATE_DEPLOYMENT_EXTENSION)
}

export function resetUpdateExtensionRequest(extensionId: string) {
  return resetAsyncRequest(UPDATE_DEPLOYMENT_EXTENSION, [extensionId])
}

export const resetUploadExtensionRequest = (extensionId: string) =>
  resetAsyncRequest(UPLOAD_DEPLOYMENT_EXTENSION, [extensionId])
