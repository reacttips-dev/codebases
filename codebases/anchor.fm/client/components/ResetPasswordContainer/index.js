import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ResetPassword } from '../ResetPassword';
import {
  getResetPasswordTokenValidity,
  requestToSubmitResetPasswordForm,
} from '../../resetPassword';

const mapStateToProps = ({ resetPassword }, { match: { params } }) => ({
  code: params.code,
  resetTokenIsValid: resetPassword.resetTokenIsValid,
  resetWasSuccessful: resetPassword.resetWasSuccessful,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    onSubmit: data => dispatch(requestToSubmitResetPasswordForm(data)),
    getResetPasswordTokenValidity: code =>
      dispatch(getResetPasswordTokenValidity('', code)),
  },
});

class ResetPasswordContainer extends Component {
  // Static SSR data function
  static fetchData({ match: { params }, store, baseUrl }) {
    return store.dispatch(getResetPasswordTokenValidity(baseUrl, params.code));
  }

  componentDidMount() {
    const { actions, code } = this.props;
    actions.getResetPasswordTokenValidity(code);
  }

  render() {
    const { actions, resetTokenIsValid, resetWasSuccessful } = this.props;
    return (
      <ResetPassword
        onSubmit={actions.onSubmit}
        resetTokenIsValid={resetTokenIsValid}
        resetWasSuccessful={resetWasSuccessful}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordContainer);
