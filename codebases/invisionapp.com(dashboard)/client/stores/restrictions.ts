import { Reducer } from 'redux'
import { createSelector } from 'reselect'
import { AppState } from './index'

export type Restrictions = any
export type RestrictionsState = Restrictions[]

const actions = {
  LOAD: 'restrictions/LOAD'
}

export const load = (payload: Restrictions[]) => ({
  type: actions.LOAD,
  payload
})

export const initialState = []

const restrictionsReducer: Reducer<RestrictionsState> = (state = initialState, action) => {
  switch (action.type) {
    case actions.LOAD: {
      return [...action.payload]
    }
    default: {
      return state
    }
  }
}

// Selectors
const restrictionState = (state: AppState) => state.restrictions
export const selectRestrictions = createSelector(restrictionState, s => s)

export const selectSeatIsAtQuota = createSelector(
  restrictionState,
  (restrictions: RestrictionsState) =>
    !!restrictions.find(restriction => restriction.key === 'seat_at_quota')
)

export const selectSeatIsOverQuota = createSelector(
  restrictionState,
  (restrictions: RestrictionsState) =>
    !!restrictions.find(restriction => restriction.key === 'seat_over_quota')
)

export default restrictionsReducer
