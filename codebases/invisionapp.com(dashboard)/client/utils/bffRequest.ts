import { useState, useEffect } from 'react'
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'

axios.defaults.headers.common['request-source'] = 'team-management-web'

export type BFFResponse = AxiosResponse
export type BFFResponseError = AxiosError
export type BFFRequestOptions = AxiosRequestConfig
export type BFFRequestStatus<ResponseData = any, ErrorResponseDate = any> =
  | ['initial', undefined]
  | ['loading', undefined]
  | ['loaded', ResponseData]
  | ['error', ErrorResponseDate]

type Method = 'get' | 'post' | 'patch' | 'put' | 'request' | 'delete'

const methodsToWrap: Array<Method> = ['get', 'post', 'patch', 'put', 'request', 'delete']

const bffRequest: {
  [method: string]: any
} = {}

function makeWrapper(methodName: Method, origin: string) {
  return function wrapper(url: string, ...opts: any) {
    // @ts-ignore
    return axios[methodName](url, ...opts).catch((error: AxiosError) => {
      if (error && error.response && error.response.status === 401) {
        const data = error.response.data || {}
        const message = data.message || ''

        if (message.toLowerCase().indexOf('session validation error') > -1) {
          // Re-requesting html will proeprly redirect via login if the session doesn't exist.
          window.location.reload()
        }
      }
      throw error
    })
  }
}

methodsToWrap.forEach((methodName: Method) => {
  bffRequest[methodName] = makeWrapper(methodName, window.location.origin)
})

export default bffRequest

export type PartialFailureResponse = { status: 'failed' | 'fulfilled' }

export const requestWithPartialFailures = (url: string, method: string, data: any) => {
  return bffRequest[method](url, data).then((response: AxiosResponse) => {
    const fulfilled = response.data.responses.filter(
      (resp: PartialFailureResponse) => resp.status === 'fulfilled'
    )
    const failed = response.data.responses.filter(
      (resp: PartialFailureResponse) => resp.status === 'failed'
    )
    const hasFailures = failed.length > 0
    const hasSuccesses = fulfilled.length > 0

    return {
      response,
      hasFailures,
      hasSuccesses,
      fulfilled,
      failed
    }
  })
}

/*
  NOTE: there are not tests for this right now because there is no easy to way to test react
  hooks on there own without using react-testing-library, but we use enzyme. We need to
  revisit this and maybe use that as well.
*/
export function useFetchBffData<ResponseData, ErrorResponseDate>({
  url,
  ...options
}: BFFRequestOptions): BFFRequestStatus<ResponseData, ErrorResponseDate> {
  const [request, setRequest] = useState<BFFRequestStatus<ResponseData, ErrorResponseDate>>([
    'initial',
    undefined
  ])

  const fullurl = `/teams/api${url}`

  useEffect(() => {
    setRequest(['loading', undefined])

    bffRequest
      .request({
        url: fullurl,
        ...options
      })
      .then((res: BFFResponse) => setRequest(['loaded', res.data]))
      .catch((error: BFFResponseError) => setRequest(['error', error.response?.data]))
  }, [])

  return request
}
