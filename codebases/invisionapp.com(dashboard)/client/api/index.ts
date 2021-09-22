import bffRequest, { BFFResponse } from '../utils/bffRequest'

const timeout = 8000

type Params = {
  [key: string]: any
}

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

const methods = {
  request: (url: string, method: Method, config: any) => {
    const requestConfig = { url, method, timeout, ...config }

    return bffRequest.request(requestConfig).then((res: BFFResponse) => {
      return res.data
    })
  },

  get: (endpoint: string, params: Params) => {
    return methods.request(`/teams/api/${endpoint}`, 'get', { params })
  },

  checkSubdomain: (subdomain: string) => {
    const data = {
      subdomain
    }
    const config = {
      validateStatus(status: number) {
        return status < 500
      }
    }

    return bffRequest.post(`/teams/api/team/subdomain`, data, config)
  },

  update: (uri: string, params: Params, data: any) => {
    return methods.request(`/teams/api/${uri}`, 'patch', { data })
  },

  delete: (uri: string, params: Params, data: any) => {
    return methods.request(`/teams/api/${uri}`, 'delete', { data })
  },

  post: (uri: string, params: Params, data: any) => {
    return methods.request(`/teams/api/${uri}`, 'post', { data })
  },

  patch: (uri: string, params: Params, data: any) => {
    return methods.request(`/teams/api/${uri}`, 'patch', { data })
  },

  sendFileWithConfig: (url: string, file: File, config: any, method: Method) => {
    const requestConfig = {
      data: file,
      headers: {
        'Content-Type': file.type || 'image/xyz'
      },
      ...config
    }
    return methods.request(url, method, requestConfig)
  },

  sendInvitationsWithMegaTimeout: (uri: string, _: any, data: any) => {
    return methods.request(`/teams/api/${uri}`, 'post', {
      data,
      timeout: 20000
    })
  },

  postFile: (url: string, file: File, config: any) => {
    return methods.sendFileWithConfig(url, file, config, 'post')
  }
}

export default methods
