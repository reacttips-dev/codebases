import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { INVITATIONS } from '../constants/mapping_types'

export const selectPropsInvitationId = (state, props) =>
  get(props, 'invitationId') || get(props, 'invitation', Immutable.Map()).get('id')

export const selectInvitations = state => state.json.get(INVITATIONS, Immutable.Map())

// Memoized selectors

// Requires `invitationId`, or `invitation` to be found in props
export const selectInvitation = createSelector(
  [selectPropsInvitationId, selectInvitations], (id, invitations) =>
    invitations.get(id, Immutable.Map()),
)

// Properties on the invitation reducer
export const selectInvitationAcceptedAt = createSelector([selectInvitation], invitation =>
  invitation.get('acceptedAt'),
)

export const selectInvitationCode = createSelector([selectInvitation], invitation =>
  invitation.get('code'),
)

export const selectInvitationCreatedAt = createSelector([selectInvitation], invitation =>
  invitation.get('createdAt'),
)

export const selectInvitationEmail = createSelector([selectInvitation], invitation =>
  invitation.get('email'),
)

export const selectInvitationId = createSelector([selectInvitation], invitation =>
  invitation.get('id'),
)

export const selectInvitationUserId = createSelector([selectInvitation], invitation =>
  invitation.getIn(['links', 'acceptedBy', 'id']),
)
