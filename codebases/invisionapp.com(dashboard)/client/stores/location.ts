import { Reducer } from 'redux'
import { Location as HistoryLocation } from 'history'
import debounce from 'lodash/debounce'
import { browserHistory } from 'react-router'
import { appShell } from '../inGlobalContext'
import { AppState } from './index'

// Types

export type Location = HistoryLocation & {
  query: any
}

export type State = Location

// Constants

const UPDATE_LOCATION = 'location/UPDATE_LOCATION'

// Actions

export const updateLocation = (location: Location) => ({
  type: UPDATE_LOCATION,
  location
})

export const navigateInternally = (url: string) => {
  browserHistory.push(url)
}

export const navigateToSettings = () => {
  return navigateInternally('/teams/settings')
}

export const navigateExternally = (url: string, options?: any) => {
  // TODO: pass the global context in from the outside instead
  // @ts-ignore
  appShell.navigate(url, options)
}

export const navigateToSignIn = () => {
  const signInUrl = `/auth/sign-in?redirectTo=${window.location.pathname}${window.location.search}`
  appShell.navigate(signInUrl)
}

export const updateLocationQuery = debounce(({ key, value }) => {
  const location = browserHistory.getCurrentLocation()
  const searchParams = new window.URLSearchParams(location.search)

  searchParams.set(key, value)

  browserHistory.push({
    pathname: location.pathname,
    search: `?${searchParams.toString()}`
  })
}, 200)

export const removeLocationQuery = (key: string) => {
  const location = browserHistory.getCurrentLocation()
  const searchParams = new window.URLSearchParams(location.search)

  if (!searchParams.get(key)) {
    return
  }

  searchParams.delete(key)

  browserHistory.push({
    pathname: location.pathname,
    search: `?${searchParams.toString()}`
  })
}

// Reducer

const initialState: State = {
  ...browserHistory.getCurrentLocation()
}

const locationReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOCATION: {
      return {
        ...action.location
      }
    }
    default: {
      return state
    }
  }
}

// Selectors

export const selectLocation = (state: AppState) => state.location

export const selectLocationQuery = (query: string) => (state: AppState) =>
  state.location?.query[query]

export default locationReducer
