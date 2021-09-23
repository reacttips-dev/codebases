/* eslint-disable import/prefer-default-export */
import get from 'lodash/get'

// props.params.xxx
export const selectParamsInvitationCode = (state, props) => get(props, 'params.invitationCode')
export const selectParamsConfirmationCode = (state, props) => get(props, 'params.confirmationCode')
export const selectParamsToken = (state, props) => {
  const token = get(props, 'params.token')
  return token ? token.toLowerCase() : null
}
export const selectParamsType = (state, props) => get(props, 'params.type')
export const selectParamsUsername = (state, props) => get(props, 'params.username', '').toLowerCase()

// Memoized selectors
