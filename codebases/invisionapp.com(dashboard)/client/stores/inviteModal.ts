import { Reducer } from 'redux'
import { createAction } from 'redux-actions'
import omit from 'lodash/omit'
import pickBy from 'lodash/pickBy'
import { generateConsts } from './utils/generators'
import { SEND } from './invitations'
import { AppState } from './index'
import { InviteModalRole } from './roles/roles.types'
import { InviteModalRoles } from './roles'

export const INVITE_PEOPLE = generateConsts('invitePeople/INVITE')
export const UPDATE_PEOPLE = 'UPDATE_PEOPLE'
export const REMOVE_PERSON = 'REMOVE_PERSON'
export const CHANGE_ROLE = 'CHANGE_ROLE'
const BULK_INVITE_PEOPLE = 'inviteModal/BULK_INVITE_PEOPLE'
const RESET_PEOPLE = 'inviteModal/RESET_PEOPLE'

export type InviteModalState = {
  people: InviteModalStatePeople
}

type InviteModalStatePeople = {
  [email: string]: InviteModalPerson
}

type InviteModalPerson = {
  email: string
  role: InviteModalRole
}

// State
const initialState: InviteModalState = {
  people: {}
}

export const invitePeople = {
  updatePeople: createAction(UPDATE_PEOPLE),
  removePerson: createAction(REMOVE_PERSON),
  changeRole: createAction(CHANGE_ROLE)
}

type InviteModalAddUser = {
  email: string
  roleName: string
}
export const bulkInviteUsers = (users: InviteModalAddUser[]) => ({
  type: BULK_INVITE_PEOPLE,
  users
})

export const resetInvitePeople = () => ({
  type: RESET_PEOPLE
})

// Reducers
const inviteModalReducer: Reducer<InviteModalState> = (state = initialState, action) => {
  switch (action.type) {
    case BULK_INVITE_PEOPLE: {
      const peopleToInvite = action.users
        .filter(({ email }: InviteModalAddUser) => !!email)
        .reduce((people: InviteModalStatePeople, { email, roleName }: InviteModalAddUser) => {
          return {
            ...people,
            [email]: {
              email,
              role: { ...InviteModalRoles[roleName] }
            }
          }
        }, {})

      return {
        ...state,
        people: {
          ...state.people,
          ...peopleToInvite
        }
      }
    }

    case UPDATE_PEOPLE: {
      const emails = action.payload.emails
        .split(',')
        .map((email: string) => email.trim())
        .filter((email: string) => !!email)

      const memberByKey = (item: any) => {
        return item.key.toLowerCase() === action.payload.roleKey.toLowerCase()
      }
      const people = emails.reduce((map: InviteModalStatePeople, email: string) => {
        if (!map[email]) {
          const role = Object.values(InviteModalRoles).filter(memberByKey)[0]

          // eslint-disable-next-line
          map[email] = {
            email,
            // @ts-ignore
            role
          }
        }

        return map
      }, state.people)

      const shouldInclude = (person: InviteModalPerson) => {
        return emails.includes(person.email)
      }

      return {
        ...state,
        people: pickBy(people, shouldInclude)
      }
    }

    case REMOVE_PERSON: {
      return {
        ...state,
        people: {
          ...omit(state.people, action.payload.email)
        }
      }
    }

    case CHANGE_ROLE: {
      return {
        ...state,
        people: {
          ...state.people,
          [action.payload.email]: action.payload
        }
      }
    }

    case SEND.SUCCESS: {
      return {
        ...state,
        people: {}
      }
    }

    case RESET_PEOPLE: {
      return {
        ...state,
        people: {}
      }
    }

    default: {
      return state
    }
  }
}

export default inviteModalReducer

// Selectors
export const selectInvitePeople = (state: AppState) => state.inviteModal.people
export const selectInviteEmails = (state: AppState) =>
  Object.keys(state.inviteModal.people).join(', ')
