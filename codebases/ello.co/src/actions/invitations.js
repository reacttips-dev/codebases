import React from 'react'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import { ErrorState } from '../components/errors/Errors'

export function loadInvitedUsers() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.invite(), vo: {} },
    meta: {
      mappingType: MAPPING_TYPES.INVITATIONS,
      renderStream: {
        asList: StreamRenderables.usersAsInviteeList,
        asGrid: StreamRenderables.usersAsInviteeGrid,
        asError: <ErrorState />,
      },
    },
  }
}

export function inviteUsers(emails) {
  return {
    type: ACTION_TYPES.INVITATIONS.INVITE,
    payload: {
      endpoint: api.invite(),
      method: 'POST',
      body: { email: emails },
    },
    meta: {
      mappingType: MAPPING_TYPES.INVITATIONS,
    },
  }
}

export function getInviteEmail(code) {
  return {
    type: ACTION_TYPES.INVITATIONS.GET_EMAIL,
    payload: {
      endpoint: api.getInviteEmail(code),
    },
  }
}

