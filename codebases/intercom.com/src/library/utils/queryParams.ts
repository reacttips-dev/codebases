import queryString from 'querystring'
import { NextRouter } from 'next/dist/next-server/lib/router/router'

export class RouterWithQueryParams {
  router: NextRouter
  constructor(router: NextRouter) {
    this.router = router
  }
  getCurrentPath() {
    return this.router?.asPath.split('?')[0]
  }
  queryParamString() {
    return this.router?.asPath.split('?')[1]
  }
  queryParams() {
    return queryString.parse(this.queryParamString())
  }
  updateQueryParam(key: string, value: string) {
    const params = this.queryParams()
    params[key] = value

    return queryString.stringify(params)
  }
  removeQueryParam(value: string): string {
    const params = this.queryParams()

    delete params[value]

    return queryString.stringify(params)
  }
  updateUrl(path: string): void {
    this.router.replace(this.router.pathname, path, { shallow: true })
  }
}
