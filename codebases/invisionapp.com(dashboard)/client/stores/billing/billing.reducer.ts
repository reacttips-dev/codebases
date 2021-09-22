import { Reducer, combineReducers } from 'redux'

import arrayToObject from '../../helpers/arrayToObj'

import { BillableState, PlansState, SubscriptionState } from './billing.types'
import { FETCH_BILLABLE, FETCH_PLANS, FETCH_SUBSCRIPTION } from './billing.actions'

const subscription: Reducer<SubscriptionState> = (
  state = { status: 'pristine' },
  action
): SubscriptionState => {
  switch (action.type) {
    case FETCH_SUBSCRIPTION.FAILURE: {
      return {
        ...state,
        status: 'error',
        error: action.payload
      }
    }
    case FETCH_SUBSCRIPTION.REQUEST: {
      return {
        ...state,
        status: 'loading'
      }
    }
    case FETCH_SUBSCRIPTION.SUCCESS: {
      return {
        ...state,
        status: 'loaded',
        data: action.payload
      }
    }
    default: {
      return state
    }
  }
}

const plans: Reducer<PlansState> = (state = { status: 'pristine' }, action): PlansState => {
  switch (action.type) {
    case FETCH_PLANS.FAILURE: {
      return { ...state, status: 'error', error: action.payload }
    }
    case FETCH_PLANS.REQUEST: {
      return {
        ...state,
        status: 'loading'
      }
    }
    case FETCH_PLANS.SUCCESS: {
      return { ...state, status: 'loaded', data: arrayToObject(action.payload) }
    }
    default: {
      return state
    }
  }
}

const billable: Reducer<BillableState> = (
  state = { status: 'pristine' },
  action
): BillableState => {
  switch (action.type) {
    case FETCH_BILLABLE.REQUEST: {
      return {
        ...state,
        status: 'loading'
      }
    }
    case FETCH_BILLABLE.FAILURE: {
      return {
        ...state,
        status: 'error',
        error: action.payload
      }
    }
    case FETCH_BILLABLE.SUCCESS: {
      return {
        ...state,
        status: 'loaded',
        data: action.payload
      }
    }
    default: {
      return state
    }
  }
}

export default combineReducers({
  billable,
  plans,
  subscription
})
