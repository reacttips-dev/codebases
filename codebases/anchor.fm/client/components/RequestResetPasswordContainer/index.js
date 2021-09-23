import { connect } from 'react-redux';
import { RequestResetPassword } from '../RequestResetPassword';
import { submitRequestResetPasswordForm, showLogin } from '../../user';

const mapDispatchToProps = dispatch => ({
  onSubmit: data => dispatch(submitRequestResetPasswordForm(data)),
  clickLogIn: () => dispatch(showLogin('Log In')),
});

export default connect(null, mapDispatchToProps)(RequestResetPassword);
