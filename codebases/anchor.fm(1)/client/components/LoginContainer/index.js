import { connect } from 'react-redux';
import { handleGetCsrfToken } from 'hooks/useCsrfToken';
import {
  showCreateAccount,
  showRequestResetPassword,
  submitLogInForm,
} from 'client/user';
import { Login } from '../Login';

const mapDispatchToProps = (dispatch, ownProps) => {
  const { loginCallback, shouldRedirectToDashboard, csrfToken } = ownProps;

  return {
    onSubmit: async data => {
      /**
       * we should have a csrf token on mount, but if that failed for some reason,
       * try fetching it again when the user submits, but before we attempt
       * the login request
       */
      let _csrf = csrfToken;
      if (!_csrf) {
        _csrf = await handleGetCsrfToken();
      }
      return dispatch(
        submitLogInForm(
          { ...data, _csrf },
          loginCallback,
          shouldRedirectToDashboard
        )
      );
    },
    clickCreateAccount: () => dispatch(showCreateAccount('Create Account')),
    clickRequestResetPassword: () =>
      dispatch(showRequestResetPassword('Forgot Password')),
  };
};

// eslint-disable-next-line no-empty-pattern
const mapStateToProps = ({}, { feedUrl, signupUrl }) => ({
  feedUrl,
  signupUrl,
});

export const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
