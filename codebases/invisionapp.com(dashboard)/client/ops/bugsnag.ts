import React from 'react'
import { appContext } from '../inGlobalContext'

export let bugsnagClient = {
  notify: () => {},
  getPlugin: (pluginName: string) => ({
    createErrorBoundary: (reactInstance: any) => React.Fragment
  })
}

export let ErrorBoundary = React.Fragment

// Grab a Bugsnag client instance from the Bugsnag Runtime Provided Resource.
// Check the docs for the available APIs:
// https://github.com/InVisionApp/runtime-provided-resources/tree/master/resources/bugsnag
export const initializeBugsnagClient = async () => {
  const bugsnag = await appContext.getRuntimeProvidedResource('bugsnag')
  bugsnagClient = (bugsnag && bugsnag.getClient()) || bugsnagClient
  ErrorBoundary =
    (bugsnagClient && bugsnagClient.getPlugin('react').createErrorBoundary(React)) ||
    ErrorBoundary
  return { ErrorBoundary, bugsnagClient }
}

export default bugsnagClient
