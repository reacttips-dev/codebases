import { AxiosResponse, AxiosError } from 'axios'
import { Dispatch } from 'redux'
import bffRequest from '../../utils/bffRequest'
import { AuditLogFormat, AuditLogJsonData } from './auditLog.types'

export const FETCH = {
  REQUEST: 'teams/auditLog/FETCH.REQUEST',
  SUCCESS_JSON: 'teams/auditLog/FETCH.SUCCESS_JSON',
  SUCCESS_CSV: 'teams/auditLog/FETCH.SUCCESS_CSV',
  FAILURE: 'teams/auditLog/FETCH.FAILURE',
  CLEAR: 'teams/auditLog/FETCH.CLEAR'
}

export type FetchAuditLogRequestArgs = {
  format: AuditLogFormat
  pageSize?: number
}

export type FetchAuditLogSuccessData = {
  data: AuditLogJsonData[]
}

export type FetchAuditLogSuccessArgs = {
  payload: AuditLogJsonData[]
}

export const fetchAuditLog = {
  request: ({ format = 'csv', pageSize = -1 }: FetchAuditLogRequestArgs) => (
    dispatch: Dispatch
  ) => {
    dispatch({ type: FETCH.REQUEST })

    let contentType = 'text/csv; charset=utf-8'

    if (format === 'json') {
      contentType = 'application/json'
    }

    const url =
      pageSize === -1
        ? `/teams/api/audit-log?format=${format}`
        : `/teams/api/audit-log?format=${format}&pageSize=${pageSize}`

    bffRequest
      .get(url, {
        Accept: contentType,
        'Content-Type': contentType
      })
      .then((response: AxiosResponse) => {
        if (format === 'csv') {
          dispatch(fetchAuditLog.successCsv(response.data))
        }

        return dispatch(fetchAuditLog.successJson(response.data))
      })
      .catch((response: AxiosError) => dispatch(fetchAuditLog.failure(response)))
  },
  successCsv: (payload: FetchAuditLogSuccessArgs) => ({
    type: FETCH.SUCCESS_CSV,
    payload
  }),
  successJson: (payload: FetchAuditLogSuccessArgs) => ({
    type: FETCH.SUCCESS_JSON,
    payload
  }),
  failure: (error: AxiosError) => ({
    type: FETCH.FAILURE,
    payload: { message: error.message }
  }),
  clear: () => ({ type: FETCH.CLEAR })
}
