import { browserHistory } from 'react-router'
import { Paywall } from '../team/team.types'

export function openInviteUser(
  pathname: string,
  showPaywall: boolean,
  paywall?: Paywall,
  isGuest?: boolean
) {
  if (showPaywall && paywall?.show) {
    paywall.show('invite-members.blocker.v1')
  } else {
    browserHistory.push(`${pathname}/add-invite${isGuest ? '?guest=true' : ''}`)
  }
}

export function closeInviteUser(pathname: string) {
  const target = pathname.replace('/add-invite', '')
  browserHistory.push(target)
}

export function openCreateUserGroup() {
  browserHistory.push('/teams/people/groups/new')
}

export function openInviteModal(pathname: string, showPaywall: boolean, paywall: Paywall) {
  if (pathname.includes('/groups')) {
    openCreateUserGroup()
  } else {
    openInviteUser(pathname, showPaywall, paywall, false)
  }
}
