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

import { defaultsDeep, get, omit, set } from 'lodash'

import { AjaxRequestError } from '../types'

type AjaxConfig = {
  headers?: unknown
  settings?: {
    json?: boolean
    binary?: boolean
    request?: unknown
    response?: {
      fullStatus?: boolean
    }
  }
  includeHeaders?: boolean
}

type HeaderMap = {
  [key: string]: any
}

type AjaxJsonOrTextResult = {
  body?: any
  headers?: HeaderMap
  status?: number
  statusText?: string
  contentType?: string | null
}

type AjaxBlobResult = {
  blobUrl?: string
  blob?: Blob
}

export type AjaxResult = AjaxJsonOrTextResult & AjaxBlobResult

const defaultRequestConfig = {
  headers: {
    Accept: `application/json`,
  },
}

// @ts-ignore: `webkitURL` might or not be a thing
const windowUrl = window.URL || window.webkitURL

const hasApiError = (body) => (body.ok === false && body.error) || get(body, [`error`, `reason`])

function ajaxGet(url: string, config: AjaxConfig = {}) {
  return fetch(url, extendConfig(config)).then(extractResponse(config))
}

function ajaxPost(url: string, body?, config: AjaxConfig = {}) {
  return fetch(url, {
    method: `post`,
    body: getRequestBody(body, config),
    ...extendConfig(config),
  }).then(extractResponse(config))
}

function ajaxPut(url: string, body?, config: AjaxConfig = {}) {
  return fetch(url, {
    method: `put`,
    body: getRequestBody(body, config),
    ...extendConfig(config),
  }).then(extractResponse(config))
}

function ajaxPatch(url: string, body?, config: AjaxConfig = {}) {
  return fetch(url, {
    method: `PATCH`,
    body: getRequestBody(body, config),
    ...extendConfig(config),
  }).then(extractResponse(config))
}

function ajaxDel(url: string, body?, config: AjaxConfig = {}) {
  return fetch(url, {
    method: `delete`,
    body: getRequestBody(body, config),
    ...extendConfig(config),
  }).then(extractResponse(config))
}

function getRequestBody(body, config) {
  if (body == null) {
    return null
  }

  const isJson = get(config, [`settings`, `json`], true)

  if (isJson !== false) {
    set(config, [`headers`, `Content-Type`], `application/json`)
    return JSON.stringify(body)
  }

  return body
}

function extendConfig(config) {
  const requestSettings = get(config, [`settings`, `request`], {})
  const pureConfig = omit(config, `settings`)
  const appliedDefaults = defaultsDeep(pureConfig, defaultRequestConfig)
  const appliedSettings = defaultsDeep(requestSettings, appliedDefaults)
  return appliedSettings
}

function filterHeaders(headers) {
  const filteredHeaders: HeaderMap = {}

  const etag = headers.get(`etag`)

  if (etag) {
    filteredHeaders.etag = etag
  }

  const version = headers.get(`x-cloud-resource-version`)

  if (version) {
    filteredHeaders[`x-cloud-resource-version`] = parseInt(version, 10) || version
    filteredHeaders[`x-cloud-resource-version.raw`] = version
  }

  const created = headers.get(`x-cloud-resource-created`)

  if (created) {
    filteredHeaders[`x-cloud-resource-created`] = new Date(created)
  }

  const lastModified = headers.get(`x-cloud-resource-last-modified`)

  if (lastModified) {
    filteredHeaders[`x-cloud-resource-last-modified`] = new Date(lastModified)
  }

  const uiTag = headers.get(`x-ui-tag`)

  if (uiTag) {
    filteredHeaders[`x-ui-tag`] = uiTag
  }

  return filteredHeaders
}

function extractResponse(config: AjaxConfig) {
  return (response: Response): Promise<AjaxResult> => {
    if (response.status === 204) {
      return Promise.resolve({})
    }

    const wantBlob = get(config, [`settings`, `binary`], false)
    const includeStatus = get(config, [`settings`, `response`, `fullStatus`], false)
    const contentType = response.headers.get(`content-type`)
    const isNotJson = !contentType || !contentType.startsWith(`application/json`)
    const isText = contentType && contentType.startsWith(`text/plain`)

    if (wantBlob && isNotJson) {
      return response.blob().then((blob) => {
        statusCheck(blob)

        return {
          blobUrl: windowUrl.createObjectURL(blob),
          blob,
        }
      })
    }

    return (isText ? response.text() : response.json()).then(
      (body) => {
        statusCheck(body)

        const ajaxResult: AjaxJsonOrTextResult = {
          body,
        }

        if (config.includeHeaders) {
          ajaxResult.headers = filterHeaders(response.headers)
        }

        if (includeStatus) {
          ajaxResult.status = response.status
          ajaxResult.statusText = response.statusText
          ajaxResult.contentType = contentType
        }

        return ajaxResult
      },
      () => {
        throw createError(response.statusText, null)
      },
    )

    function statusCheck(body) {
      if (hasApiError(body)) {
        throw createError(getApiErrorMessage(body), body)
      }

      if (response.status < 200 || response.status >= 300) {
        throw createError(response.statusText, body)
      }
    }

    function createError(message, body) {
      return new AjaxRequestError(message, { response, body })
    }

    function getApiErrorMessage(body) {
      const hasError = typeof body.error === `string`

      if (hasError) {
        return body.error
      }

      const hasErrorReason = typeof get(body, [`error`, `reason`]) === `string`

      if (hasErrorReason) {
        return get(body, [`error`, `reason`])
      }

      return `Internal Server Error`
    }
  }
}

export { ajaxGet as get, ajaxPatch as patch, ajaxPost as post, ajaxPut as put, ajaxDel as del }
