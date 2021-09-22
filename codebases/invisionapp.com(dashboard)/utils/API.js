import 'whatwg-fetch'

export default function request (url, params, preloadId) {
  params = params || {}
  params.cors = 'cors'
  params.credentials = 'include'
  if (params.hasOwnProperty('headers')) {
    params.headers.set('Request-Source', 'home-ui-v7')
    params.headers.set('Calling-Service', 'home-ui-v7')
  } else {
    params.headers = new window.Headers({
      'Request-Source': 'home-ui-v7',
      'Calling-Service': 'home-ui-v7'
    })
  }

  let errorStatus = null

  const featureContext = window.inGlobalContext.appShell.getFeatureContext('home')

  let startTime = window.performance.now()
  let endTime

  let fetchPromise
  let shouldClone = false
  if (preloadId && featureContext.dataLoader && featureContext.dataLoader.fetchById) {
    if (featureContext.dataLoader.getPreloadItem) {
      const preloadItem = featureContext.dataLoader.getPreloadItem(preloadId)
      if (preloadItem && preloadItem.meta) {
        startTime = preloadItem.meta.startTime
        endTime = preloadItem.meta.endTime
      }
    }
    fetchPromise = featureContext.dataLoader.fetchById(preloadId, url, params)
    shouldClone = true
  } else {
    fetchPromise = fetch(url, params)
  }

  return fetchPromise.then(response => {
    if (shouldClone) {
      response = response.clone()
    }

    if (response.ok) {
      if (params.noBody) {
        return Promise.resolve({})
      } else {
        return response.status === 200 || response.status === 201 ? response.json() : Promise.resolve({})
      }
    } else if (params.showErrorBody) {
      errorStatus = response.status
      return response.json() || Promise.resolve({})
    } else {
      throw new Error(response.status)
    }
  }).then(response => {
    const loadTime = (endTime || window.performance.now()) - startTime
    return {
      response: response,
      loadTime: loadTime,
      error: errorStatus
    }
  }).catch(ex => {
    return {
      response: null,
      error: ex
    }
  })
}
