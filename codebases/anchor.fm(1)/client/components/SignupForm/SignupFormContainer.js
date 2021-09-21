import { connect } from 'react-redux';
import { submitCreateAccountForm, showRequestResetPassword } from 'client/user';
import { SignupForm } from '.';

const mapDispatchToProps = (dispatch, ownProps) => {
  const { onDidSubmit, onWillSubmit } = ownProps;
  return {
    onSubmit: data => {
      if (onWillSubmit) onWillSubmit();
      dispatch(
        submitCreateAccountForm(data, onDidSubmit, {
          captchaversion: 3,
        })
      );
    },
    onClickRequestResetPassword: () =>
      dispatch(showRequestResetPassword('Forgot Password')),
  };
};

const mapStateToProps = ({ routing }, ownProps) => ({
  routing,
  isLoading: ownProps.isLoading,
  isV3Captcha: true,
});

const SignupFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupForm);

export { SignupFormContainer };
