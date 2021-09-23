import React from 'react'
import { loadInvitedUsers } from '../actions/invitations'
import { Invitations } from '../components/views/Invitations'

export default () =>
  <Invitations streamAction={loadInvitedUsers()} />

