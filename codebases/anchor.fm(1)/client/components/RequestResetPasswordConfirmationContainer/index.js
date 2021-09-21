import React from 'react';
import { connect } from 'react-redux';
import RequestResetPasswordConfirmation from '../RequestResetPasswordConfirmation';
import { showLogin } from '../../user';

const mapDispatchToProps = dispatch => ({
  clickLogIn: () => dispatch(showLogin('Log In')),
});

export default connect(
  null,
  mapDispatchToProps
)(RequestResetPasswordConfirmation);
