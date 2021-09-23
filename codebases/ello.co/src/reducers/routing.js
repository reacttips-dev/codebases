import Immutable from 'immutable'
import get from 'lodash/get'
import { LOCATION_CHANGE } from 'react-router-redux'

// Merge our initial state with routerReducer's initial state
const initialState = Immutable.fromJS({
  locationBeforeTransitions: undefined,
  previousPath: document.location.pathname,
})

export default (state = initialState, { type, payload }) => {
  if (type === LOCATION_CHANGE) {
    return state.merge({
      location: {
        pathname: get(payload, 'locationBeforeTransitions.pathname', get(payload, 'pathname')),
        state: get(payload, 'locationBeforeTransitions.state', get(payload, 'state')),
        terms: get(payload, 'locationBeforeTransitions.query.terms', get(payload, 'query.terms', undefined)),
        preview: get(payload, 'locationBeforeTransitions.query.preview', get(payload, 'query.preview', undefined)),
        submissionType: get(payload, 'locationBeforeTransitions.query.submissionType', get(payload, 'query.submissionType', undefined)),
      },
      locationBeforeTransitions: payload.locationBeforeTransitions || payload,
      previousPath: state.getIn(['location', 'pathname']),
    })
  }
  return state
}

