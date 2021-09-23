import EnterContainer from '../../containers/EnterContainer'
import SignupContainer from '../../containers/SignupContainer'
import ForgotPasswordContainer from '../../containers/ForgotPasswordContainer'
import ResetPasswordContainer from '../../containers/ResetPasswordContainer'

export default (store) => {
  function onEnter(nextState, replace) {
    if (store.getState().authentication.get('isLoggedIn')) {
      replace({ pathname: '/', state: nextState })
    } else if (/\/signup/.test(nextState.location.pathname)) {
      const pathname = nextState.params.invitationCode ? `/join/${nextState.params.invitationCode}` : '/join'
      replace({ pathname, state: nextState })
    }
  }

  return [
    {
      path: 'enter',
      getComponents(location, cb) {
        cb(null, EnterContainer)
      },
      onEnter,
    },
    {
      path: 'forgot-password',
      getComponents(location, cb) {
        cb(null, ForgotPasswordContainer)
      },
      onEnter,
    },
    {
      path: 'auth/reset-my-password',
      getComponents(location, cb) {
        cb(null, ResetPasswordContainer)
      },
      onEnter,
    },
    {
      path: 'join(/:invitationCode)',
      getComponents(location, cb) {
        cb(null, SignupContainer)
      },
      onEnter,
    },
    {
      path: 'confirm(/:confirmationCode)',
      getComponents(location, cb) {
        cb(null, SignupContainer)
      },
      onEnter,
    },
    {
      path: 'signup(/:invitationCode)',
      getComponents(location, cb) {
        cb(null, SignupContainer)
      },
      onEnter,
    },
  ]
}

