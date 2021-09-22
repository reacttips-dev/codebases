import update from 'immutability-helper'

import {
  BOARD,
  FREEHAND,
  HARMONY,
  PROTOTYPE,
  RHOMBUS,
  SPEC
} from '../constants/DocumentTypes'

import * as ActionTypes from '../constants/ActionTypes'
import createReducer from '../utils/create-reducer'

export const initialState = {
  isLoading: true,
  loadFailed: false,
  authError: false,
  user: {
    name: '',
    multipleTeams: false,
    permissions: {
      createDocuments: false,
      createSpaces: false,
      transferDocuments: false
    }
  },
  userV2: {
    flags: {
      projectsPrototypeUIEnabled: false,
      spaceProjectsEnabled: false,
      enableFreehandXFilteringSorting: false
    }
  },
  flags: {},
  permissions: {
    create: {
      [BOARD]: false,
      [FREEHAND]: false,
      [PROTOTYPE]: false,
      [RHOMBUS]: false,
      [SPEC]: false
    }
  },
  team: { name: '' }
}

function loadAccount (state, response) {
  return {
    isLoading: false,
    loadFailed: false,
    team: update(state.team, {
      '$merge': { ...response.team }
    }),
    flags: update(state.flags, {
      '$merge': { ...response.flags }
    }),
    user: update(state.user, {
      '$merge': { ...response.user }
    }),
    userV2: update(state.userV2, {
      '$merge': { ...response.userV2 }
    })
  }
}

function loadAccountFailure (state, data) {
  return {
    isLoading: false,
    loadFailed: true,
    authError: data.authError,
    team: update(state.team, {
      '$set': initialState.team
    }),
    user: update(state.user, {
      '$set': initialState.user
    }),
    userV2: update(state.userV2, {
      '$set': initialState.userV2
    })
  }
}

const actionHandlers = {
  [ActionTypes.API_GET_ACCOUNT.SUCCESS]: loadAccount,
  [ActionTypes.API_GET_ACCOUNT.FAILURE]: loadAccountFailure,

  [ActionTypes.API_GET_ACCOUNT_PERMISSIONS.SUCCESS]: (state, payload) => ({
    permissions: update(state.permissions, {
      '$merge': {
        create: {
          [BOARD]: payload[BOARD].canCreate || false,
          [FREEHAND]: payload[FREEHAND].canCreate || false,
          [PROTOTYPE]: payload[PROTOTYPE].canCreate || false,
          [RHOMBUS]: payload[RHOMBUS].canCreate || false,
          [SPEC]: payload[SPEC].canCreate || false,
          [HARMONY]: payload[HARMONY].canCreate || false
        }
      }
    })
  }),

  [ActionTypes.API_GET_ACCOUNT_PERMISSIONS.FAILURE]: () => ({
    permissions: initialState.permissions
  })
}

export default createReducer(initialState, actionHandlers)
